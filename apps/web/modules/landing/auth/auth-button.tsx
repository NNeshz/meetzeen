"use client";

import { signInWithGoogle } from "@/utils/auth-connection";
import { Button } from "@meetzeen/ui/components/button";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { toast } from "sonner";

export function AuthButton() {
  const onSubmit = async () => {
    try {
      const response = await signInWithGoogle();

      if (!response.url) {
        toast.error("Error al iniciar sesión", {
          description: "No se pudo iniciar sesión con Google",
        });
        return;
      }
    } catch (error) {
      console.error("Error en login:", error);
      toast.error("Error al iniciar sesión", {
        description: "Verifica tus credenciales e intenta de nuevo",
      });
    }
  };
  return (
    <Button onClick={onSubmit}>
      <IconBrandGoogleFilled />
      Iniciar sesión con Google
    </Button>
  );
}
