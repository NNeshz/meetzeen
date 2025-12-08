"use client";

import { Button } from "@meetzeen/ui/src/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@meetzeen/ui/src/components/input-group";
import { IconCopy } from "@tabler/icons-react";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
} from "@meetzeen/ui/src/components/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useCompany } from "@/modules/company/hooks/use-company";

const formSchema = z.object({
  slug: z
    .string()
    .min(1, { message: "El slug es requerido" })
    .max(50, { message: "El slug no puede exceder 50 caracteres" })
    .regex(/^[a-z0-9-]+$/, {
      message: "El slug solo puede contener letras minúsculas, números y guiones",
    }),
});

export function CompanySlug({
  companySlug,
  onUpdate,
}: {
  companySlug: string;
  onUpdate: (slug: string) => void;
}) {
  const { updateCompanySlug, isUpdatingCompanySlug } = useCompany();
  const [mutationError, setMutationError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: companySlug,
    },
  });

  useEffect(() => {
    form.reset({ slug: companySlug });
    setMutationError(null);
  }, [companySlug, form]);

  const currentSlug = form.watch("slug");

  function copyToClipboard() {
    navigator.clipboard.writeText("https://meetzeen.com/" + currentSlug);
    toast.success("URL copiada al portapapeles");
  }

  function handleUpdate(values: z.infer<typeof formSchema>) {
    setMutationError(null);
    updateCompanySlug(values.slug, {
      onSuccess: () => {
        onUpdate(values.slug);
        toast.success("Slug actualizado correctamente");
        form.reset({ slug: values.slug });
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al actualizar el slug de la empresa";
        setMutationError(errorMessage);
        toast.error("Error al actualizar el slug de la empresa", {
          description: errorMessage,
        });
      },
    });
  }

  const formErrors = form.formState.errors;
  const hasErrors = !!formErrors.slug || !!mutationError;

  return (
    <div className="w-full border border-border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdate)}>
          <div className="border-b border-border p-4 flex items-center justify-between">
            <div className="space-y-4 w-full">
              <div>
                <p className="font-semibold text-lg">Slug de la empresa</p>
                <p className="text-sm text-muted-foreground">
                  Este es el slug de tu empresa. Puedes cambiarlo en cualquier
                  momento.
                </p>
              </div>
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputGroup className="max-w-md">
                        <InputGroupInput
                          placeholder="nombre"
                          className="pl-1!"
                          {...field}
                          disabled={isUpdatingCompanySlug}
                          onChange={(e) => {
                            const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
                            field.onChange(value);
                          }}
                        />
                        <InputGroupAddon>
                          <InputGroupText>https://meetzeen.com/</InputGroupText>
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={copyToClipboard}
                          >
                            <IconCopy />
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                El slug es la manera de encontrate, hazlo memorable.
              </p>
              {hasErrors && (
                <div className="space-y-1">
                  {formErrors.slug && (
                    <p className="text-sm text-destructive">
                      {formErrors.slug.message}
                    </p>
                  )}
                  {mutationError && (
                    <p className="text-sm text-destructive">{mutationError}</p>
                  )}
                </div>
              )}
            </div>
            <Button type="submit" disabled={isUpdatingCompanySlug}>
              {isUpdatingCompanySlug ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
