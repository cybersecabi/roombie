import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { format, startOfMonth, startOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

interface CalendarProps {
  assignments: any[];
  onDateSelect?: (date: Date) => void;
  darkMode?: boolean;
}

export const MiniCalendar: React.FC<CalendarProps> = ({ assignments, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });

  const days = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  const getTasksForDate = (date: Date) => {
    return assignments.filter(a => {
      const taskDate = a.weekStart;
      return isSameDay(taskDate, date);
    });
  };

  const isToday = (date: Date) => isSameDay(date, new Date());
  const isCurrentMonth = (date: Date) => isSameMonth(date, currentDate);

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-400" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
          <div
            key={day}
            className="text-xs font-semibold text-zinc-600 text-center py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, idx) => {
          const tasks = getTasksForDate(date);
          const hasTasks = tasks.length > 0;

          return (
            <button
              key={idx}
              onClick={() => onDateSelect?.(date)}
              className={`
                relative aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200
                ${isToday(date)
                  ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25'
                  : isCurrentMonth(date)
                    ? 'text-white hover:bg-white/10'
                    : 'text-zinc-700'
                }
                ${hasTasks && !isToday(date) ? 'ring-1 ring-violet-500/30' : ''}
              `}
            >
              {format(date, 'd')}
              {hasTasks && (
                <div className="absolute bottom-1 flex gap-0.5">
                  {tasks.slice(0, 3).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-1 rounded-full ${
                        isToday(date) ? 'bg-white/60' : 'bg-violet-500'
                      }`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-zinc-400">
            <Clock className="w-4 h-4" />
            <span>{assignments.length} tasks this month</span>
          </div>
          <button className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
            View all
          </button>
        </div>
      </div>
    </div>
  );
};

interface DayViewProps {
  date: Date;
  assignments: any[];
  roommates: any[];
  onClose?: () => void;
}

export const DayView: React.FC<DayViewProps> = ({ date, assignments, roommates, onClose }) => {
  const dayAssignments = assignments.filter(a => isSameDay(a.weekStart, date));

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {format(date, 'EEEE, MMMM d')}
          </h3>
          <p className="text-sm text-zinc-500">{dayAssignments.length} tasks scheduled</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-zinc-400" />
        </button>
      </div>

      {dayAssignments.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500">No tasks scheduled</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dayAssignments.map((assignment, idx) => {
            const user = roommates.find(r => r.id === assignment.userId);
            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center text-sm font-semibold text-violet-400">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {assignment.choreName}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">{user?.name}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  assignment.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
