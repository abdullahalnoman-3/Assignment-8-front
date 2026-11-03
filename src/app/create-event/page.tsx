'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';
import {
  CalendarPlus,
  Type,
  AlignLeft,
  Tag,
  Image as ImageIcon,
  MapPin,
  Calendar,
  AlertCircle,
  Sparkles,
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

function CreateEventForm() {
  const router = useRouter();
  const { token } = useAuth();

  const [minDateTime, setMinDateTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'Cleanup',
    thumbnail: '',
    location: '',
    eventDate: '',
  });

  useEffect(() => {
    const now = new Date();
    const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setMinDateTime(localISO);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.title.trim().length < 5) {
      toast.error('Title must be at least 5 characters long.');
      return;
    }

    if (formData.description.trim().length < 20) {
      toast.error('Description must be at least 20 characters long.');
      return;
    }

    if (!formData.thumbnail.trim()) {
      toast.error('Please provide a thumbnail image URL.');
      return;
    }

    if (!formData.location.trim()) {
      toast.error('Please specify the event location.');
      return;
    }

    if (!formData.eventDate) {
      toast.error('Please select an event date and time.');
      return;
    }

    const selectedDate = new Date(formData.eventDate);
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      toast.error(
        'Rule 5: Event date must be in the future. Past dates are strictly prohibited.'
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetchApi<{ success: boolean; message: string; data: any }>('/events', {
        method: 'POST',
        token,
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          eventType: formData.eventType,
          thumbnail: formData.thumbnail.trim(),
          location: formData.location.trim(),
          eventDate: selectedDate.toISOString(),
        }),
      });

      if (res && res.success) {
        toast.success('Community service event created successfully!');
        router.push('/events');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to publish event. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 sm:p-10 shadow-sm space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Organize & Lead
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Create a Community Service Event
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Publish a new social or environmental initiative to recruit volunteers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Event Title *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Type className="w-5 h-5" />
                </div>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  minLength={5}
                  maxLength={120}
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Mirpur Urban Tree Plantation Drive"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="eventType"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Event Category *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Tag className="w-5 h-5" />
                  </div>
                  <select
                    id="eventType"
                    name="eventType"
                    required
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="dark:bg-gray-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="eventDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Date & Time (Future Only) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <input
                    id="eventDate"
                    name="eventDate"
                    type="datetime-local"
                    required
                    min={minDateTime}
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Event Location / Assembly Point *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Ramna Park Lake Gate, Dhaka"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="thumbnail"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Thumbnail Image URL *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <input
                  id="thumbnail"
                  name="thumbnail"
                  type="url"
                  required
                  value={formData.thumbnail}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Detailed Description (Min 20 characters) *
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  minLength={20}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the initiative, goals, materials volunteers need to bring, and expectations..."
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs border border-amber-500/20">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>Rule 5:</strong> Events cannot be scheduled for past dates. The date and time must strictly be set in the future.
            </span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CalendarPlus className="w-5 h-5" />
                  <span>Publish Community Event</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreateEventPage() {
  return (
    <AuthGuard>
      <CreateEventForm />
    </AuthGuard>
  );
}

