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
import { Checkbox } from "@meetzeen/ui/components/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@meetzeen/ui/components/select";
import { toast } from "sonner";
import { Loading } from "@/modules/dashboard/components/loading";
import { Error } from "@/modules/dashboard/components/error";

import { useCreateCompany } from "@/modules/dashboard/negocio/hooks/useNegocio";

import { Negocio } from "@/modules/dashboard/negocio/types/read-negocio";

import { validateNumeric } from "@/utils/validate-numeric";
import { normalizeText } from "@/utils/normalize-text";
import { compressImage } from "@/utils/compress-image";

const HOURS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];
const MINUTES = [
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
];
const AM_PM = ["AM", "PM"];

const schema = z.object({
  image: z.union([
    z.instanceof(File, { message: "Por favor, selecciona una imagen" }),
    z.string().url("Debe ser una URL válida"),
  ]),
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre debe tener menos de 100 caracteres")
    .refine((value) => value.trim().length > 0, "El nombre es requerido"),
  slugName: z
    .string()
    .min(3, "El slug debe tener al menos 3 caracteres")
    .max(50, "El slug debe tener menos de 50 caracteres")
    .refine(
      (value) => /^[a-z0-9-]+$/.test(value),
      "El slug solo puede contener letras minúsculas, números y guiones"
    ),
  phoneNumber: z
    .string()
    .min(10, "El teléfono debe tener exactamente 10 dígitos")
    .max(10, "El teléfono debe tener exactamente 10 dígitos")
    .refine(
      (value) => /^\d{10}$/.test(value),
      "El teléfono debe contener solo números"
    ),
  slogan: z.string().optional(),
  address: z.string().optional(),
  workDays: z.array(z.string()).min(1, "Selecciona al menos un día de trabajo"),
  startHour: z.string().min(1, "Selecciona una hora de inicio"),
  startMinute: z.string().min(1, "Selecciona un minuto de inicio"),
  startAmPm: z.string().min(1, "Selecciona AM o PM"),
  endHour: z.string().min(1, "Selecciona una hora de fin"),
  endMinute: z.string().min(1, "Selecciona un minuto de fin"),
  endAmPm: z.string().min(1, "Selecciona AM o PM"),
});

type CompanyFormValues = z.infer<typeof schema>;

const DAYS_OF_WEEK = [
  { id: "monday", label: "Lunes" },
  { id: "tuesday", label: "Martes" },
  { id: "wednesday", label: "Miércoles" },
  { id: "thursday", label: "Jueves" },
  { id: "friday", label: "Viernes" },
  { id: "saturday", label: "Sábado" },
  { id: "sunday", label: "Domingo" },
];

interface CompanyFormProps {
  company?: Negocio | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

// TODO: Resolver el problema de que la hora no se pone correctamente

export function CompanyForm({
  company,
  isLoading,
  isError,
  errorMessage,
  onRetry,
}: CompanyFormProps) {
  const { mutateAsync: createCompany } = useCreateCompany();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [hasImageChanged, setHasImageChanged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slugName: "",
      phoneNumber: "",
      slogan: "",
      address: "",
      workDays: [],
      startHour: "08",
      startMinute: "00",
      startAmPm: "AM",
      endHour: "05",
      endMinute: "00",
      endAmPm: "PM",
    },
  });

  const watchName = form.watch("name");

  useEffect(() => {
    if (watchName && !company) {
      const slug = normalizeText(watchName);
      form.setValue("slugName", slug, { shouldValidate: true });
    }
  }, [watchName, form, company]);

  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name,
        slugName: company.slugName,
        phoneNumber: company.phoneNumber,
        slogan: company.slogan || "",
        address: company.address || "",
        workDays: company.workDays,
        startHour: company.startHour,
        startMinute: company.startMinute,
        startAmPm: company.startAmPm,
        endHour: company.endHour,
        endMinute: company.endMinute,
        endAmPm: company.endAmPm,
        image: company.imageUrl,
      });
      setPreviewImage(company.imageUrl);
      setHasImageChanged(false);
    }
  }, [company, form]);

  if (isLoading && !isError) {
    return (
      <div className="space-y-4">
        <Loading
          className="py-12"
          message="Verificando información de la empresa..."
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <Error
          className="py-12"
          message={
            errorMessage || "No se pudieron verificar los datos de la empresa"
          }
          retry={onRetry}
        />
      </div>
    );
  }

  async function onSubmit(values: CompanyFormValues) {
    try {
      const startTime = `${values.startHour}:${values.startMinute} ${values.startAmPm}`;
      const endTime = `${values.endHour}:${values.endMinute} ${values.endAmPm}`;

      if (startTime === endTime) {
        toast.error("La hora de inicio y fin no pueden ser iguales");
        return;
      }

      let imageToSubmit = values.image;

      if (values.image instanceof File) {
        imageToSubmit = await compressImage(values.image, 1000, 0.8);
      }

      const data = {
        name: values.name.trim(),
        image: imageToSubmit,
        slugName: values.slugName,
        phoneNumber: values.phoneNumber,
        slogan: values.slogan?.trim() || "",
        address: values.address?.trim() || "",
        workDays: values.workDays,
        startHour: values.startHour,
        startMinute: values.startMinute,
        startAmPm: values.startAmPm,
        endHour: values.endHour,
        endMinute: values.endMinute,
        endAmPm: values.endAmPm,
        hasImageChanged,
      };

      // await createCompany(data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen no puede ser mayor a 5MB");
        return;
      }

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
      setHasImageChanged(true);
    }
  }

  function handleImageClick() {
    fileInputRef.current?.click();
  }

  function removeImage() {
    setPreviewImage(null);
    form.setValue("image", undefined as any);
    form.setError("image", { message: "Por favor, selecciona una imagen" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setHasImageChanged(true);
  }

  function handlePhoneChange(
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) {
    const numericValue = validateNumeric(event.target.value);
    const limitedValue = numericValue.slice(0, 10);
    onChange(limitedValue);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          {/* Sección: Logo de la empresa */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Logo de la empresa</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Sube el logo que representará tu empresa
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-4">
                      <div
                        className="relative w-full max-w-sm aspect-square border-1 border-muted rounded-lg overflow-hidden cursor-pointer transition-colors hover:border-gray-400 group"
                        onClick={handleImageClick}
                      >
                        {previewImage ? (
                          <>
                            <Image
                              src={previewImage}
                              alt="Vista previa del logo"
                              fill
                              className="object-cover"
                            />
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
                                  className="bg-white/90 hover:bg-white text-foreground"
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
                              PNG, JPG hasta 5MB • Formato cuadrado recomendado
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
                      {company && hasImageChanged && (
                        <p className="text-sm text-amber-600 text-center">
                          ⚠️ La imagen será actualizada al guardar los cambios
                        </p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Sección: Información básica */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Información básica</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Datos principales de tu empresa
              </p>
            </div>
            
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la empresa *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Mi Empresa S.A."
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
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
                    <FormLabel>URL de la empresa</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <span className="text-sm px-3 py-1 border border-r-0 rounded-l-md bg-brand text-black">
                          meetzeen.com/
                        </span>
                        <Input
                          placeholder="mi-empresa"
                          className="rounded-l-none"
                          {...field}
                          onChange={(e) => {
                            const normalizedValue = normalizeText(e.target.value);
                            field.onChange(normalizedValue);
                          }}
                          disabled={Boolean(company)}
                        />
                      </div>
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
                name="slogan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slogan</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Tu mejor opción en servicios"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Opcional</FormDescription>
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
                      <Input
                        placeholder="Calle, número, colonia, ciudad"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Te recomendamos que ingreses la dirección desde un link de
                      Google Maps 📍
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Sección: Días de trabajo */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Días de trabajo</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Selecciona los días en que la empresa estará operando
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="workDays"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {DAYS_OF_WEEK.map((day) => (
                        <FormField
                          key={day.id}
                          control={form.control}
                          name="workDays"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={day.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, day.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== day.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  {day.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Sección: Horario de operación */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Horario de operación</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Define el horario en que tu empresa atiende
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground text-center">
                  Hora de inicio
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="startHour"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="H" />
                            </SelectTrigger>
                            <SelectContent>
                              {HOURS.map((hour) => (
                                <SelectItem key={hour} value={hour}>
                                  {hour}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startMinute"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="M" />
                            </SelectTrigger>
                            <SelectContent>
                              {MINUTES.map((minute) => (
                                <SelectItem key={minute} value={minute}>
                                  {minute}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startAmPm"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="AM/PM" />
                            </SelectTrigger>
                            <SelectContent>
                              {AM_PM.map((period) => (
                                <SelectItem key={period} value={period}>
                                  {period}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground text-center">
                  Hora de fin
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="endHour"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="H" />
                            </SelectTrigger>
                            <SelectContent>
                              {HOURS.map((hour) => (
                                <SelectItem key={hour} value={hour}>
                                  {hour}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endMinute"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="M" />
                            </SelectTrigger>
                            <SelectContent>
                              {MINUTES.map((minute) => (
                                <SelectItem key={minute} value={minute}>
                                  {minute}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endAmPm"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="AM/PM" />
                            </SelectTrigger>
                            <SelectContent>
                              {AM_PM.map((period) => (
                                <SelectItem key={period} value={period}>
                                  {period}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="pt-6 space-y-3">
            {company && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  form.reset({
                    name: company.name,
                    slugName: company.slugName,
                    phoneNumber: company.phoneNumber,
                    slogan: company.slogan || "",
                    address: company.address || "",
                    workDays: company.workDays,
                    startHour: company.startHour,
                    startMinute: company.startMinute,
                    startAmPm: company.startAmPm,
                    endHour: company.endHour,
                    endMinute: company.endMinute,
                    endAmPm: company.endAmPm,
                    image: company.imageUrl,
                  });
                  setPreviewImage(company.imageUrl);
                  setHasImageChanged(false);
                }}
                disabled={form.formState.isSubmitting}
              >
                Restaurar cambios
              </Button>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                "Guardando..."
              ) : (
                company ? "Actualizar empresa" : "Crear empresa"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
