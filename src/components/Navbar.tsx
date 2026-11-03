'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import Swal from 'sweetalert2';
import {
  Sun,
  Moon,
  Menu,
  X,
  HeartHandshake,
  LogOut,
  PlusCircle,
  CalendarCheck,
  LayoutDashboard,
  Calendar,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // SweetAlert2 Sign Out Confirmation
  const handleSignOut = async () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to sign out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Sign Out',
      cancelButtonText: 'Cancel',
      background: theme === 'dark' ? '#1f2937' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#111827',
    });

    if (result.isConfirmed) {
      logout();
      router.push('/login');
      Swal.fire({
        title: 'Signed Out!',
        text: 'You have been logged out successfully.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: theme === 'dark' ? '#1f2937' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#111827',
      });
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 1. Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform flex-shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                Social Events Platform{' '}
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">(SEP)</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              Home
            </Link>

            {/* 1. Upcoming Events Link */}
            <Link
              href="/events"
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/events')
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Upcoming Events</span>
            </Link>
          </div>

          {/* Right Side: Theme Toggle + Profile / Auth */}
          <div className="hidden md:flex items-center gap-4">
            {/* 2. Dark/Light Mode Toggle Button */}
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle Theme"
                className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            )}

            {/* 3 & 4. User Logged-in Profile with Hover Name & Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-emerald-500/30 transition group relative"
                  title={user.name}
                  aria-label="User Profile Menu"
                >
                  <div className="w-10 h-10 rounded-full ring-2 ring-emerald-500/40 p-0.5 overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    <img
                      src={
                        user.image ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                          user.name
                        )}`
                      }
                      alt={user.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />

                  {/* Hover Tooltip showing user name */}
                  <div className="absolute right-0 top-12 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
                    <div className="bg-gray-900 text-white text-xs font-medium py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap">
                      {user.name}
                    </div>
                  </div>
                </button>

                {/* 4. Dropdown Menu on Photo Click */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/create-event"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                      >
                        <PlusCircle className="w-4 h-4 text-emerald-500" />
                        <span>Create Event</span>
                      </Link>

                      <Link
                        href="/manage-events"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                        <span>Manage Events</span>
                      </Link>

                      <Link
                        href="/joined-events"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                      >
                        <CalendarCheck className="w-4 h-4 text-emerald-500" />
                        <span>Joined Events</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-sm shadow-emerald-500/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle Theme"
                className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2 text-base font-medium ${
              isActive('/')
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-gray-700 dark:text-gray-200'
            }`}
          >
            Home
          </Link>

          <Link
            href="/events"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2 text-base font-medium ${
              isActive('/events')
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-gray-700 dark:text-gray-200'
            }`}
          >
            Upcoming Events
          </Link>

          {user ? (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={
                    user.image ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      user.name
                    )}`
                  }
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
                />
                <div className="overflow-hidden">
                  <div className="font-semibold text-gray-900 dark:text-white truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Link
                  href="/create-event"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-500" />
                  <span>Create Event</span>
                </Link>

                <Link
                  href="/manage-events"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                  <span>Manage Events</span>
                </Link>

                <Link
                  href="/joined-events"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600"
                >
                  <CalendarCheck className="w-4 h-4 text-emerald-500" />
                  <span>Joined Events</span>
                </Link>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-xl"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
