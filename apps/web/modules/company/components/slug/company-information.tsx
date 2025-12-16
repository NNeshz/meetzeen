import {
  IconMapPin,
  IconClock,
  IconWorld,
  IconCurrencyDollar,
  IconCalendar,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconBrandTiktok,
  IconShare3,
} from "@tabler/icons-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@meetzeen/ui/components/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@meetzeen/ui/components/drawer";
import { Button } from "@meetzeen/ui/components/button";
import { useIsMobile } from "@meetzeen/ui/src/hooks/use-mobile";
import { toast } from "sonner";

interface CompanyData {
  id: string;
  name: string;
  timezone: string | null;
  currency: string | null;
  slug: string | null;
  logo: string | null;
  workdays: number[] | null;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  facebookLink: string | null;
  instagramLink: string | null;
  whatsappLink: string | null;
  tiktokLink: string | null;
}

const DAYS_OF_WEEK = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

function isGoogleMapsUrl(url: string | null): boolean {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname.toLowerCase();

    return (
      (hostname.includes("google.com") || hostname.includes("maps.google")) &&
      (pathname.includes("/maps") ||
        urlObj.searchParams.has("q") ||
        urlObj.searchParams.has("ll") ||
        url.includes("maps.google.com") ||
        url.includes("goo.gl/maps") ||
        url.includes("maps.app.goo.gl"))
    );
  } catch {
    // Si no es una URL válida, verificar si contiene texto relacionado con Google Maps
    return (
      url.toLowerCase().includes("maps.google") ||
      url.toLowerCase().includes("goo.gl/maps")
    );
  }
}

function formatWorkdays(workdays: number[] | null): string {
  if (!workdays || workdays.length === 0) return "No especificado";

  const sortedDays = [...workdays].sort((a, b) => a - b);
  const dayNames = sortedDays.map((day) => DAYS_OF_WEEK[day]);

  if (dayNames.length === 7) return "Todos los días";
  if (dayNames.length === 5 && sortedDays.every((d) => d >= 1 && d <= 5)) {
    return "Lunes a Viernes";
  }

  return dayNames.join(", ");
}

function formatTime(time: string | null): string {
  if (!time) return "No especificado";
  return time;
}

function CompanyInformationContent({
  companyData,
}: {
  companyData: CompanyData;
}) {
  const locationIsGoogleMaps = isGoogleMapsUrl(companyData.location);

  return (
    <div className="p-4 space-y-4">
      {/* Horarios de trabajo */}
      {(companyData.workdays ||
        companyData.startTime ||
        companyData.endTime) && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <IconCalendar className="w-4 h-4" />
            <span>Horarios de trabajo</span>
          </div>
          <div className="pl-6 space-y-1 text-sm">
            <div>
              <span className="text-muted-foreground">Días: </span>
              <span>{formatWorkdays(companyData.workdays)}</span>
            </div>
            {(companyData.startTime || companyData.endTime) && (
              <div className="flex items-center gap-2">
                <IconClock className="w-4 h-4 text-muted-foreground" />
                <span>
                  {formatTime(companyData.startTime)} -{" "}
                  {formatTime(companyData.endTime)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ubicación */}
      {companyData.location && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <IconMapPin className="w-4 h-4" />
            <span>Ubicación</span>
          </div>
          <div className="pl-6">
            {locationIsGoogleMaps ? (
              <Link
                href={companyData.location}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {companyData.location}
              </Link>
            ) : (
              <p className="text-sm">{companyData.location}</p>
            )}
          </div>
        </div>
      )}

      {/* Zona horaria */}
      {companyData.timezone && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <IconWorld className="w-4 h-4" />
            <span>Zona horaria</span>
          </div>
          <div className="pl-6">
            <p className="text-sm">{companyData.timezone}</p>
          </div>
        </div>
      )}

      {/* Moneda */}
      {companyData.currency && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <IconCurrencyDollar className="w-4 h-4" />
            <span>Moneda</span>
          </div>
          <div className="pl-6">
            <p className="text-sm">{companyData.currency}</p>
          </div>
        </div>
      )}

      {/* Redes sociales */}
      {(companyData.facebookLink ||
        companyData.instagramLink ||
        companyData.whatsappLink ||
        companyData.tiktokLink) && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>Redes sociales</span>
          </div>
          <div className="pl-6 flex flex-wrap gap-3">
            {companyData.facebookLink && (
              <Link
                href={companyData.facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <IconBrandFacebook className="w-4 h-4" />
                <span>Facebook</span>
              </Link>
            )}
            {companyData.instagramLink && (
              <Link
                href={companyData.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <IconBrandInstagram className="w-4 h-4" />
                <span>Instagram</span>
              </Link>
            )}
            {companyData.whatsappLink && (
              <Link
                href={companyData.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <IconBrandWhatsapp className="w-4 h-4" />
                <span>WhatsApp</span>
              </Link>
            )}
            {companyData.tiktokLink && (
              <Link
                href={companyData.tiktokLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <IconBrandTiktok className="w-4 h-4" />
                <span>TikTok</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function CompanyInformation({
  companyData,
}: {
  companyData: CompanyData;
}) {
  const isMobile = useIsMobile();

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = companyData?.name
    ? `Agenda tu cita en ${companyData.name}:\n${shareUrl}`
    : `Agenda tu cita aquí:\n${shareUrl}`;

  const handleShareCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success("URL copiada al portapapeles correctamente", {
        position: "top-center",
      });
    } catch (err) {
      toast.error("Error al copiar la URL al portapapeles", {
        position: "top-center",
      });
    }
  };

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button>Información</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Información de la compañía</DrawerTitle>
            <DrawerDescription>
              Información de {companyData.name}
            </DrawerDescription>
          </DrawerHeader>
          <CompanyInformationContent companyData={companyData} />
          <DrawerFooter>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleShareCopy}
            >
              Compartir
              <IconShare3 className="ml-2 h-4 w-4" />
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Información</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Información de la compañía</SheetTitle>
          <SheetDescription>Información de {companyData.name}</SheetDescription>
        </SheetHeader>
        <CompanyInformationContent companyData={companyData} />
        <SheetFooter>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleShareCopy}
          >
            Compartir
            <IconShare3 className="ml-2 h-4 w-4" />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
