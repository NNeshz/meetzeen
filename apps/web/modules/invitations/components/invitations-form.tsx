"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@meetzeen/ui/components/form";
import { Input } from "@meetzeen/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@meetzeen/ui/components/select";
import { Button } from "@meetzeen/ui/components/button";
import { useSendInvitation } from "@/modules/invitations/hooks/use-invitations";
import { IconLoader2 } from "@tabler/icons-react";

const formSchema = z.object({
  email: z.email({ message: "El email no es válido" }),
  role: z.string().min(1, { message: "El rol es requerido" }),
});

export function InvitationsForm({ onSuccess }: { onSuccess?: () => void }) {
  const { sendInvitation, isPending } = useSendInvitation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      role: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    sendInvitation(
      { email: values.email, role: values.role },
      {
        onSuccess: () => {
          toast.success("Invitación enviada correctamente");
          form.reset();
          onSuccess?.();
        },
        onError: (error) => {
          toast.error("Error al enviar la invitación", {
            description: error.message,
          });
        },
      }
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="employee">Empleado</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="owner">Propietario</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-brand text-black">
          {isPending ? (
            <IconLoader2 className="size-4 animate-spin" />
          ) : (
            "Enviar invitación"
          )}
        </Button>
      </form>
    </Form>
  );
}
