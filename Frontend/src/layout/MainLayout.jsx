import Navbar from "@/components/Navbar";
import React from "react";
import { Outlet } from "react-router-dom";
import { useLoadUserProfileQuery } from "@/features/api/authApi";
import { Loader2 } from "lucide-react";

function MainLayout() {
  // Load user profile when app starts (if user is logged in)
  const { isLoading } = useLoadUserProfileQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#020817]">
        <Loader2 className="animate-spin h-8 w-8 text-gray-900 dark:text-gray-100" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#020817]">
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
