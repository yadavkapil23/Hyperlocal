import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/events.js';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);

    // Listen for storage changes (e.g., from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'access_token') {
        setIsAuthenticated(!!e.newValue);
        if (e.newValue) {
          queryClient.invalidateQueries({ queryKey: ['me'] });
          queryClient.invalidateQueries({ queryKey: ['my-rsvps'] });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [queryClient]);

  // Additional effect to monitor authentication state changes
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    console.log('Auth state check - token exists:', !!token, 'isAuthenticated:', isAuthenticated);
    if (token && !isAuthenticated) {
      console.log('Token found but not authenticated, updating state');
      setIsAuthenticated(true);
    } else if (!token && isAuthenticated) {
      console.log('No token but authenticated, updating state');
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]);

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.getMe,
    enabled: isAuthenticated,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      console.log('Login successful, setting token and updating state');
      localStorage.setItem('access_token', data.data.access_token);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['my-rsvps'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      // Force a small delay to ensure state updates
      setTimeout(() => {
        console.log('Forcing authentication state update');
        setIsAuthenticated(true);
        queryClient.invalidateQueries({ queryKey: ['me'] });
      }, 100);
    },
    onError: (error) => {
      console.error('Login error:', error);
    }
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.data.access_token);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['my-rsvps'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      // Force a small delay to ensure state updates
      setTimeout(() => {
        setIsAuthenticated(true);
        queryClient.invalidateQueries({ queryKey: ['me'] });
      }, 100);
    },
    onError: (error) => {
      console.error('Register error:', error);
    }
  });

  const logout = () => {
    console.log('Logging out, clearing token and updating state');
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    queryClient.clear();
    // Force a small delay to ensure state updates
    setTimeout(() => {
      console.log('Forcing logout state update');
      setIsAuthenticated(false);
    }, 100);
  };

  const refreshAuth = () => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
    if (token) {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['my-rsvps'] });
    }
  };

  return {
    user: user?.data,
    isAuthenticated,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    refreshAuth,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};
