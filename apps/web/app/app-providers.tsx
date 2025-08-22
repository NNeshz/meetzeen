"use client";

import type React from "react";
import type { ReactNode } from "react";
import { ThemeProvider } from "@meetzeen/ui/src/providers/theme-provider";
import { Toaster } from "@meetzeen/ui/src/components/sonner";

export const AppProviders = ({ children }: { children?: ReactNode }) => {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        themes={["light", "dark"]}
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </>
  );
};
