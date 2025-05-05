'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TaskEditorProps {
  items: string[];
  title: string;
  onSave: (items: string[]) => void;
  onCancel: () => void;
  colorClass: string;
}

export default function TaskEditor({ items, title, onSave, onCancel, colorClass }: TaskEditorProps) {
  const [editedItems, setEditedItems] = useState<string[]>([...items]);
  const [newItemText, setNewItemText] = useState<string>('');
  const newItemRef = useRef<HTMLInputElement>(null);
  
  // Focus the new item input when the component mounts
  useEffect(() => {
    if (newItemRef.current) {
      newItemRef.current.focus();
    }
  }, []);
  
  // Handle adding a new item
  const handleAddItem = () => {
    if (newItemText.trim() === '') return;
    
    setEditedItems([...editedItems, newItemText.trim()]);
    setNewItemText('');
    
    // Focus the input again after adding
    if (newItemRef.current) {
      newItemRef.current.focus();
    }
  };
  
  // Handle keypress event on the new item input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };
  
  // Handle removing an item
  const handleRemoveItem = (index: number) => {
    const updatedItems = [...editedItems];
    updatedItems.splice(index, 1);
    setEditedItems(updatedItems);
  };
  
  // Handle editing an item
  const handleEditItem = (index: number, value: string) => {
    const updatedItems = [...editedItems];
    updatedItems[index] = value;
    setEditedItems(updatedItems);
  };
  
  // Handle item drag
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  
  const handleDrop = () => {
    if (draggedIndex === null || dragOverIndex === null) return;
    
    const updatedItems = [...editedItems];
    const draggedItem = updatedItems[draggedIndex];
    
    // Remove the dragged item
    updatedItems.splice(draggedIndex, 1);
    
    // Insert it at the drop position
    updatedItems.splice(dragOverIndex, 0, draggedItem);
    
    setEditedItems(updatedItems);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };
  
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };
  
  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: { opacity: 0, scale: 0.8 }
  };
  
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };
  
  // Get color classes based on the provided colorClass
  const getBgColor = () => {
    if (colorClass === 'lavender') return 'bg-lavender';
    if (colorClass === 'sky-blue') return 'bg-sky-blue';
    return `bg-${colorClass}`;
  }
  
  const getBgOpacityColor = (opacity: string) => {
    if (colorClass === 'lavender') return `bg-lavender/${opacity}`;
    if (colorClass === 'sky-blue') return `bg-sky-blue/${opacity}`;
    return `bg-${colorClass}/${opacity}`;
  }
  
  const getHoverColor = () => {
    if (colorClass === 'lavender') return 'hover:bg-lavender/80';
    if (colorClass === 'sky-blue') return 'hover:bg-sky-blue/80';
    return `hover:bg-${colorClass}/80`;
  }
  
  const getTextColor = () => {
    if (colorClass === 'lavender') return 'text-lavender';
    if (colorClass === 'sky-blue') return 'text-sky-blue';
    return `text-${colorClass}`;
  }
  
  const getHoverTextColor = () => {
    if (colorClass === 'lavender') return 'hover:text-lavender';
    if (colorClass === 'sky-blue') return 'hover:text-sky-blue';
    return `hover:text-${colorClass}`;
  }
  
  const getRingColor = () => {
    if (colorClass === 'lavender') return 'focus:ring-lavender/50';
    if (colorClass === 'sky-blue') return 'focus:ring-sky-blue/50';
    return `focus:ring-${colorClass}/50`;
  }
  
  const getBorderColor = () => {
    if (colorClass === 'lavender') return 'border-lavender';
    if (colorClass === 'sky-blue') return 'border-sky-blue';
    return `border-${colorClass}`;
  }
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <motion.div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onCancel}
      />
      
      <motion.div 
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={`text-xl font-bold mb-4 ${getTextColor()}`}>{title}</h3>
        
        {/* Current Items List */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Drag items to reorder. Click the x to remove an item.
          </p>
          
          <div className="space-y-2 mb-4">
            {editedItems.map((item, index) => (
              <div 
                key={index}
                className={`flex items-center p-2 rounded-lg ${getBgOpacityColor('10')} hover:${getBgOpacityColor('20')} transition-colors
                  ${draggedIndex === index ? 'opacity-50' : ''}
                  ${dragOverIndex === index ? `border-2 ${getBorderColor()}` : ''}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
              >
                <div className="mr-2 cursor-move text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                  </svg>
                </div>
                
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleEditItem(index, e.target.value)}
                  className={`flex-grow bg-transparent border-none focus:ring-1 ${getRingColor()} rounded p-1 text-gray-800 dark:text-gray-200`}
                />
                
                <button 
                  onClick={() => handleRemoveItem(index)}
                  className={`ml-2 text-gray-400 ${getHoverTextColor()} focus:outline-none`}
                  aria-label="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          {/* Add New Item */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              ref={newItemRef}
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Add new item..."
              className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none focus:ring-2 ${getRingColor()} focus:border-transparent text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700`}
            />
            <button
              onClick={handleAddItem}
              className={`p-2 ${getBgColor()} text-white rounded-lg sm:rounded-l-none sm:rounded-r-lg ${getHoverColor()} transition-colors flex items-center justify-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Filter out any empty items before saving
              const cleanItems = editedItems
                .map(item => item.trim())
                .filter(item => item.length > 0);
              onSave(cleanItems);
            }}
            className={`px-4 py-2 ${getBgColor()} text-white rounded-lg ${getHoverColor()} transition-colors`}
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
} 