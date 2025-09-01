"use client";

import { IconBrandFacebookFilled, IconBrandInstagramFilled, IconBrandTiktokFilled, IconBrandXFilled } from "@tabler/icons-react";

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

const schema = z.object({
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  x: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof schema>;

// TODO: Agregar los iconos de redes sociales correctos

export function CompanySocialForm() {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(schema),
  });

  function onSubmit(values: CompanyFormValues) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <FormField
          control={form.control}
          name="facebook"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <IconBrandFacebookFilled className="size-4" />Facebook
              </FormLabel>
              <FormControl>
                <Input placeholder="Facebook de la empresa" {...field} />
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
              <FormLabel>
                <IconBrandInstagramFilled className="size-4" />Instagram
              </FormLabel>
              <FormControl>
                <Input placeholder="Instagram de la empresa" {...field} />
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
              <FormLabel>
                <IconBrandTiktokFilled className="size-4" />Tiktok
              </FormLabel>
              <FormControl>
                <Input placeholder="Tiktok de la empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="x"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <IconBrandXFilled className="size-4" />X
              </FormLabel>
              <FormControl>
                <Input placeholder="X de la empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Guardar</Button>
      </form>
    </Form>
  );
}
