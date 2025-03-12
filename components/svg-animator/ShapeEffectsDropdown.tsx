"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface ShapeEffectsDropdownProps {
  selectedEffect: string;
  onSelect: (effect: string) => void;
}

export function ShapeEffectsDropdown({ selectedEffect, onSelect }: ShapeEffectsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {selectedEffect === "none" ? "Shape Effects" : selectedEffect} <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onSelect("none")}>None</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect("wave")}>Wave</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect("rotate")}>Rotate</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect("twist")}>Twist</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect("skew")}>Skew</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 