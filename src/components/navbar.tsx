import { Home, Search, User, LogOut } from "lucide-react";
import { useAuth } from "../hooks/auth";
import { Link } from "react-router-dom";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { Dialogform } from "./dialog-formThreads";

export default function Navbar() {
    const {logout} = useAuth()
  return (
    <aside className="bg-black left-0 top-0 w-[23%]  h-screen px-4 py-6 text-white space-y-6 fixed flex flex-col justify-between">
      <div>
        <h1 className="!text-4xl sm:!text-6xl font-bold text-green-500 mb-9">circle</h1>
      <nav className="space-y-5 mb-9">
        <Link to="/" className="flex items-center gap-3 sm:!text-xl  !text-white cursor-pointer hover:!text-green-500">
          <Home /> Home
        </Link>
        <Link to="/search" className="flex items-center gap-3 sm:!text-xl !text-white cursor-pointer hover:!text-green-500">
          <Search /> Search
        </Link>
        <Link to="/follows" className="flex items-center gap-3 sm:!text-xl !text-white cursor-pointer hover:!text-green-500">
          <User /> Follows
        </Link>
        <Link to="/profile" className="flex items-center gap-3 sm:!text-xl !text-white cursor-pointer hover:!text-green-500">
          <User /> Profile
        </Link>
      </nav>
      <Dialog>
        <DialogTrigger className="w-full dark">
          <button className=" hidden lg:block w-full !bg-green-600 !text-sm sm:!text-[18px] text-white py-2 !rounded-full hover:bg-green-700 ">Create Post</button>
          <button className=" block lg:hidden w-full !bg-green-600 !text-xl sm:!text-[20px] text-white py-2 !rounded-full hover:bg-green-700 ">+</button>
        </DialogTrigger>
        
        <Dialogform />
      </Dialog>
      </div>
      
      <div className="mt-10 flex items-center gap-2 sm:!text-xl cursor-pointer hover:text-red-400" onClick={() => logout()}>
        <LogOut /> Logout
      </div>
    </aside>
  );
}