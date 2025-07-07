"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSettings } from "@/hooks/useSettings"
import { CURRENCIES, type CurrencyCode } from "@/lib/currency"
import { useTheme } from "next-themes"
import { useToast } from "@/../../hooks/use-toast"

export default function SettingsPage() {
  const { settings, isLoading, updateSettings } = useSettings()
  const { setTheme } = useTheme()
  const { toast } = useToast()
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
        title: "Success",
        description: "Settings updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
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
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and settings</p>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Loading settings...
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your display name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Default Currency</Label>
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
            <Label htmlFor="theme">Preferred Theme</Label>
            <Select
              value={formData.preferred_theme}
              onValueChange={(value) => setFormData({ ...formData, preferred_theme: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave} disabled={isUpdating} className="mt-4">
            {isUpdating ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Profile, notifications, and security settings coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
} 