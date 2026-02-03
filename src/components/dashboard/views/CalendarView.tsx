import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { format, startOfMonth, startOfWeek, isSameMonth, isSameDay, addMonths, subMonths, isToday as isDateToday } from 'date-fns';
import { staggerReveal } from '../../../lib/animations';

interface CalendarViewProps {
  assignments: any[];
  roommates: any[];
  darkMode?: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ assignments, roommates, darkMode = true }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const days = Array.from(containerRef.current.querySelectorAll('.calendar-day'));
      if (days.length > 0) {
        staggerReveal(days);
      }
    }
  }, [currentDate]);

  const monthStart = startOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });

  const days = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  const getTasksForDate = (date: Date) => {
    return assignments.filter(a => isSameDay(a.weekStart, date));
  };

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div ref={containerRef} className="lg:col-span-2 glass-card p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{format(currentDate, 'MMMM yyyy')}</h2>
              <p className="text-sm text-zinc-500">{assignments.length} tasks this month</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-400" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-white transition-colors"
            >
              Today
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-zinc-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, idx) => {
            const tasks = getTasksForDate(date);
            const hasTasks = tasks.length > 0;
            const isToday = isDateToday(date);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isCurrentMonth = isSameMonth(date, currentDate);

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(isSelected ? null : date)}
                className={`
                  calendar-day relative aspect-square rounded-xl p-2 transition-all duration-200
                  ${isToday
                    ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 scale-105'
                    : isSelected
                      ? 'bg-violet-500/20 text-white border-2 border-violet-500'
                      : isCurrentMonth
                        ? 'bg-white/5 text-white hover:bg-white/10'
                        : 'text-zinc-600'
                  }
                  ${hasTasks && !isToday && !isSelected ? 'ring-1 ring-violet-500/30' : ''}
                `}
              >
                <span className="text-sm font-medium">{format(date, 'd')}</span>
                {hasTasks && (
                  <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                    {tasks.slice(0, 3).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full ${
                          isToday ? 'bg-white' : 'bg-violet-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-500" />
            <span className="text-zinc-500">Has tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-violet-500 to-purple-600" />
            <span className="text-zinc-500">Today</span>
          </div>
        </div>
      </div>

      {/* Selected date details */}
      <div className="space-y-6">
        {selectedDate ? (
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">{format(selectedDate, 'MMMM d, yyyy')}</h3>
                <p className="text-zinc-500">
                  {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} scheduled
                </p>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-zinc-400 rotate-180" />
              </button>
            </div>

            {selectedTasks.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500">No tasks scheduled</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedTasks.map((assignment) => {
                  const user = roommates.find(r => r.id === assignment.userId);
                  return (
                    <div
                      key={assignment.id}
                      className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{assignment.choreName}</h4>
                          <p className="text-sm text-zinc-500">{user?.name}</p>
                        </div>
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold
                          ${assignment.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                          }
                        `}>
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className={`
                          px-2 py-0.5 rounded-full font-semibold
                          ${assignment.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                          }
                        `}>
                          {assignment.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card p-6 text-center">
            <CalendarIcon className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Select a date</h3>
            <p className="text-zinc-500">Click on any day to view its tasks</p>
          </div>
        )}

        {/* Mini stats */}
        <div className="glass-card p-5">
          <h4 className="font-semibold text-white mb-4">Monthly Summary</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Total tasks</span>
              <span className="font-semibold text-white">{assignments.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Completed</span>
              <span className="font-semibold text-emerald-400">
                {assignments.filter(a => a.status === 'completed').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Pending</span>
              <span className="font-semibold text-amber-400">
                {assignments.filter(a => a.status === 'pending').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
