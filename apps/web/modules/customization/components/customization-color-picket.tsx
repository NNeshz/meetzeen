"use client";

import * as React from "react";
import { Check, Pipette } from "lucide-react";
import { cn } from "@meetzeen/ui/src/lib/utils";
import { Button } from "@meetzeen/ui/src/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@meetzeen/ui/src/components/popover";
import { Input } from "@meetzeen/ui/src/components/input";

interface ColorPickerProps {
  id?: string;
  value: string;
  onChange: (color: string) => void;
}

const presetColors = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#78716c",
  "#71717a",
  "#000000",
];

export function ColorPicker({ id, value, onChange }: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleInputBlur = () => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(inputValue)) {
      setInputValue(value);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className="w-full justify-start gap-3 h-11 px-3 bg-transparent"
        >
          <div
            className="h-6 w-6 rounded-md border shadow-sm shrink-0"
            style={{ backgroundColor: value }}
          />
          <span className="font-mono text-sm uppercase">{value}</span>
          <Pipette className="ml-auto h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="start">
        <div className="space-y-4">
          {/* Color preview grande */}
          <div
            className="h-24 w-full rounded-lg border shadow-inner"
            style={{ backgroundColor: value }}
          />

          {/* Input de color nativo + texto */}
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-10 shrink-0">
              <div
                className="absolute inset-0 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center pointer-events-none"
                style={{ backgroundColor: value }}
              >
                <Pipette
                  className={cn(
                    "h-4 w-4 drop-shadow-md",
                    isLightColor(value) ? "text-black" : "text-white"
                  )}
                />
              </div>
              <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="font-mono uppercase text-sm h-10 flex-1"
              maxLength={7}
              placeholder="#000000"
            />
          </div>

          {/* Colores preset */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Colores rápidos
            </p>
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    onChange(color);
                  }}
                  className={cn(
                    "h-8 w-8 rounded-lg border-2 transition-all hover:scale-110 flex items-center justify-center",
                    value === color
                      ? "border-foreground shadow-md"
                      : "border-transparent hover:border-muted-foreground/30"
                  )}
                  style={{ backgroundColor: color }}
                >
                  {value === color && (
                    <Check
                      className={cn(
                        "h-4 w-4",
                        isLightColor(color) ? "text-black" : "text-white"
                      )}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function isLightColor(hex: string): boolean {
  if (!hex || !/^#[0-9A-Fa-f]{6}$/.test(hex)) return false;
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
