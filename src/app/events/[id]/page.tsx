'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import { fetchApi } from '@/lib/api';
import { getCategoryBadgeStyle, EventData } from '@/components/EventCard';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import {
  Calendar,
  MapPin,
  Users,
  User,
  Mail,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  HeartHandshake,
  Clock,
} from 'lucide-react';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user, token } = useAuth();
  const { theme } = useTheme();

  const eventId = params.id as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [joining, setJoining] = useState<boolean>(false);
  const [hasJoined, setHasJoined] = useState<boolean>(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const res = await fetchApi<{ success: boolean; data: EventData }>(`/events/${eventId}`);
        if (res && res.success && res.data) {
          setEvent(res.data);
        } else {
          setEvent(null);
        }
      } catch (error) {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

  useEffect(() => {
    const checkJoinedStatus = async () => {
      if (!user || !token || !eventId) return;
      try {
        const res = await fetchApi<{ success: boolean; data: string[] }>('/users/joined-ids', {
          token,
        });
        if (res && res.success && Array.isArray(res.data)) {
          if (res.data.includes(eventId)) {
            setHasJoined(true);
          }
        }
      } catch (e) {
        // non-blocking
      }
    };

    checkJoinedStatus();
  }, [user, token, eventId]);

  const handleJoinEvent = async () => {
    if (!user) {
      toast.info('Please sign in to join this event as a volunteer.');
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!event) return;

    if (new Date(event.eventDate) < new Date()) {
      toast.error('This event has already ended.');
      return;
    }

    try {
      setJoining(true);
      const res = await fetchApi<{ success: boolean; message: string }>(`/events/${eventId}/join`, {
        method: 'POST',
        token,
      });

      if (res && res.success) {
        setHasJoined(true);
        setEvent((prev) =>
          prev ? { ...prev, participantCount: (prev.participantCount || 0) + 1 } : prev
        );

        Swal.fire({
          title: 'Welcome Aboard!',
          text: `You have successfully joined as a volunteer for "${event.title}".`,
          icon: 'success',
          confirmButtonColor: '#059669',
          confirmButtonText: 'Great!',
          background: theme === 'dark' ? '#1f2937' : '#ffffff',
          color: theme === 'dark' ? '#ffffff' : '#111827',
        });
      }
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes('already registered')) {
        setHasJoined(true);
      }
      toast.error(err.message || 'Failed to join the event.');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-80 w-full bg-gray-200 dark:bg-gray-800 rounded-3xl" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-32 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
          <Calendar className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Event Not Found</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          The event you are looking for does not exist or may have been removed.
        </p>
        <Link
          href="/events"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Link>
      </div>
    );
  }

  const isPast = new Date(event.eventDate) < new Date();
  const eventDateObj = new Date(event.eventDate);
  const formattedDate = eventDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = eventDateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>

      {/* Main Banner Header */}
      <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800">
        <img
          src={event.thumbnail}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4">
          <span
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md shadow-sm ${getCategoryBadgeStyle(
              event.eventType
            )}`}
          >
            {event.eventType}
          </span>
        </div>
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-200">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              {formattedTime}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              {event.location}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Layout: Left Details, Right Sidebar Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Overview & Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              About This Social Initiative
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Location & Map Box */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Location Details
              </h2>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  event.location
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  Meeting / Assembly Point
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  {event.location}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Please arrive 15 minutes before scheduled start time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Join Action Card & Organizer Card */}
        <div className="space-y-6">
          {/* Join Event Card */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 sm:p-7 space-y-5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Volunteers Status
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <Users className="w-3.5 h-3.5" />
                <span>{event.participantCount || 0} Joined</span>
              </div>
            </div>

            <div className="space-y-3">
              {isPast ? (
                <div className="w-full py-3.5 px-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 text-center text-sm font-semibold">
                  This Event Has Ended
                </div>
              ) : hasJoined ? (
                <div className="w-full py-3.5 px-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2 text-sm font-bold shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>You Have Joined This Event</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleJoinEvent}
                  disabled={joining}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {joining ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <HeartHandshake className="w-5 h-5" />
                      <span>Join Event as Volunteer</span>
                    </>
                  )}
                </button>
              )}

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                {hasJoined
                  ? 'Thank you for stepping up to serve the community!'
                  : 'Free registration • Certificate of appreciation upon participation'}
              </p>
            </div>
          </div>

          {/* Organizer Card */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Organized By
            </h3>
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base flex-shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {event.organizerName || 'Community Organizer'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{event.organizerEmail}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Verified Community Organizer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

