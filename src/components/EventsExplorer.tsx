'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { EventCard, EventCardSkeleton, EventData } from '@/components/EventCard';
import {
  Search,
  Filter,
  Calendar,
  Sparkles,
  RefreshCw,
  X,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Cleanup',
  'Plantation',
  'Donation',
  'Education',
  'Healthcare',
  'Winter Relief',
  'Food Drive',
  'Blood Donation',
];

export interface EventsExplorerProps {
  includePast?: boolean;
  pageTitle?: string;
  badgeText?: string;
  pageDescription?: string;
}

export const EventsExplorer: React.FC<EventsExplorerProps> = ({
  includePast = false,
  pageTitle = 'Upcoming Social Events',
  badgeText = 'Discover & Participate',
  pageDescription = 'Browse through volunteer drives and community initiatives.',
}) => {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (includePast) params.append('includePast', 'true');
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await fetchApi<{ success: boolean; count: number; data: EventData[] }>(
        `/events${queryString}`
      );

      if (response && response.success) {
        setEvents(response.data || []);
      } else {
        setEvents([]);
      }
    } catch (error) {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [includePast, searchTerm, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEvents();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadEvents]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            {badgeText}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {pageTitle}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {pageDescription}
          </p>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Showing <span className="text-emerald-600 dark:text-emerald-400 font-bold">{events.length}</span> events
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="relative md:col-span-8">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by event title, location, or keywords..."
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-sm transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter by Category</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <EventCardSkeleton key={n} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            No Events Match Your Search
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            We couldn't find any events matching your current filters. Try searching with different keywords or reset your filters.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};
