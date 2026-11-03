'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { fetchApi } from '@/lib/api';
import { getCategoryBadgeStyle, EventData } from '@/components/EventCard';
import {
  Calendar,
  MapPin,
  CheckCircle2,
  CalendarCheck,
  ArrowRight,
  Clock,
  Sparkles,
  User,
} from 'lucide-react';

interface JoinedEventItem extends EventData {
  registrationId: string;
  joinedAt: string;
}

function JoinedEventsContent() {
  const { token, user } = useAuth();
  const [joinedEvents, setJoinedEvents] = useState<JoinedEventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchJoinedEvents = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetchApi<{ success: boolean; data: JoinedEventItem[] }>(
        '/users/joined-events',
        { token }
      );
      if (res && res.success && Array.isArray(res.data)) {
        setJoinedEvents(res.data);
      } else {
        setJoinedEvents([]);
      }
    } catch (error) {
      setJoinedEvents([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchJoinedEvents();
  }, [fetchJoinedEvents]);

  const formatDate = (dateString: string | Date) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return String(dateString);
    }
  };

  const formatJoinedDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Volunteer Commitment
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            My Joined Events
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            A chronological timeline of community initiatives you have registered to volunteer for.
          </p>
        </div>

        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Total Joined:{' '}
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {joinedEvents.length}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-80 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse overflow-hidden p-6 space-y-4"
            >
              <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : joinedEvents.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            You haven&apos;t joined any events yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Discover meaningful causes around you and join hundreds of volunteers making a real difference.
          </p>
          <div className="pt-2">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Explore Upcoming Events</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {joinedEvents.map((item) => (
            <div
              key={item.registrationId || item._id}
              className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${getCategoryBadgeStyle(
                        item.eventType
                      )}`}
                    >
                      {item.eventType}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-gray-900/90 text-emerald-600 dark:text-emerald-400 shadow-md backdrop-blur-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Registered</span>
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>Event Date: {formatDate(item.eventDate)}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate">Organized by {item.organizerName}</span>
                    </div>

                    {item.joinedAt && (
                      <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 pt-1">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Registered on {formatJoinedDate(item.joinedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href={`/events/${item._id}`}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 font-medium text-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>View Full Details</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function JoinedEventsPage() {
  return (
    <AuthGuard>
      <JoinedEventsContent />
    </AuthGuard>
  );
}
