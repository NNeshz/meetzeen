"use client";

import * as React from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@meetzeen/ui/src/components/input-group";
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
  FormLabel,
  FormMessage,
} from "@meetzeen/ui/src/components/form";
import { useCopyToClipboard } from "@/utils/use-copy-to-clipboard";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import {
  useUpdateCompanySlug,
  useValidateCompanySlug,
} from "../hooks/useNegocio";
import { useDebounce } from "@/utils/use-debounce";

const slugSchema = z.object({
  slug: z.string().min(1, "El slug es requerido"),
});

export function SlugForm({ slug }: { slug: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const form = useForm<z.infer<typeof slugSchema>>({
    resolver: zodResolver(slugSchema),
    defaultValues: {
      slug,
    },
  });

  const { mutateAsync: updateSlug, isPending: isUpdating } =
    useUpdateCompanySlug();
  const { mutateAsync: validateSlug, isPending: isValidating } =
    useValidateCompanySlug();

  const initialSlug = slug || "";
  const watchedSlug = form.watch("slug") || "";
  const debouncedSlug = useDebounce(watchedSlug, 400);

  const [isAvailable, setIsAvailable] = React.useState<boolean>(false);

  const hasChanged = debouncedSlug !== initialSlug;

  // Valida con debounce solo si el usuario cambió el valor y el formato es válido
  React.useEffect(() => {
    if (!hasChanged) {
      setIsAvailable(false);
      return;
    }

    const formatOk = /^[a-z0-9ñ]{3,100}$/.test(debouncedSlug);
    if (!formatOk) {
      setIsAvailable(false);
      return;
    }

    validateSlug(debouncedSlug)
      .then((res: any) => {
        const available =
          (res?.data && res?.data?.available === true) ||
          res?.available === true;
        setIsAvailable(!!available);
      })
      .catch(() => setIsAvailable(false));
  }, [debouncedSlug, validateSlug, hasChanged]);

  const isUnchanged = watchedSlug === initialSlug;
  const isValidFormat = /^[a-z0-9ñ]{3,100}$/.test(watchedSlug);
  const isValid = isValidFormat && isAvailable;

  async function onSubmit(values: z.infer<typeof slugSchema>) {
    if (!isValid) return;
    await updateSlug(values.slug);
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Slug de la empresa</CardTitle>
        <CardDescription>
          Este es el slug es importante, pues por medio de él tus usuarios
          podrán acceder a tu empresa y agendar una cita contigo.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent>
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>https://meetzeen.com/</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      // Restringe entrada: solo letras (incluye ñ) y números, sin espacios ni signos
                      onChange={(e) => {
                        const raw = e.target.value;
                        const sanitized = raw
                          .replace(/[^a-zA-Z0-9ñÑ]/g, "") // quita todo lo que no sea letra/numero/ñ
                          .toLowerCase();
                        field.onChange(sanitized);
                      }}
                      value={field.value}
                      className={[
                        "!pl-0.5",
                        isValid
                          ? "border-green-500 focus-visible:ring-green-500"
                          : "",
                      ].join(" ")}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        aria-label="Copy"
                        title="Copy"
                        size="icon-xs"
                        onClick={() => {
                          copyToClipboard(
                            `https://meetzeen.com/${field.value}`
                          );
                        }}
                      >
                        {isCopied ? <IconCheck /> : <IconCopy />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  <FormMessage />
                  <FormDescription className="text-xs">
                    {isValidating
                      ? "Validando slug…"
                      : isValid
                        ? "Slug válido y disponible."
                        : "Usa solo letras minúsculas (incluye ñ) y números, mínimo 3 caracteres."}
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="justify-end">
            <Button
              type="submit"
              disabled={!isValid || isUnchanged || isUpdating}
            >
              {isUpdating ? "Guardando…" : "Guardar"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
