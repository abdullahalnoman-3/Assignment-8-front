import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

export interface EventData {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string | Date;
  organizerName?: string;
  organizerEmail?: string;
  participantCount?: number;
}

interface EventCardProps {
  event: EventData;
}

export const getCategoryBadgeStyle = (category: string) => {
  switch (category) {
    case 'Healthcare':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800';
    case 'Cleanup':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
    case 'Winter Relief':
      return 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-800';
    case 'Plantation':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
    case 'Education':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800';
    case 'Food Drive':
      return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800';
    case 'Blood Donation':
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800';
    case 'Donation':
      return 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
  }
};

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const isPast = new Date(event.eventDate) < new Date();

  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="h-full flex flex-col justify-between bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
      <div>
        {/* Thumbnail & Category Badge */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={event.thumbnail}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-sm ${getCategoryBadgeStyle(
                event.eventType
              )}`}
            >
              {event.eventType}
            </span>
          </div>

          {/* Past Event Badge */}
          {isPast && (
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-900/80 text-gray-200 border border-gray-700/60 backdrop-blur-md shadow-sm">
                Past Event
              </span>
            </div>
          )}
        </div>

        {/* Event Body Info */}
        <div className="p-5 space-y-3">
          {/* Date & Volunteers Count */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full font-medium">
              <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{event.participantCount ?? 0} Joined</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 pt-1">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-5 pt-0">
        <Link
          href={`/events/${event._id}`}
          className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 font-medium text-sm transition-all flex items-center justify-center gap-2"
        >
          <span>View Event Details</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export const EventCardSkeleton: React.FC = () => {
  return (
    <div className="h-full flex flex-col justify-between bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm animate-pulse">
      <div>
        <div className="h-48 w-full bg-gray-200 dark:bg-gray-800" />
        <div className="p-5 space-y-3">
          <div className="flex justify-between">
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded-full" />
          </div>
          <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded pt-1" />
        </div>
      </div>
      <div className="p-5 pt-0">
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
      </div>
    </div>
  );
};

export default EventCard;

