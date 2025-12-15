"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@meetzeen/ui/components/sheet";
import { Button } from "@meetzeen/ui/components/button";
import { ButtonGroup } from "@meetzeen/ui/src/components/button-group";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@meetzeen/ui/src/components/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@meetzeen/ui/components/collapsible";
import { Checkbox } from "@meetzeen/ui/src/components/checkbox";
import { IconPlus, IconTrash, IconChevronDown } from "@tabler/icons-react";
import { useCreateTemplate } from "@/modules/team/hooks/use-team";
import { CreateTimeBlocks, TimeBlock } from "@/modules/team/types/team.types";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@meetzeen/ui/src/lib/utils";

const DAYS = [
  { value: 1, label: "Lunes" }, 
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

interface DayTimeBlocks {
  [dayOfWeek: number]: TimeBlock[];
}

export function TeamTemplateForm({ memberId }: { memberId: string }) {
  const { createTemplate, isCreating } = useCreateTemplate();
  const [openDays, setOpenDays] = useState<Record<number, boolean>>({});
  const [dayTimeBlocks, setDayTimeBlocks] = useState<DayTimeBlocks>({});

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return (hours || 0) * 60 + (minutes || 0);
  };

  const doTimeBlocksOverlap = (block1: TimeBlock, block2: TimeBlock): boolean => {
    const start1 = timeToMinutes(block1.startTime);
    const end1 = timeToMinutes(block1.endTime);
    const start2 = timeToMinutes(block2.startTime);
    const end2 = timeToMinutes(block2.endTime);

    return !(end1 <= start2 || end2 <= start1);
  };

  const isValidTimeBlock = (block: TimeBlock): boolean => {
    return timeToMinutes(block.startTime) < timeToMinutes(block.endTime);
  };

  const validateDayTimeBlocks = (blocks: TimeBlock[] | undefined): string | null => {
    if (!blocks || blocks.length === 0) {
      return null;
    }

    for (const block of blocks) {
      if (!isValidTimeBlock(block)) {
        return "La hora de inicio debe ser anterior a la hora de fin";
      }
    }

    for (let i = 0; i < blocks.length; i++) {
      for (let j = i + 1; j < blocks.length; j++) {
        const block1 = blocks[i];
        const block2 = blocks[j];
        if (block1 && block2 && doTimeBlocksOverlap(block1, block2)) {
          return "Los horarios no pueden sobreponerse";
        }
      }
    }

    return null;
  };

  const handleDayToggle = (day: number, checked: boolean) => {
    if (checked) {
      setOpenDays((prev) => ({ ...prev, [day]: true }));
      if (!dayTimeBlocks[day] || dayTimeBlocks[day].length === 0) {
        setDayTimeBlocks((prev) => ({
          ...prev,
          [day]: [{ startTime: "09:00", endTime: "18:00" }],
        }));
      }
    } else {
      setOpenDays((prev) => ({ ...prev, [day]: false }));
      setDayTimeBlocks((prev) => {
        const newBlocks = { ...prev };
        delete newBlocks[day];
        return newBlocks;
      });
    }
  };

  const handleCollapsibleOpenChange = (day: number, open: boolean) => {
    setOpenDays((prev) => ({ ...prev, [day]: open }));
    if (open && (!dayTimeBlocks[day] || dayTimeBlocks[day].length === 0)) {
      setDayTimeBlocks((prev) => ({
        ...prev,
        [day]: [{ startTime: "09:00", endTime: "18:00" }],
      }));
    }
  };

  const addTimeBlock = (day: number) => {
    const currentBlocks = dayTimeBlocks[day] || [];
    const newBlock: TimeBlock = {
      startTime: "09:00",
      endTime: "18:00",
    };
    
    setDayTimeBlocks((prev) => ({
      ...prev,
      [day]: [...currentBlocks, newBlock],
    }));
  };

  const removeTimeBlock = (day: number, index: number) => {
    setDayTimeBlocks((prev) => {
      const blocks = prev[day] || [];
      const newBlocks = blocks.filter((_, i) => i !== index);
      return {
        ...prev,
        [day]: newBlocks,
      };
    });
  };

  const updateTimeBlock = (
    day: number,
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setDayTimeBlocks((prev) => {
      const blocks = prev[day] || [];
      const newBlocks = [...blocks];
      const currentBlock = newBlocks[index];
      if (currentBlock) {
        newBlocks[index] = {
          ...currentBlock,
          [field]: value,
        };
      }
      return {
        ...prev,
        [day]: newBlocks,
      };
    });
  };

  const handleSubmit = () => {
    const daysWithBlocks = Object.keys(dayTimeBlocks).map(Number);
    
    if (daysWithBlocks.length === 0) {
      toast.error("Debes seleccionar al menos un día con horarios");
      return;
    }

    for (const day of daysWithBlocks) {
      const blocks = dayTimeBlocks[day];
      if (!blocks || blocks.length === 0) {
        const dayLabel = DAYS.find(d => d.value === day)?.label || "día seleccionado";
        toast.error(`El día ${dayLabel} debe tener al menos un horario`);
        return;
      }

      const error = validateDayTimeBlocks(blocks);
      if (error) {
        const dayLabel = DAYS.find(d => d.value === day)?.label || "día seleccionado";
        toast.error(`Error en ${dayLabel}: ${error}`);
        return;
      }
    }

    const timeBlocks: CreateTimeBlocks[] = [];
    for (const day of daysWithBlocks) {
      const blocks = dayTimeBlocks[day];
      if (blocks) {
        for (const block of blocks) {
          timeBlocks.push({
            dayOfWeek: day,
            startTime: block.startTime,
            endTime: block.endTime,
          });
        }
      }
    }

    createTemplate(
      { memberId, timeBlocks },
      {
        onSuccess: () => {
          toast.success("Horario semanal creado correctamente");
          setDayTimeBlocks({});
          setOpenDays({});
        },
        onError: (error) => {
          toast.error("Error al crear el horario semanal", {
            description: error.message,
          });
        },
      }
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus className="size-4 mr-2" />
          Crear horario semanal
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl font-geist">
        <SheetHeader>
          <SheetTitle>Selecciona los días</SheetTitle>
          <SheetDescription>
            Selecciona los días de la semana para configurar los horarios.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <div className="space-y-2 mt-6">
            {/* List of Days with Collapsibles */}
            {DAYS.map((day) => {
              const hasBlocks = (dayTimeBlocks[day.value]?.length ?? 0) > 0;
              const isOpen = openDays[day.value] || false;
              const isChecked = hasBlocks;

              return (
                <Collapsible
                  key={day.value}
                  open={isOpen}
                  onOpenChange={(open) => handleCollapsibleOpenChange(day.value, open)}
                  className="border border-border rounded-lg overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-4 bg-background hover:bg-muted/50 transition-colors">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleDayToggle(day.value, checked === true)
                      }
                      disabled={isCreating}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        className="flex-1 flex items-center justify-between text-left"
                        disabled={isCreating}
                      >
                        <span className="font-medium">{day.label}</span>
                        <IconChevronDown
                          className={cn(
                            "size-4 text-muted-foreground transition-transform duration-200",
                            isOpen && "rotate-180"
                          )}
                        />
                      </button>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent>
                    <div className="border-t border-border p-4 space-y-4 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Configura los horarios de trabajo para este día.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addTimeBlock(day.value)}
                          disabled={isCreating}
                        >
                          <IconPlus className="size-4 mr-2" />
                          Agregar horario
                        </Button>
                      </div>

                      {dayTimeBlocks[day.value]?.map((block, index) => {
                        const [startHour, startMinute] = block.startTime.split(":").map(Number);
                        const [endHour, endMinute] = block.endTime.split(":").map(Number);
                        const error = validateDayTimeBlocks(dayTimeBlocks[day.value] || []);

                        return (
                          <div
                            key={index}
                            className="border border-border rounded-lg p-4 space-y-4 bg-background"
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">Horario {index + 1}</p>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTimeBlock(day.value, index)}
                                disabled={isCreating}
                                aria-label="Eliminar horario"
                              >
                                <IconTrash className="size-4 text-destructive" />
                              </Button>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <p className="text-sm font-medium mb-2">Hora de inicio</p>
                                <ButtonGroup className="w-full max-w-md">
                                  <Select
                                    value={String(startHour)}
                                    onValueChange={(value) => {
                                      const newTime = `${String(value).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`;
                                      updateTimeBlock(day.value, index, "startTime", newTime);
                                    }}
                                    disabled={isCreating}
                                  >
                                    <SelectTrigger className="w-full" data-slot="select-trigger">
                                      {startHour} h
                                    </SelectTrigger>
                                    <SelectContent>
                                      {HOURS.map((h) => (
                                        <SelectItem key={h} value={String(h)}>
                                          {h} h
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Select
                                    value={String(startMinute)}
                                    onValueChange={(value) => {
                                      const newTime = `${String(startHour).padStart(2, "0")}:${String(value).padStart(2, "0")}`;
                                      updateTimeBlock(day.value, index, "startTime", newTime);
                                    }}
                                    disabled={isCreating}
                                  >
                                    <SelectTrigger className="w-full" data-slot="select-trigger">
                                      {String(startMinute).padStart(2, "0")} m
                                    </SelectTrigger>
                                    <SelectContent>
                                      {MINUTES.map((m) => (
                                        <SelectItem key={m} value={String(m)}>
                                          {String(m).padStart(2, "0")} m
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </ButtonGroup>
                              </div>

                              <div>
                                <p className="text-sm font-medium mb-2">Hora de fin</p>
                                <ButtonGroup className="w-full max-w-md">
                                  <Select
                                    value={String(endHour)}
                                    onValueChange={(value) => {
                                      const newTime = `${String(value).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
                                      updateTimeBlock(day.value, index, "endTime", newTime);
                                    }}
                                    disabled={isCreating}
                                  >
                                    <SelectTrigger className="w-full" data-slot="select-trigger">
                                      {endHour} h
                                    </SelectTrigger>
                                    <SelectContent>
                                      {HOURS.map((h) => (
                                        <SelectItem key={h} value={String(h)}>
                                          {h} h
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Select
                                    value={String(endMinute)}
                                    onValueChange={(value) => {
                                      const newTime = `${String(endHour).padStart(2, "0")}:${String(value).padStart(2, "0")}`;
                                      updateTimeBlock(day.value, index, "endTime", newTime);
                                    }}
                                    disabled={isCreating}
                                  >
                                    <SelectTrigger className="w-full" data-slot="select-trigger">
                                      {String(endMinute).padStart(2, "0")} m
                                    </SelectTrigger>
                                    <SelectContent>
                                      {MINUTES.map((m) => (
                                        <SelectItem key={m} value={String(m)}>
                                          {String(m).padStart(2, "0")} m
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </ButtonGroup>
                              </div>

                              {error && index === (dayTimeBlocks[day.value]?.length || 0) - 1 && (
                                <p className="text-sm text-destructive">{error}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}

            {/* Submit Button */}
            <div className="flex items-center justify-end pt-4 border-t">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isCreating || Object.keys(dayTimeBlocks).length === 0}
              >
                {isCreating ? "Creando..." : "Crear horario semanal"}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
