import React, { useRef, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { animateCounter } from '../../../lib/animations';

interface StatCardProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  gradient?: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  gradient = 'from-violet-500 to-purple-600',
  delay = 0,
}) => {
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (counterRef.current) {
      animateCounter(counterRef.current, value, { delay });
    }
  }, [value, delay]);

  return (
    <div className="glass-card p-6 relative overflow-hidden group">
      {/* Background gradient glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            {label}
          </span>
        </div>

        <div className="flex items-baseline gap-1">
          <span
            ref={counterRef}
            className="text-4xl font-bold text-white tracking-tight"
          >
            0
          </span>
          <span className="text-zinc-500 text-sm">total</span>
        </div>
      </div>
    </div>
  );
};

interface TaskCardProps {
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  onComplete: () => void;
  isCompleted?: boolean;
  estimatedTime?: number;
  darkMode?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  title,
  dueDate,
  priority,
  category,
  onComplete,
  isCompleted = false,
  estimatedTime,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const priorityColors = {
    low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    high: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const priorityGlow = {
    low: 'hover:shadow-emerald-500/10',
    medium: 'hover:shadow-amber-500/10',
    high: 'hover:shadow-rose-500/10',
  };

  const handleMouseEnter = () => {
    if (cardRef.current && !isCompleted) {
      cardRef.current.style.transform = 'translateY(-4px)';
      cardRef.current.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current && !isCompleted) {
      cardRef.current.style.transform = 'translateY(0)';
      cardRef.current.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
    }
  };

  return (
    <div
      ref={cardRef}
      className={`
        glass-card p-5 relative overflow-hidden transition-all duration-300
        ${isCompleted ? 'opacity-50' : `hover:border-white/20 ${priorityGlow[priority]}`}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Priority indicator line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${
        priority === 'high' ? 'from-rose-500 to-orange-500' :
        priority === 'medium' ? 'from-amber-500 to-yellow-500' :
        'from-emerald-500 to-teal-500'
      }`} />

      <div className="pl-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full mb-2 ${priorityColors[priority]}`}>
              {priority}
            </span>
            <h3 className={`text-lg font-semibold text-white ${isCompleted ? 'line-through text-zinc-500' : ''}`}>
              {title}
            </h3>
          </div>

          <button
            onClick={onComplete}
            disabled={isCompleted}
            className={`
              p-2 rounded-lg transition-all duration-200 flex-shrink-0 ml-2
              ${isCompleted
                ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                : 'bg-white/10 text-white hover:bg-emerald-500 hover:scale-110 active:scale-95'
              }
            `}
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <span className="flex items-center gap-1">
            {dueDate}
          </span>
          {estimatedTime && (
            <>
              <span className="w-1 h-1 bg-zinc-600 rounded-full" />
              <span>{estimatedTime} min</span>
            </>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-zinc-500">{category}</span>
        </div>
      </div>
    </div>
  );
};

interface LeaderboardCardProps {
  rank: number;
  name: string;
  avatar: string;
  completed: number;
  total: number;
  streak?: number;
  isCurrentUser?: boolean;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  rank,
  name,
  avatar,
  completed,
  total,
  streak = 0,
  isCurrentUser = false,
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    const percentage = (completed / total) * 100;
    setProgress(percentage);
  }, [completed, total]);

  const rankStyles = {
    1: {
      bg: 'from-yellow-400 to-amber-500',
      text: 'text-yellow-400',
      icon: '🥇',
    },
    2: {
      bg: 'from-zinc-300 to-zinc-400',
      text: 'text-zinc-300',
      icon: '🥈',
    },
    3: {
      bg: 'from-amber-600 to-orange-700',
      text: 'text-amber-600',
      icon: '🥉',
    },
  };

  const rankStyle = rankStyles[rank as keyof typeof rankStyles];

  return (
    <div className={`
      glass-card p-4 transition-all duration-300
      ${isCurrentUser ? 'ring-1 ring-violet-500/50 bg-violet-500/5' : ''}
    `}>
      <div className="flex items-center gap-4">
        {/* Rank */}
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg
          ${rankStyle?.bg || 'bg-zinc-800'} bg-gradient-to-br
        `}>
          {rankStyle?.icon || rank}
        </div>

        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
          {avatar}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-semibold truncate ${isCurrentUser ? 'text-violet-400' : 'text-white'}`}>
              {name}
            </h4>
            {isCurrentUser && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-violet-500/20 text-violet-400 rounded-full">
                You
              </span>
            )}
            {streak > 0 && (
              <span className="flex items-center gap-1 text-xs text-orange-400">
                🔥 {streak}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="relative h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Count */}
        <div className="text-right">
          <span className="text-2xl font-bold text-white">{completed}</span>
          <p className="text-xs text-zinc-500">completed</p>
        </div>
      </div>
    </div>
  );
};
