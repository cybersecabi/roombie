import React, { useState } from 'react';
import { useHouse } from '../../contexts/HouseContext';
import { Home, Users, Copy, Check, Loader2, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export const HouseSetup: React.FC = () => {
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
  const [houseName, setHouseName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdCode, setCreatedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const { createHouse, joinHouse } = useHouse();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const code = await createHouse(houseName);
      setCreatedCode(code);
    } catch (err: any) {
      setError(err.message || 'Failed to create house');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await joinHouse(inviteCode);
    } catch (err: any) {
      setError(err.message || 'Failed to join house');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(createdCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (createdCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="w-12 h-12 bg-black dark:bg-white flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-white dark:text-black" />
            </div>
            <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">
              House created
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Share this code with your roommates
            </p>
          </div>

          <div className="mb-8">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Invite Code
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1 py-4 px-4 bg-gray-100 dark:bg-gray-900 border-2 border-black dark:border-white">
                <span className="text-2xl font-mono font-bold text-black dark:text-white tracking-widest">
                  {createdCode}
                </span>
              </div>
              <button
                onClick={copyCode}
                className="p-4 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                {copied ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <Copy className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-medium flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors group"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'select') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black p-6">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <div className="w-12 h-12 bg-black dark:bg-white flex items-center justify-center mb-6">
              <Home className="w-6 h-6 text-white dark:text-black" />
            </div>
            <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">
              Join a house
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Create a new house or join an existing one
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              className="w-full p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black dark:bg-white flex items-center justify-center">
                  <Home className="w-6 h-6 text-white dark:text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-black dark:text-white text-lg">Create New House</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Start fresh with your roommates</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
              </div>
            </button>

            <button
              onClick={() => setMode('join')}
              className="w-full p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Users className="w-6 h-6 text-black dark:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-black dark:text-white text-lg">Join Existing House</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enter an invite code to join</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black p-6">
      <div className="w-full max-w-md">
        <button
          onClick={() => setMode('select')}
          className="mb-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">
            {mode === 'create' ? 'Create house' : 'Join house'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            {mode === 'create' 
              ? 'Give your house a name to get started' 
              : 'Enter the invite code from your roommate'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-black dark:border-white bg-gray-50 dark:bg-gray-900">
            <p className="text-sm text-black dark:text-white">{error}</p>
          </div>
        )}

        <form onSubmit={mode === 'create' ? handleCreate : handleJoin} className="space-y-6">
          {mode === 'create' ? (
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                House Name
              </label>
              <input
                type="text"
                value={houseName}
                onChange={(e) => setHouseName(e.target.value)}
                className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 text-black dark:text-white focus:border-black dark:focus:border-white focus:outline-none transition-colors text-xl font-medium placeholder:text-gray-400"
                placeholder="e.g., The Cool House"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Invite Code
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 text-black dark:text-white focus:border-black dark:focus:border-white focus:outline-none transition-colors text-xl font-mono font-medium uppercase placeholder:text-gray-400 tracking-widest"
                placeholder="XXXXXX"
                maxLength={6}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-medium flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{mode === 'create' ? 'Creating...' : 'Joining...'}</span>
              </>
            ) : (
              <>
                <span>{mode === 'create' ? 'Create House' : 'Join House'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
