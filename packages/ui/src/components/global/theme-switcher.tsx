"use client";

import * as React from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";

import { Button } from "@meetzeen/ui/src/components/button";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      size="icon"
      className="bg-brand text-black hover:bg-brand/90"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? <IconSun /> : <IconMoon />}
    </Button>
  );
}