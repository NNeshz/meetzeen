"use client";

import { Header } from "@/modules/landing/slug/components/header";
import { BookingStepper } from "@/modules/landing/slug/components/booking-stepper";
import { Loading } from "@/modules/landing/components/loading";
import { Error } from "@/modules/landing/components/error";
import { Empty } from "@/modules/landing/components/empty";
import { useSlugQuery } from "@/modules/landing/slug/hooks/useSlugs";

import { use } from "react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function OrganizationPage({ params }: PageProps) {  
  const { slug } = use(params);
  const { data, isLoading, isError, refetch } = useSlugQuery(slug);
  
  // Estado de carga
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
  
  // Estado de error
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
  
  // Estado vacío (no se encontró la organización)
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
      <div className="max-w-6xl mx-auto px-4">
        <BookingStepper slugName={slug} />
      </div>
    </div>
  );
}