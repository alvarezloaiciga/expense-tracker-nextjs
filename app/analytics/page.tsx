import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MonthlySpendingComparison } from "@/components/charts/monthly-spending-comparison"
import { CategoryBreakdownOverTime } from "@/components/charts/category-breakdown-over-time"
import { CardUsageComparison } from "@/components/charts/card-usage-comparison"
import { Download, Share2 } from "lucide-react"
import { PdfExport } from "@/components/pdf-export"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into your spending patterns</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <PdfExport elementId="analytics-content" fileName="finance-analytics.pdf" />
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div id="analytics-content" className="space-y-4">
        <Tabs defaultValue="monthly" className="space-y-4">
          <TabsList>
            <TabsTrigger value="monthly">Monthly Comparison</TabsTrigger>
            <TabsTrigger value="categories">Categories Over Time</TabsTrigger>
            <TabsTrigger value="cards">Card Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Spending Comparison</CardTitle>
              </CardHeader>
              <CardContent className="h-[500px]">
                <MonthlySpendingComparison />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-[500px]">
                <CategoryBreakdownOverTime />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Card Usage Comparison</CardTitle>
              </CardHeader>
              <CardContent className="h-[500px]">
                <CardUsageComparison />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
