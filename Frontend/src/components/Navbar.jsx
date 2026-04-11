import {
  GraduationCap,
  LayoutDashboard,
  LogOutIcon,
  Menu,
  School,
  UserCog,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";

import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";
import Darkmode from "@/Darkmode";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";


function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  
  const navigate = useNavigate();

  const [logoutUser,{data,isSuccess}] = useLogoutUserMutation();


  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message||"User Logout Successfully")
    }
  }, [isSuccess])

  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-50">
      <div className="mx-auto max-w-8xl px-6 hidden md:flex items-center justify-between gap-2 h-full mr-auto">
        <div className="flex items-center gap-2">
          <School size={"30"} className="text-gray-900 dark:text-white" />
          <Link to="/"><h1 className="hidden md:block font-extrabold text-2xl text-gray-900 dark:text-white hover:text-black dark:hover:text-white">LMS</h1></Link>
        </div>

        {/* right side part of navbar */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="flex gap-1.5 items-center justify-center mt-2">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => navigate("/my-learning")}> 
                  <GraduationCap />
                  My Learning
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <UserCog />
                  Edit Profile
                </DropdownMenuItem>
                {user?.role === "instructor" && (
                  <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
                    <LayoutDashboard />
                    Dashboard
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  <LogOutIcon />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div>
              <Link to="/login">
                <Button variant="outline" className="mr-2">
                  Login
                </Button>
              </Link>
              <Link to="/login">
                <Button>Signup</Button>
              </Link>
            </div>
          )}
          <Darkmode />
        </div>
      </div>
      {/* Mobile device */}
      <div className="flex md:hidden items-center justify-between h-full px-4">
        <div className="flex items-center gap-2">
          <School size={"30"} className="text-gray-900 dark:text-white" />
          <h1 className="font-extrabold text-2xl text-gray-900 dark:text-white">LMS</h1>
        </div>
        <div className="flex items-center gap-2">
          <Darkmode />
          <MobileNavbar user={user} isAuthenticated={isAuthenticated} />
        </div>
      </div>
    </div>
  );
}

export default Navbar;

const MobileNavbar = ({ user, isAuthenticated }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-background">
        <div className="border-b dark:border-gray-700 pb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Menu</h2>
        </div>

        {isAuthenticated ? (
          <div className="flex flex-col flex-1 gap-6 mt-6">
            {/* User Profile Section */}
            <div className="flex items-center gap-3 pb-4 border-b dark:border-gray-700">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} alt={user?.name || "User"} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{user?.name || "User"}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{user?.email || ""}</span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-1">
              <Button
                variant="ghost"
                className="justify-start gap-3 h-12 text-base"
              >
                <GraduationCap className="h-5 w-5" />
                <span onClick={() => navigate("/my-learning")}>My Learning</span>
              </Button>
              <Button
                variant="ghost"
                className="justify-start gap-3 h-12 text-base"
              >
                <UserCog className="h-5 w-5" />
                <span onClick={() => navigate("/profile")}>Edit Profile</span>
              </Button>
              {user?.role === "instructor" && (
                <Button
                  variant="ghost"
                  className="justify-start gap-3 h-12 text-base"
                  onClick={() => navigate("/admin/dashboard")}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Button>
              )}
            </nav>

            {/* Logout Button */}
            <div className="mt-auto pb-4">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-base text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={handleLogout}
              >
                <LogOutIcon className="h-5 w-5" />
                Log out
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Sign in to access your courses and profile
            </p>
            <Link to="/login">
              <Button className="w-full" size="lg">
                Login
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="w-full" size="lg">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
