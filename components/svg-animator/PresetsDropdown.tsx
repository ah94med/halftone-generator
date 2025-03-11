"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface PresetsDropdownProps {
  onSelect: (preset: string) => void;
}

export function PresetsDropdown({ onSelect }: PresetsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          Presets <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onSelect("breathing")}>Breathing</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect("wave")}>Wave</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect("pulse")}>Pulse</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}