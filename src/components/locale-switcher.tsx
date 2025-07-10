"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/hooks/useTranslation"

const locales = {
  en: { name: "English", flag: "🇺🇸" },
  es: { name: "Español", flag: "🇪🇸" },
}

export function LocaleSwitcher() {
  const { locale, changeLocale } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 w-10 p-0 flex items-center justify-center">
          {locales[locale as keyof typeof locales]?.flag}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-10 min-w-0 !p-0">
        {Object.entries(locales).map(([code, { flag }]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => changeLocale(code as 'en' | 'es')}
            className={`justify-center !min-w-0 ${locale === code ? "bg-accent" : ""}`}
          >
            {flag}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 