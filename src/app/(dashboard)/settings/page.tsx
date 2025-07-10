"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSettings } from "@/hooks/useSettings"
import { useTranslation } from "@/hooks/useTranslation"
import { CURRENCIES, type CurrencyCode } from "@/lib/currency"
import { useTheme } from "next-themes"
import { useToast } from "@/../../hooks/use-toast"

export default function SettingsPage() {
  const { settings, isLoading, updateSettings } = useSettings()
  const { setTheme } = useTheme()
  const { toast } = useToast()
  const { t } = useTranslation()
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    default_currency: "USD" as CurrencyCode,
    preferred_theme: "light"
  })

  // Initialize form data when settings load
  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name || "",
        default_currency: (settings.default_currency as CurrencyCode) || "USD",
        preferred_theme: settings.preferred_theme || "light"
      })
    }
  }, [settings])

  const handleSave = async () => {
    setIsUpdating(true)
    try {
      await updateSettings({
        ...settings,
        ...formData
      })
      setTheme(formData.preferred_theme)
      toast({
        title: t("common.success"),
        description: t("settings.updatedSuccessfully"),
      })
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("settings.failedToUpdate"),
        variant: "destructive",
      })
      console.error("Failed to update settings:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("settings.title")}</h1>
          <p className="text-muted-foreground">{t("settings.subtitle")}</p>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t("settings.loadingSettings")}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("settings.title")}</h1>
        <p className="text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.userPreferences")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("settings.displayName")}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t("settings.enterDisplayName")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">{t("settings.defaultCurrency")}</Label>
            <Select
              value={formData.default_currency}
              onValueChange={(value) => setFormData({ ...formData, default_currency: value as CurrencyCode })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {settings.enabled_currencies?.map((code: string) => {
                  const info = CURRENCIES[code as CurrencyCode]
                  return (
                    <SelectItem key={code} value={code}>
                      {info.symbol} {info.name} ({info.code})
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">{t("settings.preferredTheme")}</Label>
            <Select
              value={formData.preferred_theme}
              onValueChange={(value) => setFormData({ ...formData, preferred_theme: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t("settings.light")}</SelectItem>
                <SelectItem value="dark">{t("settings.dark")}</SelectItem>
                <SelectItem value="system">{t("settings.system")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave} disabled={isUpdating} className="mt-4">
            {isUpdating ? t("settings.saving") : t("settings.saveSettings")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.accountSettings")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t("settings.comingSoon")}</p>
        </CardContent>
      </Card>
    </div>
  )
} 