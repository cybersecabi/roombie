import React, { useEffect, useRef } from 'react';
import { History, CheckCircle2, Calendar as CalendarIcon, User } from 'lucide-react';
import { format } from 'date-fns';
import { staggerReveal } from '../../../lib/animations';

interface HistoryViewProps {
  assignments: any[];
  roommates: any[];
  darkMode?: boolean;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  assignments,
  roommates,
  darkMode = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const items = Array.from(containerRef.current.querySelectorAll('.history-item'));
      if (items.length > 0) {
        staggerReveal(items);
      }
    }
  }, [assignments]);

  const completedAssignments = assignments
    .filter(a => a.status === 'completed')
    .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0));

  const groupedByDate = completedAssignments.reduce((groups: Record<string, any[]>, assignment) => {
    const date = assignment.completedAt ? format(assignment.completedAt, 'yyyy-MM-dd') : 'Unknown';
    if (!groups[date]) groups[date] = [];
    groups[date].push(assignment);
    return groups;
  }, {});

  const sortedDates = Object.entries(groupedByDate).sort(([a], [b]) => b.localeCompare(a));

  const getUserName = (userId: string) => roommates.find(r => r.id === userId)?.name || 'Unknown';
  const getUserInitial = (userId: string) => roommates.find(r => r.id === userId)?.name?.charAt(0).toUpperCase() || '?';

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Task History</h2>
          <p className="text-zinc-500">{completedAssignments.length} completed tasks</p>
        </div>
      </div>

      {completedAssignments.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <History className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No completed tasks yet</h3>
          <p className="text-zinc-500">Complete some tasks to see your history here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDates.map(([date, dayAssignments]) => (
            <div key={date} className="glass-card overflow-hidden">
              {/* Date header */}
              <div className="px-6 py-4 bg-gradient-to-r from-violet-500/10 to-purple-600/10 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {date === 'Unknown' ? 'Unknown Date' : format(new Date(date), 'EEEE, MMMM d, yyyy')}
                      </h3>
                      <p className="text-sm text-zinc-500">
                        {dayAssignments.length} task{dayAssignments.length !== 1 ? 's' : ''} completed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignments list */}
              <div className="divide-y divide-white/5">
                {dayAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="history-item flex items-center gap-4 p-5 hover:bg-white/5 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0">
                      {getUserInitial(assignment.userId)}
                    </div>

                    {/* Task info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white">{assignment.choreName}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-zinc-500 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {getUserName(assignment.userId)}
                        </span>
                        {assignment.completedAt && (
                          <span className="text-sm text-zinc-600">
                            at {format(assignment.completedAt, 'h:mm a')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status indicator */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
