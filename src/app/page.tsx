import Link from 'next/link';
import { HeartHandshake, Calendar, Users, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
        <Sparkles className="w-3.5 h-3.5" />
        Community Action & Volunteer Coordination
      </div>

      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-4xl">
        Make a Difference with{' '}
        <span className="text-emerald-600 dark:text-emerald-400">Social Events Platform (SEP)</span>
      </h1>

      <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
        Join hundreds of volunteers participating in tree plantations, clean-up drives, food distribution, and community relief efforts.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
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
    </div>
  );
}

