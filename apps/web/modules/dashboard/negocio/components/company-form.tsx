"use client";

import Image from "next/image";
import { IconCamera, IconUpload, IconX } from "@tabler/icons-react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";

import { Button } from "@meetzeen/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@meetzeen/ui/components/form";
import { Input } from "@meetzeen/ui/components/input";
import { toast } from "sonner";

const schema = z.object({
  image: z.instanceof(File, { message: "Por favor, selecciona una imagen" }),
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre debe tener menos de 100 caracteres"),
  slugName: z
    .string()
    .min(3, "El slug debe tener al menos 3 caracteres")
    .max(100, "El slug debe tener menos de 100 caracteres"),
  phoneNumber: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 caracteres")
    .max(10, "El teléfono debe tener menos de 10 caracteres"),
  slogan: z.string().optional(),
  address: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof schema>;

export function CompanyForm() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(schema),
  });

  function onSubmit(values: CompanyFormValues) {
    console.log(values);
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor selecciona un archivo de imagen válido");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("image", file);
      form.clearErrors("image");
    }
  }

  function handleImageClick() {
    fileInputRef.current?.click();
  }

  function removeImage() {
    setPreviewImage(null);
    form.setValue("image", undefined as any);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Logo de la empresa
              </FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {/* Área de vista previa 4:3 */}
                  <div
                    className="relative w-full aspect-[1/1] border-2 border-dashed rounded-lg overflow-hidden cursor-pointer transition-colors group"
                    onClick={handleImageClick}
                  >
                    {previewImage ? (
                      <>
                        <Image
                          src={previewImage || "/placeholder.svg"}
                          alt="Vista previa del logo"
                          fill
                          className="object-cover"
                        />
                        {/* Overlay para remover imagen */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageClick();
                              }}
                              className="bg-white/90 hover:bg-white text-gray-900"
                            >
                              <IconUpload className="w-4 h-4 mr-1" />
                              Cambiar
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage();
                              }}
                              className="bg-red-500/90 hover:bg-red-600"
                            >
                              <IconX className="w-4 h-4 mr-1" />
                              Remover
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500 group-hover:text-gray-600 transition-colors">
                        <IconCamera className="w-12 h-12 mb-3" />
                        <p className="text-sm font-medium mb-1">
                          Haz clic para subir una imagen
                        </p>
                        <p className="text-xs text-gray-400">
                          PNG, JPG hasta 5MB • Formato 1:1
                        </p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slugName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="Slug de la empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder="Teléfono de la empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slogan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slogan</FormLabel>
              <FormControl>
                <Input placeholder="Slogan de la empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Dirección de la empresa" {...field} />
              </FormControl>
              <FormDescription>
                Te recomendamos que ingreses la dirección desde un link de Google Maps <span className="ml-1">📍</span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Guardar</Button>
      </form>
    </Form>
  );
}
