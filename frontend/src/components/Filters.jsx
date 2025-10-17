import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../api/events.js';
import { Filter, X } from 'lucide-react';

export const Filters = ({ onFiltersChange, isOpen, onToggle, radius, setRadius }) => {
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
      <span
        onClick={onToggle}
        style={{ cursor: 'pointer', position: 'fixed', top: '16px', left: '16px', zIndex: 10 }}
      >
        Filters
      </span>

      {/* Filter Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: '320px',
          background: 'white',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 300ms ease-in-out',
          zIndex: 20
        }}
      >
        <div style={{
          padding: '24px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
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
            }}>Filters</h2>
            <span
              onClick={onToggle}
              style={{ cursor: 'pointer' }}
            >
              Close
            </span>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            flex: 1
          }}>
            {/* Search Radius Filter */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '12px'
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
                  height: '8px',
                  background: '#e5e7eb',
                  borderRadius: '8px',
                  appearance: 'none',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#6b7280',
                marginTop: '4px'
              }}>
                <span>500m</span>
                <span>10km</span>
              </div>
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <span style={{
                  display: 'inline-block',
                  background: '#dbeafe',
                  color: '#1e40af',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '4px 12px',
                  borderRadius: '9999px'
                }}>
                  {radius}m
                </span>
              </div>
            </div>

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
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  background: 'white',
                  cursor: 'pointer',
                  outline: 'none'
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
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  background: 'white',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              />
            </div>

            {/* Clear Filters */}
            <div style={{ paddingTop: '16px' }}>
              <span
                onClick={clearFilters}
                style={{ cursor: 'pointer' }}
              >
                Clear Filters
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-10"
          onClick={onToggle}
        />
      )}
    </>
  );
};
