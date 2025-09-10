"use client";

import * as React from "react";
import {
  IconCalendar,
  IconHome,
  IconBrandAppgallery,
  IconHistory,
  IconBuilding,
  IconCategory,
  IconUserCog,
  IconHeartHandshake,
  IconUserBolt,
} from "@tabler/icons-react";

import { NavMain } from "@/modules/dashboard/components/nav-main";
import { NavUser } from "@/modules/dashboard/components/nav-user";
import { TeamSwitcher } from "@/modules/dashboard/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@meetzeen/ui/components/sidebar";
import { NavCitas } from "@/modules/dashboard/components/nav-citas";
import { NavConfig } from "@/modules/dashboard/components/nav-config";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Inicio",
      url: "/dashboard",
      icon: IconHome,
    },
    {
      title: "Clientes",
      url: "/dashboard/clientes",
      icon: IconUserBolt,
    }
  ],
  navCitas: [
    {
      title: "Citas",
      url: "/dashboard/calendario",
      icon: IconCalendar,
    },
    {
      title: "Historial",
      url: "/dashboard/historial",
      icon: IconHistory,
    },
  ],
  navConfig: [
    {
      title: "Negocio",
      url: "/dashboard/negocio",
      icon: IconBuilding,
    },
    {
      title: "Categorias",
      url: "/dashboard/categorias",
      icon: IconCategory,
    },
    {
      title: "Equipo",
      url: "/dashboard/equipo",
      icon: IconUserCog,
    },
    {
      title: "Servicios",
      url: "/dashboard/servicios",
      icon: IconHeartHandshake,
    },
  ],
};

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <TeamSwitcher icon={IconBrandAppgallery} title="Meetzeen" />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavCitas items={data.navCitas} />
        <NavConfig items={data.navConfig} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
