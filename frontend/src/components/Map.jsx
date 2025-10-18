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
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 4px #3b82f6',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: '4px solid #3b82f6'
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
      <div className="absolute top-4 left-4 bg-gradient-to-br from-yellow-100 to-pink-100 rounded-xl shadow-2xl border-4 border-yellow-300 p-4 z-10 min-w-48 max-w-56">
        <div className="mb-3">
          <label className="block text-sm font-bold text-purple-800 mb-2 flex items-center">
            <span className="text-lg mr-2">🎯</span>
            Search Radius
          </label>
          <input
            type="range"
            min="500"
            max="10000"
            step="500"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full h-3 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            style={{
              background: 'linear-gradient(to right, #fbb6ce 0%, #c084fc 100%)',
              borderRadius: '10px'
            }}
          />
          <div className="flex justify-between text-xs text-purple-600 mt-2 font-bold">
            <span>500m</span>
            <span>10km</span>
          </div>
          <div className="text-center mt-3">
            <span className="text-lg font-bold text-purple-800 bg-gradient-to-r from-yellow-200 to-pink-200 px-3 py-1 rounded-full">
              {radius}m
            </span>
          </div>
        </div>
        
        {isLoading && (
          <div className="flex items-center justify-center py-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-sm font-bold text-purple-700">
              🔍 Loading events...
            </span>
          </div>
        )}
        
        {eventsData?.data?.results && (
          <div className="text-center bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-2">
            <span className="text-sm font-bold text-green-700 flex items-center justify-center">
              <span className="text-lg mr-2">🎉</span>
              {eventsData.data.results.length} events found
            </span>
          </div>
        )}
      </div>
    </div>
  );
};