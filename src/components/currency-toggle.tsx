"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { CURRENCIES, type CurrencyCode } from "@/lib/currency"
import { useSettings } from "@/hooks/useSettings"

interface CurrencyToggleProps {
  currentCurrency: CurrencyCode
  onCurrencyChange: (currency: CurrencyCode) => void
}

export function CurrencyToggle({ currentCurrency, onCurrencyChange }: CurrencyToggleProps) {
  const { enabledCurrencies } = useSettings()

  // Don't render if there are no enabled currencies or only one
  if (!enabledCurrencies || enabledCurrencies.length <= 1) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {CURRENCIES[currentCurrency].symbol} {CURRENCIES[currentCurrency].code}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {enabledCurrencies.map((code) => {
          const info = CURRENCIES[code]
          return (
            <DropdownMenuItem
              key={code}
              onClick={() => onCurrencyChange(code)}
              className={currentCurrency === code ? "bg-accent" : ""}
            >
              {info.symbol} {info.name} ({info.code})
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
