import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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
        const lat = event.latitude || event.lat || 0;
        const lng = event.longitude || event.lng || 0;
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
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm">{event.title}</h3>
                <p className="text-xs text-gray-600">{event.category}</p>
                {event.distance_m && (
                  <p className="text-xs text-gray-500">
                    {Math.round(event.distance_m)}m away
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export const Map = ({ onEventClick, selectedEvent, filters }) => {
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]); // San Francisco
  const [radius, setRadius] = useState(2000);

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

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100vh', width: '100%', minHeight: '500px' }}
        whenCreated={(mapInstance) => {
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
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-gray-200 z-[1000] min-w-[280px]">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-800 mb-3">Search Radius</label>
          <div className="relative">
            <input
              type="range"
              min="500"
              max="10000"
              step="500"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>500m</span>
              <span>10km</span>
            </div>
          </div>
          <div className="text-center mt-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {radius}m
            </span>
          </div>
        </div>
        
        {isLoading && (
          <div className="flex items-center justify-center py-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-sm text-gray-600">Loading events...</span>
          </div>
        )}
        
        {eventsData?.data?.results && (
          <div className="text-center">
            <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              {eventsData.data.results.length} events found
            </span>
          </div>
        )}
      </div>
    </div>
  );
};