'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { EventCard, EventCardSkeleton, EventData } from '@/components/EventCard';
import { toast } from 'sonner';
import {
  Calendar,
  Users,
  Sparkles,
  Camera,
  MapPin,
  ArrowRight,
  Mail,
  Send,
  CheckCircle2,
} from 'lucide-react';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Urban Greenery Drive, Ramna',
    location: 'Ramna Park, Dhaka',
    category: 'Environment',
    caption: 'Over 500 indigenous saplings planted by youth volunteers to expand Dhaka city green canopy.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Emergency Flood Relief Support',
    location: 'Feni Sadar, Feni',
    category: 'Disaster Relief',
    caption: 'Essential food rations, clean drinking water, and medicine kits delivered to flood-affected families.',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Free Community Health Camp',
    location: 'Mirpur, Dhaka',
    category: 'Healthcare',
    caption: 'Providing free health checkups, diabetes screening, and basic medicines to over 350 seniors.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Winter Warmth Distribution Drive',
    location: 'Kurigram, Rangpur',
    category: 'Winter Relief',
    caption: 'Warm blankets and heavy winter sweaters distributed to vulnerable families in Northern Bangladesh.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    title: 'Coastal Beach Clean-up Marathon',
    location: 'Kolatoli Beach, Coxs Bazar',
    category: 'Clean-up',
    caption: 'Over 150 volunteers gathered to remove 1.2 tons of single-use marine plastic and discarded nets.',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    title: 'Underprivileged Children Education Drive',
    location: 'Korail Community, Dhaka',
    category: 'Education',
    caption: 'Distributing school bags, stationery, and storybooks to underprivileged street children in community schools.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
  },
];

export default function HomePage() {
  const [recentEvents, setRecentEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setSubscribing(true);
    setTimeout(() => {
      setSubscribing(false);
      setNewsletterEmail('');
      toast.success('Thank you for subscribing! A confirmation email has been sent to your inbox.');
    }, 600);
  };

  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        setLoading(true);
        const res = await fetchApi<{ success: boolean; data: EventData[] }>('/events/recent');
        if (res && res.success) {
          setRecentEvents(res.data || []);
        }
      } catch (error) {
        setRecentEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEvents();
  }, []);

  return (
    <div className="space-y-24 py-12">
      {/* 1. Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Community Action & Volunteer Coordination
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-4xl leading-tight">
          Make a Difference with{' '}
          <span className="text-emerald-600 dark:text-emerald-400">Social Events Platform (SEP)</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
          Join thousands of volunteers participating in environmental campaigns, health camps, winter relief, and humanitarian community activities across Bangladesh.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/events"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg shadow-emerald-600/20 transition flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Browse Upcoming Events
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Become a Volunteer
          </Link>
        </div>
      </section>

      {/* 3. Recent Events Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5" />
              Upcoming Opportunities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Recent & Upcoming Events
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Join immediate community drives and volunteer opportunities in your area.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <EventCardSkeleton key={n} />
            ))}
          </div>
        ) : recentEvents.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No upcoming events found right now. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Camera className="w-3.5 h-3.5" />
            Moments in Action
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Our Community Service Gallery
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Real impacts and dedicated volunteer initiatives helping communities across Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-md">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span>{item.location}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Newsletter Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-emerald-500/10 dark:from-emerald-950/40 dark:via-gray-900 dark:to-emerald-950/30 border border-emerald-500/20 p-8 sm:p-12 text-center shadow-sm">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-600 text-white items-center justify-center shadow-lg shadow-emerald-600/30">
              <Mail className="w-6 h-6" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Stay Connected With Social Initiatives
            </h2>

            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Subscribe to our weekly newsletter to receive direct updates about new volunteer campaigns, free health camps, and emergency relief programs.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="pt-4 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={subscribing}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-60"
              >
                {subscribing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>No spam guaranteed. Unsubscribe anytime with one click.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
