"use client";

import { useState } from "react";
import { PanelLeft } from "lucide-react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  role: "vendor" | "customer" | "admin";
  children: React.ReactNode;
}

export default function DashboardLayout({
  role,
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3] dark:bg-[#171412]">
      {/* Dashboard Area */}
      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <div
          className={`hidden shrink-0 transition-all duration-300 lg:block ${
            sidebarOpen ? "w-72" : "w-0"
          }`}>
          <div className="sticky top-0 h-screen overflow-hidden">
            <DashboardSidebar
              role={role}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="min-w-0 flex-1">
          {/* Toolbar */}
          <div className="sticky top-0 z-30 flex h-16 items-center border-b border-gray-200 bg-white/95 px-4 backdrop-blur-md dark:border-gray-800 dark:bg-[#171412]/95">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className="border-[#E87932] text-[#E87932] hover:bg-[#E87932] hover:text-white dark:bg-[#211C19]"
              aria-label="Toggle dashboard sidebar"
              aria-expanded={sidebarOpen}>
              <PanelLeft size={20} />
            </Button>
          </div>

          <main className="w-full p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <DashboardSidebar
            role={role}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
