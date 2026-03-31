/**
 * Calendar View Component
 * Displays journal entries in a calendar format
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const CalendarView = ({ entries = [], isOpen, onClose, onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEntriesForDate = (date) => {
    const dateStr = date.toDateString();
    return entries.filter(e => new Date(e.createdAt).toDateString() === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const today = new Date();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add day cells
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  if (!isOpen) return null;

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="modal-overlay flex items-center justify-center p-4">
      <div className="bento-item max-w-2xl w-full p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sage-200 dark:border-deep-600">
          <h2 className="text-xl font-semibold text-earth-800 dark:text-cream-100">
            📆 Journal Calendar
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sage-100 dark:hover:bg-deep-600 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-earth-600 dark:text-cream-400" />
          </button>
        </div>

        {/* Calendar */}
        <div className="p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-sage-100 dark:hover:bg-deep-600 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-earth-600 dark:text-cream-400" />
            </button>
            <h3 className="text-lg font-semibold text-earth-800 dark:text-cream-100">
              {monthName}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-sage-100 dark:hover:bg-deep-600 rounded-xl transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-earth-600 dark:text-cream-400" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-earth-600 dark:text-cream-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dayEntries = getEntriesForDate(date);
              const isToday = date.toDateString() === today.toDateString();
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();

              return (
                <button
                  key={date.toDateString()}
                  onClick={() => {
                    onSelectDate?.(date);
                    onClose();
                  }}
                  className={`aspect-square p-2 rounded-xl border-2 transition-all hover:shadow-md ${
                    isToday
                      ? 'border-leaf-500 bg-leaf-100 dark:bg-leaf-900/30'
                      : 'border-sage-200 dark:border-deep-500'
                  } ${
                    !isCurrentMonth && 'opacity-40'
                  } hover:border-leaf-500 bg-white dark:bg-deep-700`}
                >
                  <div className="text-sm font-semibold text-earth-700 dark:text-cream-200 mb-1">
                    {date.getDate()}
                  </div>
                  <div className="flex items-center justify-center min-h-[16px]">
                    {dayEntries.length > 0 && (
                      <div className="flex-wrap justify-center -space-x-1">
                        {dayEntries.slice(0, 3).map((entry, idx) => (
                          <div
                            key={idx}
                            className="w-4 h-4 rounded-full bg-leaf-500 border border-white dark:border-deep-700 flex items-center justify-center flex-shrink-0"
                            title={`Entry from ${new Date(entry.createdAt).toLocaleTimeString()}`}
                          >
                            {entry.mood && (
                              <span className="text-xs leading-none">{entry.mood}</span>
                            )}
                          </div>
                        ))}
                        {dayEntries.length > 3 && (
                          <span className="text-xs text-earth-600 dark:text-cream-400 font-semibold">
                            +{dayEntries.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-sage-200 dark:border-deep-600">
            <p className="text-sm text-earth-600 dark:text-cream-400 mb-3">
              <strong>Legend:</strong>
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-leaf-500"></div>
                <span className="text-earth-600 dark:text-cream-400">Entry recorded</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-lg border-2 border-leaf-500 bg-leaf-100 dark:bg-leaf-900/30"></div>
                <span className="text-earth-600 dark:text-cream-400">Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
