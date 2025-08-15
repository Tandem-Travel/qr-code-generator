"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

const presetColors = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFA500",
  "#800080",
  "#008000",
  "#800000",
  "#008080",
  "#000080",
  "#FFC0CB",
]

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(color)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue(color)
  }, [color])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    // Validate if it's a proper hex color
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
      onChange(value)
    }
  }

  const handlePresetClick = (presetColor: string) => {
    onChange(presetColor)
    setInputValue(presetColor)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between" onClick={() => setIsOpen(true)}>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-sm border" style={{ backgroundColor: color }} />
            {inputValue}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: color }} />
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              className="flex-1"
              placeholder="#000000"
            />
          </div>

          <div>
            <div className="mb-2 text-sm font-medium">Presets</div>
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  className="h-6 w-6 rounded-md border flex items-center justify-center"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => handlePresetClick(presetColor)}
                >
                  {presetColor === color && (
                    <Check className="h-4 w-4 text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

