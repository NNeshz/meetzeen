"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@meetzeen/ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@meetzeen/ui/components/sidebar"
import { Skeleton } from "@meetzeen/ui/components/skeleton"
import { Avatar, AvatarImage, AvatarFallback } from "@meetzeen/ui/components/avatar"
import { useAllCompanies } from "@/modules/company/hooks/use-company"
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store"

function getInitials(name: string): string {
  if (!name) return "";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";

  if (words[0]) {
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    const first = words[0]?.charAt(0) ?? '';
    const second = words[1]?.charAt(0) ?? '';
    return (first + second).toUpperCase();
  }

  return "";
}

export function TeamSwitcher() {
  const { data: companies, isLoading } = useAllCompanies()
  const { isMobile } = useSidebar()
  const { organization, setOrganization } = useDashboardStore()

  React.useEffect(() => {
    if (
      Array.isArray(companies) &&
      companies.length > 0 &&
      !organization
    ) {
      const firstCompany = companies[0]
      if (firstCompany && firstCompany.organization) {
        setOrganization({
          id: firstCompany.organization.id ?? "",
          name: firstCompany.organization.name ?? "",
          logo: firstCompany.organization.logo ?? null,
        })
      }
    }
  }, [companies, organization, setOrganization])

  if (isLoading || !organization) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <Skeleton className="size-8 rounded-lg" />
            <div className="grid flex-1 text-left text-sm leading-tight gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <ChevronsUpDown className="ml-auto opacity-50" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  const handleOrganizationChange = (org: { id: string; name: string; logo: string | null }) => {
    setOrganization({
      id: org.id,
      name: org.name,
      logo: org.logo,
    })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                {organization.logo ? (
                  <AvatarImage src={organization.logo} alt={organization.name} />
                ) : null}
                <AvatarFallback className="bg-brand text-black rounded-none">
                  {getInitials(organization.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{organization.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {companies?.find(c => c.organization.id === organization.id)?.role || ""}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Negocios
            </DropdownMenuLabel>
            {companies?.map((company, index) => (
              <DropdownMenuItem
                key={company.organization.id}
                onClick={() => handleOrganizationChange(company.organization)}
                className="gap-2 p-2"
              >
                <Avatar className="size-6 rounded-md">
                  {company.organization.logo ? (
                    <AvatarImage src={company.organization.logo} alt={company.organization.name} />
                  ) : null}
                  <AvatarFallback className="bg-brand text-black rounded-none text-xs">
                    {getInitials(company.organization.name)}
                  </AvatarFallback>
                </Avatar>
                {company.organization.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
