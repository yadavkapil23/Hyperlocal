import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { eventsApi, categoriesApi } from '../api/events.js';

export const CreateEventModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_slug: '',
    starts_at: '',
    ends_at: '',
    latitude: 37.7749, // Default to San Francisco
    longitude: -122.4194,
    is_public: true
  });
  const [error, setError] = useState('');

  const queryClient = useQueryClient();

  // Fetch categories for the dropdown
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories
  });

  const createEventMutation = useMutation({
    mutationFn: eventsApi.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      onClose();
      setFormData({
        title: '',
        description: '',
        category_slug: '',
        starts_at: '',
        ends_at: '',
        latitude: 37.7749,
        longitude: -122.4194,
        is_public: true
      });
    },
    onError: (err) => {
      setError(err.response?.data?.detail || 'Failed to create event');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await createEventMutation.mutateAsync(formData);
    } catch (err) {
      // Error is handled in onError
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  if (!isOpen) return null;

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
        maxWidth: '500px',
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
            Create New Event
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
              color: '#374151',
              marginBottom: '4px'
            }}>Event Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#374151',
                background: 'white',
                outline: 'none'
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
            }}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#374151',
                background: 'white',
                outline: 'none',
                resize: 'vertical'
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
            }}>Category *</label>
            <select
              name="category_slug"
              value={formData.category_slug}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#374151',
                background: 'white',
                outline: 'none'
              }}
            >
              <option value="">Select a category</option>
              {categories?.data?.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '4px'
            }}>Start Date & Time *</label>
            <input
              type="datetime-local"
              name="starts_at"
              value={formData.starts_at}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#374151',
                background: 'white',
                outline: 'none'
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
            }}>End Date & Time</label>
            <input
              type="datetime-local"
              name="ends_at"
              value={formData.ends_at}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#374151',
                background: 'white',
                outline: 'none'
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
            }}>Location (Latitude)</label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              step="0.000001"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#374151',
                background: 'white',
                outline: 'none'
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
            }}>Location (Longitude)</label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              step="0.000001"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#374151',
                background: 'white',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              name="is_public"
              checked={formData.is_public}
              onChange={handleInputChange}
              style={{ margin: 0 }}
            />
            <label style={{
              fontSize: '14px',
              color: '#374151',
              cursor: 'pointer'
            }}>
              Make this event public
            </label>
          </div>

          {error && (
            <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="submit"
              disabled={createEventMutation.isPending}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: createEventMutation.isPending ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: createEventMutation.isPending ? 'not-allowed' : 'pointer'
              }}
            >
              {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 16px',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
