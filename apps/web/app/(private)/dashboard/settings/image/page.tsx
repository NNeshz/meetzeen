"use client";

import { ImageForm } from "@/modules/dashboard/settings/image/image-form";
import { SloganForm } from "@/modules/dashboard/settings/image/slogan-form";
import { SlugForm } from "@/modules/dashboard/settings/image/slug-form";
import { useCompanyImage } from "@/modules/dashboard/settings/hooks/useNegocio";
import { InputLoading } from "@/modules/dashboard/settings/components/input-loading";
import { Error } from "@/modules/landing/components/error";

export default function ImagePage() {
  const { data: image, isLoading, isError, refetch } = useCompanyImage();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <InputLoading />
        <InputLoading />
        <InputLoading />
      </div>
    );
  }

  if (isError) {
    return (
      <Error
        message="No se pudo cargar la configuración de la empresa."
        retry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <SlugForm slug={image?.data?.slug ?? ""} />
      <ImageForm imageUrl={image?.data?.imageUrl ?? ""} />
      <SloganForm slogan={image?.data?.slogan ?? ""} />
    </div>
  );
}
