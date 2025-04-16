"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  BookOpen,
  Users,
  Trophy,
  BarChart2,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  BrainCircuit,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "tasks", label: "Tasks", icon: <CheckSquare size={20} /> },
    { id: "time", label: "Time Tracker", icon: <Timer size={20} /> },
    { id: "revisions", label: "Revisions", icon: <BrainCircuit size={20} /> },
    { id: "quizzes", label: "Quizzes", icon: <BookOpen size={20} /> },
    { id: "groups", label: "Group Study", icon: <Users size={20} /> },
    { id: "leaderboard", label: "Leaderboard", icon: <Trophy size={20} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart2 size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#f5f5f5]">
      {/* Sidebar */}
      <motion.div
        className={`fixed top-0 left-0 bottom-0 z-40 border-r-4 border-black bg-[#FFD600] ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
        animate={{ width: isSidebarOpen ? 256 : 64 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b-4 border-black">
            {isSidebarOpen && (
              <Link href="/dashboard" className="font-black text-2xl">
                USTADI
              </Link>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 bg-white border-3 border-black rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/dashboard${item.id !== "dashboard" ? `/${item.id}` : ""}`}
                    className={`flex items-center ${
                      isSidebarOpen ? "px-4" : "justify-center px-2"
                    } py-3 rounded-md border-3 border-black transition-all ${
                      activeItem === item.id
                        ? "bg-black text-[#FFD600]"
                        : "bg-white hover:bg-gray-100"
                    } ${isSidebarOpen ? "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" : ""}`}
                    onClick={() => setActiveItem(item.id)}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {isSidebarOpen && <span className="font-bold">{item.label}</span>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </motion.div>

      {/* Content area */}
      <div
        className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-16"} transition-all duration-300`}
      >
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b-4 border-black bg-white">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border-3 border-black rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 bg-white border-3 border-black rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-black"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-pink-400 rounded-full border-3 border-black flex items-center justify-center">
                <span className="font-bold text-sm">AR</span>
              </div>
              {isSidebarOpen && (
                <span className="font-bold text-sm">Abdul Rehman</span>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
