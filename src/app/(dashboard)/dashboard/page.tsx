"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownIcon, ArrowUpIcon, CreditCard, DollarSign, ShoppingBag, TrendingDown } from "lucide-react"
import { SpendingByCategory } from "@/components/charts/spending-by-category"
import { DailySpendingTrend } from "@/components/charts/daily-spending-trend"
import { TopVendors } from "@/components/charts/top-vendors"
import { PdfExport } from "@/components/pdf-export"
import { CurrencyToggle } from "@/components/currency-toggle"
import { formatCurrency, convertCurrency, type CurrencyCode } from "@/lib/currency"

export default function Dashboard() {
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>("USD")

  // Sample data with mixed currencies
  const totalSpendingUSD = 2456.78
  const totalSpendingCRC = convertCurrency(totalSpendingUSD, "USD", "CRC")
  const displayAmount = displayCurrency === "USD" ? totalSpendingUSD : totalSpendingCRC

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Your financial overview and insights</p>
        </div>
        <div className="flex gap-2">
          <CurrencyToggle currentCurrency={displayCurrency} onCurrencyChange={setDisplayCurrency} />
          <PdfExport elementId="dashboard-content" fileName="finance-dashboard.pdf" />
        </div>
      </div>

      <div id="dashboard-content" className="space-y-6">
        <Tabs defaultValue="30days">
          <TabsList>
            <TabsTrigger value="7days">Last 7 days</TabsTrigger>
            <TabsTrigger value="30days">Last 30 days</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          <TabsContent value="7days" className="space-y-4">
            {/* 7 days content would go here */}
          </TabsContent>
          <TabsContent value="30days" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Daily Spending Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <DailySpendingTrend />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <SpendingByCategory />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Vendors</CardTitle>
              </CardHeader>
              <CardContent>
                <TopVendors />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="custom" className="space-y-4">
            {/* Custom date range content would go here */}
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(displayAmount, displayCurrency)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500 inline-flex items-center">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  +12.5%
                </span>{" "}
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
              <div className="text-2xl font-bold">Groceries</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(
                  displayCurrency === "USD" ? 543.21 : convertCurrency(543.21, "USD", "CRC"),
                  displayCurrency,
                )}{" "}
                (22%)
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <ArrowDownIcon className="mr-1 h-3 w-3" />
                  -8%
                </span>{" "}
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
                  displayCurrency === "USD" ? 58.49 : convertCurrency(58.49, "USD", "CRC"),
                  displayCurrency,
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <ArrowDownIcon className="mr-1 h-3 w-3" />
                  -2.3%
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
