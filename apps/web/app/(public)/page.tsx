import { buttonVariants } from "@meetzeen/ui/src/components/button";
import { cn } from "@meetzeen/ui/src/lib/utils";
import Link from "next/link";
import { IconBrandGithub } from "@tabler/icons-react"

export default function Page() {
  return (
    <div className="h-[100dvh] w-[100dvw] flex flex-col items-center justify-center p-8 space-y-4">
      <h1 className="text-6xl font-bold text-center">
        Meetzeen
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl text-center leading-relaxed">
        Un meetzeen que combina todo lo moderno de{" "}
        <span className="text-primary font-semibold">
          NextJS, Elysia, Better Auth y Supabase
        </span>{" "}
        más la calidad de desarrollo con un plus de Typescript.
      </p>
      <span className="flex space-x-2">
        <Link
          href={"https://github.com/NNeshz/meetzeen"}
          target="_blank"
          className={cn(
            buttonVariants({
              variant: "default",
              className: "hover:bg-primary/90 hover:cursor-pointer",
            })
          )}
        >
          <IconBrandGithub />
          Repositorio
        </Link>
      </span>
    </div>
  );
}
