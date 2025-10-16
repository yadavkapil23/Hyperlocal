import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '../api/events.js';
import { useAuth } from '../hooks/useAuth.js';
import { MapPin, Calendar, Users, X } from 'lucide-react';

export const EventDetail = ({ event, onClose }) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isRsvping, setIsRsvping] = useState(false);

  // Get my RSVPs to check if I'm already RSVPed
  const { data: myRsvps } = useQuery({
    queryKey: ['my-rsvps'],
    queryFn: eventsApi.getMyRsvps,
    enabled: isAuthenticated,
  });

  const isRsvped = myRsvps?.data?.some(rsvp => rsvp.event_id === event.id);

  const rsvpMutation = useMutation({
    mutationFn: () => eventsApi.rsvpEvent(event.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-rsvps'] });
      setIsRsvping(false);
    },
  });

  const unrsvpMutation = useMutation({
    mutationFn: () => eventsApi.unrsvpEvent(event.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-rsvps'] });
      setIsRsvping(false);
    },
  });

  const handleRsvp = async () => {
    if (!isAuthenticated) {
      alert('Please log in to RSVP');
      return;
    }

    setIsRsvping(true);
    try {
      if (isRsvped) {
        await unrsvpMutation.mutateAsync();
      } else {
        await rsvpMutation.mutateAsync();
      }
    } catch (error) {
      console.error('RSVP error:', error);
      alert('Failed to RSVP. Please try again.');
    } finally {
      setIsRsvping(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">{event.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {event.description && (
          <p className="text-gray-700 mb-4">{event.description}</p>
        )}

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2" />
            <span>Category: {event.category}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span>Starts: {formatDate(event.starts_at)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span>Ends: {formatDate(event.ends_at)}</span>
          </div>

          {event.distance_m && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={16} className="mr-2" />
              <span>{Math.round(event.distance_m)}m away</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRsvp}
            disabled={isRsvping}
            className={`flex-1 py-2 px-4 rounded-lg font-medium ${
              isRsvped
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } disabled:opacity-50`}
          >
            {isRsvping ? 'Loading...' : isRsvped ? 'Un-RSVP' : 'RSVP'}
          </button>
        </div>

        {!isAuthenticated && (
          <p className="text-sm text-gray-500 mt-3">
            Log in to RSVP to events
          </p>
        )}
      </div>
    </div>
  );
};
