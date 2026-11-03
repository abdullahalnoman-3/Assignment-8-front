'use client';

import React, { Suspense } from 'react';
import { EventsExplorer } from '@/components/EventsExplorer';

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="w-12 h-12 mx-auto rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin" />
        </div>
      }
    >
      <EventsExplorer
        includePast={false}
        pageTitle="Upcoming Social Events"
        badgeText="Discover & Participate"
        pageDescription="Browse through upcoming volunteer drives and active community initiatives."
      />
    </Suspense>
  );
}
