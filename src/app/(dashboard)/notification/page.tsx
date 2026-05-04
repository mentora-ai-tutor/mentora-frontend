"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Bell, Settings, CheckCheck } from "lucide-react";
import { NotificationList, Notification } from "@/components/notification/page";

// Mock data based on user provided structure
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    _id: "69f86aa9f3852f24af2bfa9c",
    notification_id: "N-01KQS619",
    student_id: "STU-2026-2124",
    type: "pairing_success",
    message: "Your peer learning session for Generics is starting! You are paired as a learner.",
    session_id: "PS-01KQS619",
    topic_name: "Generics",
    role: "learner",
    peer_id: "STU-2026-2128",
    created_at: "2026-05-04T09:45:13.625+00:00",
    status: "unread"
  },
  {
    _id: "69f86a4af3852f24af2bfa96",
    notification_id: "N-01KQS5YC",
    student_id: "STU-2026-2124",
    type: "queue_entry",
    message: "No immediate match found for Generics. You've been added to the waiting queue.",
    queue_id: "WQ-01KQS5YC",
    topic_name: "Generics",
    created_at: "2026-05-04T09:43:38.318+00:00",
    status: "unread"
  }
];

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setNotifications(MOCK_NOTIFICATIONS);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'read' as const })));
  };

  return (
    <div className="h-screen w-full max-w-full bg-[#0F172A] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-teal-400 hover:border-teal-500/30 transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                Notifications
                <span className="flex items-center justify-center bg-[#B45309] text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm animate-pulse">
                  {notifications.filter(n => n.status === 'unread').length} NEW
                </span>
              </h1>
              <p className="text-xs text-white/40 font-medium uppercase tracking-widest mt-1">Updates from your learning journey</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/60 hover:text-teal-400 hover:bg-teal-500/10 rounded-xl transition-all"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Mark all as read</span>
            </button>
            <button className="p-2 text-white/40 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 pt-8 pb-20">
        <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-white/5 border border-white/10 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="animate-slide-up">
            <NotificationList notifications={notifications} />
          </div>
        )}
        </div>
      </main>

      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
