"use client"

import * as React from "react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@meetzeen/ui/components/sidebar"

// TODO: Registrar que tipo de plan tiene el usuario

export function TeamSwitcher({
  icon: IconComponent,
  title = "Meetzeen"
}: {
  icon: React.ForwardRefExoticComponent<any>
  title?: string
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
            <IconComponent className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{title}</span>
            <span className="truncate text-xs text-sidebar-foreground/60">
              Plan Gratis
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
