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

  function onSubmit(values: z.infer<typeof slugSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
                    <InputGroupInput {...field} className="!pl-0.5" />
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
                    Este link lo puedes compartir por redes sociales para que agenden citas contigo.
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="justify-end">
            <Button type="submit">Guardar</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
