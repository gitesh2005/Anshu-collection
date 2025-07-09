import React, { useState } from 'react';
import { X, Lock, User, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (success: boolean) => void;
}

export function AdminLogin({ isOpen, onClose, onLogin }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Admin credentials (in production, this should be handled by a backend)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'shrihari2024'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (
      credentials.username === ADMIN_CREDENTIALS.username &&
      credentials.password === ADMIN_CREDENTIALS.password
    ) {
      // Store admin session
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminLoginTime', Date.now().toString());
      onLogin(true);
      onClose();
      setCredentials({ username: '', password: '' });
    } else {
      setError('Invalid username or password');
      onLogin(false);
    }
    
    setIsLoading(false);
  };

  const handleClose = () => {
    setCredentials({ username: '', password: '' });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="netflix-card-gradient rounded-lg w-full max-w-md border border-gray-700 animate-slideInUp">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <Lock className="text-white" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-white">Admin Login</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-700 rounded-full transition-all duration-200 transform hover:scale-110 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="Enter admin username"
                />
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="Enter admin password"
                />
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900 bg-opacity-20 border border-red-700 rounded-lg animate-fadeIn">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg netflix-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Login to Admin Panel</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Security Notice</h4>
            <p className="text-xs text-gray-400">
              This admin panel is protected. Only authorized personnel should access this area.
              Sessions expire after 24 hours for security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}