import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useHouse } from '../../contexts/HouseContext';
import {
  Home,
  CheckCircle2,
  Calendar,
  ShoppingCart,
  Trophy,
  History,
  LogOut,
  Moon,
  Sun,
  Copy,
  Check,
  Menu,
  X as Close
} from 'lucide-react';

// Import Views
import { DashboardHome, ChoresView } from './views/DashboardViews';
import { LeaderboardView } from './views/LeaderboardView';
import { CalendarView } from './views/CalendarView';
import { HistoryView } from './views/HistoryView';

// Import Modals
import { AddChoreModal, AddShoppingModal } from './modals';

export const Dashboard: React.FC = () => {
  const { userData, logout } = useAuth();
  const {
    house,
    roommates,
    chores,
    assignments,
    shoppingList,
    completeAssignment,
    addShoppingItem,
    purchaseItem,
    leaveHouse,
  } = useHouse();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'chores' | 'calendar' | 'shopping' | 'leaderboard' | 'history'>('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showAddChore, setShowAddChore] = useState(false);
  const [showAddShopping, setShowAddShopping] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Apply dark mode class on mount and when darkMode changes
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  // Ensure dark mode is applied on initial mount (handles SSR/hydration issues)
  useEffect(() => {
    const root = document.documentElement;
    const saved = localStorage.getItem('darkMode');
    const isDark = saved !== null ? saved === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, []);

  const currentAssignments = assignments.filter((a) => {
    const now = new Date();
    return a.weekStart <= now && a.weekEnd >= now;
  });

  const myAssignments = currentAssignments.filter((a) => a.userId === userData?.id);
  const myPendingAssignments = myAssignments.filter((a) => a.status === 'pending');

  const handleComplete = async (assignmentId: string) => {
    await completeAssignment(assignmentId);
    setNotifications((prev) => [...prev, 'Task completed! 🎉']);
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 3000);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleLeaveHouse = async () => {
    if (confirm('Are you sure you want to leave this house?')) {
      await leaveHouse();
    }
  };

  const copyInviteCode = () => {
    if (house?.inviteCode) {
      navigator.clipboard.writeText(house.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'chores', label: 'Chores', icon: CheckCircle2 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'shopping', label: 'Shopping', icon: ShoppingCart },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'history', label: 'History', icon: History },
  ] as const;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      {/* Ambient background effects - only in dark mode */}
      {darkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>
      )}

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        {notifications.map((notif, idx) => (
          <div
            key={idx}
            className="pointer-events-auto bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-xl shadow-violet-500/25 flex items-center gap-2"
            style={{ animation: 'slideIn 0.3s ease-out' }}
          >
            <CheckCircle2 className="w-5 h-5" />
            {notif}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${darkMode ? 'bg-zinc-950/80 border-white/10' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className={`font-bold text-lg transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>{house?.name || 'Roommate Manager'}</h1>
                <p className={`text-xs transition-colors ${darkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
                  {roommates.length} {roommates.length === 1 ? 'roommate' : 'roommates'}
                </p>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Invite code */}
              {house?.inviteCode && (
                <button
                  onClick={copyInviteCode}
                  className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}
                  title="Copy invite code"
                >
                  <span className={`text-sm font-mono font-bold transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>{house.inviteCode}</span>
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className={`w-4 h-4 transition-colors ${darkMode ? 'text-zinc-400' : 'text-gray-500'}`} />}
                </button>
              )}

              {/* Theme toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-xl transition-colors ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2.5 rounded-xl transition-colors ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {mobileMenuOpen ? <Close className={`w-5 h-5 ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`} /> : <Menu className={`w-5 h-5 ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`} />}
              </button>

              {/* User menu */}
              <div className="relative group hidden lg:block">
                <button className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl transition-colors ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                    {userData?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className={`text-sm font-medium transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userData?.name?.split(' ')[0]}</span>
                </button>

                {/* Dropdown */}
                <div className={`absolute right-0 top-full mt-2 w-64 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden border ${darkMode ? 'glass-card border-white/10' : 'bg-white border-gray-200'}`}>
                  <div className={`p-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                    <p className={`font-medium transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userData?.name}</p>
                    <p className={`text-sm transition-colors ${darkMode ? 'text-zinc-500' : 'text-gray-500'}`}>{userData?.email}</p>
                  </div>

                  {house?.inviteCode && (
                    <div className={`p-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                      <p className={`text-xs font-medium uppercase tracking-wider mb-2 ${darkMode ? 'text-zinc-600' : 'text-gray-500'}`}>Invite Code</p>
                      <div className="flex items-center gap-2">
                        <code className={`flex-1 px-3 py-2 font-mono text-lg font-bold rounded-lg ${darkMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-900'}`}>
                          {house.inviteCode}
                        </code>
                        <button
                          onClick={copyInviteCode}
                          className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                          title="Copy invite code"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleLeaveHouse}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 text-sm transition-colors ${darkMode ? 'text-zinc-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                  >
                    <LogOut className="w-4 h-4" /> Leave House
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 text-sm transition-colors ${darkMode ? 'text-zinc-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className={`absolute inset-0 backdrop-blur-sm ${darkMode ? 'bg-black/80' : 'bg-gray-900/50'}`}
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className={`absolute inset-y-0 left-0 w-64 p-6 space-y-2 border-r ${darkMode ? 'glass-card border-white/10' : 'bg-white border-gray-200'}`}>
            <div className={`flex items-center gap-3 mb-6 pb-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={`font-medium transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userData?.name}</p>
                <p className={`text-xs transition-colors ${darkMode ? 'text-zinc-500' : 'text-gray-500'}`}>{house?.name}</p>
              </div>
            </div>

            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
                    : darkMode ? 'text-zinc-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}

            <div className={`pt-4 mt-4 border-t space-y-2 ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <button
                onClick={handleLeaveHouse}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${darkMode ? 'text-zinc-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <LogOut className="w-5 h-5" /> Leave House
              </button>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${darkMode ? 'text-zinc-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <nav className={`hidden lg:block border-b backdrop-blur-sm transition-colors ${darkMode ? 'border-white/10 bg-zinc-950/50' : 'border-gray-200 bg-white/50'}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200
                  ${activeTab === id
                    ? 'border-violet-500 text-violet-500'
                    : darkMode 
                      ? 'border-transparent text-zinc-500 hover:text-zinc-300' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 relative">
        {activeTab === 'dashboard' && (
          <DashboardHome
            myPendingAssignments={myPendingAssignments}
            currentAssignments={currentAssignments}
            roommates={roommates}
            onComplete={handleComplete}
            userData={userData}
            assignments={assignments}
            shoppingList={shoppingList}
            onAddShopping={() => setShowAddShopping(true)}
            purchaseItem={purchaseItem}
            darkMode={darkMode}
          />
        )}
        {activeTab === 'chores' && (
          <ChoresView
            chores={chores}
            assignments={assignments}
            roommates={roommates}
            onAddChore={() => setShowAddChore(true)}
            darkMode={darkMode}
          />
        )}
        {activeTab === 'calendar' && (
          <CalendarView assignments={assignments} roommates={roommates} darkMode={darkMode} />
        )}
        {activeTab === 'shopping' && (
          <div className={`p-8 text-center rounded-2xl border ${darkMode ? 'glass-card border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
            <ShoppingCart className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-zinc-700' : 'text-gray-300'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Shopping View</h3>
            <p className={`mb-6 ${darkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Use the shopping list in the dashboard</p>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl"
            >
              Go to Dashboard
            </button>
          </div>
        )}
        {activeTab === 'leaderboard' && (
          <LeaderboardView roommates={roommates} assignments={assignments} darkMode={darkMode} />
        )}
        {activeTab === 'history' && (
          <HistoryView assignments={assignments} roommates={roommates} darkMode={darkMode} />
        )}
      </main>

      {/* Modals */}
      {showAddChore && <AddChoreModal onClose={() => setShowAddChore(false)} />}
      {showAddShopping && (
        <AddShoppingModal onClose={() => setShowAddShopping(false)} onAdd={addShoppingItem} />
      )}
    </div>
  );
};

// Global styles for glass card
const style = document.createElement('style');
style.textContent = `
  .glass-card {
    background: rgba(24, 24, 27, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
