# Social Events Platform (SEP) — Frontend

A modern, responsive full-stack Community Service & Volunteer Mobilization web application built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Node.js/Express**, and **MongoDB Atlas**.

---

## 🌐 Live Website & Deployment

- **Live Frontend URL:** [https://assignment.hmnoman.com](https://assignment.hmnoman.com)
- **Live Backend API URL:** [https://assignmentserver.hmnoman.com/api](https://assignmentserver.hmnoman.com/api)
- **Deployment Platform:** cPanel Phusion Passenger (Node.js 20.x) with custom `server.js`

---

## 🌟 Key Website Features (Minimum 5 Highlights)

1. **Rule 5 Automated Future-Only Scheduling**:
   - Both client-side HTML5 input validation (`min={currentDateTime}`) and server-side MongoDB schema hooks prevent any past dates from being created or updated. Only active, future humanitarian initiatives can be submitted.

2. **Strict Organizer Ownership & Cascade Operations**:
   - Only the authenticated event creator can edit or delete their events. Unauthorized attempts return `403 Forbidden`. Deleting an event cascades to safely remove all associated volunteer registrations.

3. **1-Click Volunteer Registration & Live Participant Counters**:
   - Logged-in users can volunteer for community drives with instant SweetAlert2 confirmation feedback and live dynamic counter updates. Compound unique indexes prevent duplicate registrations.

4. **Dynamic Search & Category Filter Pills**:
   - Real-time debounced search bar filtering across titles, locations, and descriptions alongside category filters (Cleanup, Plantation, Donation, Healthcare, Education, Winter Relief, etc.) and an instant reset option.

5. **Chronological Volunteer Impact Timeline**:
   - Dedicated `Joined Events` dashboard sorting all initiatives the user has volunteered for by upcoming event date, displaying full details, registration badges, and location maps.

6. **Protected Event Details Route with Smart Redirects**:
   - The Event Details page (`/events/[id]`) is strictly guarded by `AuthGuard`. Unauthenticated visitors attempting to view event details are seamlessly redirected to the Login page (`/login?redirect=/events/[id]`) and returned to the exact event upon sign-in.

7. **Interactive Dark & Light Theme Customization**:
   - Full dark/light mode toggle powered by `next-themes` and Tailwind CSS, smoothly persisted across sessions and applied to all modal dialogues, tables, and form controls.

8. **Zero Native Alerts & Accessible UX**:
   - Replaced all default browser alerts and confirms with animated **SweetAlert2** dialogues and **Sonner** notifications for a polished, accessible user experience.

9. **Profile View & Live Update Feature**:
   - Users can update their display name and profile picture URL with quick avatar presets and instant real-time synchronization with the top navigation bar without page reloads.

---

## 💻 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with `@tailwindcss/forms`
- **Theme:** `next-themes` (Dark / Light mode)
- **Icons:** `lucide-react` (including modern 'X' logo)
- **Notifications & Dialogs:** `sweetalert2` and `sonner`

### Backend
- **Runtime:** Node.js (v20+)
- **Framework:** Express.js
- **Database:** MongoDB Atlas with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) with `bcryptjs` password hashing
- **Security:** CORS, input sanitation, protected route middlewares

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/assignment-8-frontend.git
cd assignment-8-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` or `.env` file in the root directory:
```env
NEXT_PUBLIC_API_URL=https://assignmentserver.hmnoman.com/api
# Or for local backend:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 Responsive Routes & Structure

- `/` — Public Home Page (Hero Banner, Features, Recent 6 Events Grid, Photo Gallery, Newsletter)
- `/events` — Public Upcoming Events Explorer (Live search, Category filters, Event cards)
- `/events/[id]` — **Protected Route:** Single event details & volunteer enrollment (AuthGuard with automatic redirect)
- `/all-events` — Searchable catalog of community events for registered users
- `/create-event` — **Protected Route:** Create new social event with future date validation
- `/manage-events` — **Protected Route:** Organizer table to edit and delete user's own events
- `/joined-events` — **Protected Route:** Chronological list of user's joined events
- `/profile` — **Protected Route:** View and update display name and avatar URL
- `/login` & `/register` — Authentication pages with validation and demo social sign-ins

---

## 📄 License
This project was developed for educational purposes as part of Assignment 8.
