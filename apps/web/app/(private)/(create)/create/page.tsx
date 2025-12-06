import { CreateForm } from "@/modules/company/components/create-form";
import { Button } from "@meetzeen/ui/src/components/button";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export default function CreatePage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      <Link href="/" className="absolute top-4 left-4">
        <Button variant="outline">
          <IconArrowLeft />
          Inicio
        </Button>
      </Link>
      <div className="w-full px-4 md:px-0 md:max-w-md mx-auto">
        <CreateForm />
      </div>
    </div>
  );
}
