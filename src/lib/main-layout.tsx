import Profilebar from "../components/profilebar";
import Navbar from "../components/navbar";
import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-black flex text-white min-h-screen w-full">
      <Navbar />
      <main className="flex-1 px-4 py-3 w-full pl-[23%] pr-0 md:pr-[26%]" >{children}</main>
      <Profilebar />
    </div>
  );
}