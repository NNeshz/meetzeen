"use client";

import {
  IconBrandFacebookFilled,
  IconBrandInstagramFilled,
  IconBrandTiktokFilled,
  IconBrandXFilled,
} from "@tabler/icons-react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@meetzeen/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@meetzeen/ui/components/form";
import { Input } from "@meetzeen/ui/components/input";
import { toast } from "sonner";

import { Loading } from "@/modules/dashboard/components/loading";
import { Error } from "@/modules/dashboard/components/error";

import { Socials } from "@/modules/dashboard/negocio/types/read-socials";

import { useUpdateSocials } from "@/modules/dashboard/negocio/hooks/useNegocio";
import { useEffect } from "react";

const schema = z.object({
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  twitterX: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof schema>;

interface CompanySocialFormProps {
  socials?: Socials;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

export function CompanySocialForm({
  socials,
  isLoading,
  isError,
  errorMessage,
  onRetry,
}: CompanySocialFormProps) {
  const { mutateAsync: updateSocials } = useUpdateSocials();

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      facebook: "",
      instagram: "",
      tiktok: "",
      twitterX: "",
    },
  });

  useEffect(() => {
    if (socials) {
      form.reset({
        facebook: socials?.facebook ?? "",
        instagram: socials?.instagram ?? "",
        tiktok: socials?.tiktok ?? "",
        twitterX: socials?.twitterX ?? "",
      });
    }
  }, [socials, form]);

  async function onSubmit(values: CompanyFormValues) {
    try {
      await updateSocials(values);
      toast.success("Redes sociales actualizadas correctamente");
    } catch (error) {
      console.error("Error al actualizar las redes sociales:", error);
      toast.error("Error al actualizar las redes sociales");
    }
  }

  if (isLoading && !isError) {
    return (
      <div className="space-y-4">
        <Loading
          className="py-12"
          message={["Verificando información de la empresa...", "Actualizando información de la empresa..."]}
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

  return (
    <div className="max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <IconBrandFacebookFilled className="size-4 text-blue-600" />
                  Facebook
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://facebook.com/tu-empresa"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <IconBrandInstagramFilled className="size-4 text-pink-600" />
                  Instagram
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://instagram.com/tu-empresa"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tiktok"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <IconBrandTiktokFilled className="size-4" />
                  TikTok
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://tiktok.com/@tu-empresa"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="twitterX"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <IconBrandXFilled className="size-4" />
                  X (Twitter)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://x.com/tu-empresa"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loading message="Actualizando..." />
              ) : (
                "Guardar redes sociales"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}