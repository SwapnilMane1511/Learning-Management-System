import React, { useState } from "react";
import { ChartNoAxesColumn, SquareLibrary, Menu } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for large screen */}
      <div className="hidden lg:block w-[250px] bg-[#f0f0f0] border-r dark:bg-gray-800 dark:border-gray-600 dark:text-white-200 border-gray-300 p-5 sticky top-0 h-screen">
        <SidebarContent />
      </div>

      {/* Toggle button for mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-200 p-2 rounded shadow"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Slide-over Sidebar for small/medium screens */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-30">
          <div className="w-64 bg-white h-full p-5 shadow-lg">
            <SidebarContent />
            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 text-red-500 underline"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 p-4 sm:p-6 md:p-10 lg:p-14">
        <Outlet />
      </div>
    </div>
  );
};

const SidebarContent = () => (
  <div className="space-y-6 mt-20">
    <Link to="dashboard" className="flex items-center gap-2">
      <ChartNoAxesColumn size={22} />
      <span>Dashboard</span>
    </Link>
    <Link to="course" className="flex items-center gap-2">
      <SquareLibrary size={22} />
      <span>Courses</span>
    </Link>
  </div>
);

export default Sidebar;
