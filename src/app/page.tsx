import Link from 'next/link';
import {
  HeartHandshake,
  Calendar,
  Users,
  Sparkles,
  Camera,
  MapPin,
  Tag,
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
  return (
    <div className="space-y-20 py-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
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
    </div>
  );
}
