"use client";

import type React from "react";
import type { ReactNode } from "react";
import { ThemeProvider } from "@meetzeen/ui/src/providers/theme-provider";
import { Toaster } from "@meetzeen/ui/src/components/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const AppProviders = ({ children }: { children?: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: 1000 * 60 * 5,
      },
    },
  });

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        themes={["light", "dark", "system"]}
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <Toaster />
      </ThemeProvider>
    </>
  );
};
