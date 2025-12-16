"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useVerifyInvitation,
  useAcceptInvitation,
} from "@/modules/invitations/hooks/use-invitations";
import { Button } from "@meetzeen/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@meetzeen/ui/components/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@meetzeen/ui/components/alert";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Mail,
  Building2,
  User,
} from "lucide-react";

export default function AcceptInvitationPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Leer el token de la URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get("token");
      setToken(tokenParam);
      setIsInitializing(false);

      if (!tokenParam) {
        setError("No se proporcionó un token de invitación");
      }
    }
  }, []);

  const {
    data: invitationData,
    isLoading: isVerifying,
    error: verifyError,
  } = useVerifyInvitation(token);

  const {
    acceptInvitation,
    isPending: isAccepting,
    isSuccess: isAccepted,
  } = useAcceptInvitation();

  const handleAccept = () => {
    if (!token) return;
    setError(null);
    acceptInvitation(token, {
      onError: (err: Error) => {
        setError(err.message || "Error al aceptar la invitación");
      },
      onSuccess: () => {
        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      },
    });
  };

  // Mostrar loader mientras se inicializa
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Cargando...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error: No hay token
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>Token no encontrado</AlertTitle>
              <AlertDescription>
                No se proporcionó un token de invitación válido. Por favor,
                verifica el enlace que recibiste por correo.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificando invitación
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Verificando invitación...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error al verificar
  if (verifyError || !invitationData) {
    const errorMessage =
      verifyError instanceof Error
        ? verifyError.message
        : "Error al verificar la invitación";

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>No se pudo verificar la invitación</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invitación inválida
  if (!invitationData.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md rounded-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Invitación inválida
            </CardTitle>
            <CardDescription>{invitationData.message}</CardDescription>
          </CardHeader>
          <CardContent className="rounded-none">
            <Alert variant="destructive">
              <AlertTitle>Esta invitación no está disponible</AlertTitle>
              <AlertDescription>
                {invitationData.message ||
                  "La invitación ha expirado o ya fue utilizada."}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invitación aceptada exitosamente
  if (isAccepted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              ¡Invitación aceptada!
            </CardTitle>
            <CardDescription>Redirigiendo al dashboard...</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>¡Bienvenido!</AlertTitle>
              <AlertDescription>
                Has sido agregado exitosamente a{" "}
                {invitationData.organization?.name || "la organización"}. Serás
                redirigido al dashboard en breve.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vista principal: Mostrar detalles de la invitación
  const { invitation, organization, inviter } = invitationData;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-b from-background to-muted/20">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Invitación a unirte</CardTitle>
          <CardDescription>
            Has sido invitado a formar parte de una organización
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {organization && (
            <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">{organization.name}</p>
                {organization.logo && (
                  <p className="text-sm text-muted-foreground">Organización</p>
                )}
              </div>
            </div>
          )}

          {invitation && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Rol asignado</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {invitation.role || "Empleado"}
                  </p>
                </div>
              </div>

              {inviter && (
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Invitado por</p>
                    <p className="text-sm text-muted-foreground">
                      {inviter.name || inviter.email}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            onClick={handleAccept}
            disabled={isAccepting}
            className="w-full"
            size="lg"
          >
            {isAccepting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Aceptando...
              </>
            ) : (
              "Aceptar Invitación"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full"
          >
            Cancelar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
