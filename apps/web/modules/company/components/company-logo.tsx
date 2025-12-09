"use client";

import { useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@meetzeen/ui/components/avatar";
import { useCompany } from "@/modules/company/hooks/use-company";
import { Loader2 } from "lucide-react";

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

export function CompanyLogo({ 
  companyLogo, 
  companyName,
  onUpdate 
}: { 
  companyLogo: string | null | undefined; 
  companyName: string | null | undefined;
  onUpdate?: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadLogoAsync, isUploadingLogo } = useCompany();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadLogoAsync(file);
      onUpdate?.();
    } catch (error) {
      console.error("Error uploading logo:", error);
    } finally {
      // Reset input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const initials = getInitials(companyName || "");

  return (
    <div className="w-full border border-border">
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-lg">Logo de la empresa</p>
          <p className="text-sm text-muted-foreground">
            Este es el logo de tu empresa. Haz click para subir un nuevo logo
            desde tus archivos.
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div 
          className="relative cursor-pointer"
          onClick={handleAvatarClick}
        >
          <Avatar className="w-16 h-16 rounded-none aspect-square">
            {companyLogo ? (
              <AvatarImage src={companyLogo} alt={companyName || "Company logo"} />
            ) : null}
            <AvatarFallback className="bg-muted text-foreground rounded-none text-lg font-semibold">
              {initials || "?"}
            </AvatarFallback>
          </Avatar>
          {isUploadingLogo && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-none">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          )}
        </div>
      </div>
      <div className="p-4 text-sm text-muted-foreground">
        Un logo es opcional pero demasiado recomendado.
      </div>
    </div>
  );
}
