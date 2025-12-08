"use client";

import { Input } from "@meetzeen/ui/src/components/input";
import { Button } from "@meetzeen/ui/src/components/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@meetzeen/ui/src/components/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useCompany } from "@/modules/company/hooks/use-company";
import { toast } from "sonner";

const formSchema = z.object({
  facebookLink: z
    .string()
    .refine(
      (val) => val === "" || z.string().url().safeParse(val).success,
      { message: "Debe ser una URL válida" }
    ),
  instagramLink: z
    .string()
    .refine(
      (val) => val === "" || z.string().url().safeParse(val).success,
      { message: "Debe ser una URL válida" }
    ),
  whatsappLink: z
    .string()
    .refine(
      (val) => val === "" || z.string().url().safeParse(val).success,
      { message: "Debe ser una URL válida" }
    ),
  tiktokLink: z
    .string()
    .refine(
      (val) => val === "" || z.string().url().safeParse(val).success,
      { message: "Debe ser una URL válida" }
    ),
});

export function CompanySocials({
  facebookLink,
  instagramLink,
  whatsappLink,
  tiktokLink,
  onUpdate,
}: {
  facebookLink?: string;
  instagramLink?: string;
  whatsappLink?: string;
  tiktokLink?: string;
  onUpdate: () => void;
}) {
  const { updateSocialLinks, isUpdatingSocialLinks } = useCompany();
  const [mutationError, setMutationError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facebookLink: facebookLink || "",
      instagramLink: instagramLink || "",
      whatsappLink: whatsappLink || "",
      tiktokLink: tiktokLink || "",
    },
  });

  useEffect(() => {
    form.reset({
      facebookLink: facebookLink || "",
      instagramLink: instagramLink || "",
      whatsappLink: whatsappLink || "",
      tiktokLink: tiktokLink || "",
    });
    setMutationError(null);
  }, [facebookLink, instagramLink, whatsappLink, tiktokLink, form]);

  function handleUpdate(values: z.infer<typeof formSchema>) {
    setMutationError(null);
    updateSocialLinks(
      {
        facebookLink: values.facebookLink || undefined,
        instagramLink: values.instagramLink || undefined,
        whatsappLink: values.whatsappLink || undefined,
        tiktokLink: values.tiktokLink || undefined,
      },
      {
        onSuccess: () => {
          onUpdate();
          toast.success("Redes sociales actualizadas correctamente");
          form.reset({
            facebookLink: values.facebookLink,
            instagramLink: values.instagramLink,
            whatsappLink: values.whatsappLink,
            tiktokLink: values.tiktokLink,
          });
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Error al actualizar las redes sociales";
          setMutationError(errorMessage);
          toast.error("Error al actualizar las redes sociales", {
            description: errorMessage,
          });
        },
      }
    );
  }

  const formErrors = form.formState.errors;
  const hasErrors =
    !!formErrors.facebookLink ||
    !!formErrors.instagramLink ||
    !!formErrors.whatsappLink ||
    !!formErrors.tiktokLink ||
    !!mutationError;

  return (
    <div className="w-full border border-border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdate)}>
          <div className="border-b border-border p-4 flex items-center justify-between">
            <div className="space-y-4 w-full">
              <div>
                <p className="font-semibold text-lg">Redes sociales</p>
                <p className="text-sm text-muted-foreground">
                  Agrega las redes sociales de tu empresa para que los clientes puedan encontrarte fácilmente.
                </p>
              </div>
              <div className="space-y-4 w-full">
                <FormField
                  control={form.control}
                  name="facebookLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.facebook.com/your-page"
                          className="w-full max-w-md"
                          {...field}
                          disabled={isUpdatingSocialLinks}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instagramLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.instagram.com/your-page"
                          className="w-full max-w-md"
                          {...field}
                          disabled={isUpdatingSocialLinks}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="whatsappLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://wa.me/1234567890"
                          className="w-full max-w-md"
                          {...field}
                          disabled={isUpdatingSocialLinks}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tiktokLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TikTok</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.tiktok.com/@your-page"
                          className="w-full max-w-md"
                          {...field}
                          disabled={isUpdatingSocialLinks}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Agrega los enlaces de tus redes sociales. Deben ser URLs válidas.
              </p>
              {hasErrors && (
                <div className="space-y-1">
                  {formErrors.facebookLink && (
                    <p className="text-sm text-destructive">
                      Facebook: {formErrors.facebookLink.message}
                    </p>
                  )}
                  {formErrors.instagramLink && (
                    <p className="text-sm text-destructive">
                      Instagram: {formErrors.instagramLink.message}
                    </p>
                  )}
                  {formErrors.whatsappLink && (
                    <p className="text-sm text-destructive">
                      WhatsApp: {formErrors.whatsappLink.message}
                    </p>
                  )}
                  {formErrors.tiktokLink && (
                    <p className="text-sm text-destructive">
                      TikTok: {formErrors.tiktokLink.message}
                    </p>
                  )}
                  {mutationError && (
                    <p className="text-sm text-destructive">{mutationError}</p>
                  )}
                </div>
              )}
            </div>
            <Button type="submit" disabled={isUpdatingSocialLinks}>
              {isUpdatingSocialLinks ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
