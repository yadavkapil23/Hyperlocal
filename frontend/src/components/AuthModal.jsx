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

  if (variant === 'panel') {
    return (
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '24px',
        width: '100%',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
            {formMode === 'login' ? 'Log In' : 'Sign Up'}
          </h2>
          <span onClick={onClose} style={{ cursor: 'pointer', color: 'blue' }}>Close</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          {formMode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Display Name</label>
              <input type="text" name="display_name" value={formData.display_name} onChange={handleInputChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
          )}
          {error && (<div style={{ color: 'red', fontSize: '14px' }}>{error}</div>)}
          <button type="submit" style={{ background: 'blue', color: 'white', border: 'none', borderRadius: '4px', padding: '10px', cursor: 'pointer' }}>
            {isLoggingIn || isRegistering ? 'Loading...' : formMode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <span onClick={() => setFormMode(formMode === 'login' ? 'register' : 'login')} style={{ cursor: 'pointer', color: 'blue' }}>
            {formMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </span>
        </div>
      </div>
    );
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
      zIndex: 9999
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '400px',
        width: '100%',
        margin: '0 16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            margin: 0
          }}>
            {formMode === 'login' ? 'Log In' : 'Sign Up'}
          </h2>
          <span
            onClick={onClose}
            style={{ cursor: 'pointer', color: 'blue' }}
          >
            Close
          </span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
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
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
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
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          {formMode === 'register' && (
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '4px'
              }}>Display Name</label>
              <input
                type="text"
                name="display_name"
                value={formData.display_name}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>
          )}

          {error && (
            <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>
          )}

          <span
            onClick={handleSubmit}
            style={{ cursor: 'pointer', color: 'blue' }}
          >
            {isLoggingIn || isRegistering
              ? 'Loading...'
              : formMode === 'login'
              ? 'Log In'
              : 'Sign Up'}
          </span>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <span
            onClick={() => setFormMode(formMode === 'login' ? 'register' : 'login')}
            style={{ cursor: 'pointer', color: 'blue' }}
          >
            {formMode === 'login'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Log in'}
          </span>
        </div>
      </div>
    </div>
  );
};
