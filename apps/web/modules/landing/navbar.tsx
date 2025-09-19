"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import { Button, buttonVariants } from "@meetzeen/ui/src/components/button";
import { cn } from "@meetzeen/ui/src/lib/utils";
import { authClient } from "@meetzeen/auth/client";
import { ModeToggle } from "@/modules/landing/components/mode-toggle";

const links = [
  {
    name: "Demo",
    href: "/demo",
  },
  {
    name: "Testimonios",
    href: "/testimonios",
  },
  {
    name: "Precios",
    href: "/precios",
  },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const session = authClient.useSession();

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Header original de desktop mantenido */}
      <header className="fixed top-4 z-50 w-full flex justify-center px-4">
        <nav className="w-full max-w-7xl px-2 py-2 flex items-center justify-between backdrop-blur-xl rounded-xl overflow-hidden">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {/* ModeToggle solo en desktop */}
            <div className="hidden md:block">
              <ModeToggle />
            </div>
            <Link
              href="/"
              className="text-xl font-medium tracking-tighter flex items-center gap-2 px-2"
            >
              Meetzeen
            </Link>
          </div>

          {/* Desktop Navigation - EXACTAMENTE IGUAL */}
          <div className="hidden md:flex items-center gap-4">
            <ul className="hidden md:flex gap-8 text-muted-foreground font-medium tracking-tighter">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-foreground transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Auth button solo en desktop */}
          <div className="hidden md:block">
            {session?.data?.user ? (
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({
                    variant: "default",
                    size: "sm",
                    className: "flex items-center",
                  })
                )}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/auth"
                className={cn(
                  buttonVariants({
                    variant: "default",
                    size: "sm",
                    className: "flex items-center gap-2",
                  })
                )}
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Mobile Menu Button - Solo en mobile */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative overflow-hidden"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <X size={18} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Menu size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu - Con fondo sólido */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={closeMenu}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full bg-background border-l border-border/50 shadow-2xl md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header del panel - ALINEADO CON NAVBAR */}
                <div className="flex items-center justify-between px-4 py-2 mt-4 mx-2 h-[52px]">
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-xl font-medium tracking-tighter">
                      Meetzeen
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeMenu}
                    className="relative overflow-hidden"
                  >
                    <X size={18} />
                  </Button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 px-6 py-6">
                  <nav className="space-y-2">
                    {links.map((link, index) => (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={link.href}
                          onClick={closeMenu}
                          className="flex items-center px-4 py-3 text-xl font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </div>

                {/* Bottom Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 border-t border-border/50"
                >
                  <div className="flex gap-3">
                    <ModeToggle />

                    {/* Auth Button */}
                    {session?.data?.user ? (
                      <Link
                        href="/dashboard"
                        onClick={closeMenu}
                        className={cn(
                          buttonVariants({
                            variant: "default",
                            className: "flex-1 justify-center",
                          })
                        )}
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/auth"
                        onClick={closeMenu}
                        className={cn(
                          buttonVariants({
                            variant: "default",
                            className: "flex-1 justify-center",
                          })
                        )}
                      >
                        Iniciar sesión
                      </Link>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
