import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '../api/events.js';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
      background-color: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const MapEvents = ({ onEventClick, selectedEvent, eventsData }) => {
  const map = useMap();

  useEffect(() => {
    if (eventsData?.data?.results) {
      // Fit map to show all events
      const bounds = L.latLngBounds();
      eventsData.data.results.forEach(event => {
        const lat = Number(event.latitude ?? event.lat ?? 0);
        const lng = Number(event.longitude ?? event.lng ?? 0);
        if (lat && lng && lat !== 0 && lng !== 0) {
          bounds.extend([lat, lng]);
        }
      });
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [eventsData, map]);

  return (
    <>
      {eventsData?.data?.results?.map((event) => {
        // Extract coordinates from the event
        // The API might return coordinates in different formats
        const lat = event.latitude || event.lat || 0;
        const lng = event.longitude || event.lng || 0;
        
        // Skip events with invalid coordinates
        if (!lat || !lng || lat === 0 || lng === 0) {
          return null;
        }
        
        return (
          <>
          <Marker
            key={event.id}
            position={[lat, lng]}
            icon={createCustomIcon(
              selectedEvent?.id === event.id ? '#ff6b6b' : '#4ecdc4'
            )}
            eventHandlers={{
              click: () => onEventClick(event),
            }}
          >
          </Marker>
          {/* simple visible dot to ensure markers are noticeable */}
          <CircleMarker center={[lat, lng]} radius={6} pathOptions={{ color: '#1e40af', fillColor: '#3b82f6', fillOpacity: 0.8 }} />
          </>
        );
      })}
    </>
  );
};

export const Map = ({ onEventClick, selectedEvent, filters, radius, setRadius, onEventsLoaded }) => {
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]); // San Francisco
  const mapRef = useRef(null);

  // Get events near map center
  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['events', mapCenter[0], mapCenter[1], radius, filters],
    queryFn: () => eventsApi.getEvents({
      lat: mapCenter[0],
      lon: mapCenter[1],
      radius_m: radius,
      limit: 50,
      ...filters,
    }),
  });

  // Notify parent when events load
  useEffect(() => {
    if (onEventsLoaded) {
      onEventsLoaded(eventsData?.data?.results || []);
    }
  }, [eventsData, onEventsLoaded]);

  // Fly to selected event when set
  useEffect(() => {
    if (!selectedEvent || !mapRef.current) return;
    const lat = Number(selectedEvent.latitude ?? selectedEvent.lat ?? 0);
    const lng = Number(selectedEvent.longitude ?? selectedEvent.lng ?? 0);
    if (lat && lng) {
      mapRef.current.flyTo([lat, lng], 15, { duration: 0.6 });
    }
  }, [selectedEvent]);

  return (
    <div
      className="relative"
      style={{
        width: '100%',
        height: '70vh',
        maxWidth: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'
      }}
    >
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
          // Update center when map moves
          mapInstance.on('moveend', () => {
            const center = mapInstance.getCenter();
            setMapCenter([center.lat, center.lng]);
          });
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEvents
          onEventClick={onEventClick}
          selectedEvent={selectedEvent}
          eventsData={eventsData}
        />
      </MapContainer>
      
      {/* Map controls */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        background: 'white',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        zIndex: 1000,
        minWidth: '180px',
        maxWidth: '220px'
      }}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '500',
            marginBottom: '6px',
            color: '#374151'
          }}>Search Radius</label>
          <input
            type="range"
            min="500"
            max="10000"
            step="500"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              background: '#e5e7eb',
              borderRadius: '3px',
              appearance: 'none',
              cursor: 'pointer',
              outline: 'none'
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#6b7280',
            marginTop: '3px'
          }}>
            <span>500m</span>
            <span>10km</span>
          </div>
          <div style={{ textAlign: 'center', marginTop: '6px' }}>
            <span style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#1f2937'
            }}>{radius}m</span>
          </div>
        </div>
        
        {isLoading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 0'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid #e5e7eb',
              borderTop: '2px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span style={{ marginLeft: '8px', fontSize: '14px', color: '#6b7280' }}>
              Loading events...
            </span>
          </div>
        )}
        
        {eventsData?.data?.results && (
          <div style={{ textAlign: 'center' }}>
            <span style={{
              fontSize: '12px',
              fontWeight: '500',
              color: '#059669'
            }}>
              {eventsData.data.results.length} events found
            </span>
          </div>
        )}
      </div>
    </div>
  );
};