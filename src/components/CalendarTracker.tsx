'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import TaskEditor from './TaskEditor';

// Array of motivational quotes for rotation
const MOTIVATIONAL_QUOTES = [
  "Productivity is never an accident. It is always the result of a commitment to excellence.",
  "Focus on being productive instead of busy.",
  "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
  "Don't wait for inspiration. It comes while working.",
  "Do the hard jobs first. Easy jobs will take care of themselves.",
  "Action is the foundational key to all success.",
  "You don't have to be great to start, but you have to start to be great.",
  "The only way to do great work is to love what you do.",
  "Productivity is being able to do things that you were never able to do before.",
  "It's not about having time, it's about making time.",
  "The perfect is the enemy of the good.",
  "Start where you are. Use what you have. Do what you can.",
  "Amateurs sit and wait for inspiration. The rest of us just get up and go to work.",
  "Don't wish it were easier, wish you were better.",
  "Strive not to be a success, but rather to be of value.",
  "The way to get started is to quit talking and begin doing.",
  "A goal without a plan is just a wish.",
  "The successful warrior is the average person, with laser-like focus.",
  "Focus on your goal. Don't look in any direction but ahead.",
  "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice, and most of all, love of what you are doing.",
  "When we strive to become better than we are, everything around us becomes better too.",
  "The only limit to our realization of tomorrow will be our doubts of today.",
  "The future depends on what you do today.",
  "Don't count the days, make the days count.",
  "Either you run the day or the day runs you.",
  "Your time is limited, don't waste it living someone else's life.",
  "You are never too old to set another goal or to dream a new dream.",
  "It's not what you do once in a while; it's what you do day in and day out that makes the difference.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "The more you praise and celebrate your life, the more there is in life to celebrate."
];

// Default tasks and wellness items (empty by default)
const DEFAULT_TASKS: string[] = [];
const DEFAULT_WELLNESS: string[] = [];

interface DayData {
  date: string;
  score: number;
  tasks: { [key: string]: boolean };
  wellness: { [key: string]: boolean };
  notes: string;
  quote: string;
}

export default function CalendarTracker() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [days, setDays] = useState<Date[]>([]);
  const [dayData, setDayData] = useState<{ [key: string]: DayData }>({});
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [showTaskEditor, setShowTaskEditor] = useState<boolean>(false);
  const [editingWellness, setEditingWellness] = useState<boolean>(false);
  const [globalTasks, setGlobalTasks] = useState<string[]>([...DEFAULT_TASKS]);
  const [globalWellness, setGlobalWellness] = useState<string[]>([...DEFAULT_WELLNESS]);
  const [progressStats, setProgressStats] = useState<{taskCount: number, taskCompleted: number, wellnessCount: number, wellnessCompleted: number}>({
    taskCount: DEFAULT_TASKS.length,
    taskCompleted: 0,
    wellnessCount: DEFAULT_WELLNESS.length,
    wellnessCompleted: 0
  });
  const taskScrollRef = useRef<HTMLDivElement>(null);
  
  // Initialize days of the current month
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const daysArray: Date[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(new Date(year, month, i));
    }
    
    setDays(daysArray);
    
    // Set active day to current day if in current month, or first day otherwise
    const today = new Date();
    if (today.getMonth() === month && today.getFullYear() === year) {
      const todayIndex = daysArray.findIndex(day => day.getDate() === today.getDate());
      setActiveDayIndex(todayIndex >= 0 ? todayIndex : 0);
    } else {
      setActiveDayIndex(0);
    }
  }, [currentMonth]);
  
  // Load data from localStorage
  useEffect(() => {
    try {
      // Load calendar data
      const savedData = localStorage.getItem('calendarTrackerData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setDayData(parsedData);
      }
      
      // Load global task lists
      const savedTasks = localStorage.getItem('calendarTrackerTasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        setGlobalTasks(parsedTasks);
      } else {
        // If no saved tasks, initialize with defaults and save them
        setGlobalTasks([...DEFAULT_TASKS]);
        localStorage.setItem('calendarTrackerTasks', JSON.stringify(DEFAULT_TASKS));
      }
      
      const savedWellness = localStorage.getItem('calendarTrackerWellness');
      if (savedWellness) {
        const parsedWellness = JSON.parse(savedWellness);
        setGlobalWellness(parsedWellness);
      } else {
        // If no saved wellness items, initialize with defaults and save them
        setGlobalWellness([...DEFAULT_WELLNESS]);
        localStorage.setItem('calendarTrackerWellness', JSON.stringify(DEFAULT_WELLNESS));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // Fallback to defaults if localStorage fails
      setGlobalTasks([...DEFAULT_TASKS]);
      setGlobalWellness([...DEFAULT_WELLNESS]);
    }
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('calendarTrackerData', JSON.stringify(dayData));
    } catch (error) {
      console.error('Error saving day data to localStorage:', error);
    }
  }, [dayData]);
  
  // Save task lists to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('calendarTrackerTasks', JSON.stringify(globalTasks));
    } catch (error) {
      console.error('Error saving task list to localStorage:', error);
    }
  }, [globalTasks]);
  
  useEffect(() => {
    try {
      localStorage.setItem('calendarTrackerWellness', JSON.stringify(globalWellness));
    } catch (error) {
      console.error('Error saving wellness list to localStorage:', error);
    }
  }, [globalWellness]);
  
  // Scroll to active day when it changes
  useEffect(() => {
    if (taskScrollRef.current && days.length > 0) {
      const dayElements = taskScrollRef.current.getElementsByTagName('button');
      if (dayElements.length > activeDayIndex) {
        const activeElement = dayElements[activeDayIndex];
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeDayIndex, days]);
  
  // Update progress stats whenever active day or day data changes
  useEffect(() => {
    if (days.length === 0) return;
    
    const activeDay = days[activeDayIndex];
    const activeDayData = getDayData(activeDay);
    
    // Calculate progress stats
    const taskCount = Object.keys(activeDayData.tasks).length;
    const taskCompleted = Object.values(activeDayData.tasks).filter(Boolean).length;
    const wellnessCount = Object.keys(activeDayData.wellness).length;
    const wellnessCompleted = Object.values(activeDayData.wellness).filter(Boolean).length;
    
    setProgressStats({
      taskCount,
      taskCompleted,
      wellnessCount,
      wellnessCompleted
    });
  }, [days, activeDayIndex, dayData, globalTasks, globalWellness]);
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Format date for use as an object key
  const getDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Get or initialize data for the given day
  const getDayData = (date: Date) => {
    const dateKey = getDateKey(date);
    
    if (!dayData[dateKey]) {
      // Initialize with defaults if not exists
      const randomQuoteIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
      
      const initialTasks: { [key: string]: boolean } = {};
      globalTasks.forEach(task => {
        initialTasks[task] = false;
      });
      
      const initialWellness: { [key: string]: boolean } = {};
      globalWellness.forEach(item => {
        initialWellness[item] = false;
      });
      
      return {
        date: dateKey,
        score: 0,
        tasks: initialTasks,
        wellness: initialWellness,
        notes: '',
        quote: MOTIVATIONAL_QUOTES[randomQuoteIndex]
      };
    }
    
    return dayData[dateKey];
  };
  
  // Update active day data
  const updateDayData = (updatedData: Partial<DayData>) => {
    if (days.length === 0) return;
    
    const activeDay = days[activeDayIndex];
    const dateKey = getDateKey(activeDay);
    const currentData = getDayData(activeDay);
    
    const newDayData = {
      ...dayData,
      [dateKey]: {
        ...currentData,
        ...updatedData
      }
    };
    
    setDayData(newDayData);
    
    // Update progress stats immediately to avoid delay in UI update
    if (updatedData.tasks || updatedData.wellness) {
      const updatedDayData = {
        ...currentData,
        ...updatedData
      };
      
      const taskCount = Object.keys(updatedDayData.tasks).length;
      const taskCompleted = Object.values(updatedDayData.tasks).filter(Boolean).length;
      const wellnessCount = Object.keys(updatedDayData.wellness).length;
      const wellnessCompleted = Object.values(updatedDayData.wellness).filter(Boolean).length;
      
      setProgressStats({
        taskCount,
        taskCompleted,
        wellnessCount,
        wellnessCompleted
      });
    }
  };
  
  // Handle score change
  const handleScoreChange = (score: number) => {
    updateDayData({ score });
  };
  
  // Handle task toggle
  const handleTaskToggle = (task: string) => {
    const activeDay = days[activeDayIndex];
    const currentData = getDayData(activeDay);
    
    updateDayData({
      tasks: {
        ...currentData.tasks,
        [task]: !currentData.tasks[task]
      }
    });
  };
  
  // Handle wellness toggle
  const handleWellnessToggle = (item: string) => {
    const activeDay = days[activeDayIndex];
    const currentData = getDayData(activeDay);
    
    updateDayData({
      wellness: {
        ...currentData.wellness,
        [item]: !currentData.wellness[item]
      }
    });
  };
  
  // Handle notes change
  const handleNotesChange = (notes: string) => {
    updateDayData({ notes });
  };
  
  // Go to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Go to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Update task list globally
  const updateTaskList = (newTasks: string[]) => {
    try {
      // Update global tasks state
      setGlobalTasks(newTasks);
      
      // Create a deep copy of the day data to ensure immutability
      const updatedDayData = { ...JSON.parse(JSON.stringify(dayData)) };
      
      // Update all existing days to include the new tasks
      Object.keys(updatedDayData).forEach(dateKey => {
        const currentTasks = updatedDayData[dateKey].tasks || {};
        const updatedTasks: { [key: string]: boolean } = {};
        
        // Add existing tasks that are still in the new task list
        newTasks.forEach(task => {
          updatedTasks[task] = currentTasks[task] || false;
        });
        
        updatedDayData[dateKey].tasks = updatedTasks;
      });
      
      // Force update localStorage immediately
      try {
        localStorage.setItem('calendarTrackerTasks', JSON.stringify(newTasks));
        localStorage.setItem('calendarTrackerData', JSON.stringify(updatedDayData));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
      
      // Update state with the new data
      setDayData(updatedDayData);
      
      // Update the active day immediately for the UI
      if (days.length > 0) {
        const activeDay = days[activeDayIndex];
        const dateKey = getDateKey(activeDay);
        
        if (updatedDayData[dateKey]) {
          const taskCount = newTasks.length;
          const taskCompleted = Object.values(updatedDayData[dateKey].tasks).filter(Boolean).length;
          
          setProgressStats(prev => ({
            ...prev,
            taskCount,
            taskCompleted
          }));
        }
      }
    } catch (error) {
      console.error('Error updating task list:', error);
    }
  };
  
  // Update wellness list globally
  const updateWellnessList = (newWellness: string[]) => {
    try {
      // Update global wellness state
      setGlobalWellness(newWellness);
      
      // Create a deep copy of the day data to ensure immutability
      const updatedDayData = { ...JSON.parse(JSON.stringify(dayData)) };
      
      // Update all existing days to include the new wellness items
      Object.keys(updatedDayData).forEach(dateKey => {
        const currentWellness = updatedDayData[dateKey].wellness || {};
        const updatedWellness: { [key: string]: boolean } = {};
        
        // Add existing wellness items that are still in the new wellness list
        newWellness.forEach(item => {
          updatedWellness[item] = currentWellness[item] || false;
        });
        
        updatedDayData[dateKey].wellness = updatedWellness;
      });
      
      // Force update localStorage immediately
      try {
        localStorage.setItem('calendarTrackerWellness', JSON.stringify(newWellness));
        localStorage.setItem('calendarTrackerData', JSON.stringify(updatedDayData));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
      
      // Update state with the new data
      setDayData(updatedDayData);
      
      // Update the active day immediately for the UI
      if (days.length > 0) {
        const activeDay = days[activeDayIndex];
        const dateKey = getDateKey(activeDay);
        
        if (updatedDayData[dateKey]) {
          const wellnessCount = newWellness.length;
          const wellnessCompleted = Object.values(updatedDayData[dateKey].wellness).filter(Boolean).length;
          
          setProgressStats(prev => ({
            ...prev,
            wellnessCount,
            wellnessCompleted
          }));
        }
      }
    } catch (error) {
      console.error('Error updating wellness list:', error);
    }
  };
  
  // Reset to default tasks
  const resetToDefaultTasks = () => {
    updateTaskList([...DEFAULT_TASKS]);
  };
  
  // Reset to default wellness
  const resetToDefaultWellness = () => {
    updateWellnessList([...DEFAULT_WELLNESS]);
  };
  
  // Get current month and year display
  const monthYearDisplay = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  // Get active day's data
  const activeDayData = days.length > 0 ? getDayData(days[activeDayIndex]) : null;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  };
  
  if (!activeDayData) return null;
  
  return (
    <motion.div 
      className="w-full mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Month Navigation */}
      <motion.div 
        className="flex justify-between items-center mb-6 sm:mb-8"
        variants={itemVariants}
      >
        <button 
          onClick={goToPreviousMonth}
          className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-200"
          aria-label="Previous month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">{monthYearDisplay}</h2>
        
        <button 
          onClick={goToNextMonth}
          className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-200"
          aria-label="Next month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </motion.div>
      
      {/* Days Carousel */}
      <motion.div 
        className="mb-6 sm:mb-8 overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide max-w-[95%] mx-auto"
        variants={itemVariants}
        ref={taskScrollRef}
      >
        <div className="flex space-x-[4px] min-w-max px-1">
          {days.map((day, index) => (
            <button
              key={day.toISOString()}
              onClick={() => setActiveDayIndex(index)}
              className={`inline-flex flex-col items-center justify-center h-[64px] w-[64px] rounded-full transition-all duration-300 ${
                index === activeDayIndex 
                  ? 'bg-purple-500 text-white shadow-lg transform scale-105' 
                  : 'bg-black/40 hover:bg-black/50 text-gray-300 hover:transform hover:scale-105'
              }`}
            >
              <span className="text-[10px] font-medium leading-none mb-1">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-[15px] font-bold leading-none">{day.getDate()}</span>
              {getDayData(day).score > 0 && (
                <div className={`mt-1.5 w-3 h-3 rounded-full flex items-center justify-center ${
                  getDayData(day).score <= 3 ? 'bg-red-500' : 
                  getDayData(day).score <= 6 ? 'bg-amber-500' : 
                  getDayData(day).score <= 8 ? 'bg-green-400' : 
                  'bg-green-500'
                }`}>
                  <span className="text-[7px] font-bold text-white leading-none">{getDayData(day).score}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </motion.div>
      
      {/* Active Day Content */}
      <motion.div 
        className="backdrop-blur-md bg-white/5 dark:bg-gray-800/5 rounded-xl p-3 sm:p-6 mb-4 shadow-lg mx-0 border border-white/10 dark:border-gray-700/30"
        variants={itemVariants}
      >
        {/* Date Header */}
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-white">
          {days.length > 0 ? formatDate(days[activeDayIndex]) : ''}
        </h3>
        
        {/* Quote of the Day */}
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-white/5 dark:bg-gray-800/5 backdrop-blur-sm text-sm sm:text-base italic text-gray-700 dark:text-gray-300 border border-white/10 dark:border-gray-700/30">
          {activeDayData.quote}
        </div>
        
        {/* Daily Score */}
        <div className="mb-4 sm:mb-6">
          <h4 className="text-sm sm:text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">Daily Score (0-10)</h4>
          <div className="flex items-center space-x-2">
            <div className="w-full h-2 bg-black/10 dark:bg-white/5 rounded-lg relative backdrop-blur-sm">
              <div 
                className={`absolute top-0 left-0 h-full rounded-lg ${
                  activeDayData.score <= 3 ? 'bg-red-500' : 
                  activeDayData.score <= 6 ? 'bg-amber-500' : 
                  activeDayData.score <= 8 ? 'bg-green-400' : 
                  'bg-green-500'
                }`}
                style={{ width: `${(activeDayData.score / 10) * 100}%` }}
              ></div>
              <input
                type="range"
                min="0"
                max="10"
                value={activeDayData.score}
                onChange={(e) => handleScoreChange(parseInt(e.target.value))}
                className="w-full h-2 absolute top-0 left-0 opacity-0 cursor-pointer"
              />
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white dark:bg-gray-100 shadow-lg transform transition-transform hover:scale-110 focus:scale-110 ${
                  activeDayData.score <= 3 ? 'border-2 border-red-500' : 
                  activeDayData.score <= 6 ? 'border-2 border-amber-500' : 
                  activeDayData.score <= 8 ? 'border-2 border-green-400' : 
                  'border-2 border-green-500'
                }`}
                style={{ left: `${(activeDayData.score / 10) * 100}%`, marginLeft: '-6px' }}
              />
            </div>
            <span 
              className={`text-base sm:text-lg font-bold w-6 sm:w-8 text-center ${
                activeDayData.score <= 3 ? 'text-red-500' : 
                activeDayData.score <= 6 ? 'text-amber-500' : 
                activeDayData.score <= 8 ? 'text-green-400' : 
                'text-green-500'
              }`}
            >
              {activeDayData.score}
            </span>
          </div>
        </div>
        
        {/* Tasks Section */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-2">
            <h4 className="text-sm sm:text-md font-semibold text-gray-800 dark:text-gray-200">Daily Tasks</h4>
            <div className="flex space-x-2">
              <button 
                onClick={() => { setShowTaskEditor(true); setEditingWellness(false); }}
                className="px-2 py-1 text-xs sm:text-sm bg-lavender/80 text-white rounded hover:bg-lavender transition-colors"
              >
                {Object.keys(activeDayData.tasks).length === 0 ? 'Add Tasks' : 'Edit Tasks'}
              </button>
              {Object.keys(activeDayData.tasks).length > 0 && (
                <button 
                  onClick={() => updateTaskList([])}
                  className="px-2 py-1 text-xs sm:text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
          {Object.keys(activeDayData.tasks).length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400 bg-white/5 dark:bg-gray-800/5 backdrop-blur-sm rounded-lg border border-white/10 dark:border-gray-700/30">
              No tasks added yet. Click 'Add Tasks' to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
              {Object.keys(activeDayData.tasks).map((task) => (
                <div 
                  key={task} 
                  className="flex items-center min-h-[40px] w-full p-2.5 sm:p-3 rounded-xl bg-white/5 dark:bg-gray-800/5 backdrop-blur-sm hover:bg-lavender/10 dark:hover:bg-lavender/10 transition-colors border border-white/10 dark:border-gray-700/30"
                >
                  <input
                    type="checkbox"
                    id={`task-${task}`}
                    checked={activeDayData.tasks[task]}
                    onChange={() => handleTaskToggle(task)}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-lavender rounded focus:ring-2 focus:ring-lavender/50 mr-2.5 sm:mr-3 flex-shrink-0"
                  />
                  <label 
                    htmlFor={`task-${task}`}
                    className={`text-sm sm:text-base flex-grow ${activeDayData.tasks[task] ? 'line-through opacity-70' : ''}`}
                  >
                    {task}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Wellness Section */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-2">
            <h4 className="text-sm sm:text-md font-semibold text-gray-800 dark:text-gray-200">Wellness Checklist</h4>
            <div className="flex space-x-2">
              <button 
                onClick={() => { setShowTaskEditor(true); setEditingWellness(true); }}
                className="px-2 py-1 text-xs sm:text-sm bg-sky-blue/80 text-white rounded hover:bg-sky-blue transition-colors"
              >
                {Object.keys(activeDayData.wellness).length === 0 ? 'Add Items' : 'Edit List'}
              </button>
              {Object.keys(activeDayData.wellness).length > 0 && (
                <button 
                  onClick={() => updateWellnessList([])}
                  className="px-2 py-1 text-xs sm:text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
          {Object.keys(activeDayData.wellness).length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400 bg-white/5 dark:bg-gray-800/5 backdrop-blur-sm rounded-lg border border-white/10 dark:border-gray-700/30">
              No wellness items added yet. Click 'Add Items' to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
              {Object.keys(activeDayData.wellness).map((item) => (
                <div 
                  key={item} 
                  className="flex items-center min-h-[40px] w-full p-2.5 sm:p-3 rounded-xl bg-white/5 dark:bg-gray-800/5 backdrop-blur-sm hover:bg-sky-blue/10 dark:hover:bg-sky-blue/10 transition-colors border border-white/10 dark:border-gray-700/30"
                >
                  <input
                    type="checkbox"
                    id={`wellness-${item}`}
                    checked={activeDayData.wellness[item]}
                    onChange={() => handleWellnessToggle(item)}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-sky-blue rounded focus:ring-2 focus:ring-sky-blue/50 mr-2.5 sm:mr-3 flex-shrink-0"
                  />
                  <label 
                    htmlFor={`wellness-${item}`}
                    className={`text-sm sm:text-base flex-grow ${activeDayData.wellness[item] ? 'line-through opacity-70' : ''}`}
                  >
                    {item}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Notes Section */}
        <div className="mb-4 sm:mb-6">
          <h4 className="text-sm sm:text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">Daily Reflection</h4>
          <textarea
            value={activeDayData.notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Write your thoughts, reflections, or notes for the day..."
            className="w-full h-24 sm:h-32 p-2 sm:p-3 text-sm sm:text-base rounded-lg bg-white/5 dark:bg-gray-800/5 backdrop-blur-sm border border-white/10 dark:border-gray-700/30 focus:border-lavender/50 focus:ring focus:ring-lavender/20 resize-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </motion.div>
      
      {/* Daily Progress Summary */}
      <motion.div 
        className="backdrop-blur-md bg-white/5 dark:bg-gray-800/5 rounded-xl p-3 sm:p-4 mx-0 border border-white/10 dark:border-gray-700/30"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-sm sm:text-md font-semibold text-gray-800 dark:text-gray-200">Daily Progress</h4>
            <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              {progressStats.taskCompleted} of {progressStats.taskCount} tasks completed
            </div>
            <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              {progressStats.wellnessCompleted} of {progressStats.wellnessCount} wellness items completed
            </div>
          </div>
          
          <div className="w-24 h-24 sm:w-32 sm:h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle 
                className="text-gray-200 dark:text-gray-700" 
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="40" 
                cx="50" 
                cy="50" 
              />
              <circle 
                className={
                  activeDayData.score <= 3 ? 'text-red-500' : 
                  activeDayData.score <= 6 ? 'text-amber-500' : 
                  activeDayData.score <= 8 ? 'text-green-400' : 
                  'text-green-500'
                }
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="40" 
                cx="50" 
                cy="50" 
                strokeDasharray={`${
                  (activeDayData.score / 10) * 251.2
                } 251.2`}
                strokeDashoffset="0"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
              <text 
                x="50" 
                y="50" 
                dominantBaseline="middle" 
                textAnchor="middle"
                className={`text-base sm:text-xl font-bold fill-current ${
                  activeDayData.score <= 3 ? 'text-red-500' : 
                  activeDayData.score <= 6 ? 'text-amber-500' : 
                  activeDayData.score <= 8 ? 'text-green-400' : 
                  'text-green-500'
                }`}
              >
                {activeDayData.score}/10
              </text>
            </svg>
          </div>
        </div>
      </motion.div>
      
      {/* Task Editor Modal */}
      {showTaskEditor && (
        <TaskEditor
          items={editingWellness ? globalWellness : globalTasks}
          title={editingWellness ? "Edit Wellness Checklist" : "Edit Task List"}
          onSave={(newItems) => {
            if (editingWellness) {
              updateWellnessList(newItems);
            } else {
              updateTaskList(newItems);
            }
            setShowTaskEditor(false);
          }}
          onCancel={() => setShowTaskEditor(false)}
          colorClass={editingWellness ? "sky-blue" : "lavender"}
        />
      )}
    </motion.div>
  );
} 