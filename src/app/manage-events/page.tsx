'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { useTheme } from 'next-themes';
import { fetchApi } from '@/lib/api';
import { getCategoryBadgeStyle, EventData } from '@/components/EventCard';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import {
  Calendar,
  MapPin,
  Users,
  Edit3,
  Trash2,
  PlusCircle,
  X,
  Save,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

const CATEGORIES = [
  'Cleanup',
  'Plantation',
  'Donation',
  'Education',
  'Healthcare',
  'Winter Relief',
  'Food Drive',
  'Blood Donation',
];

function ManageEventsContent() {
  const { token } = useAuth();
  const { theme } = useTheme();

  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [minDateTime, setMinDateTime] = useState('');

  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    eventType: 'Cleanup',
    thumbnail: '',
    location: '',
    eventDate: '',
  });

  const loadUserEvents = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetchApi<{ success: boolean; data: EventData[] }>('/users/events', {
        token,
      });
      if (res && res.success) {
        setEvents(res.data || []);
      } else {
        setEvents([]);
      }
    } catch (error) {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUserEvents();
  }, [loadUserEvents]);

  useEffect(() => {
    const now = new Date();
    const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setMinDateTime(localISO);
  }, []);

  const openEditModal = (event: EventData) => {
    setEditingEvent(event);
    const d = new Date(event.eventDate);
    const localISO = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    setEditFormData({
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      thumbnail: event.thumbnail,
      location: event.location,
      eventDate: localISO,
    });
  };

  const closeEditModal = () => {
    setEditingEvent(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    if (editFormData.title.trim().length < 5) {
      toast.error('Title must be at least 5 characters long.');
      return;
    }

    if (editFormData.description.trim().length < 20) {
      toast.error('Description must be at least 20 characters long.');
      return;
    }

    const selectedDate = new Date(editFormData.eventDate);
    if (selectedDate <= new Date()) {
      toast.error(
        'Rule 5: Updated event date must strictly be in the future. Past dates are prohibited.'
      );
      return;
    }

    try {
      setIsUpdating(true);
      const res = await fetchApi<{ success: boolean; message: string; data: EventData }>(
        `/events/${editingEvent._id}`,
        {
          method: 'PUT',
          token,
          body: JSON.stringify({
            title: editFormData.title.trim(),
            description: editFormData.description.trim(),
            eventType: editFormData.eventType,
            thumbnail: editFormData.thumbnail.trim(),
            location: editFormData.location.trim(),
            eventDate: selectedDate.toISOString(),
          }),
        }
      );

      if (res && res.success) {
        toast.success('Event updated successfully!');
        setEvents((prev) =>
          prev.map((ev) =>
            ev._id === editingEvent._id
              ? { ...ev, ...res.data, participantCount: ev.participantCount }
              : ev
          )
        );
        closeEditModal();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update event.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to permanently delete "${eventTitle}"? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete Event',
      cancelButtonText: 'Cancel',
      background: theme === 'dark' ? '#1f2937' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#111827',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetchApi<{ success: boolean; message: string }>(`/events/${eventId}`, {
          method: 'DELETE',
          token,
        });

        if (res && res.success) {
          setEvents((prev) => prev.filter((ev) => ev._id !== eventId));

          Swal.fire({
            title: 'Deleted!',
            text: 'Your event and its registrations have been removed.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
          });
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete event.');
      }
    }
  };

  const formatDate = (dateString: string | Date) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return String(dateString);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Organizer Workspace
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Manage My Events
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            View, edit event schedule, and track volunteers registered for your initiatives.
          </p>
        </div>

        <Link
          href="/create-event"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Event</span>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 space-y-4 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            You haven&apos;t created any events yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Take the initiative to mobilize volunteers for a community cause in your area.
          </p>
          <div className="pt-2">
            <Link
              href="/create-event"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Your First Event</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-50/80 dark:bg-gray-800/60 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    Volunteers
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {events.map((event) => (
                  <tr
                    key={event._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={event.thumbnail}
                          alt={event.title}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-gray-100 dark:bg-gray-800"
                        />
                        <div className="max-w-xs">
                          <Link
                            href={`/events/${event._id}`}
                            className="font-semibold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition line-clamp-1"
                          >
                            {event.title}
                          </Link>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryBadgeStyle(
                          event.eventType
                        )}`}
                      >
                        {event.eventType}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{formatDate(event.eventDate)}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 max-w-[180px] truncate">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        <Users className="w-3.5 h-3.5" />
                        <span>{event.participantCount || 0}</span>
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(event)}
                          className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-emerald-600 hover:border-emerald-600 dark:hover:text-emerald-400 dark:hover:border-emerald-500 transition"
                          title="Edit Event"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(event._id, event.title)}
                          className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-red-600 hover:border-red-600 dark:hover:text-red-400 dark:hover:border-red-500 transition"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit Event Details
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Update event schedule, location, or description
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  minLength={5}
                  value={editFormData.title}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    name="eventType"
                    value={editFormData.eventType}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="dark:bg-gray-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Date & Time (Future Only) *
                  </label>
                  <input
                    type="datetime-local"
                    name="eventDate"
                    required
                    min={minDateTime}
                    value={editFormData.eventDate}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={editFormData.location}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Thumbnail URL *
                </label>
                <input
                  type="url"
                  name="thumbnail"
                  required
                  value={editFormData.thumbnail}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  minLength={20}
                  value={editFormData.description}
                  onChange={handleEditChange}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition flex items-center gap-2 disabled:opacity-60"
                >
                  {isUpdating ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ManageEventsPage() {
  return (
    <AuthGuard>
      <ManageEventsContent />
    </AuthGuard>
  );
}

