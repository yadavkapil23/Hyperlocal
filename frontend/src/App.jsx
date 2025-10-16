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
      <header className="bg-white shadow-sm border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Third-Place</h1>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User size={16} />
                <span>{user?.display_name || user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <LogIn size={16} />
              Login
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
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
          onClose={() => setShowAuthModal(false)}
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