'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import Swal from 'sweetalert2';
import {
  User,
  Mail,
  Image as ImageIcon,
  Save,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Camera,
} from 'lucide-react';

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
];

const ProfileContent: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setImage(user.image || '');
      setImageError(false);
    }
  }, [user]);

  const fallbackAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    name || user?.name || 'User'
  )}`;

  const currentPreview = imageError || !image.trim() ? fallbackAvatar : image.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Name Required',
        text: 'Please enter your full name.',
        confirmButtonColor: '#10b981',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await updateProfile(name.trim(), image.trim());

      if (success) {
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your personal information has been saved successfully.',
          confirmButtonColor: '#10b981',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 sm:py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
            Volunteer Profile
          </span>
        </div>

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-500/10 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl ring-4 ring-white/30 overflow-hidden bg-white/10 shadow-lg">
                <img
                  src={currentPreview}
                  alt={name || 'User Avatar'}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white text-emerald-700 p-1.5 rounded-xl shadow-md">
                <Camera className="w-4 h-4" />
              </div>
            </div>

            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {user?.name || 'My Profile'}
              </h1>
              <p className="text-emerald-100 text-sm mt-1">{user?.email}</p>
              <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                  Verified Community Volunteer
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Form Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-10">
          <div className="border-b border-gray-100 dark:border-gray-800 pb-5 mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Personal Information
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Update your display name and public avatar photo URL.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition"
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-gray-400" />
                  Cannot be changed
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={user?.email || ''}
                  disabled
                  readOnly
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                />
              </div>
            </div>

            {/* Profile Picture URL */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Profile Photo URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <input
                  type="url"
                  id="image"
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    setImageError(false);
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                Provide a direct URL to an image (JPEG, PNG, WebP) or pick a sample photo below.
              </p>
            </div>

            {/* Preset Sample Avatars */}
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                Quick Avatar Suggestions:
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                {SAMPLE_AVATARS.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setImage(url);
                      setImageError(false);
                    }}
                    className={`w-11 h-11 rounded-xl overflow-hidden ring-2 transition transform hover:scale-105 ${
                      image === url
                        ? 'ring-emerald-500 scale-105'
                        : 'ring-gray-200 dark:ring-gray-800 hover:ring-emerald-400'
                    }`}
                    title={`Avatar option ${index + 1}`}
                  >
                    <img
                      src={url}
                      alt={`Avatar option ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setImage('');
                    setImageError(false);
                  }}
                  className="px-3 py-2 text-xs font-medium rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Use Default Initials
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-end gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
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
    </div>
  );
};

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
