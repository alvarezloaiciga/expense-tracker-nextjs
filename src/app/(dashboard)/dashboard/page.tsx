"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownIcon, ArrowUpIcon, CreditCard, DollarSign, ShoppingBag, TrendingDown } from "lucide-react"
import { SpendingByCategory } from "@/components/charts/spending-by-category"
import { DailySpendingTrend } from "@/components/charts/daily-spending-trend"
import { TopVendors } from "@/components/charts/top-vendors"
import { PdfExport } from "@/components/pdf-export"
import { CurrencyToggle } from "@/components/currency-toggle"
import { formatCurrency, type CurrencyCode } from "@/lib/currency"
import { getDashboardStats } from "@/services/api"
import { useSettings } from "@/hooks/useSettings"
import type { DashboardStats } from "@/types"

function getDateRangeForTab(tab: string): { from: string; to: string } {
  const now = new Date()
  let from: Date
  if (tab === "7days") {
    from = new Date(now)
    from.setDate(now.getDate() - 6)
  } else if (tab === "30days") {
    from = new Date(now)
    from.setDate(now.getDate() - 29)
  } else {
    // Default to last 30 days
    from = new Date(now)
    from.setDate(now.getDate() - 29)
  }
  return {
    from: from.toISOString().slice(0, 10),
    to: now.toISOString().slice(0, 10),
  }
}

export default function Dashboard() {
  const { defaultCurrency, enabledCurrencies } = useSettings()
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>(defaultCurrency)
  const [tab, setTab] = useState("30days")
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Update display currency when default currency changes
  useEffect(() => {
    setDisplayCurrency(defaultCurrency)
  }, [defaultCurrency])

  // If no enabled currencies, don't render currency toggle
  const showCurrencyToggle = enabledCurrencies && enabledCurrencies.length > 1

  useEffect(() => {
    const { from, to } = getDateRangeForTab(tab)
    setLoading(true)
    getDashboardStats({ from, to, currency: displayCurrency })
      .then(setStats)
      .catch(error => {
        console.error('Failed to fetch dashboard stats:', error)
        setStats(null)
      })
      .finally(() => setLoading(false))
  }, [tab, displayCurrency])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Your financial overview and insights</p>
        </div>
        <div className="flex gap-2">
          {showCurrencyToggle && (
            <CurrencyToggle currentCurrency={displayCurrency} onCurrencyChange={setDisplayCurrency} />
          )}
          <PdfExport elementId="dashboard-content" fileName="finance-dashboard.pdf" />
        </div>
      </div>

      <div id="dashboard-content" className="space-y-6">
        <Tabs value={tab} onValueChange={setTab} defaultValue="30days">
          <TabsList>
            <TabsTrigger value="7days">Last 7 days</TabsTrigger>
            <TabsTrigger value="30days">Last 30 days</TabsTrigger>
            <TabsTrigger value="custom" disabled>Custom</TabsTrigger>
          </TabsList>
          {(tab === "7days" || tab === "30days") && (
            <TabsContent value={tab} className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : stats && (
                <>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                      <CardHeader>
                        <CardTitle>Daily Spending Trend</CardTitle>
                      </CardHeader>
                      <CardContent className="h-[300px]">
                        <DailySpendingTrend data={stats.daily_spending_trend} currency={displayCurrency} />
                      </CardContent>
                    </Card>
                    <Card className="col-span-3">
                      <CardHeader>
                        <CardTitle>Spending by Category</CardTitle>
                      </CardHeader>
                      <CardContent className="h-[300px]">
                        <SpendingByCategory data={stats.spending_by_category} currency={displayCurrency} />
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Vendors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TopVendors data={stats.top_vendors} currency={displayCurrency} />
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          )}
          <TabsContent value="custom" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">Custom date range coming soon…</div>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loading || !stats ? (
            <>
              <Card><CardContent className="py-8 text-center text-muted-foreground">Loading…</CardContent></Card>
              <Card><CardContent className="py-8 text-center text-muted-foreground">Loading…</CardContent></Card>
              <Card><CardContent className="py-8 text-center text-muted-foreground">Loading…</CardContent></Card>
              <Card><CardContent className="py-8 text-center text-muted-foreground">Loading…</CardContent></Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(
                    stats.summary.total_spending,
                    displayCurrency
                  )}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-red-500 inline-flex items-center">
                      <TrendingDown className="mr-1 h-3 w-3" />
                      {stats.summary.trend.total_spending_pct_change > 0 ? '+' : ''}
                      {stats.summary.trend.total_spending_pct_change}%
                    </span>{' '}
                    from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Largest Category</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.summary.largest_category.name}</div>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(
                      stats.summary.largest_category.amount,
                      displayCurrency
                    )} ( {stats.summary.largest_category.percent}% )
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.summary.transaction_count}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 inline-flex items-center">
                      <ArrowDownIcon className="mr-1 h-3 w-3" />
                      {stats.summary.trend.transaction_count_pct_change > 0 ? '+' : ''}
                      {stats.summary.trend.transaction_count_pct_change}%
                    </span>{' '}
                    from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
                  <ArrowUpIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      stats.summary.average_transaction,
                      displayCurrency
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 inline-flex items-center">
                      <ArrowDownIcon className="mr-1 h-3 w-3" />
                      {stats.summary.trend.average_transaction_pct_change > 0 ? '+' : ''}
                      {stats.summary.trend.average_transaction_pct_change}%
                    </span>{' '}
                    from last month
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
