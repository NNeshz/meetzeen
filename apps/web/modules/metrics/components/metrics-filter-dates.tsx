"use client";

import { Button } from "@meetzeen/ui/src/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@meetzeen/ui/src/components/dropdown-menu";
import { IconChevronDown, IconFilter2 } from "@tabler/icons-react";
import { useState } from "react";
import { periods } from "@/modules/metrics/constants/periods";

export function MetricsFilterDates() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    periods[1]?.label || ""
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <IconFilter2 className="w-4 h-4 mr-1" />
          <span>{selectedPeriod}</span>
          <IconChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Periodo
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {periods.map((period) => (
            <DropdownMenuItem key={period.value} onClick={() => setSelectedPeriod(period.label)}>
              {period.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem>
            Personalizado
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
