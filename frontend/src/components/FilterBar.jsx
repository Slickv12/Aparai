import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const FilterBar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    experience: ''
  });

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      location: '',
      type: '',
      experience: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="card p-4 md:p-5 mb-0">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-200/60 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by role, technology, or keyword..."
              className="input-field pl-10"
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
            />
          </div>
        </div>

        {/* Location Filter */}
        <div className="w-full lg:w-48">
          <select
            className="input-field"
            value={filters.location}
            onChange={(e) => handleChange('location', e.target.value)}
          >
            <option value="">All Locations</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
            <option value="Austin">Baramati</option>
            <option value="San Francisco">Pune</option>
            <option value="NYC">Benguluru</option>
          </select>
        </div>

        {/* Job Type Filter */}
        <div className="w-full lg:w-48">
          <select
            className="input-field"
            value={filters.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-Time</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="btn-secondary flex items-center justify-center space-x-2 lg:w-auto"
          >
            <X className="h-4 w-4" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-emerald-500/20">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            return (
              <span
                key={key}
                className="px-3 py-1 bg-emerald-500/10 text-emerald-200 text-sm rounded-full flex items-center space-x-2"
              >
                <span className="capitalize">{key}: {value}</span>
                <button
                  onClick={() => handleChange(key, '')}
                  className="hover:text-emerald-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
