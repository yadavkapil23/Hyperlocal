import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../api/events.js';
import { Filter, X } from 'lucide-react';

export const Filters = ({ onFiltersChange, isOpen, onToggle }) => {
  const [filters, setFilters] = useState({
    category: '',
    starts_after: '',
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories,
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { category: '', starts_after: '' };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <>
      {/* Filter Toggle Button */}
      <button
        onClick={onToggle}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(229, 231, 235, 0.8)',
          cursor: 'pointer',
          transition: 'all 200ms',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'white';
          e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.95)';
          e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        }}
      >
        <Filter size={20} style={{ color: '#374151' }} />
      </button>

      {/* Filter Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: '320px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 300ms ease-in-out',
          zIndex: 20,
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        <div style={{
          padding: '32px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0
            }}>Filters</h2>
            <button
              onClick={onToggle}
              style={{
                padding: '8px',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 200ms',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              <X size={20} style={{ color: '#6b7280' }} />
            </button>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            flex: 1
          }}>
            {/* Category Filter */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '12px'
              }}>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#374151',
                  background: 'white',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 200ms'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">All Categories</option>
                {categories?.data?.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Filter */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '12px'
              }}>Starts After</label>
              <input
                type="datetime-local"
                value={filters.starts_after}
                onChange={(e) => handleFilterChange('starts_after', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#374151',
                  background: 'white',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 200ms'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Clear Filters */}
            <div style={{ paddingTop: '16px' }}>
              <button
                onClick={clearFilters}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  color: '#374151',
                  border: '2px solid #d1d5db',
                  borderRadius: '12px',
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f9fafb';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.25)',
            zIndex: 10,
            cursor: 'pointer'
          }}
          onClick={onToggle}
        />
      )}
    </>
  );
};
