import { Home, Search, User, UserCheck, LogOut, Plus } from "lucide-react";
import { useAuth } from "../hooks/auth";
import { Link, useLocation } from "react-router-dom";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { Dialogform } from "./dialog-formThreads";

export default function MobileToolbar() {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 shadow-lg md:hidden z-50">
      <div className="flex items-center justify-around py-2 px-4">
        <Link
          to="/"
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            isActive("/")
              ? "text-green-500 bg-green-500/10"
              : "text-gray-400 hover:text-green-500"
          }`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          to="/search"
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            isActive("/search")
              ? "text-green-500 bg-green-500/10"
              : "text-gray-400 hover:text-green-500"
          }`}
        >
          <Search size={20} />
          <span className="text-xs mt-1">Search</span>
        </Link>

        <Dialog>
          <DialogTrigger className="flex flex-col items-center p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors">
            <Plus size={24} />
          </DialogTrigger>
          <Dialogform />
        </Dialog>

        <Link
          to="/follows"
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            isActive("/follows")
              ? "text-green-500 bg-green-500/10"
              : "text-gray-400 hover:text-green-500"
          }`}
        >
          <UserCheck size={20} />
          <span className="text-xs mt-1">Follows</span>
        </Link>

        <Link
          to="/profile"
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            isActive("/profile")
              ? "text-green-500 bg-green-500/10"
              : "text-gray-400 hover:text-green-500"
          }`}
        >
          <User size={20} />
          <span className="text-xs mt-1">Profile</span>
        </Link>

        <button
          onClick={() => logout()}
          className="flex flex-col items-center p-2 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-xs mt-1">Logout</span>
        </button>
      </div>
    </div>
  );
}
