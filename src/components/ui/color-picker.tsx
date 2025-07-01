"use client"

import { useState } from "react"
import { HexColorPicker } from "react-colorful"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
  className?: string
}

const defaultColors = [
  "#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6",
  "#06B6D4", "#84CC16", "#F97316", "#EC4899", "#6B7280",
  "#F87171", "#FB7185", "#F472B6", "#E879F9", "#C084FC",
  "#A78BFA", "#818CF8", "#60A5FA", "#38BDF8", "#22D3EE"
]

export function ColorPicker({ value, onChange, label, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleColorChange = (color: string) => {
    onChange(color)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      onChange(color)
    }
  }

  return (
    <div className={className}>
      {label && <Label className="mb-2 block">{label}</Label>}
      
      <div className="flex items-center space-x-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-10 h-10 p-0 border-2 border-gray-200 hover:border-gray-400 transition-colors"
              style={{ backgroundColor: value }}
            >
              <span className="sr-only">Pick color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="start">
            <div className="space-y-4">
              <HexColorPicker color={value} onChange={handleColorChange} />
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quick Colors</Label>
                <div className="grid grid-cols-8 gap-1">
                  {defaultColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-6 h-6 rounded border border-gray-200 hover:border-gray-400 hover:scale-110 transition-all"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        handleColorChange(color)
                        setIsOpen(false)
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex-1">
          <Input
            value={value}
            onChange={handleInputChange}
            placeholder="#3B82F6"
            className="font-mono text-sm"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 