import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/events.js';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.getMe,
    enabled: isAuthenticated,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.data.access_token);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.data.access_token);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    queryClient.clear();
  };

  return {
    user: user?.data,
    isAuthenticated,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};
