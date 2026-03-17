import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";
import { MobileNav } from "@/components/shared/MobileNav";
import { KeyboardShortcutsProvider } from "@/components/shared/KeyboardShortcutsProvider";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile for navbar data
  const { data: profile } = await supabase
    .from("profiles")
    .select("prep_start_date, daily_streak")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          prepStartDate={profile?.prep_start_date}
          streak={profile?.daily_streak ?? 0}
        />
        <main className="flex-1 overflow-auto px-6 pt-4 pb-24 md:px-10 md:pt-4 md:pb-12 bg-background">
          <div className="mx-auto max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
      <KeyboardShortcutsProvider />
    </div>
  );
}
