import React, { useEffect, useRef } from 'react';
import { Flame, CheckCircle2, TrendingUp, Clock, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { fadeUp, staggerReveal } from '../../../lib/animations';
import { TaskCard, StatCard } from '../ui/PremiumCards';
import { MiniCalendar } from '../ui/Calendar';
import { ShoppingList } from '../ui/ShoppingList';
import { StreakDisplay } from '../ui/GamifiedComponents';

interface DashboardViewProps {
  myPendingAssignments: any[];
  currentAssignments: any[];
  roommates: any[];
  onComplete: (id: string) => void;
  userData?: any;
  assignments: any[];
  shoppingList: any[];
  onAddShopping: () => void;
  purchaseItem: (id: string) => void;
  darkMode?: boolean;
}

export const DashboardHome: React.FC<DashboardViewProps> = ({
  myPendingAssignments,
  currentAssignments,
  roommates,
  onComplete,
  userData,
  assignments,
  shoppingList,
  onAddShopping,
  purchaseItem,
  darkMode = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial animations
    if (containerRef.current) {
      const greeting = containerRef.current.querySelector('.greeting-section');
      const stats = Array.from(containerRef.current.querySelectorAll('.stat-card'));
      const tasks = Array.from(containerRef.current.querySelectorAll('.task-card'));

      if (greeting) fadeUp(greeting);
      if (stats.length > 0) staggerReveal(stats);
      if (tasks.length > 0) staggerReveal(tasks);
    }
  }, []);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const totalCompleted = assignments.filter(a => a.status === 'completed').length;
  const myCompleted = assignments.filter(a => a.userId === userData?.id && a.status === 'completed').length;
  const streak = userData?.streak || 0;

  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-zinc-500' : 'text-gray-500';
  const cardBg = darkMode ? 'glass-card' : 'bg-white border border-gray-200 shadow-sm';
  const itemBg = darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100';
  const itemBorder = darkMode ? 'border-violet-500/20' : 'border-violet-200';
  const itemBgHighlight = darkMode ? 'bg-violet-500/10' : 'bg-violet-50';
  const avatarBg = darkMode ? 'bg-zinc-800' : 'bg-gray-200';

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Greeting Section */}
      <section className="greeting-section">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-1 ${textPrimary}`}>
              {getTimeGreeting()}, {userData?.name?.split(' ')[0]}! 👋
            </h1>
            <p className={textSecondary}>
              {myPendingAssignments.length === 0
                ? "You're all caught up! Great job!"
                : `You have ${myPendingAssignments.length} task${myPendingAssignments.length !== 1 ? 's' : ''} pending this week.`
              }
            </p>
          </div>

          <div className="hidden md:block">
            <StreakDisplay streak={streak} />
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section ref={statsRef}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            value={myPendingAssignments.length}
            label="Due This Week"
            icon={<CheckCircle2 className="w-5 h-5 text-white" />}
            gradient="from-violet-500 to-purple-600"
            delay={0.1}
          />
          <StatCard
            value={myCompleted}
            label="Completed"
            icon={<CheckCircle2 className="w-5 h-5 text-white" />}
            gradient="from-emerald-500 to-teal-600"
            delay={0.15}
          />
          <StatCard
            value={streak}
            label="Week Streak"
            icon={<Flame className="w-5 h-5 text-white" />}
            gradient="from-orange-500 to-red-600"
            delay={0.2}
          />
          <StatCard
            value={totalCompleted}
            label="House Total"
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            gradient="from-blue-500 to-cyan-600"
            delay={0.25}
          />
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* My Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold flex items-center gap-2 ${textPrimary}`}>
              <Zap className="w-5 h-5 text-violet-400" />
              Your Tasks
            </h2>
            <span className={`text-sm ${textSecondary}`}>{myPendingAssignments.length} pending</span>
          </div>

          {myPendingAssignments.length === 0 ? (
            <div className={`p-8 text-center rounded-2xl ${cardBg}`}>
              <CheckCircle2 className="w-16 h-16 text-emerald-500/50 mx-auto mb-4" />
              <h3 className={`text-xl font-semibold mb-2 ${textPrimary}`}>All caught up!</h3>
              <p className={textSecondary}>You've completed all your tasks for this week.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {myPendingAssignments.map((assignment) => (
                <div key={assignment.id} className="task-card">
                  <TaskCard
                    title={assignment.choreName}
                    dueDate={`Due ${format(assignment.weekEnd, 'MMM d')}`}
                    priority="medium"
                    category="Chore"
                    onComplete={() => onComplete(assignment.id)}
                    darkMode={darkMode}
                  />
                </div>
              ))}
            </div>
          )}

          {/* This Week's Schedule */}
          <div className="mt-6">
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${textPrimary}`}>
              <Clock className="w-5 h-5 text-violet-400" />
              This Week's Schedule
            </h2>

            <div className={`p-4 space-y-2 rounded-2xl ${cardBg}`}>
              {currentAssignments.length === 0 ? (
                <p className={`text-center py-4 ${textSecondary}`}>No assignments scheduled</p>
              ) : (
                currentAssignments.map((assignment) => {
                  const user = roommates.find(r => r.id === assignment.userId);
                  const isCurrentUser = assignment.userId === userData?.id;
                  return (
                    <div
                      key={assignment.id}
                      className={`
                        flex items-center justify-between p-3 rounded-xl transition-colors
                        ${isCurrentUser ? `${itemBgHighlight} border ${itemBorder}` : itemBg}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold
                            ${assignment.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : isCurrentUser
                                ? 'bg-violet-500/20 text-violet-400'
                                : `${avatarBg} ${darkMode ? 'text-zinc-400' : 'text-gray-500'}`
                            }
                          `}
                        >
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className={`font-medium text-sm ${textPrimary}`}>{assignment.choreName}</p>
                          <p className={`text-xs ${textSecondary}`}>{user?.name}</p>
                        </div>
                      </div>
                      {assignment.status === 'completed' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Calendar */}
          <MiniCalendar assignments={currentAssignments} darkMode={darkMode} />

          {/* Shopping List */}
          <ShoppingList
            items={shoppingList}
            onAddItem={onAddShopping}
            onPurchase={purchaseItem}
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
};

interface ChoresViewProps {
  chores: any[];
  assignments: any[];
  roommates: any[];
  onAddChore: () => void;
  darkMode?: boolean;
}

export const ChoresView: React.FC<ChoresViewProps> = ({
  chores,
  onAddChore,
  darkMode = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const cards = Array.from(containerRef.current.querySelectorAll('.chore-card'));
      if (cards.length > 0) {
        staggerReveal(cards);
      }
    }
  }, [chores]);

  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-zinc-500' : 'text-gray-500';
  const cardBg = darkMode ? 'glass-card hover:border-white/20' : 'bg-white border border-gray-200 hover:border-gray-300 shadow-sm';

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${textPrimary}`}>House Chores</h2>
          <p className={textSecondary}>{chores.length} chore{chores.length !== 1 ? 's' : ''} configured</p>
        </div>
        <button
          onClick={onAddChore}
          className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-200 flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Add Chore
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chores.map((chore) => (
          <div key={chore.id} className={`chore-card p-5 transition-all duration-300 rounded-2xl ${cardBg}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className={`font-semibold text-lg ${textPrimary}`}>{chore.name}</h3>
                <span className="inline-block mt-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-violet-500/20 text-violet-400 uppercase tracking-wider">
                  {chore.category.replace('_', ' ')}
                </span>
              </div>
            </div>

            {chore.description && (
              <p className="text-sm text-zinc-500 mb-4">{chore.description}</p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="text-xs text-zinc-500">
                <span className="font-medium">{chore.estimatedTime} min</span> •{' '}
                <span className="font-medium capitalize">{chore.priority}</span> priority
              </div>
              <span className="text-xs text-zinc-600">{chore.frequency}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
