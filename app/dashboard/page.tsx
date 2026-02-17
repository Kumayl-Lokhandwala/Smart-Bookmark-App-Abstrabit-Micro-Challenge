"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🔒 Protect route
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) window.location.href = "/";
      else setLoading(false);
    });
  }, []);

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  // Realtime
  useEffect(() => {
    const initBookmarks = async () => {
      await fetchBookmarks();

      const channel = supabase
        .channel("live-bookmarks")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "bookmarks" },
          fetchBookmarks,
        )
        .subscribe();

      return () => supabase.removeChannel(channel);
    };

    let unsubscribe: (() => void) | undefined;
    initBookmarks().then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const addBookmark = async () => {
    if (!title || !url) return;

    const { data } = await supabase.auth.getUser();

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: data.user?.id,
    });

    setTitle("");
    setUrl("");
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const filtered = bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.url.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 bg-black">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* HEADER */}
      <div className="border-b border-gray-800 bg-black/80 backdrop-blur">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold tracking-wide">
            Smart Bookmarks
          </h1>

          <button
            onClick={logout}
            className="text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-3xl mx-auto p-6">
        {/* ADD BOOKMARK */}
        <div className="bg-[#111] border border-gray-800 rounded-xl p-4 shadow-md mb-6">
          <div className="flex gap-2">
            <input
              className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/10"
              placeholder="Bookmark title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/10"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <button
              onClick={addBookmark}
              className="bg-white text-black px-4 rounded-lg text-sm hover:opacity-90 transition"
            >
              Add
            </button>
          </div>

          {/* SEARCH */}
          <input
            className="mt-3 w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/10"
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* LIST */}
        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p>No bookmarks yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b) => {
              const favicon = `https://www.google.com/s2/favicons?domain=${b.url}`;

              return (
                <div
                  key={b.id}
                  className="bg-[#111] border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition flex justify-between items-center"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img src={favicon} className="w-5 h-5" />

                    <div className="overflow-hidden">
                      <a
                        href={b.url}
                        target="_blank"
                        className="text-gray-200 font-medium hover:underline truncate block"
                      >
                        {b.title}
                      </a>

                      <p className="text-xs text-gray-500 truncate">{b.url}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteBookmark(b.id)}
                    className="text-xs text-red-500 hover:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
