"use client";

import type React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef, useEffect } from "react";

import Image from "next/image";
import {
  IconCamera,
  IconUpload,
  IconX,
  IconCheck,
  IconClipboard,
} from "@tabler/icons-react";

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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@meetzeen/ui/components/input-group";
import { ButtonGroup } from "@meetzeen/ui/components/button-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@meetzeen/ui/components/select";
import { toast } from "sonner";

import { validateNumeric } from "@/utils/validate-numeric";
import { normalizeText } from "@/utils/normalize-text";
import { compressImage } from "@/utils/compress-image";

// Lista de códigos de país más comunes en América Latina
const COUNTRY_CODES = [
  { code: "+52", country: "MX", label: "México (+52)", emoji: "🇲🇽" },
  { code: "+1", country: "US", label: "Estados Unidos (+1)", emoji: "🇺🇸" },
  { code: "+54", country: "AR", label: "Argentina (+54)", emoji: "🇦🇷" },
  { code: "+56", country: "CL", label: "Chile (+56)", emoji: "🇨🇱" },
  { code: "+57", country: "CO", label: "Colombia (+57)", emoji: "🇨🇴" },
  { code: "+51", country: "PE", label: "Perú (+51)", emoji: "🇵🇪" },
  { code: "+598", country: "UY", label: "Uruguay (+598)", emoji: "🇺🇾" },
  { code: "+595", country: "PY", label: "Paraguay (+595)", emoji: "🇵🇾" },
  { code: "+591", country: "BO", label: "Bolivia (+591)", emoji: "🇧🇴" },
  { code: "+593", country: "EC", label: "Ecuador (+593)", emoji: "🇪🇨" },
  { code: "+58", country: "VE", label: "Venezuela (+58)", emoji: "🇻🇪" },
  { code: "+507", country: "PA", label: "Panamá (+507)", emoji: "🇵🇦" },
  { code: "+506", country: "CR", label: "Costa Rica (+506)", emoji: "🇨🇷" },
  { code: "+502", country: "GT", label: "Guatemala (+502)", emoji: "🇬🇹" },
  { code: "+503", country: "SV", label: "El Salvador (+503)", emoji: "🇸🇻" },
  { code: "+504", country: "HN", label: "Honduras (+504)", emoji: "🇭🇳" },
  { code: "+505", country: "NI", label: "Nicaragua (+505)", emoji: "🇳🇮" },
  {
    code: "+1809",
    country: "DO",
    label: "Rep. Dominicana (+1809)",
    emoji: "🇩🇴",
  },
] as const;

const basicInfoSchema = z.object({
  image: z.union([
    z.instanceof(File, { message: "Por favor, selecciona una imagen" }),
    z.string().url("Debe ser una URL válida"),
  ]),
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre debe tener menos de 100 caracteres")
    .refine((value) => value.trim().length > 0, "El nombre es requerido"),
  slug: z
    .string()
    .min(3, "El slug debe tener al menos 3 caracteres")
    .max(50, "El slug debe tener menos de 50 caracteres")
    .refine(
      (value) => /^[a-z0-9-]+$/.test(value),
      "El slug solo puede contener letras minúsculas, números y guiones"
    ),
  countryCode: z.string().min(1, "Selecciona un código de país"),
  phone: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 dígitos")
    .max(15, "El teléfono debe tener máximo 15 dígitos")
    .refine(
      (value) => /^\d+$/.test(value),
      "El teléfono debe contener solo números"
    ),
  slogan: z.string().optional(),
});

type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;

interface BasicInfoFormProps {
  onSubmit?: (values: BasicInfoFormValues) => void;
  initialData?: Partial<BasicInfoFormValues>;
}

export function BasicInfoForm({ onSubmit, initialData }: BasicInfoFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [hasImageChanged, setHasImageChanged] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: "",
      slug: "",
      countryCode: "+52", // México por defecto
      phone: "",
      slogan: "",
      ...initialData,
    },
  });

  const watchName = form.watch("name");
  const watchSlug = form.watch("slug");

  // Auto-generar slug basado en el nombre
  useEffect(() => {
    if (watchName && !initialData?.slug) {
      const slug = normalizeText(watchName);
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [watchName, form, initialData?.slug]);

  // Establecer imagen inicial si existe
  useEffect(() => {
    if (initialData?.image && typeof initialData.image === "string") {
      setPreviewImage(initialData.image);
      setHasImageChanged(false);
    }
  }, [initialData?.image]);

  async function handleSubmit(values: BasicInfoFormValues) {
    try {
      let imageToSubmit = values.image;

      if (values.image instanceof File) {
        imageToSubmit = await compressImage(values.image, 1000, 0.8);
      }

      const data = {
        ...values,
        name: values.name.trim(),
        image: imageToSubmit,
        slogan: values.slogan?.trim() || "",
        hasImageChanged,
      };

      onSubmit?.(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al procesar la información");
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      // Removemos la limitación de tamaño ya que se comprime después
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
    const limitedValue = numericValue.slice(0, 15);
    onChange(limitedValue);
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast.success("URL copiada al portapapeles");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error("Error al copiar la URL");
    }
  }

  const fullUrl = `https://meetzeen.com/${watchSlug}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Información básica
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Escribe la información básica de tu empresa
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Columna izquierda: Imagen */}
            <div className="order-2 md:order-1">
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
                                alt="Vista previa del logo"
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
                                    <IconUpload className="w-3 h-3 mr-1" />
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
                                    className="bg-red-500/90 hover:bg-red-600 text-xs px-2 py-1"
                                  >
                                    <IconX className="w-3 h-3 mr-1" />
                                    Remover
                                  </Button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 group-hover:text-gray-600 transition-colors">
                              <IconCamera className="w-8 h-8 mb-2" />
                              <p className="text-xs font-medium mb-1 text-center">
                                Subir imagen
                              </p>
                              <p className="text-xs text-gray-400 text-center px-2">
                                PNG, JPG, WEBP
                              </p>
                            </div>
                          )}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </div>
                        {initialData && hasImageChanged && (
                          <p className="text-xs text-amber-600 text-center">
                            ⚠️ Se actualizará al guardar
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Columna derecha: Campos de información */}
            <div className="space-y-4 md:col-span-2 order-1 md:order-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la empresa *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Mi Empresa S.A." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de la empresa</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupAddon align="inline-start">
                          <InputGroupText>https://meetzeen.com/</InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                          placeholder="mi-empresa"
                          {...field}
                          onChange={(e) => {
                            const normalizedValue = normalizeText(
                              e.target.value
                            );
                            field.onChange(normalizedValue);
                          }}
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            aria-label="Copiar URL"
                            title="Copiar URL completa"
                            size="icon-xs"
                            onClick={() => copyToClipboard(fullUrl)}
                          >
                            {isCopied ? (
                              <IconCheck className="w-3 h-3" />
                            ) : (
                              <IconClipboard className="w-3 h-3" />
                            )}
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field: countryField }) => (
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field: phoneField }) => {
                        const selectedCountry = COUNTRY_CODES.find(
                          (country) => country.code === countryField.value
                        );
                        return (
                          <FormItem>
                            <FormLabel>Teléfono *</FormLabel>
                            <FormControl>
                              <ButtonGroup>
                                <ButtonGroup>
                                  <Select
                                    value={countryField.value}
                                    onValueChange={countryField.onChange}
                                  >
                                    <SelectTrigger>
                                      {selectedCountry && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-lg">
                                            {selectedCountry.emoji}
                                          </span>
                                          <span className="text-sm font-medium">
                                            {selectedCountry.code}
                                          </span>
                                        </div>
                                      )}
                                    </SelectTrigger>
                                    <SelectContent className="min-w-48">
                                      {COUNTRY_CODES.map((country) => (
                                        <SelectItem
                                          key={country.code}
                                          value={country.code}
                                        >
                                          <div className="flex items-center gap-3">
                                            <span className="text-lg">
                                              {country.emoji}
                                            </span>
                                            <span className="text-sm font-medium">
                                              {country.code}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                              {country.label}
                                            </span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Input
                                    placeholder="1234567890"
                                    {...phoneField}
                                    onChange={(e) =>
                                      handlePhoneChange(e, phoneField.onChange)
                                    }
                                    maxLength={15}
                                    pattern="[0-9]*"
                                  />
                                </ButtonGroup>
                              </ButtonGroup>
                            </FormControl>
                            <FormDescription>
                              Selecciona el código de país e ingresa tu número
                              de teléfono
                            </FormDescription>
                            {(form.formState.errors.countryCode ||
                              form.formState.errors.phone) && (
                              <FormMessage>
                                {form.formState.errors.countryCode?.message ||
                                  form.formState.errors.phone?.message}
                              </FormMessage>
                            )}
                          </FormItem>
                        );
                      }}
                    />
                  )}
                />
              </div>

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

            </div>
          </div>

          {/* Botón alineado a la izquierda */}
          <div className="flex justify-start">
            <Button type="submit" className="w-full md:w-auto">
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
