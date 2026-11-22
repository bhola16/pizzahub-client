"use client";

import { PanelLeft } from "lucide-react";
import { useState } from "react";

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
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div
          className={`hidden shrink-0 transition-all duration-300 lg:block ${
            sidebarOpen ? "w-66" : "w-0"
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
        <div className="relative min-w-0 flex-1">
          {/* Dashboard Content */}
          <main className="w-full p-4 pt-4 sm:p-6 sm:pt-6 lg:p-8 lg:pt-6">
            {/* Sidebar Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className="absolute left-4 top-4 z-30 border-[#E87932] bg-white text-[#E87932] hover:bg-[#E87932] hover:text-white dark:bg-[#211C19]"
              aria-label="Toggle dashboard sidebar"
              aria-expanded={sidebarOpen}>
              <PanelLeft size={20} />
            </Button>

            <div className="mx-auto pl-10 w-full max-w-6xl">{children}</div>
          </main>
        </div>

        {/* Mobile and Tablet Sidebar */}
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
