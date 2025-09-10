import Profilebar from "../components/profilebar";
import Navbar from "../components/navbar";
import MobileToolbar from "../components/mobile-toolbar";
import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-black flex text-white min-h-screen w-full flex-col md:flex-row">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <main className="flex-1 px-4 py-3 w-full md:pl-[23%] md:pr-[26%]">{children}</main>
      <div className="hidden md:block">
        <Profilebar />
      </div>
      <MobileToolbar />
    </div>
  );
}
