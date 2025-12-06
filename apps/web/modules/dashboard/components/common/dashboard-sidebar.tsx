"use client";

import * as React from "react";
import {
  IconCommand,
  IconSettings2,
  IconCategory,
  IconCategory2,
  IconBook,
  IconHome,
  IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "@/modules/dashboard/components/common/nav-main";
import { NavUser } from "@/modules/dashboard/components/common/nav-user";
import { NavSecondary } from "@/modules/dashboard/components/common/nav-secondary";
import { TeamSwitcher } from "@/modules/dashboard/components/common/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@meetzeen/ui/components/sidebar";

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: IconCategory,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: IconCategory2,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: IconCommand,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Inicio",
      url: "/dashboard",
      icon: IconHome,
      items: [
        {
          title: "Metrícas",
          url: "/dashboard/metrics",
        },
        {
          title: "Servicios",
          url: "/dashboard/services",
        },
        {
          title: "Historial",
          url: "/dashboard/history",
        },
      ],
    },
    {
      title: "Clientes",
      url: "/dashboard/customers",
      icon: IconUsers,
      items: [
        {
          title: "Todos",
          url: "/dashboard/customers",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: IconBook,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: IconSettings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Configuración",
      url: "/dashboard/settings",
      icon: IconSettings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
