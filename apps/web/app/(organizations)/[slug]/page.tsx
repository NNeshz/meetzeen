"use client";

import { Header } from "@/modules/landing/slug/components/header";
import { Loading } from "@/modules/landing/components/loading";
import { Error } from "@/modules/landing/components/error";
import { Empty } from "@/modules/landing/components/empty";
import { useSlugQuery } from "@/modules/landing/slug/hooks/useSlugs";

import { use } from "react";
import { Services } from "@/modules/landing/slug/components/services";
import { useBookingStores } from "@/modules/landing/slug/store/useBookingStores";
import { Schedule } from "@/modules/landing/slug/components/schedule";
import { Resume } from "@/modules/landing/slug/components/resume";
import { UserData } from "@/modules/landing/slug/components/user-data";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function OrganizationPage({ params }: PageProps) {  
  const { slug } = use(params);
  const { step } = useBookingStores()
  const { data, isLoading, isError, refetch } = useSlugQuery(slug);
  
  if (isLoading) {
    return (
      <Loading 
        message={[
          "Cargando información de la organización...",
          "Obteniendo datos del perfil...",
          "Preparando la información..."
        ]}
      />
    );
  }
  
  if (isError) {
    return (
      <Error 
        message={[
          "No se pudo cargar la información de la organización",
          "Verifica tu conexión a internet",
          "La organización podría no existir"
        ]}
        retry={() => refetch()}
      />
    );
  }
  
  if (!data || !data.data) {
    return (
      <Empty 
        message={[
          "No se encontró la organización",
          "Verifica que el enlace sea correcto",
          "La organización podría haber sido eliminada"
        ]}
      />
    );
  }

  return (
    <div className="">
      <Header slugName={slug} />
      <div className="max-w-3xl mx-auto px-4">
        {step === 1 && <Services slugName={slug} />}
        {step === 2 && <Schedule />}
        {step === 3 && <Resume />}
        {step === 4 && <UserData />}
      </div>
    </div>
  );
}