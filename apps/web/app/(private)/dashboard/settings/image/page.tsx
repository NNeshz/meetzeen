import { ImageForm } from "@/modules/dashboard/settings/image/image-form";
import { SloganForm } from "@/modules/dashboard/settings/image/slogan-form";
import { SlugForm } from "@/modules/dashboard/settings/image/slug-form";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imagen | Meetzeen",
};

export default function ImagePage() {
  return (
    <div className="space-y-8">
      <SlugForm />
      <ImageForm />
      <SloganForm />
   </div>
  );
}