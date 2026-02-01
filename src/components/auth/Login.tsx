import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { SweepingPreloader } from './SweepingPreloader';

interface LoginProps {
  onToggle: () => void;
}

export const Login: React.FC<LoginProps> = ({ onToggle }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [preloading, setPreloading] = useState(true);
  const { login } = useAuth();

  // Show preloader on initial load
  React.useEffect(() => {
    const timer = setTimeout(() => setPreloading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (preloading) {
    return <SweepingPreloader text="Loading..." />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-12">
          <div className="w-12 h-12 bg-black dark:bg-white flex items-center justify-center mb-6">
            <span className="text-xl font-bold text-white dark:text-black">R</span>
          </div>
          <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Sign in to manage your household
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 border border-black dark:border-white bg-gray-50 dark:bg-gray-900">
            <p className="text-sm text-black dark:text-white">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 text-black dark:text-white focus:border-black dark:focus:border-white focus:outline-none transition-colors placeholder:text-gray-400"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 text-black dark:text-white focus:border-black dark:focus:border-white focus:outline-none transition-colors placeholder:text-gray-400"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-medium flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <span>Sweeping things up...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={onToggle}
              className="text-black dark:text-white font-medium underline underline-offset-4 hover:no-underline"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
