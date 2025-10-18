import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { X } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, mode = 'login', variant = 'modal' }) => {
  const [formMode, setFormMode] = useState(mode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    display_name: '',
  });
  const [error, setError] = useState('');

  const { login, register, isLoggingIn, isRegistering } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formMode === 'login') {
      login(
        { email: formData.email, password: formData.password },
        {
          onSuccess: () => {
            onClose();
          },
          onError: (err) => {
            console.error('Login error:', err);
            const errorMessage = err.response?.data?.detail || err.message || 'Login failed. Please try again.';
            setError(errorMessage);
          }
        }
      );
    } else {
      register(
        {
          email: formData.email,
          password: formData.password,
          display_name: formData.display_name,
        },
        {
          onSuccess: () => {
            onClose();
          },
          onError: (err) => {
            console.error('Register error:', err);
            const errorMessage = err.response?.data?.detail || err.message || 'Registration failed. Please try again.';
            setError(errorMessage);
          }
        }
      );
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  if (variant === 'panel') {
    return (
      <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl shadow-2xl p-6 w-full border-4 border-pink-300 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-800 m-0 flex items-center">
            <span className="text-3xl mr-3">
              {formMode === 'login' ? '🔑' : '✨'}
            </span>
            {formMode === 'login' ? 'Log In' : 'Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              required 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleInputChange} 
              required 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Enter your password"
            />
          </div>
          {formMode === 'register' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
              <input 
                type="text" 
                name="display_name" 
                value={formData.display_name} 
                onChange={handleInputChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter your display name"
              />
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <button 
            type="submit" 
            disabled={isLoggingIn || isRegistering}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            {isLoggingIn || isRegistering ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Loading...</span>
              </>
            ) : (
              <span>{formMode === 'login' ? 'Log In' : 'Sign Up'}</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setFormMode(formMode === 'login' ? 'register' : 'login')}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            {formMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl shadow-2xl max-w-md w-full border-4 border-pink-300">
        <div className="flex justify-between items-center p-6 border-b-4 border-pink-300">
          <h2 className="text-2xl font-bold text-purple-800 m-0 flex items-center">
            <span className="text-3xl mr-3">
              {formMode === 'login' ? '🔑' : '✨'}
            </span>
            {formMode === 'login' ? 'Log In' : 'Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-purple-700 mb-2 flex items-center">
                <span className="text-lg mr-2">📧</span>
                Email
              </label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                required 
                className="w-full px-4 py-3 border-2 border-pink-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-purple-700 mb-2 flex items-center">
                <span className="text-lg mr-2">🔒</span>
                Password
              </label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                required 
                className="w-full px-4 py-3 border-2 border-pink-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                placeholder="Enter your password"
              />
            </div>
            {formMode === 'register' && (
              <div>
                <label className="block text-sm font-bold text-purple-700 mb-2 flex items-center">
                  <span className="text-lg mr-2">👤</span>
                  Display Name
                </label>
                <input 
                  type="text" 
                  name="display_name" 
                  value={formData.display_name} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border-2 border-pink-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                  placeholder="Enter your display name"
                />
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <button 
              type="submit" 
              disabled={isLoggingIn || isRegistering}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isLoggingIn || isRegistering ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">
                    {formMode === 'login' ? '🔑' : '✨'}
                  </span>
                  <span>{formMode === 'login' ? 'Log In' : 'Sign Up'}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setFormMode(formMode === 'login' ? 'register' : 'login')}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              {formMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
