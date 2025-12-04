"use client";

import Link from "next/link";
import { Button } from "@meetzeen/ui/components/button";
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

export function Navbar() {
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
          <Button variant="default" className="h-10 flex items-center">
            <Link
              href="/"
              className="w-full h-full flex items-center justify-center"
            >
              Iniciar sesión
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Sheet>
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
          <SheetContent side="right" className="w-full sm:max-w-xl flex flex-col px-4">
            <SheetTitle className="sr-only">
              Menú de navegación
            </SheetTitle>
            <SheetDescription className="sr-only">
              Navegación principal de Meetzeen
            </SheetDescription>
            <div className="flex-1 flex items-center justify-start px-4">
              <div className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="text-primary/50 hover:text-primary text-4xl font-medium transition-colors"
                >
                  Tutorial
                </Link>
                <Link
                  href="/"
                  className="text-primary/50 hover:text-primary text-4xl font-medium transition-colors"
                >
                  Servicio
                </Link>
                <Link
                  href="/"
                  className="text-primary/50 hover:text-primary text-4xl font-medium transition-colors"
                >
                  Demo
                </Link>
                <Link
                  href="/"
                  className="text-primary/50 hover:text-primary text-4xl font-medium transition-colors"
                >
                  Precios
                </Link>
              </div>
            </div>
            
            <SheetFooter className="flex-row items-center gap-4 border-t border-border pt-4 px-0">
              <ThemeSwitcher />
              <Button variant="default" className="flex-1">
                <Link
                  href="/"
                  className="w-full h-full flex items-center justify-center"
                >
                  Iniciar sesión
                </Link>
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
