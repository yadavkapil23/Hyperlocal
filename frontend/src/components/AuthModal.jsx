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
            setError(err.response?.data?.detail || 'An error occurred');
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
            setError(err.response?.data?.detail || 'An error occurred');
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
      <div className="bg-white rounded-xl shadow-lg p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 m-0">
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 m-0">
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
      </div>
    </div>
  );
};
