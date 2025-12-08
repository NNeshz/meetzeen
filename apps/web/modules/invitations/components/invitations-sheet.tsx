"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@meetzeen/ui/components/sheet";
import { Button } from "@meetzeen/ui/components/button";
import { IconPlus } from "@tabler/icons-react";
import { InvitationsForm } from "@/modules/invitations/components/invitations-form";

export function InvitationsSheet({
  variant = "default",
  text,
  className,
}: {
  variant?: "default" | "outline";
  className?: string;
  text?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant={variant} className={className}>
          <IconPlus className="size-4" />
          {text}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl font-geist">
        <SheetHeader>
          <SheetTitle>Enviar Invitación</SheetTitle>
          <SheetDescription className="sr-only">
            Completa el formulario para crear una nueva invitación
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <InvitationsForm onSuccess={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
