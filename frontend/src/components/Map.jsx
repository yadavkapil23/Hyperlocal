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
        bounds.extend([event.latitude, event.longitude]);
      });
      if (eventsData.data.results.length > 0) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [eventsData, map]);

  return (
    <>
      {eventsData?.data?.results?.map((event) => (
        <Marker
          key={event.id}
          position={[event.latitude, event.longitude]}
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
      ))}
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
        style={{ height: '100%', width: '100%' }}
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
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Search Radius (m)</label>
          <input
            type="range"
            min="500"
            max="10000"
            step="500"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-gray-600">{radius}m</div>
        </div>
        
        {isLoading && (
          <div className="text-sm text-gray-600">Loading events...</div>
        )}
        
        {eventsData?.data?.results && (
          <div className="text-sm text-gray-600">
            {eventsData.data.results.length} events found
          </div>
        )}
      </div>
    </div>
  );
};