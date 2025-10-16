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
        className="fixed top-4 left-4 z-10 bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50"
      >
        <Filter size={20} />
      </button>

      {/* Filter Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform z-20 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={onToggle}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-2 border rounded-lg"
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
              <label className="block text-sm font-medium mb-2">Starts After</label>
              <input
                type="datetime-local"
                value={filters.starts_after}
                onChange={(e) => handleFilterChange('starts_after', e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="w-full py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
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
