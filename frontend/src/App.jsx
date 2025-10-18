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
  
  const { user, isAuthenticated, logout, refreshAuth } = useAuth();

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 shadow-2xl border-b-4 border-pink-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                    <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">Hyper</span>
                    <span className="text-white">local</span>
                  </h1>
                  <p className="text-sm text-pink-100 mt-1 font-medium">🌟 Discover amazing local events near you</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {isAuthenticated && (
                  <button
                    onClick={() => setShowCreateEvent(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span>+</span>
                    <span>Create Event</span>
                  </button>
                )}
                
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                      <User size={16} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {user?.display_name || user?.email}
                      </span>
                    </div>
                    <button
                      onClick={logout}
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                  >
                    <LogIn size={16} />
                    <span>Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
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
                  <div style="
                    padding: 12px 16px;
                    border-bottom: 1px solid #f3f4f6;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    border-radius: 6px;
                    margin: 4px 0;
                  " onmouseover="this.style.backgroundColor='#f8fafc'" onmouseout="this.style.backgroundColor='transparent'">
                    <div style="font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 4px;">${ev.title}</div>
                    <div style="font-size: 13px; color: #6b7280; display: flex; align-items: center; gap: 8px;">
                      <span style="background: #e5e7eb; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">${ev.category}</span>
                      ${ev.distance_m ? `<span style="color: #9ca3af;">${Math.round(ev.distance_m)}m away</span>` : ''}
                    </div>
                  </div>
                `).join('');
                Array.from(container.children).forEach((child, idx) => {
                  child.onclick = () => setSelectedEvent(events[idx]);
                });
              }}
            />
          </div>
          <div className="lg:col-span-1 relative" style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            maxHeight: '75vh',
            overflowY: 'auto',
            minWidth: '300px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ 
              padding: '16px 20px', 
              borderBottom: '1px solid #e5e7eb',
              background: '#f8fafc',
              borderRadius: '12px 12px 0 0'
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1f2937' 
              }}>
                Events nearby
              </h3>
            </div>
            <div id="events-list" style={{ padding: '12px 16px' }} />
            {!isAuthenticated && (
              <div style={{ padding: '12px 16px', borderTop: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <AuthModal isOpen={true} onClose={() => {}} variant="panel" />
              </div>
            )}
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