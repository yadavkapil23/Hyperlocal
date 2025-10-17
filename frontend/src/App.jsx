import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Map } from './components/Map.jsx';
import { EventDetail } from './components/EventDetail.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { CreateEventModal } from './components/CreateEventModal.jsx';
import { Filters } from './components/Filters.jsx';
import { useAuth } from './hooks/useAuth.js';
import { LogIn, LogOut, User } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [filters, setFilters] = useState({});
  const [radius, setRadius] = useState(2000);
  
  const { user, isAuthenticated, logout } = useAuth();

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="h-screen flex flex-col">
        {/* Header */}
        <header style={{
          background: 'white',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid #e5e7eb',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            margin: 0
          }}>Third-Place</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {isAuthenticated && (
              <button
                onClick={() => setShowCreateEvent(true)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'green', 
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  padding: 0
                }}
              >
                Create Event
              </button>
            )}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  background: '#f3f4f6',
                  padding: '8px 12px',
                  borderRadius: '8px'
                }}>
                  <User size={16} />
                  <span style={{ fontWeight: '500' }}>{user?.display_name || user?.email}</span>
                </div>
                <span
                  onClick={logout}
                  style={{ cursor: 'pointer' }}
                >
                  Logout
                </span>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'blue', 
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  padding: 0
                }}
              >
                Login
              </button>
            )}
          </div>
        </header>

      {/* Main Content */}
      <main className="flex-1" style={{ padding: '16px' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '16px',
          alignItems: 'start'
        }}>
          <div>
            <Map 
              onEventClick={handleEventClick}
              selectedEvent={selectedEvent}
              filters={filters}
              radius={radius}
              setRadius={setRadius}
              onEventsLoaded={(events) => {
                const container = document.getElementById('events-list');
                if (!container) return;
                if (!events || events.length === 0) {
                  container.innerHTML = '<div style="color:#6b7280;font-size:14px;">No events in range</div>';
                  return;
                }
                container.innerHTML = events.map(ev => `
                  <div style="padding:8px 6px;border-bottom:1px solid #f3f4f6;cursor:pointer;">
                    <div style="font-size:14px;font-weight:600;color:#111827;">${ev.title}</div>
                    <div style="font-size:12px;color:#6b7280;">${ev.category}${ev.distance_m ? ` • ${Math.round(ev.distance_m)}m` : ''}</div>
                  </div>
                `).join('');
                Array.from(container.children).forEach((child, idx) => {
                  child.onclick = () => setSelectedEvent(events[idx]);
                });
              }}
            />
          </div>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            maxHeight: '70vh',
            overflowY: 'auto'
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
              <strong>Events nearby</strong>
            </div>
            <div id="events-list" style={{ padding: '8px 12px' }} />
          </div>
        </div>

        <Filters
          onFiltersChange={handleFiltersChange}
          isOpen={showFilters}
          onToggle={() => setShowFilters(!showFilters)}
          radius={radius}
          setRadius={setRadius}
        />
      </main>

      {/* Modals */}
      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {showCreateEvent && (
        <CreateEventModal
          isOpen={showCreateEvent}
          onClose={() => setShowCreateEvent(false)}
        />
      )}
      
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;