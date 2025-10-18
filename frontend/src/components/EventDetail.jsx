import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '../api/events.js';
import { useAuth } from '../hooks/useAuth.js';
import { MapPin, Calendar, Users, X, Trash2 } from 'lucide-react';

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

  const deleteMutation = useMutation({
    mutationFn: () => eventsApi.deleteEvent(event.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      onClose(); // Close the modal after successful deletion
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

  const handleDelete = async () => {
    if (!isAuthenticated) {
      alert('Please log in to delete events');
      return;
    }

    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-[9999] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative mr-8">
        <div className="flex justify-between items-start mb-6 p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 m-0">{event.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pb-6">
          {event.description && (
            <p className="text-gray-700 mb-6 text-base leading-relaxed">
              {event.description}
            </p>
          )}

          <div className="space-y-4 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={16} className="mr-2 text-blue-500" />
              <span className="font-medium">Category: </span>
              <span className="ml-1 capitalize">{event.category}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-2 text-green-500" />
              <span className="font-medium">Starts: </span>
              <span className="ml-1">{formatDate(event.starts_at)}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-2 text-red-500" />
              <span className="font-medium">Ends: </span>
              <span className="ml-1">{formatDate(event.ends_at)}</span>
            </div>

            {event.distance_m && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin size={16} className="mr-2 text-purple-500" />
                <span className="font-medium">Distance: </span>
                <span className="ml-1">{Math.round(event.distance_m)}m away</span>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={handleRsvp}
              disabled={isRsvping}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold text-white transition-colors duration-200 flex items-center justify-center space-x-2 ${
                isRsvping 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : isRsvped 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isRsvping ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Users size={16} />
                  <span>{isRsvped ? 'Un-RSVP' : 'RSVP'}</span>
                </>
              )}
            </button>
          
            {isAuthenticated && (
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className={`px-4 py-3 rounded-lg font-semibold text-white transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  deleteMutation.isPending 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <Trash2 size={16} />
                <span>{deleteMutation.isPending ? 'Deleting...' : 'Delete Event'}</span>
              </button>
            )}
          </div>

          {!isAuthenticated && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              Log in to RSVP to events
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
