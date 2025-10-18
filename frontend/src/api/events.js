import apiClient from './client.js';

export const eventsApi = {
  // Get events with filters
  getEvents: (params) => {
    const searchParams = new URLSearchParams();
    if (params.lat) searchParams.append('lat', params.lat);
    if (params.lon) searchParams.append('lon', params.lon);
    if (params.radius_m) searchParams.append('radius_m', params.radius_m);
    if (params.category) searchParams.append('category', params.category);
    if (params.starts_after) searchParams.append('starts_after', params.starts_after);
    if (params.limit) searchParams.append('limit', params.limit);
    if (params.offset) searchParams.append('offset', params.offset);
    
    return apiClient.get(`/api/events?${searchParams.toString()}`);
  },

  // Create event
  createEvent: (eventData) => {
    return apiClient.post('/api/events', eventData);
  },

  // Delete event
  deleteEvent: (eventId) => {
    return apiClient.delete(`/api/events/${eventId}`);
  },

  // RSVP to event
  rsvpEvent: (eventId) => {
    return apiClient.post(`/api/events/${eventId}/rsvp`);
  },

  // Un-RSVP from event
  unrsvpEvent: (eventId) => {
    return apiClient.delete(`/api/events/${eventId}/rsvp`);
  },

  // Get my RSVPs
  getMyRsvps: () => {
    return apiClient.get('/api/me/rsvps');
  },
};

export const categoriesApi = {
  getCategories: () => {
    return apiClient.get('/api/categories');
  },
};

export const authApi = {
  register: (userData) => {
    return apiClient.post('/api/auth/register', userData);
  },

  login: (credentials) => {
    return apiClient.post('/api/auth/login', credentials);
  },

  getMe: () => {
    return apiClient.get('/api/me');
  },
};
