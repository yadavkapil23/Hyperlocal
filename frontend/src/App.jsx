import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Map } from './components/Map.jsx';
import { EventDetail } from './components/EventDetail.jsx';
import { AuthModal } from './components/AuthModal.jsx';
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
  const [filters, setFilters] = useState({});
  
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
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            margin: 0
          }}>Third-Place</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                <button
                  onClick={logout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#6b7280',
                    background: '#f3f4f6',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 200ms'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#374151';
                    e.target.style.background = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#6b7280';
                    e.target.style.background = '#f3f4f6';
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  console.log('Login button clicked, setting showAuthModal to true');
                  setShowAuthModal(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: 'white',
                  background: '#3b82f6',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
              >
                <LogIn size={16} />
                Login
              </button>
            )}
          </div>
        </header>

      {/* Main Content */}
      <main className="flex-1 relative" style={{ height: 'calc(100vh - 80px)' }}>
        <Map 
          onEventClick={handleEventClick}
          selectedEvent={selectedEvent}
          filters={filters}
        />
        
        <Filters
          onFiltersChange={handleFiltersChange}
          isOpen={showFilters}
          onToggle={() => setShowFilters(!showFilters)}
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
          onClose={() => {
            console.log('Closing auth modal');
            setShowAuthModal(false);
          }}
        />
      )}
      
      {/* Simple test modal */}
      {showAuthModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          color: 'white',
          fontSize: '24px'
        }}>
          <div style={{
            background: 'white',
            color: 'black',
            padding: '20px',
            borderRadius: '8px'
          }}>
            TEST MODAL - This should appear!
            <button onClick={() => setShowAuthModal(false)}>Close</button>
          </div>
        </div>
      )}
      
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 9999
        }}>
          showAuthModal: {showAuthModal.toString()}
        </div>
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