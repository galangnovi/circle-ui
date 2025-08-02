
import Navbar from "../components/navbar";
import type { ReactNode } from "react";
import Recomendationbar from "@/components/recomendationBar";

export default function RecomendationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-black flex text-white min-h-screen w-full">
      <Navbar />
      <main className="flex-1 px-6 py-6 w-full pl-[23%] pr-0 md:pr-[25%]">{children}</main>
      <Recomendationbar />
    </div>
  );
}