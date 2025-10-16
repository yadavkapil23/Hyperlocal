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

  console.log('AuthModal render - isOpen:', isOpen);
  
  if (!isOpen) {
    console.log('AuthModal not rendering because isOpen is false');
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '400px',
        width: '100%',
        margin: '0 16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937',
            margin: 0
          }}>
            {formMode === 'login' ? 'Log In' : 'Sign Up'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              transition: 'color 200ms'
            }}
            onMouseEnter={(e) => e.target.style.color = '#374151'}
            onMouseLeave={(e) => e.target.style.color = '#6b7280'}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '4px'
            }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#374151',
                background: 'white',
                outline: 'none',
                transition: 'all 200ms'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '4px'
            }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#374151',
                background: 'white',
                outline: 'none',
                transition: 'all 200ms'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {formMode === 'register' && (
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '4px'
              }}>Display Name</label>
              <input
                type="text"
                name="display_name"
                value={formData.display_name}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  background: 'white',
                  outline: 'none',
                  transition: 'all 200ms'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          )}

          {error && (
            <div style={{
              color: '#dc2626',
              fontSize: '14px',
              padding: '8px 12px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px'
            }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoggingIn || isRegistering}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: isLoggingIn || isRegistering ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: isLoggingIn || isRegistering ? 'not-allowed' : 'pointer',
              transition: 'all 200ms'
            }}
            onMouseEnter={(e) => {
              if (!isLoggingIn && !isRegistering) {
                e.target.style.background = '#2563eb';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoggingIn && !isRegistering) {
                e.target.style.background = '#3b82f6';
              }
            }}
          >
            {isLoggingIn || isRegistering
              ? 'Loading...'
              : formMode === 'login'
              ? 'Log In'
              : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button
            onClick={() => setFormMode(formMode === 'login' ? 'register' : 'login')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#3b82f6',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'color 200ms'
            }}
            onMouseEnter={(e) => e.target.style.color = '#2563eb'}
            onMouseLeave={(e) => e.target.style.color = '#3b82f6'}
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
