"use client";

import { useSlugQuery } from "@/modules/landing/slug/hooks/useSlugs";
import {
  IconPhone,
  IconMapPin,
  IconClock,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandX,
  IconCalendar,
  IconInfoCircle,
} from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@meetzeen/ui/src/components/button";
import { Badge } from "@meetzeen/ui/src/components/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@meetzeen/ui/src/components/sheet";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@meetzeen/ui/src/components/avatar";
import { boolean } from "better-auth";

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  imageUrl: string | null;
  phoneNumber: string;
  slogan: string;
  address: string;
  workDays: string[];
  startHour: string;
  startMinute: string;
  startAmPm: string;
  endHour: string;
  endMinute: string;
  endAmPm: string;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  twitterX: string | null;
}

interface ApiResponse {
  status: number;
  message: string;
  data: Organization;
}

export function Header({ slugName }: { slugName: string }) {
  const { data, isLoading, isError } = useSlugQuery(slugName);

  if (isLoading || isError || !data) {
    return null;
  }

  const organization = (data as ApiResponse).data;

  const socialLinks = [
    {
      icon: IconBrandFacebook,
      url: organization.facebook,
      label: "Facebook",
      color: "text-blue-600",
    },
    {
      icon: IconBrandInstagram,
      url: organization.instagram,
      label: "Instagram",
      color: "text-pink-600",
    },
    {
      icon: IconBrandTiktok,
      url: organization.tiktok,
      label: "TikTok",
      color: "text-black",
    },
    {
      icon: IconBrandX,
      url: organization.twitterX,
      label: "X (Twitter)",
      color: "text-gray-900",
    },
  ].filter((link) => link.url);

  function isGoogleMapsUrl(url: string | undefined): boolean {
    if (!url) {
      return false;
    }

    return url.includes('maps.google.com') || url.includes('www.google.com/maps') || url.includes("maps.app.goo.gl");
  }

  return (
    <div className="w-full">
      <section className="max-w-3xl mx-auto px-4 mt-4">
        {/* Imagen más nombre*/}
        <div className="flex flex-col w-full">
          <div className="flex flex-col md:flex-row items-center md:items-center w-full md:justify-between">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Avatar className="w-24 h-24 md:w-20 md:h-20 rounded">
                <AvatarImage
                  src={organization.imageUrl || ""}
                  className="w-full h-full object-cover"
                />
                <AvatarFallback className="w-24 h-24 md:w-20 md:h-20 rounded">{organization.name}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <p className="text-2xl font-bold">{organization.name}</p>
                <p className="text-muted-foreground">{organization.slogan}</p>
              </div>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-fit mt-4 md:mt-0"
                  size={"sm"}
                >
                  Ver información <IconInfoCircle className="w-4 h-4 ml-2" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-xl">
                <SheetHeader>
                  <SheetTitle>Conoce más de {organization.name}</SheetTitle>
                  <SheetDescription>{organization.slogan}</SheetDescription>
                </SheetHeader>
                <div className="px-4 space-y-8">
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">
                      Información General:
                    </p>
                    <div className="flex flex-col">
                      <p className="text-sm text-muted-foreground flex items-center">
                        <IconPhone className="w-4 h-4 inline-block mr-2" />{" "}
                        Telefono
                      </p>
                      <p className="text-sm">{organization.phoneNumber}</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm text-muted-foreground flex items-center">
                        <IconMapPin className="w-4 h-4 inline-block mr-2" />{" "}
                        Dirección:
                      </p>
                      {isGoogleMapsUrl(organization.address) ? (
                        <Link
                          href={organization.address}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                        >
                          Ver en Google Maps
                        </Link>
                      ) : (
                        <p className="text-sm">{organization.address}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">Horarios:</p>
                    {organization?.workDays?.length > 0 ? (
                      <>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground flex items-center">
                            <IconCalendar className="w-4 h-4 inline-block mr-2" />{" "}
                            Días Laborales
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {organization?.workDays.map((day) => {
                              const spanishDays: { [key: string]: string } = {
                                monday: "Lunes",
                                tuesday: "Martes",
                                wednesday: "Miércoles",
                                thursday: "Jueves",
                                friday: "Viernes",
                                saturday: "Sábado",
                                sunday: "Domingo",
                              };
                              return (
                                <Badge key={day} className="text-sm">
                                  {spanishDays[day]}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground flex items-center">
                            <IconClock className="w-4 h-4 inline-block mr-2" />{" "}
                            Horario General
                          </p>
                          <p className="text-sm">
                            {organization.startHour}:{organization.startMinute}{" "}
                            {organization.startAmPm} - {organization.endHour}:
                            {organization.endMinute} {organization.endAmPm}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm">No hay horarios disponibles</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">Redes Sociales:</p>
                    {socialLinks.length > 0 ? (
                      <div className="flex flex-wrap gap-4">
                        {socialLinks.map((social) => {
                          const Icon = social.icon;
                          return (
                            <Link
                              key={social.label}
                              href={social.url || ""}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-2 hover:opacity-80 ${social.color}`}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="text-sm">{social.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No hay redes sociales registradas
                      </p>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </section>
    </div>
  );
}
