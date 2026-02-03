import React, { useEffect, useRef } from 'react';
import { Trophy, Medal, Star, Award, Crown } from 'lucide-react';
import { LeaderboardCard, StatCard } from '../ui/PremiumCards';
import { AchievementBadge } from '../ui/GamifiedComponents';
import { staggerReveal } from '../../../lib/animations';

interface LeaderboardViewProps {
  roommates: any[];
  assignments: any[];
  darkMode?: boolean;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  roommates,
  assignments,
  darkMode = true,
}) => {
  // darkMode prop available for future theming
  void darkMode;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const cards = Array.from(containerRef.current.querySelectorAll('.leaderboard-card'));
      if (cards.length > 0) {
        staggerReveal(cards);
      }
    }
  }, [roommates]);

  // Calculate completed tasks per user
  const userStats = roommates.map(user => {
    const completed = assignments.filter(a => a.userId === user.id && a.status === 'completed').length;
    const total = assignments.filter(a => a.userId === user.id).length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    return { ...user, completed, total, progress };
  });

  // Sort by completed tasks
  const sortedUsers = [...userStats].sort((a, b) => b.completed - a.completed);
  const totalCompleted = assignments.filter(a => a.status === 'completed').length;
  const topPerformer = sortedUsers[0];
  const currentUserIndex = sortedUsers.findIndex(u => u.id === roommates.find(r => r.id === u.id)?.id);

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard
          value={totalCompleted}
          label="Total Completed"
          icon={<Trophy className="w-5 h-5 text-white" />}
          gradient="from-yellow-400 to-amber-500"
          delay={0}
        />
        <StatCard
          value={roommates.length}
          label="Participants"
          icon={<Medal className="w-5 h-5 text-white" />}
          gradient="from-violet-500 to-purple-600"
          delay={0.1}
        />
        <StatCard
          value={topPerformer?.completed || 0}
          label="Top Score"
          icon={<Crown className="w-5 h-5 text-white" />}
          gradient="from-orange-500 to-red-600"
          delay={0.2}
        />
      </div>

      {/* Top Performer Highlight */}
      {topPerformer && (
        <div className="glass-card p-6 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-transparent" />

          <div className="relative z-10 flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-yellow-500/25">
                {topPerformer.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full p-2 shadow-lg">
                <Crown className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-white">{topPerformer.name}</h3>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Top Performer
                </span>
              </div>
              <p className="text-zinc-500">Leading with {topPerformer.completed} completed tasks</p>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold text-white">{topPerformer.completed}</div>
              <p className="text-sm text-zinc-500">tasks done</p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="space-y-3">
        {sortedUsers.map((user, idx) => (
          <div key={user.id} className="leaderboard-card">
            <LeaderboardCard
              rank={idx + 1}
              name={user.name}
              avatar={user.name?.charAt(0).toUpperCase() || '?'}
              completed={user.completed}
              total={user.total || 1}
              streak={user.streak || 0}
              isCurrentUser={idx === currentUserIndex}
            />
          </div>
        ))}
      </div>

      {/* Achievements Section */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-violet-400" />
          Achievements
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AchievementBadge
            icon="🏆"
            title="First Steps"
            description="Complete your first task"
            unlocked={totalCompleted > 0}
          />
          <AchievementBadge
            icon="🔥"
            title="On Fire"
            description="Maintain a 3-week streak"
            unlocked={topPerformer?.streak >= 3}
          />
          <AchievementBadge
            icon="💪"
            title="Dedicated"
            description="Complete 10 tasks"
            unlocked={totalCompleted >= 10}
          />
          <AchievementBadge
            icon="⚡"
            title="Speed Demon"
            description="Complete 5 tasks in a day"
            unlocked={false}
          />
          <AchievementBadge
            icon="🎯"
            title="Perfectionist"
            description="Complete all weekly tasks"
            unlocked={false}
          />
          <AchievementBadge
            icon="👑"
            title="Champion"
            description="Reach #1 on leaderboard"
            unlocked={currentUserIndex === 0}
          />
        </div>
      </div>
    </div>
  );
};
