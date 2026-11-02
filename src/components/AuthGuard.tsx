'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { HeartHandshake } from 'lucide-react';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // লোডিং শেষ হওয়ার পরই কেবল চেক করা হবে ইউজার লগড-ইন কিনা!
    if (!isLoading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, router, pathname]);

  // রিফ্রেশ চলার সময় লোডার দেখাবে (লগইন পেজে কিক করবে না!)
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin" />
        <p className="text-sm text-gray-500">Verifying session...</p>
      </div>
    );
  }

  if (!user) return null;
  return <>{children}</>;
};

export default AuthGuard;

