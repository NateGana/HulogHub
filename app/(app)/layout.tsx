"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { useAppData } from "@/context/AppDataContext";
import { LoadingState } from "@/components/ui/LoadingState";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useAppData();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:pb-10">
          {loading ? <LoadingState label="Loading your dashboard..." /> : children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
