import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import WorkspaceNavigation from "@/app/dashboard/WorkspaceNavigation";
import { Geist } from "next/font/google";
import { dashboardTheme } from "@/app/dashboard/styles";

const geist = Geist({ subsets: ["latin"], variable: "--font-dashboard-sans" });

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
    email: session.email || "",
  };

  return (
    <div
      className={`${dashboardTheme} ${geist.variable} font-[family-name:var(--font-dashboard-sans)] antialiased`}
    >
      <WorkspaceNavigation session={clientSession} />
      <div className="min-w-0 lg:ml-[232px]">
        <main className="mx-auto max-w-[1260px] px-4 py-7 sm:px-8 sm:py-9 lg:px-10">
          {children}
          <footer className="mt-9 flex flex-wrap justify-between gap-2 border-t border-[var(--dash-border)] pt-5 text-[11px] text-[var(--dash-dim)]">
            <span>Your knowledge. Better conversations.</span>
            <span>EchoDesk workspace</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
