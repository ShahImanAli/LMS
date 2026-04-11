import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex">
      <div className="hidden lg:block w-63 sm:w-75 space-y-8 border-r border-r-gray-200 dark:border-gray-700 p-5 sticky top-0 h-screen ">
        <div className="mt-20">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 py-2 px-3 rounded-md transition-all duration-200 ${
                isActive
                  ? "bg-gray-100 dark:bg-gray-800 font-bold"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`
            }
          >
            <ChartNoAxesColumn size={22} />
            <span className="font-medium">Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/course"
            className={({ isActive }) =>
              `flex items-center gap-3 py-2 px-3 rounded-md transition-all duration-200 mt-2 ${
                isActive
                  ? "bg-gray-100 dark:bg-gray-800 font-bold"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`
            }
          >
            <SquareLibrary size={22} />
            <span className="font-medium">Courses</span>
          </NavLink>
        </div>
      </div>
      <div className="flex-1 p-10 mt-15">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
