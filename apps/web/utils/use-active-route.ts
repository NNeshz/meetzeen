"use client";

import { usePathname } from "next/navigation";

export function useActiveRoute() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Exact match for root dashboard
    if (href === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    
    // For other routes, check if pathname starts with href (but not for root dashboard)
    if (href !== "/dashboard" && pathname.startsWith(href)) {
      return true;
    }
    
    return false;
  };

  const getActiveClasses = (href: string) => {
    return isActive(href) ? "bg-brand text-black" : "";
  };

  return { isActive, getActiveClasses };
}