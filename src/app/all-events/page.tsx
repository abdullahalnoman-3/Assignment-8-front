'use client';

import React, { Suspense } from 'react';
import { EventsExplorer } from '@/components/EventsExplorer';

export default function AllEventsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="w-12 h-12 mx-auto rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin" />
        </div>
      }
    >
      <EventsExplorer
        includePast={true}
        pageTitle="All Social Events & Community Drives"
        badgeText="Complete Directory"
        pageDescription="Explore all upcoming volunteer drives as well as past completed humanitarian initiatives."
      />
    </Suspense>
  );
}
