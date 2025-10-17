"use client";

import type React from "react";

import Image from "next/image";
import { IconCamera, IconUpload, IconX } from "@tabler/icons-react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef, useEffect } from "react";

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
import { Badge } from "@meetzeen/ui/components/badge";

import { useUpdateEmployeeMutation } from "@/modules/dashboard/equipo/hooks/useEquipo";

import { validateNumeric } from "@/utils/validate-numeric";
import { compressImage } from "@/utils/compress-image";
import { ButtonGroup } from "@meetzeen/ui/src/components/button-group";

interface Categoria {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  phoneNumber: string;
  imageUrl: string | null;
  categories: {
    name: string;
    id: string;
  }[];
}

const schema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre debe tener menos de 100 caracteres")
    .refine((value) => value.trim().length > 0, "El nombre es requerido"),
  phoneNumber: z
    .string()
    .min(10, "El teléfono debe tener exactamente 10 dígitos")
    .max(10, "El teléfono debe tener exactamente 10 dígitos")
    .refine(
      (value) => /^\d{10}$/.test(value),
      "El teléfono debe contener solo números"
    ),
  email: z
    .string()
    .email("Ingresa un correo electrónico válido")
    .min(1, "El correo electrónico es requerido"),
  image: z
    .instanceof(File, { message: "Debe ser un archivo válido" })
    .optional(),
  categoryIds: z.array(z.string()).min(1, "Selecciona al menos una categoría"),
});

type EmployeeFormValues = z.infer<typeof schema>;

interface EquipoUpdateProps {
  categories: Categoria[];
  employee: Employee;
  onSuccess?: () => void;
}

export function EquipoUpdate({
  categories,
  employee,
  onSuccess,
}: EquipoUpdateProps) {
  const { mutateAsync: updateEmployee, isPending } =
    useUpdateEmployeeMutation();
  const [previewImage, setPreviewImage] = useState<string | null>(
    employee.imageUrl
  );
  const [hasImageChanged, setHasImageChanged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: employee.name,
      phoneNumber: employee.phoneNumber,
      email: employee.email,
      categoryIds: employee.categories.map((cat) => cat.id),
    },
  });

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const value = validateNumeric(e.target.value);
    onChange(value);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error(
          "Tipo de archivo no válido. Solo se permiten JPEG, PNG y WebP."
        );
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("El archivo es demasiado grande. Máximo 10MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
        setHasImageChanged(true);
      };
      reader.readAsDataURL(file);
      form.setValue("image", file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setHasImageChanged(true);
    form.setValue("image", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function onSubmit(values: EmployeeFormValues) {
    try {
      console.log(values);

      let imageToSubmit: File | string | undefined = values.image;

      if (values.image instanceof File) {
        imageToSubmit = await compressImage(values.image, 1000, 0.8);
      } else if (!hasImageChanged) {
        // Si no ha cambiado la imagen, mantener la URL actual
        imageToSubmit = employee.imageUrl || undefined;
      } else if (hasImageChanged && !values.image) {
        // Si se removió la imagen
        imageToSubmit = undefined;
      }

      const data = {
        name: values.name.trim(),
        phoneNumber: values.phoneNumber,
        email: values.email.trim(),
        image: imageToSubmit,
        categoryIds: values.categoryIds,
        hasImageChanged,
      };

      await updateEmployee({ id: employee.id, employeeData: data });

      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="max-w-2xl mx-auto pb-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Juan Pérez García" {...field} />
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
                <FormLabel>Teléfono *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="1234567890"
                    {...field}
                    onChange={(e) => handlePhoneChange(e, field.onChange)}
                    maxLength={10}
                  />
                </FormControl>
                <FormDescription>
                  Ingresa 10 dígitos sin espacios ni guiones
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="juan.perez@ejemplo.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categorías *</FormLabel>
                <FormControl>
                  <div
                    className="overflow-x-auto scrollbar-hide"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <style jsx>{`
                      div::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                    <div className="min-w-max">
                      <ButtonGroup>
                        <ButtonGroup>
                          {categories.map((category) => {
                            const isSelected = field.value.includes(
                              category.id
                            );
                            return (
                              <Button
                                key={category.id}
                                type="button"
                                className={`flex-none whitespace-nowrap ${
                                  isSelected
                                    ? "bg-brand text-black hover:bg-brand/90 border-brand"
                                    : ""
                                }`}
                                variant={isSelected ? "default" : "outline"}
                                onClick={() => {
                                  const newValue = isSelected
                                    ? field.value.filter(
                                        (id) => id !== category.id
                                      )
                                    : [...field.value, category.id];
                                  field.onChange(newValue);
                                }}
                              >
                                {category.name}
                              </Button>
                            );
                          })}
                        </ButtonGroup>
                      </ButtonGroup>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormControl>
                  <div className="space-y-4">
                    <div
                      className="relative w-full aspect-square border-2 border-dashed border-muted rounded-lg overflow-hidden cursor-pointer transition-colors hover:border-gray-400 group"
                      onClick={handleImageClick}
                    >
                      {previewImage ? (
                        <>
                          <Image
                            src={previewImage}
                            alt="Vista previa del empleado"
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
                                className="bg-white/90 hover:bg-white text-foreground text-xs px-2 py-1"
                              >
                                <IconUpload className="w-3 h-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage();
                                }}
                                className="bg-red-500/90 hover:bg-red-600 text-xs px-2 py-1"
                              >
                                <IconX className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 group-hover:text-gray-600 transition-colors">
                          <IconCamera className="w-8 h-8 mb-2" />
                          <p className="text-xs font-medium text-center px-2">
                            Subir foto
                          </p>
                          <p className="text-xs text-gray-400 text-center px-1">
                            Opcional
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

          <div className="flex justify-end pt-6">
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Actualizando..." : "Actualizar empleado"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
