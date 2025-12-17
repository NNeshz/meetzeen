"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@meetzeen/ui/components/button";
import { ThemeSwitcher } from "@meetzeen/ui/components/global/theme-switcher";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@meetzeen/ui/src/components/sheet";
import { IconMenu } from "@tabler/icons-react";
import { authClient } from "@meetzeen/auth/client";

const buttonConfigs = {
  authenticated: {
    variant: "default" as const,
    text: "Dashboard",
    href: "/dashboard",
  },
  authenticatedNoOrg: {
    variant: "default" as const,
    text: "Dashboard",
    href: "/create",
  },
  unauthenticated: {
    variant: "default" as const,
    text: "Iniciar sesión",
    href: "/auth",
  },
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const { data: organizations } = authClient.useListOrganizations();
  const isAuthenticated = !!session?.user;
  
  const currentButtonConfig = isAuthenticated
    ? organizations && organizations.length > 0
      ? buttonConfigs.authenticated
      : buttonConfigs.authenticatedNoOrg
    : buttonConfigs.unauthenticated;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background h-16">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 h-16">
        <div className="flex items-center h-full gap-4">
          <div className="hidden lg:block">
            <ThemeSwitcher />
          </div>
          <h1 className="text-2xl font-geist tracking-tighter font-semibold">
            Meetzeen
          </h1>
        </div>

        {/* Desktop Navigation - Centered */}
        <ul className="hidden lg:flex items-center gap-8 h-full absolute left-1/2 -translate-x-1/2">
          <li className="flex items-center h-full">
            <Link
              href="/"
              className="text-primary/50 hover:text-primary flex items-center h-full"
            >
              Tutorial
            </Link>
          </li>
          <li className="flex items-center h-full">
            <Link
              href="/"
              className="text-primary/50 hover:text-primary flex items-center h-full"
            >
              Servicio
            </Link>
          </li>
          <li className="flex items-center h-full">
            <Link
              href="/"
              className="text-primary/50 hover:text-primary flex items-center h-full"
            >
              Demo
            </Link>
          </li>
          <li className="flex items-center h-full">
            <Link
              href="/"
              className="text-primary/50 hover:text-primary flex items-center h-full"
            >
              Precios
            </Link>
          </li>
        </ul>

        {/* Desktop Button */}
        <div className="hidden lg:flex items-center gap-4 h-full">
          <Link
            href={currentButtonConfig.href}
            className={buttonVariants({
              variant: currentButtonConfig.variant,
              className: "h-10 flex items-center",
            })}
          >
            {currentButtonConfig.text}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Abrir menú"
            >
              <IconMenu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full sm:max-w-xl flex flex-col px-4"
          >
            <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
            <SheetDescription className="sr-only">
              Navegación principal de Meetzeen
            </SheetDescription>
            <div className="flex-1 flex items-center justify-start px-4">
              <div className="flex flex-col gap-4">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="text-primary/50 hover:text-primary text-4xl font-medium transition-colors"
                >
                  Tutorial
                </Link>
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="text-primary/50 hover:text-primary text-4xl font-medium transition-colors"
                >
                  Servicio
                </Link>
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="text-primary/50 hover:text-primary text-4xl font-medium transition-colors"
                >
                  Demo
                </Link>
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="text-primary/50 hover:text-primary text-4xl font-medium transition-colors"
                >
                  Precios
                </Link>
              </div>
            </div>

            <SheetFooter className="flex-row items-center gap-4 border-t border-border pt-4 px-0">
              <ThemeSwitcher />
              <Link
                href={currentButtonConfig.href}
                onClick={() => setIsOpen(false)}
                className={buttonVariants({
                  variant: currentButtonConfig.variant,
                  className: "flex-1",
                })}
              >
                {currentButtonConfig.text}
              </Link>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
