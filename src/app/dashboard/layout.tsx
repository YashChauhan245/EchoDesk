import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import SidebarNav from "./SidebarNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/login");
  }

  // Ensure types are aligned
  const clientSession = {
    name: session.name || "User",
    email: session.email || ""
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f8fafc] dark:bg-[#030307] grid-bg">
      {/* Client-side navigation & mobile drawer */}
      <SidebarNav session={clientSession} />

      {/* Main Content Pane */}
      <div className="flex-1 min-w-0 lg:pl-60 pt-14 lg:pt-0">
        <main className="p-4 sm:p-6 md:p-10 max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
