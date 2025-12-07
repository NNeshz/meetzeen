"use client";

import { Button } from "@meetzeen/ui/src/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@meetzeen/ui/src/components/input-group";
import { IconCopy } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

export function CompanySlug() {

  const [slug, setSlug] = useState("");

  function copyToClipboard() {
    navigator.clipboard.writeText("https://meetzeen.com/" + slug);
    toast.success("URL copiada al portapapeles");
  }

  return (
    <div className="w-full border border-border">
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-lg">Slug de la empresa</p>
            <p className="text-sm text-muted-foreground">
              Este es el slug de tu empresa. Puedes cambiarlo en cualquier
              momento.
            </p>
          </div>
          <InputGroup className="max-w-md">
            <InputGroupInput placeholder="nombre" className="pl-1!" value={slug} onChange={(e) => setSlug(e.target.value)} />
            <InputGroupAddon>
              <InputGroupText>https://meetzeen.com/</InputGroupText>
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="ghost" size="icon-xs" onClick={copyToClipboard}>
                <IconCopy />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          El slug es la manera de encontrate, hazlo memorable.
        </p>
        <Button>Guardar</Button>
      </div>
    </div>
  );
}
