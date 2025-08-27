import { DashboardSidebar } from "@/modules/dashboard/components/dashboard-sidebar";
import { HeaderBreadcrumb } from "@/modules/dashboard/components/header-breadcrumb";
import { SidebarInset, SidebarProvider } from "@meetzeen/ui/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <HeaderBreadcrumb />
          <div className="px-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
