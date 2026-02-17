"use client";

import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.href = "/dashboard";
    });
  }, []);

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-[#111] border border-gray-800 rounded-2xl p-8 shadow-lg">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-wide">
            Smart Bookmarks
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Save and organize your favorite links
          </p>
        </div>

        {/* Google Login */}
        <button
          onClick={login}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-lg font-medium hover:opacity-90 transition"
        >
          {/* Google Icon */}
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.72 1.22 9.22 3.61l6.9-6.9C35.96 2.54 30.38 0 24 0 14.62 0 6.47 5.48 2.65 13.44l8.06 6.26C12.67 13.22 17.84 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.5 24.5c0-1.63-.14-3.2-.4-4.72H24v9h12.7c-.55 2.96-2.2 5.47-4.7 7.14l7.25 5.64C43.7 37.56 46.5 31.52 46.5 24.5z"
            />
            <path
              fill="#FBBC05"
              d="M10.7 28.7a14.5 14.5 0 010-9.4l-8.06-6.26A23.98 23.98 0 000 24c0 3.93.94 7.64 2.65 10.96l8.05-6.26z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.38 0 11.73-2.1 15.64-5.7l-7.25-5.64c-2.02 1.36-4.6 2.16-8.39 2.16-6.16 0-11.33-3.72-13.29-9.2l-8.05 6.26C6.47 42.52 14.62 48 24 48z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-600 text-center mt-6">
          Secure login powered by Google
        </p>
      </div>
    </div>
  );
}
