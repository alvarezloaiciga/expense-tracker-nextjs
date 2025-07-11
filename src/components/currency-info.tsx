"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSettings } from "@/hooks/useSettings"
import { CURRENCIES, type CurrencyCode } from "@/lib/currency"

interface CurrencyInfoProps {
  displayCurrency: CurrencyCode
}

export function CurrencyInfo({ displayCurrency }: CurrencyInfoProps) {
  const { settings } = useSettings()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm">Currency Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Display Currency:</span>
          <Badge variant="secondary">
            {CURRENCIES[displayCurrency].symbol} {CURRENCIES[displayCurrency].code}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Default Currency:</span>
          <Badge variant="outline">
            {CURRENCIES[settings.default_currency as CurrencyCode].symbol} {CURRENCIES[settings.default_currency as CurrencyCode].code}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Enabled Currencies:</span>
          <div className="flex gap-1">
            {settings.enabled_currencies?.map((code: string) => (
              <Badge key={code} variant="outline" className="text-xs">
                {CURRENCIES[code as CurrencyCode].symbol}
              </Badge>
            ))}
          </div>
        </div>
        {displayCurrency !== settings.default_currency && (
          <div className="text-xs text-muted-foreground mt-2">
            💡 Display currency changes are temporary. Update your default currency in Settings to make it permanent.
          </div>
        )}
      </CardContent>
    </Card>
  )
} 