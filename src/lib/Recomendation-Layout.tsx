
import Navbar from "../components/navbar";
import type { ReactNode } from "react";
import Recomendationbar from "@/components/recomendationBar";
import MobileToolbar from "../components/mobile-toolbar";

export default function RecomendationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-black flex text-white min-h-screen w-full flex-col md:flex-row">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <main className="flex-1 px-6 py-6 w-full md:pl-[23%] md:pr-[25%]">{children}</main>
      <div className="hidden md:block">
        <Recomendationbar />
      </div>
      <MobileToolbar />
    </div>
  );
}
