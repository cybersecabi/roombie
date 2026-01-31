import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';

interface SignupProps {
  onToggle: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onToggle }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, name);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
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
            Create account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Start managing chores with your roommates
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
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 text-black dark:text-white focus:border-black dark:focus:border-white focus:outline-none transition-colors placeholder:text-gray-400"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

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
                placeholder="Min. 6 characters"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <button
              onClick={onToggle}
              className="text-black dark:text-white font-medium underline underline-offset-4 hover:no-underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
