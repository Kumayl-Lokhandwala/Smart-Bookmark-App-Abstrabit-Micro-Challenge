# Smart Bookmark App

A modern, real-time bookmark manager built with Next.js (App Router) and Supabase. The application allows users to securely authenticate using Google, store private bookmarks, and view updates instantly across multiple tabs without refreshing the page.

---

## Live Demo

https://smart-bookmark-app-abstrabit-micro-six.vercel.app/

---

## Overview

The Smart Bookmark App enables users to save and manage web links in a clean, responsive interface. Authentication is handled entirely through Google OAuth, and each user’s bookmarks remain private using Supabase Row Level Security. Real-time synchronization ensures that any change made in one tab is instantly reflected in another.

---

## Technology Stack

Frontend: Next.js (App Router), Tailwind CSS
Backend: Supabase (Authentication, PostgreSQL, Realtime)
Deployment: Vercel

---

## Database Schema

Table: bookmarks

* id (uuid, primary key)
* user_id (uuid, foreign key referencing auth.users)
* title (text)
* url (text)
* created_at (timestamp)

Row Level Security ensures users can only access and modify their own bookmarks.

---

## Local Setup

Clone the repository and install dependencies:

```
git clone https://github.com/Kumayl-Lokhandwala/Smart-Bookmark-App-Abstrabit-Micro-Challenge.git
cd smart-bookmark
npm install
```

Create a `.env.local` file and add:

```
NEXT_PUBLIC_SUPABASE_URL=YOUR_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_KEY
```

Run the development server:

```
npm run dev
```

---

## Deployment

The application is deployed on Vercel. Environment variables were configured in Vercel, and the production URL was added to Supabase Authentication settings to ensure correct OAuth redirection.

---

## Challenges Faced and Solutions

1. **OAuth Redirect Issue After Deployment**
   After deploying, Google OAuth redirected users to localhost instead of the production domain. This occurred because the Site URL in Supabase Authentication settings was still configured for local development. Updating the Site URL to the deployed Vercel domain and using a dynamic redirect based on `window.location.origin` resolved the issue.

2. **Realtime Updates Not Reflecting Across Tabs**
   Initially, bookmarks added in one tab were not appearing instantly in another. The issue was caused by an unstable realtime connection and inefficient UI updates. Enabling realtime at the database table level and updating the frontend state directly from realtime events ensured consistent live synchronization.

---

## Author

Kumayl Lokhandwala
