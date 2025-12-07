import { Metadata } from "next";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/modules/dashboard/components/common/dashboard-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@meetzeen/ui/components/sidebar";
import { Separator } from "@meetzeen/ui/src/components/separator";
import {
  getSessionFromBackend,
  getOrganizationsFromBackend,
} from "@/modules/dashboard/utils/verification";

export const metadata: Metadata = {
  title: "Dashboard | Meetzeen",
  description: "Dashboard de Meetzeen",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromBackend();

  if (!session || !session.user) {
    redirect("/");
  }

  const organizations = await getOrganizationsFromBackend();

  if (organizations.length === 0) {
    redirect("/create");
  }

  return (
    <div className="font-geist">
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 block lg:hidden" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4 block lg:hidden"
              />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
