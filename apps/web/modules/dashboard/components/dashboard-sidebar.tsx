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
  IconSettings,
  IconColorSwatch,
  IconPalette,
  IconAddressBook,
  IconLinkPlus,
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
import { NavBusiness } from "@/modules/dashboard/components/nav-business";

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
  navBusiness: [
    {
      title: "Categorias",
      url: "/dashboard/categories",
      icon: IconCategory,
    },
    {
      title: "Equipo",
      url: "/dashboard/team",
      icon: IconUserCog,
    },
    {
      title: "Servicios",
      url: "/dashboard/services",
      icon: IconHeartHandshake,
    }
  ],
  navConfig: [
    {
      title: "General",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Imagen",
      url: "/dashboard/settings/image",
      icon: IconPalette,
    },
    {
      title: "Contacto",
      url: "/dashboard/settings/contact",
      icon: IconAddressBook,
    },
    {
      title: "Sociales",
      url: "/dashboard/settings/socials",
      icon: IconLinkPlus,
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
        <NavBusiness items={data.navBusiness} />
        <NavConfig items={data.navConfig} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
