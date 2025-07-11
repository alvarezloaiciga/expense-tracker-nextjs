"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MonthlySpendingComparison } from "@/components/charts/monthly-spending-comparison"
import { CategoryBreakdownOverTime } from "@/components/charts/category-breakdown-over-time"
import { CardUsageComparison } from "@/components/charts/card-usage-comparison"
import { Download, Share2 } from "lucide-react"
import { PdfExport } from "@/components/pdf-export"
import { CurrencyToggle } from "@/components/currency-toggle"
import { useSettings } from "@/hooks/useSettings"
import { useTranslation } from "@/hooks/useTranslation"
import { type CurrencyCode } from "@/lib/currency"

export default function AnalyticsPage() {
  const { settings } = useSettings()
  const { t } = useTranslation()
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>(settings.default_currency as CurrencyCode)

  // Update display currency when default currency changes
  useEffect(() => {
    setDisplayCurrency(settings.default_currency as CurrencyCode)
  }, [settings.default_currency])

  // If no enabled currencies, don't render currency toggle
  const showCurrencyToggle = settings.enabled_currencies && settings.enabled_currencies.length > 1

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("analytics.title")}</h1>
          <p className="text-muted-foreground">{t("analytics.subtitle")}</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          {showCurrencyToggle && (
            <CurrencyToggle currentCurrency={displayCurrency} onCurrencyChange={setDisplayCurrency} />
          )}
          <PdfExport elementId="analytics-content" fileName="finance-analytics.pdf" buttonText={t("analytics.exportPdf")} />
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            {t("analytics.exportCsv")}
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            {t("analytics.share")}
          </Button>
        </div>
      </div>

      <div id="analytics-content" className="space-y-4">
        <Tabs defaultValue="monthly" className="space-y-4">
          <TabsList>
            <TabsTrigger value="monthly">{t("analytics.monthlyComparison")}</TabsTrigger>
            <TabsTrigger value="categories">{t("analytics.categoriesOverTime")}</TabsTrigger>
            <TabsTrigger value="cards">{t("analytics.cardUsage")}</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("analytics.monthlySpendingComparison")}</CardTitle>
              </CardHeader>
              <CardContent className="h-[500px]">
                <MonthlySpendingComparison currency={displayCurrency} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("analytics.categoryBreakdownOverTime")}</CardTitle>
              </CardHeader>
              <CardContent className="h-[500px]">
                <CategoryBreakdownOverTime currency={displayCurrency} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("analytics.cardUsageComparison")}</CardTitle>
              </CardHeader>
              <CardContent className="h-[500px]">
                <CardUsageComparison currency={displayCurrency} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
