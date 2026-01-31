import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useHouse } from '../../contexts/HouseContext';
import { 
  Home, CheckCircle2, Calendar, ShoppingCart, 
  LogOut, Moon, Sun, Trophy, Flame, X,
  Plus, History
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, isWithinInterval, addWeeks } from 'date-fns';
import type { Assignment, User, Chore, ShoppingItem } from '../../types';

export const Dashboard: React.FC = () => {
  const { userData, logout } = useAuth();
  const { house, roommates, chores, assignments, shoppingList, completeAssignment, addShoppingItem, purchaseItem, leaveHouse } = useHouse();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chores' | 'calendar' | 'shopping' | 'leaderboard' | 'history'>('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showAddChore, setShowAddChore] = useState(false);
  const [showAddShopping, setShowAddShopping] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const currentAssignments = assignments.filter(a => 
    isWithinInterval(new Date(), { start: a.weekStart, end: a.weekEnd })
  );

  const myAssignments = currentAssignments.filter(a => a.userId === userData?.id);
  const myPendingAssignments = myAssignments.filter(a => a.status === 'pending');

  const handleComplete = async (assignmentId: string) => {
    await completeAssignment(assignmentId);
    setNotifications(prev => [...prev, 'Task completed']);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
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

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'chores', label: 'Chores', icon: CheckCircle2 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'shopping', label: 'Shopping', icon: ShoppingCart },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'history', label: 'History', icon: History },
  ] as const;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notif, idx) => (
          <div key={idx} className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 border border-black dark:border-white animate-fade-in">
            {notif}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-black dark:bg-white flex items-center justify-center">
                <Home className="w-5 h-5 text-white dark:text-black" />
              </div>
              <div>
                <h1 className="font-bold text-black dark:text-white text-lg">{house?.name || 'Roommate Manager'}</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {roommates.length} {roommates.length === 1 ? 'roommate' : 'roommates'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-black" />}
              </button>
              
              <div className="relative group">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                  <div className="w-8 h-8 bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-semibold text-sm">
                    {userData?.name?.charAt(0).toUpperCase()}
                  </div>
                </button>
                
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <p className="font-medium text-black dark:text-white">{userData?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{userData?.email}</p>
                  </div>
                  <button
                    onClick={handleLeaveHouse}
                    className="w-full px-4 py-3 text-left text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 flex items-center gap-3 text-sm border-b border-gray-200 dark:border-gray-800"
                  >
                    <LogOut className="w-4 h-4" /> Leave House
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 flex items-center gap-3 text-sm"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === id
                    ? 'border-black dark:border-white text-black dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView 
            myPendingAssignments={myPendingAssignments}
            currentAssignments={currentAssignments}
            roommates={roommates}
            onComplete={handleComplete}
          />
        )}
        {activeTab === 'chores' && (
          <ChoresView 
            chores={chores}
            assignments={assignments}
            roommates={roommates}
            onAddChore={() => setShowAddChore(true)}
          />
        )}
        {activeTab === 'calendar' && (
          <CalendarView assignments={assignments} roommates={roommates} />
        )}
        {activeTab === 'shopping' && (
          <ShoppingView 
            items={shoppingList}
            onAddItem={() => setShowAddShopping(true)}
            onPurchase={purchaseItem}
          />
        )}
        {activeTab === 'leaderboard' && (
          <LeaderboardView roommates={roommates} assignments={assignments} />
        )}
        {activeTab === 'history' && (
          <HistoryView assignments={assignments} roommates={roommates} />
        )}
      </main>

      {/* Add Chore Modal */}
      {showAddChore && (
        <AddChoreModal onClose={() => setShowAddChore(false)} />
      )}

      {/* Add Shopping Modal */}
      {showAddShopping && (
        <AddShoppingModal onClose={() => setShowAddShopping(false)} onAdd={addShoppingItem} />
      )}
    </div>
  );
};

// Sub-components
const DashboardView: React.FC<{
  myPendingAssignments: Assignment[];
  currentAssignments: Assignment[];
  roommates: User[];
  onComplete: (id: string) => void;
}> = ({ myPendingAssignments, currentAssignments, roommates, onComplete }) => {
  const getUserName = (userId: string) => roommates.find(r => r.id === userId)?.name || 'Unknown';

  return (
    <div className="space-y-8">
      {/* My Tasks */}
      <section>
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Your Tasks This Week
        </h2>
        {myPendingAssignments.length === 0 ? (
          <div className="border border-gray-200 dark:border-gray-800 p-8 text-center">
            <CheckCircle2 className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">All caught up! No pending chores.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myPendingAssignments.map(assignment => (
              <div key={assignment.id} className="border-2 border-black dark:border-white p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-black dark:text-white">{assignment.choreName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Due {format(assignment.weekEnd, 'MMM d')}
                    </p>
                  </div>
                  <button
                    onClick={() => onComplete(assignment.id)}
                    className="p-2 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* This Week's Schedule */}
      <section>
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          This Week's Schedule
        </h2>
        <div className="border border-gray-200 dark:border-gray-800">
          {currentAssignments.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No assignments scheduled
            </div>
          ) : (
            currentAssignments.map((assignment, idx) => (
              <div 
                key={assignment.id} 
                className={`flex items-center justify-between p-4 ${idx !== currentAssignments.length - 1 ? 'border-b border-gray-200 dark:border-gray-800' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 ${assignment.status === 'completed' ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-700'}`} />
                  <span className="font-medium text-black dark:text-white">{assignment.choreName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{getUserName(assignment.userId)}</span>
                  {assignment.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-black dark:text-white" />}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const ChoresView: React.FC<{
  chores: Chore[];
  assignments: Assignment[];
  roommates: User[];
  onAddChore: () => void;
}> = ({ chores, assignments, roommates, onAddChore }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          House Chores
        </h2>
        <button 
          onClick={onAddChore} 
          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Chore
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {chores.map(chore => {
          const recentAssignments = assignments
            .filter(a => a.choreId === chore.id)
            .sort((a, b) => b.weekStart.getTime() - a.weekStart.getTime())
            .slice(0, 4);

          return (
            <div key={chore.id} className="border border-gray-200 dark:border-gray-800 p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-black dark:text-white">{chore.name}</h3>
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {chore.category.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{chore.description}</p>
              
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Recent
                </p>
                <div className="flex flex-wrap gap-2">
                  {recentAssignments.map((assignment, idx) => {
                    const user = roommates.find(r => r.id === assignment.userId);
                    return (
                      <div
                        key={idx}
                        className={`w-8 h-8 flex items-center justify-center text-xs font-medium ${
                          assignment.status === 'completed'
                            ? 'bg-black dark:bg-white text-white dark:text-black'
                            : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400'
                        }`}
                        title={`${user?.name} - ${format(assignment.weekStart, 'MMM d')}`}
                      >
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CalendarView: React.FC<{
  assignments: Assignment[];
  roommates: User[];
}> = ({ assignments, roommates }) => {
  const weeks = Array.from({ length: 4 }, (_, i) => {
    const start = addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), i);
    const end = endOfWeek(start, { weekStartsOn: 1 });
    return { start, end, assignments: assignments.filter(a => 
      isWithinInterval(a.weekStart, { start, end: addWeeks(start, 1) })
    )};
  });

  const getUserName = (userId: string) => roommates.find(r => r.id === userId)?.name || 'Unknown';

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Upcoming Schedule
      </h2>
      
      <div className="space-y-4">
        {weeks.map((week, idx) => (
          <div key={idx} className="border border-gray-200 dark:border-gray-800">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <h3 className="font-semibold text-black dark:text-white">
                Week of {format(week.start, 'MMM d')} - {format(week.end, 'MMM d')}
              </h3>
            </div>
            <div>
              {week.assignments.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm p-4">No assignments scheduled</p>
              ) : (
                week.assignments.map((assignment, aidx) => (
                  <div 
                    key={assignment.id} 
                    className={`flex items-center justify-between p-4 ${aidx !== week.assignments.length - 1 ? 'border-b border-gray-200 dark:border-gray-800' : ''}`}
                  >
                    <span className="text-black dark:text-white">{assignment.choreName}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{getUserName(assignment.userId)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ShoppingView: React.FC<{
  items: ShoppingItem[];
  onAddItem: () => void;
  onPurchase: (id: string) => void;
}> = ({ items, onAddItem, onPurchase }) => {
  const pendingItems = items.filter(i => i.status === 'pending');
  const purchasedItems = items.filter(i => i.status === 'purchased').slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Shopping List
        </h2>
        <button 
          onClick={onAddItem} 
          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
            Needed
          </h3>
          <div className="border border-gray-200 dark:border-gray-800">
            {pendingItems.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm p-4">No items needed</p>
            ) : (
              pendingItems.map((item, idx) => (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-4 ${idx !== pendingItems.length - 1 ? 'border-b border-gray-200 dark:border-gray-800' : ''}`}
                >
                  <div>
                    <span className="font-medium text-black dark:text-white">{item.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">x{item.quantity}</span>
                  </div>
                  <button
                    onClick={() => onPurchase(item.id)}
                    className="p-2 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
            Recently Purchased
          </h3>
          <div className="border border-gray-200 dark:border-gray-800 opacity-60">
            {purchasedItems.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm p-4">No recent purchases</p>
            ) : (
              purchasedItems.map((item, idx) => (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-4 ${idx !== purchasedItems.length - 1 ? 'border-b border-gray-200 dark:border-gray-800' : ''}`}
                >
                  <span className="font-medium text-black dark:text-white line-through">{item.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">x{item.quantity}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LeaderboardView: React.FC<{
  roommates: User[];
  assignments: Assignment[];
}> = ({ roommates, assignments }) => {
  const sortedRoommates = [...roommates].sort((a, b) => (b.totalCompleted || 0) - (a.totalCompleted || 0));

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Leaderboard
      </h2>
      
      <div className="space-y-0 border border-gray-200 dark:border-gray-800">
        {sortedRoommates.map((roommate, idx) => {
          const completedCount = assignments.filter(a => a.userId === roommate.id && a.status === 'completed').length;
          const isTop = idx === 0;
          
          return (
            <div 
              key={roommate.id} 
              className={`flex items-center gap-4 p-4 ${idx !== sortedRoommates.length - 1 ? 'border-b border-gray-200 dark:border-gray-800' : ''} ${isTop ? 'bg-gray-50 dark:bg-gray-900' : ''}`}
            >
              <div className={`w-10 h-10 flex items-center justify-center font-bold text-sm ${
                idx === 0 ? 'bg-black dark:bg-white text-white dark:text-black' :
                idx === 1 ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-black' :
                idx === 2 ? 'bg-gray-600 dark:bg-gray-400 text-white dark:text-black' :
                'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}>
                {idx + 1}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-black dark:text-white">{roommate.name}</span>
                  {isTop && <Trophy className="w-4 h-4 text-black dark:text-white" />}
                  {roommate.streak > 0 && (
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Flame className="w-3 h-3" /> {roommate.streak} week streak
                    </span>
                  )}
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 h-1 mt-2">
                  <div 
                    className="bg-black dark:bg-white h-1 transition-all"
                    style={{ width: `${Math.min((completedCount / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-2xl font-bold text-black dark:text-white">{completedCount}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">done</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HistoryView: React.FC<{
  assignments: Assignment[];
  roommates: User[];
}> = ({ assignments, roommates }) => {
  const getUserName = (userId: string) => roommates.find(r => r.id === userId)?.name || 'Unknown';
  const getUserInitial = (userId: string) => roommates.find(r => r.id === userId)?.name?.charAt(0).toUpperCase() || '?';
  
  const completedAssignments = assignments
    .filter(a => a.status === 'completed')
    .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0));

  const groupedByDate = completedAssignments.reduce((groups, assignment) => {
    const date = assignment.completedAt ? format(assignment.completedAt, 'yyyy-MM-dd') : 'Unknown';
    if (!groups[date]) groups[date] = [];
    groups[date].push(assignment);
    return groups;
  }, {} as Record<string, Assignment[]>);

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Task Completion History
      </h2>
      
      {completedAssignments.length === 0 ? (
        <div className="border border-gray-200 dark:border-gray-800 p-8 text-center">
          <History className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No completed tasks yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByDate).map(([date, dayAssignments]) => (
            <div key={date} className="border border-gray-200 dark:border-gray-800">
              <div className="p-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <h3 className="font-medium text-black dark:text-white">
                  {date === 'Unknown' ? 'Unknown Date' : format(new Date(date), 'EEEE, MMMM d, yyyy')}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {dayAssignments.length} task{dayAssignments.length !== 1 ? 's' : ''} completed
                </p>
              </div>
              <div>
                {dayAssignments.map((assignment, idx) => (
                  <div 
                    key={assignment.id} 
                    className={`flex items-center gap-4 p-4 ${idx !== dayAssignments.length - 1 ? 'border-b border-gray-200 dark:border-gray-800' : ''}`}
                  >
                    <div className="w-10 h-10 bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-semibold text-sm">
                      {getUserInitial(assignment.userId)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-black dark:text-white">{assignment.choreName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Completed by {getUserName(assignment.userId)}
                        {assignment.completedAt && (
                          <span> at {format(assignment.completedAt, 'h:mm a')}</span>
                        )}
                      </p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-black dark:text-white" />
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

const AddChoreModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addChore, roommates } = useHouse();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('kitchen');
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(30);
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekly' | 'monthly' | 'custom'>('weekly');
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const weekDays = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
  ];

  const toggleDay = (day: number) => {
    setRepeatDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await addChore({ 
      name, 
      category: category as any, 
      description, 
      estimatedTime,
      frequency,
      repeatDays: repeatDays.length > 0 ? repeatDays : undefined,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      priority,
      assignedTo: assignedTo || undefined,
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-black dark:text-white">Add New Chore</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Name
            </label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 text-black dark:text-white focus:border-black dark:focus:border-white focus:outline-none transition-colors"
              required 
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Category
            </label>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)} 
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 text-black dark:text-white focus:border-black dark:focus:border-white focus:outline-none transition-colors"
            >
              <option value="kitchen">Kitchen</option>
              <option value="bathroom">Bathroom</option>
              <option value="living_room">Living Room</option>
              <option value="bedroom">Bedroom</option>
              <option value="trash">Trash</option>
              <option value="outdoor">Outdoor</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 text-black dark:text-white focus:border-black dark:focus:border-white focus:outline-none transition-colors resize-none"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Priority
              </label>
              <select 
                value={priority} 
                onChange={e => setPriority(e.target.value as any)} 
                className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 text-black dark:text-white focus:border-black dark:focus:border-white focus:outline-none transition-colors"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Assign To (Optional)
              </label>
              <select 
                value={assignedTo} 
                onChange={e => setAssignedTo(e.target.value)} 
                className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 text-black dark:text-white focus:border-black dark:focus:border-white focus:outline-none transition-colors"
              >
                <option value="">Rotate (Auto)</option>
                {roommates.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Estimated Time: {estimatedTime} min
            </label>
            <input 
              type="range" 
              min="5" 
              max="120" 
              step="5" 
              value={estimatedTime} 
              onChange={e => setEstimatedTime(Number(e.target.value))} 
              className="w-full accent-black dark:accent-white"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Frequency
            </label>
            <select 
              value={frequency} 
              onChange={e => setFrequency(e.target.value as any)} 
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 text-black dark:text-white focus:border-black dark:focus:border-white focus:outline-none transition-colors"
            >
              <option value="once">One Time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom Days</option>
            </select>
          </div>
          
          {frequency === 'custom' && (
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Repeat On
              </label>
              <div className="flex gap-2">
                {weekDays.map(day => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                      repeatDays.includes(day.value)
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Start Date
              </label>
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
                className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 text-black dark:text-white focus:border-black dark:focus:border-white focus:outline-none transition-colors"
                required 
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                End Date (Optional)
              </label>
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} 
                className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 text-black dark:text-white focus:border-black dark:focus:border-white focus:outline-none transition-colors"
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-3 border border-gray-200 dark:border-gray-800 text-black dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Chore'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddShoppingModal: React.FC<{ onClose: () => void; onAdd: any }> = ({ onClose, onAdd }) => {
  const { userData } = useAuth();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onAdd({
      name,
      quantity,
      requestedBy: userData?.id,
      requestedByName: userData?.name,
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 w-full max-w-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-black dark:text-white">Add Shopping Item</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Item Name
            </label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 text-black dark:text-white focus:border-black dark:focus:border-white focus:outline-none transition-colors"
              placeholder="e.g., Dish soap"
              required 
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Quantity
            </label>
            <input 
              type="number" 
              min="1" 
              value={quantity} 
              onChange={e => setQuantity(Number(e.target.value))} 
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 text-black dark:text-white focus:border-black dark:focus:border-white focus:outline-none transition-colors"
              required 
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-3 border border-gray-200 dark:border-gray-800 text-black dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
