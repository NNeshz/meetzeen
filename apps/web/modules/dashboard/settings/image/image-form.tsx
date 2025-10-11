"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useRef, useEffect } from "react";
import { Upload, X, Camera } from "lucide-react";
import Image from "next/image";

import { Button } from "@meetzeen/ui/src/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@meetzeen/ui/src/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@meetzeen/ui/src/components/form";
import { useUpdateCompanyImage } from "@/modules/dashboard/settings/hooks/useNegocio";
import { Spinner } from "@meetzeen/ui/src/components/spinner";

const formSchema = z.object({
  image: z
    .instanceof(File, { message: "Debe ser un archivo válido" })
    .optional()
    .refine(
      (file) => !file || file.size <= 5000000,
      "El tamaño máximo de la imagen es 5MB."
    )
    .refine(
      (file) => !file || ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      "Solo se permiten archivos .jpg, .jpeg, .png y .webp."
    ),
});

export function ImageForm({ imageUrl }: { imageUrl?: string }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl ?? null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutateAsync, isPending } = useUpdateCompanyImage();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
    },
  });

  const initialImageUrl = imageUrl ?? null;
  const watchedFile = form.watch("image");
  const isUnchanged = previewUrl === initialImageUrl && !watchedFile;

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.image) return;
    await mutateAsync(values.image);
  }

  useEffect(() => {
    setPreviewUrl(imageUrl ?? null);
  }, [imageUrl]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        console.error("Por favor selecciona un archivo de imagen válido");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("image", file);
      form.clearErrors("image");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreviewUrl(null);
    form.setValue("image", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Logo de la empresa</CardTitle>
        <CardDescription>
          Esta es la imagen visible de tu empresa dentro de Meetzeen. Se recomienda usar el logo de tu empresa.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="space-y-6">
            {/* Image Upload Section */}
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-4">
                      <div
                        className="relative w-full aspect-square border-2 border-dashed border-muted-foreground/5 rounded-lg overflow-hidden cursor-pointer transition-colors hover:border-muted-foreground group"
                        onClick={handleImageClick}
                      >
                        {previewUrl ? (
                          <>
                            <Image
                              src={previewUrl}
                              alt="Vista previa de la empresa"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="flex gap-1">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageClick();
                                  }}
                                >
                                  <Upload className="w-3 h-3" />
                                  Cambiar
                                </Button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-500 group-hover:text-gray-600 transition-colors">
                            <Camera className="w-8 h-8 mb-2" />
                            <p className="text-xs font-medium text-center px-2">
                              Subir imagen
                            </p>
                            <p className="text-xs text-gray-400 text-center px-1">
                              Imagen cuadrada 1:1
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
                  <FormDescription className="text-xs text-center">
                    Formatos permitidos: JPG, PNG, WEBP.
                    <br />
                    Se recomienda una imagen cuadrada (1:1) para mejores resultados.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className="justify-end">
            <Button type="submit" disabled={isPending || isUnchanged}>
              {isPending ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}