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
        className="fixed top-4 left-4 z-10 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200 hover:bg-white hover:shadow-2xl transition-all duration-200"
      >
        <Filter size={20} className="text-gray-700" />
      </button>

      {/* Filter Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-sm shadow-2xl transform transition-all duration-300 z-20 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-800">Filters</h2>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="space-y-8 flex-1">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
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
              <label className="block text-sm font-semibold text-gray-800 mb-3">Starts After</label>
              <input
                type="datetime-local"
                value={filters.starts_after}
                onChange={(e) => handleFilterChange('starts_after', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              />
            </div>

            {/* Clear Filters */}
            <div className="pt-4">
              <button
                onClick={clearFilters}
                className="w-full py-3 px-4 text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
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
          className="fixed inset-0 bg-black bg-opacity-25 z-10"
          onClick={onToggle}
        />
      )}
    </>
  );
};
