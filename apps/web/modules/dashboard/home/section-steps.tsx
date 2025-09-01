import { Button } from "@meetzeen/ui/components/button";
import {
  IconArrowRight,
  IconBuilding,
  IconCheck,
  IconCircleDashed,
  IconCircleDashedCheck,
} from "@tabler/icons-react";
import { Card } from "@meetzeen/ui/src/components/card";

export function SectionSteps() {
  const currentStep = 2; // This would come from props or state
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    {
      id: 1,
      title: "Paso 1",
      description: "Crea tu empresa para comenzar",
      completed: true,
    },
    {
      id: 2,
      title: "Paso 2",
      description: "Crea las categorías",
      completed: false,
      current: true,
    },
    { id: 3, title: "Paso 3", description: "Crea tus primeros empleados", completed: false },
    { id: 4, title: "Paso 4", description: "Completa tus servicios", completed: false },
  ];

  return (
    <Card className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
      <div className="flex gap-4">
        <div className="p-4 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
        <IconBuilding className="size-24" />
        </div>
        <div className="flex flex-col px-2 py-4">
            <div className="mb-6">
            <p className="text-3xl font-semibold ">{`${progress.toFixed(0)}%`}</p>
            <p className="text-lg font-semibold">{steps[currentStep - 1]?.title}</p>
            <p className="text-sm text-muted-foreground">{steps[currentStep - 1]?.description}</p>
            </div>
            <Button variant={"outline"}>
                Vamos
                <IconArrowRight />
            </Button>
        </div>
      </div>
      <div className="flex flex-col justify-center space-y-4">
        {steps.slice(0, 2).map((step) => (
          <div key={step.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {step.completed ? (
                <IconCircleDashedCheck className="w-6 h-6 text-green-500" />
              ) : step.current ? (
                <IconCircleDashed className="w-6 h-6 animate-spin" />
              ) : (
                <IconCircleDashed className="w-6 h-6" />
              )}
              <p className={step.completed ? "text-primary" : ""}>{step.title}</p>
            </div>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-center space-y-4">
        {steps.slice(2).map((step) => (
          <div key={step.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {step.completed ? (
                <IconCheck className="w-6 h-6" />
              ) : step.current ? (
                <IconCircleDashed className="w-6 h-6 animate-spin" />
              ) : (
                <IconCircleDashed className="w-6 h-6" />
              )}
              <p className={step.completed ? "text-primary" : ""}>{step.title}</p>
            </div>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
