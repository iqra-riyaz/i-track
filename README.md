# Daily Calendar Tracker

A modern web application for tracking daily activities, tasks, and wellness goals with a beautiful, responsive interface.

## Features

- **Calendar Interface**
  - Daily activity tracking
  - Score-based progress monitoring
  - Motivational quotes for each day
  - Responsive date selection

- **Task Management**
  - Customizable task lists
  - Task completion tracking
  - Progress visualization
  - Local storage persistence

- **Wellness Tracking**
  - Customizable wellness checklist
  - Daily wellness monitoring
  - Progress indicators
  - Habit formation support

- **Daily Reflections**
  - Notes for each day
  - Progress summaries
  - Visual progress indicators
  - Mood tracking

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Local Storage for data persistence

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/daily-calendar-tracker.git
cd daily-calendar-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── calendar/
│   │   └── page.tsx     # Calendar page
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/
│   ├── CalendarTracker.tsx  # Main calendar component
│   ├── TaskEditor.tsx       # Task management component
│   └── BackgroundAnimation.tsx # Background effects
├── context/
│   └── AppContext.tsx    # Application state management
└── lib/
    └── analyticsService.ts # Analytics utilities
```

## Features in Detail

### Calendar Interface
- Interactive date selection
- Daily score tracking (0-10 scale)
- Visual progress indicators
- Responsive design for all devices

### Task Management
- Add/Edit/Delete tasks
- Task completion tracking
- Progress visualization
- Persistent storage

### Wellness Tracking
- Customizable wellness items
- Daily wellness monitoring
- Progress tracking
- Visual indicators

### Daily Reflections
- Text area for daily notes
- Progress summaries
- Score-based tracking
- Mood indicators

## Deployment

This project is configured for deployment on Netlify:

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Pomodoro Technique](https://francescocirillo.com/pages/pomodoro-technique)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Chart.js](https://www.chartjs.org/) 