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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            margin: 0,
            color: '#1f2937'
          }}>{event.title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => e.target.style.color = '#374151'}
            onMouseOut={(e) => e.target.style.color = '#6b7280'}
          >
            <X size={20} />
          </button>
        </div>

        {event.description && (
          <p style={{
            color: '#374151',
            marginBottom: '16px',
            fontSize: '16px',
            lineHeight: '1.5'
          }}>{event.description}</p>
        )}

        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '12px'
          }}>
            <MapPin size={16} style={{ marginRight: '8px' }} />
            <span>Category: {event.category}</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '12px'
          }}>
            <Calendar size={16} style={{ marginRight: '8px' }} />
            <span>Starts: {formatDate(event.starts_at)}</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <Calendar size={16} style={{ marginRight: '8px' }} />
            <span>Ends: {formatDate(event.ends_at)}</span>
          </div>

          {event.distance_m && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              color: '#6b7280',
              marginTop: '12px'
            }}>
              <MapPin size={16} style={{ marginRight: '8px' }} />
              <span>{Math.round(event.distance_m)}m away</span>
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <button
            onClick={handleRsvp}
            disabled={isRsvping}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '8px',
              fontWeight: '500',
              backgroundColor: isRsvped ? '#ef4444' : '#3b82f6',
              color: 'white',
              border: 'none',
              cursor: isRsvping ? 'not-allowed' : 'pointer',
              opacity: isRsvping ? 0.5 : 1,
              fontSize: '16px'
            }}
            onMouseOver={(e) => {
              if (!isRsvping) {
                e.target.style.backgroundColor = isRsvped ? '#dc2626' : '#2563eb';
              }
            }}
            onMouseOut={(e) => {
              if (!isRsvping) {
                e.target.style.backgroundColor = isRsvped ? '#ef4444' : '#3b82f6';
              }
            }}
          >
            {isRsvping ? 'Loading...' : isRsvped ? 'Un-RSVP' : 'RSVP'}
          </button>
          
          {isAuthenticated && (
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                border: 'none',
                cursor: deleteMutation.isPending ? 'not-allowed' : 'pointer',
                opacity: deleteMutation.isPending ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '16px'
              }}
              onMouseOver={(e) => {
                if (!deleteMutation.isPending) {
                  e.target.style.backgroundColor = '#b91c1c';
                }
              }}
              onMouseOut={(e) => {
                if (!deleteMutation.isPending) {
                  e.target.style.backgroundColor = '#dc2626';
                }
              }}
            >
              <Trash2 size={16} />
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>

        {!isAuthenticated && (
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            marginTop: '12px',
            textAlign: 'center'
          }}>
            Log in to RSVP to events
          </p>
        )}
      </div>
    </div>
  );
};
