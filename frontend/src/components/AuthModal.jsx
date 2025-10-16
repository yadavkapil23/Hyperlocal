import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { X } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, mode = 'login' }) => {
  const [formMode, setFormMode] = useState(mode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    display_name: '',
  });
  const [error, setError] = useState('');

  const { login, register, isLoggingIn, isRegistering } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (formMode === 'login') {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          display_name: formData.display_name,
        });
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {formMode === 'login' ? 'Log In' : 'Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {formMode === 'register' && (
            <div>
              <label className="block text-sm font-medium mb-1">Display Name</label>
              <input
                type="text"
                name="display_name"
                value={formData.display_name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoggingIn || isRegistering}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoggingIn || isRegistering
              ? 'Loading...'
              : formMode === 'login'
              ? 'Log In'
              : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setFormMode(formMode === 'login' ? 'register' : 'login')}
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            {formMode === 'login'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};
