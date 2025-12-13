"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
} from "@meetzeen/ui/components/sheet";
import { Button } from "@meetzeen/ui/components/button";
import { ButtonGroup } from "@meetzeen/ui/components/button-group";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@meetzeen/ui/components/select";
import { Textarea } from "@meetzeen/ui/components/textarea";
import { Input } from "@meetzeen/ui/components/input";
import { Badge } from "@meetzeen/ui/components/badge";
import {
  IconEdit,
  IconPlus,
  IconTrash,
  IconCalendarOff,
  IconRepeat,
  IconCalendar,
  IconInfinity,
} from "@tabler/icons-react";
import { useUpdateSchedule, useRemoveSchedule } from "@/modules/team/hooks/use-team";
import { TimeBlock } from "@/modules/team/types/team.types";

interface TeamDatesFormProps {
  memberId: string;
  selectedDate?: Date;
  currentTimeBlocks?: TimeBlock[];
  onSuccess?: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

export function TeamDatesForm({
  memberId,
  selectedDate,
  currentTimeBlocks = [],
  onSuccess,
}: TeamDatesFormProps) {
  const [open, setOpen] = useState(false);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [reason, setReason] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<
    "solo-este-dia" | "repetir" | "vacaciones" | "para-siempre" | null
  >("solo-este-dia");
  const [repeatCount, setRepeatCount] = useState<number>(2);
  const { updateSchedule, isUpdatingSchedule } = useUpdateSchedule();
  const { removeSchedule, isRemovingSchedule } = useRemoveSchedule();

  // Initialize time blocks when sheet opens or currentTimeBlocks change
  useEffect(() => {
    if (open) {
      if (currentTimeBlocks && currentTimeBlocks.length > 0) {
        setTimeBlocks([...currentTimeBlocks]);
      } else {
        // Default time block if none exist
        setTimeBlocks([{ startTime: "09:00", endTime: "18:00" }]);
      }
      setSelectedAction("solo-este-dia");
      setRepeatCount(2);
      setReason("");
    }
  }, [open, currentTimeBlocks]);

  const formatDateToString = (date: Date | undefined): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getDayOfWeek = (date: Date | undefined): number => {
    if (!date) return 0;
    return date.getDay();
  };

  const getDayName = (dayOfWeek: number): string => {
    const days = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];
    return days[dayOfWeek] || "";
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return (hours || 0) * 60 + (minutes || 0);
  };

  const validateTimeBlocks = (blocks: TimeBlock[]): string | null => {
    if (blocks.length === 0) return null;

    for (const block of blocks) {
      if (timeToMinutes(block.startTime) >= timeToMinutes(block.endTime)) {
        return "La hora de inicio debe ser anterior a la hora de fin";
      }
    }

    // Check for overlaps
    for (let i = 0; i < blocks.length; i++) {
      for (let j = i + 1; j < blocks.length; j++) {
        const block1 = blocks[i];
        const block2 = blocks[j];
        if (!block1 || !block2) continue;

        const start1 = timeToMinutes(block1.startTime);
        const end1 = timeToMinutes(block1.endTime);
        const start2 = timeToMinutes(block2.startTime);
        const end2 = timeToMinutes(block2.endTime);

        if (!(end1 <= start2 || end2 <= start1)) {
          return "Los horarios no pueden sobreponerse";
        }
      }
    }

    return null;
  };

  const addTimeBlock = () => {
    setTimeBlocks([...timeBlocks, { startTime: "09:00", endTime: "18:00" }]);
  };

  const removeTimeBlock = (index: number) => {
    setTimeBlocks(timeBlocks.filter((_, i) => i !== index));
  };

  const updateTimeBlock = (
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const newBlocks = [...timeBlocks];
    const currentBlock = newBlocks[index];
    if (!currentBlock) return;

    newBlocks[index] = {
      ...currentBlock,
      [field]: value,
    };
    setTimeBlocks(newBlocks);
  };

  const calculateRepeatDates = (startDate: Date, count: number): Date[] => {
    const dates: Date[] = [];
    for (let i = 0; i < count; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i * 7);
      dates.push(date);
    }
    return dates;
  };

  const formatDateToShortSpanish = (date: Date): string => {
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  const getSuccessMessage = (action: string): string => {
    switch (action) {
      case "solo-este-dia":
        return "Horario actualizado para este día";
      case "repetir":
        return `Horario aplicado a ${repeatCount} fecha${repeatCount > 1 ? "s" : ""}`;
      case "vacaciones":
        return "Día marcado como vacaciones/no disponible";
      case "para-siempre":
        return `Horario aplicado para siempre todos los ${getDayName(getDayOfWeek(selectedDate))}s`;
      default:
        return "Horario actualizado";
    }
  };

  const handleSubmit = () => {
    if (!selectedDate) {
      toast.error("Debes seleccionar una fecha");
      return;
    }

    if (!selectedAction) {
      toast.error("Debes seleccionar una opción");
      return;
    }

    // Validar timeBlocks solo si no es vacaciones
    if (selectedAction !== "vacaciones") {
      const error = validateTimeBlocks(timeBlocks);
      if (error) {
        toast.error(error);
        return;
      }
    }

    // Validar repeatCount para repetir
    if (selectedAction === "repetir" && (repeatCount < 2 || repeatCount > 8)) {
      toast.error("El número de repeticiones debe estar entre 2 y 8");
      return;
    }

    updateSchedule(
      {
        memberId,
        action: selectedAction,
        date: formatDateToString(selectedDate),
        timeBlocks: selectedAction === "vacaciones" ? [] : timeBlocks,
        repeatCount: selectedAction === "repetir" ? repeatCount : undefined,
        reason: reason || undefined,
      },
      {
        onSuccess: () => {
          toast.success(getSuccessMessage(selectedAction));
          setOpen(false);
          onSuccess?.();
        },
        onError: (error) => {
          toast.error("Error al actualizar el horario", {
            description: error.message,
          });
        },
      }
    );
  };

  const handleDeleteSchedule = () => {
    if (!selectedDate) {
      toast.error("Debes seleccionar una fecha");
      return;
    }

    const dayName = getDayName(getDayOfWeek(selectedDate));

    removeSchedule(
      {
        memberId,
        date: formatDateToString(selectedDate),
      },
      {
        onSuccess: () => {
          toast.success(`Horarios eliminados para todos los ${dayName}s`);
          setOpen(false);
          onSuccess?.();
        },
        onError: (error: Error) => {
          toast.error("Error al eliminar el horario", {
            description: error.message,
          });
        },
      }
    );
  };

  const error = validateTimeBlocks(timeBlocks);
  const isLoading = isUpdatingSchedule || isRemovingSchedule;

  const repeatDates =
    selectedDate && selectedAction === "repetir"
      ? calculateRepeatDates(selectedDate, repeatCount)
      : [];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center"
        >
          <IconEdit className="size-4 mr-2" />
          Editar horarios
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl font-geist overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <SheetHeader>
          <SheetTitle>Editar horarios</SheetTitle>
          <SheetDescription>
            Modifica los horarios disponibles para fechas específicas
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 space-y-6">
          {/* Time Blocks - Only show if not vacation */}
          {selectedAction !== "vacaciones" && selectedAction !== null && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Horarios de trabajo</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTimeBlock}
                  disabled={isLoading}
                >
                  <IconPlus className="size-4 mr-2" />
                  Agregar horario
                </Button>
              </div>

              {timeBlocks.length === 0 ? (
                <div className="p-4 border bg-muted/30 text-center">
                  <p className="text-sm text-muted-foreground">
                    No hay horarios configurados
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {timeBlocks.map((block, index) => {
                    const [startHour, startMinute] = block.startTime
                      .split(":")
                      .map(Number);
                    const [endHour, endMinute] = block.endTime
                      .split(":")
                      .map(Number);

                    return (
                      <div
                        key={index}
                        className="border border-border p-4 space-y-4 bg-background"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">
                            Horario {index + 1}
                          </p>
                          {timeBlocks.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTimeBlock(index)}
                              disabled={isLoading}
                              aria-label="Eliminar horario"
                            >
                              <IconTrash className="size-4 text-destructive" />
                            </Button>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium mb-2">
                              Hora de inicio
                            </p>
                            <ButtonGroup className="w-full max-w-md">
                              <Select
                                value={String(startHour)}
                                onValueChange={(value) => {
                                  const newTime = `${String(value).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`;
                                  updateTimeBlock(index, "startTime", newTime);
                                }}
                                disabled={isLoading}
                              >
                                <SelectTrigger className="w-full">
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
                                  updateTimeBlock(index, "startTime", newTime);
                                }}
                                disabled={isLoading}
                              >
                                <SelectTrigger className="w-full">
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
                            <p className="text-sm font-medium mb-2">
                              Hora de fin
                            </p>
                            <ButtonGroup className="w-full max-w-md">
                              <Select
                                value={String(endHour)}
                                onValueChange={(value) => {
                                  const newTime = `${String(value).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
                                  updateTimeBlock(index, "endTime", newTime);
                                }}
                                disabled={isLoading}
                              >
                                <SelectTrigger className="w-full">
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
                                  updateTimeBlock(index, "endTime", newTime);
                                }}
                                disabled={isLoading}
                              >
                                <SelectTrigger className="w-full">
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
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          )}

          {/* Repeat Count Input - Only show if "Repetir" is selected */}
          {selectedAction === "repetir" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Número de repeticiones
              </label>
              <Input
                type="number"
                min={2}
                max={8}
                value={repeatCount}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 2;
                  setRepeatCount(Math.max(2, Math.min(8, value)));
                }}
                disabled={isLoading}
                placeholder="Ej: 3"
              />
              <p className="text-xs text-muted-foreground">
                Se repetirá cada semana el mismo día
              </p>

              {/* Date badges */}
              {repeatDates.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-sm font-medium">Fechas seleccionadas:</p>
                  <div className="flex flex-wrap gap-2">
                    {repeatDates.map((date, index) => (
                      <Badge key={index} variant="outline">
                        {formatDateToShortSpanish(date)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reason field - Only show for "Vacaciones" */}
          {selectedAction === "vacaciones" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Razón{" "}
                <span className="text-xs text-muted-foreground">
                  (Opcional)
                </span>
              </label>
              <Textarea
                placeholder="Ej: Vacaciones, Día festivo, etc."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="resize-none"
                rows={3}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Action Selection */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Opciones de aplicación</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                onClick={() => setSelectedAction("solo-este-dia")}
                disabled={isLoading}
                className="w-full justify-start"
                variant={
                  selectedAction === "solo-este-dia" ? "default" : "outline"
                }
              >
                <IconCalendar className="size-4 mr-2" />
                Solo este día
              </Button>
              <Button
                type="button"
                onClick={() => setSelectedAction("repetir")}
                disabled={isLoading}
                className="w-full justify-start"
                variant={selectedAction === "repetir" ? "default" : "outline"}
              >
                <IconRepeat className="size-4 mr-2" />
                Repetir
              </Button>
              <Button
                type="button"
                onClick={() => setSelectedAction("vacaciones")}
                disabled={isLoading}
                className="w-full justify-start"
                variant={
                  selectedAction === "vacaciones" ? "default" : "outline"
                }
              >
                <IconCalendarOff className="size-4 mr-2" />
                No disponible
              </Button>
              <Button
                type="button"
                onClick={() => setSelectedAction("para-siempre")}
                disabled={isLoading}
                className="w-full justify-start"
                variant={
                  selectedAction === "para-siempre" ? "default" : "outline"
                }
              >
                <IconInfinity className="size-4 mr-2" />
                Para siempre
              </Button>
            </div>
          </div>
        </div>
        <SheetFooter className="flex-col gap-2">
          {/* Submit Button */}
          {selectedAction && (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading
                ? "Guardando..."
                : selectedAction === "vacaciones"
                  ? "Marcar como no disponible"
                  : selectedAction === "repetir"
                    ? `Aplicar a ${repeatCount} fecha${repeatCount > 1 ? "s" : ""}`
                    : selectedAction === "para-siempre"
                      ? "Aplicar para siempre"
                      : "Guardar horario"}
            </Button>
          )}
          
          {/* Delete Button - Elimina TODOS los horarios de ese día de la semana */}
          <Button
            type="button"
            onClick={handleDeleteSchedule}
            disabled={isLoading}
            variant="destructive"
            className="w-full"
          >
            <IconTrash className="size-4 mr-2" />
            {isRemovingSchedule 
              ? "Eliminando..." 
              : `Eliminar todos los ${getDayName(getDayOfWeek(selectedDate))}s`}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
