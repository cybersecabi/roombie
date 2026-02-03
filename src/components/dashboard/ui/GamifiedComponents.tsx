import React, { useRef, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { animateCounter } from '../../../lib/animations';

interface AchievementBadgeProps {
  icon: string;
  title: string;
  description: string;
  unlocked?: boolean;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  icon,
  title,
  description,
  unlocked = false,
}) => {
  return (
    <div
      className={`
        relative p-4 rounded-2xl border transition-all duration-500
        ${unlocked
          ? 'bg-gradient-to-br from-violet-500/10 to-purple-600/10 border-violet-500/30'
          : 'bg-zinc-900/50 border-zinc-800 opacity-50'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`
          text-3xl transition-all duration-300
          ${unlocked ? 'scale-100' : 'scale-75 grayscale'}
        `}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold text-sm ${unlocked ? 'text-white' : 'text-zinc-500'}`}>
            {title}
          </h4>
          <p className={`text-xs mt-1 ${unlocked ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

interface StreakDisplayProps {
  streak: number;
  bestStreak?: number;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak, bestStreak }) => {
  const streakRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (streakRef.current && streak > 0) {
      animateCounter(streakRef.current, streak);
    }
  }, [streak]);

  return (
    <div className="glass-card p-6 relative overflow-hidden">
      {/* Flame glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent" />

      <div className="relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-4 shadow-lg shadow-orange-500/25">
          <Flame className="w-8 h-8 text-white" />
        </div>

        <div className="flex items-baseline justify-center gap-1 mb-1">
          <span
            ref={streakRef}
            className="text-5xl font-bold text-white"
          >
            {streak}
          </span>
          <span className="text-lg text-zinc-400">weeks</span>
        </div>

        <p className="text-sm text-zinc-500">Current streak</p>

        {bestStreak && bestStreak > streak && (
          <p className="text-xs text-zinc-600 mt-2">
            Best: {bestStreak} weeks
          </p>
        )}
      </div>
    </div>
  );
};

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  label,
  color = '#8b5cf6',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min((value / max) * 100, 100);
  const offset = circumference - (progress / 100) * circumference;
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (counterRef.current) {
      animateCounter(counterRef.current, value);
    }
  }, [value]);

  return (
    <div className="relative flex flex-col items-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#27272a"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          ref={counterRef}
          className="text-3xl font-bold text-white"
        >
          0
        </span>
        {label && (
          <span className="text-xs text-zinc-500 mt-1">{label}</span>
        )}
      </div>
    </div>
  );
};

interface QuickStatProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export const QuickStat: React.FC<QuickStatProps> = ({
  value,
  label,
  icon,
  trend,
  trendValue,
}) => {
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (counterRef.current) {
      animateCounter(counterRef.current, value);
    }
  }, [value]);

  return (
    <div className="glass-card p-4 hover:bg-white/5 transition-colors duration-300">
      <div className="flex items-start justify-between mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center">
          {icon}
        </div>
        {trend && trendValue && (
          <span className={`
            text-xs font-semibold flex items-center gap-1
            ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-zinc-400'}
          `}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trendValue}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1 mb-1">
        <span
          ref={counterRef}
          className="text-2xl font-bold text-white"
        >
          0
        </span>
      </div>

      <span className="text-sm text-zinc-500">{label}</span>
    </div>
  );
};

interface ActivityFeedItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  time: string;
  delay?: number;
}

export const ActivityFeedItem: React.FC<ActivityFeedItemProps> = ({
  icon,
  title,
  subtitle,
  time,
  delay = 0,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (itemRef.current) {
      const el = itemRef.current;
      el.style.opacity = '0';
      el.style.transform = 'translateX(-20px)';
      el.style.transition = `opacity 0.4s ease ${delay}s, transform 0.4s ease ${delay}s`;
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
      });
    }
  }, [delay]);

  return (
    <div
      ref={itemRef}
      className="flex items-start gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors duration-200"
    >
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{title}</p>
        <p className="text-xs text-zinc-500 truncate">{subtitle}</p>
      </div>
      <span className="text-xs text-zinc-600 whitespace-nowrap">{time}</span>
    </div>
  );
};
