import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Edit, Trash2 } from "lucide-react"

const categories = [
  {
    id: "1",
    name: "Groceries",
    rules: ["Whole Foods", "Trader Joe's", "Safeway"],
    confidence: 95,
    transactions: 42,
    budget: 600,
    spent: 543.21,
  },
  {
    id: "2",
    name: "Dining",
    rules: ["Restaurant", "Cafe", "Bar", "Starbucks"],
    confidence: 88,
    transactions: 37,
    budget: 500,
    spent: 423.45,
  },
  {
    id: "3",
    name: "Entertainment",
    rules: ["Netflix", "Spotify", "Cinema"],
    confidence: 92,
    transactions: 12,
    budget: 300,
    spent: 156.89,
  },
  {
    id: "4",
    name: "Transportation",
    rules: ["Uber", "Lyft", "Gas", "Parking"],
    confidence: 85,
    transactions: 23,
    budget: 400,
    spent: 287.32,
  },
  {
    id: "5",
    name: "Shopping",
    rules: ["Amazon", "Target", "Walmart"],
    confidence: 78,
    transactions: 18,
    budget: 300,
    spent: 198.76,
  },
]

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorization Rules</h1>
          <p className="text-muted-foreground">Manage how transactions are categorized</p>
        </div>
        <Button className="mt-4 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.slice(0, 3).map((category) => (
          <Card key={category.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <Badge
                  variant={category.confidence > 90 ? "default" : category.confidence > 80 ? "secondary" : "outline"}
                >
                  {category.confidence}% Confidence
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget: ${category.budget}</span>
                    <span>
                      ${category.spent} ({Math.round((category.spent / category.budget) * 100)}%)
                    </span>
                  </div>
                  <Progress value={(category.spent / category.budget) * 100} className="h-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{category.transactions} transactions</p>
                  <div className="flex flex-wrap gap-1">
                    {category.rules.map((rule, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {rule}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="mr-2 h-3 w-3" /> Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <CardTitle>All Categories</CardTitle>
            <div className="mt-2 sm:mt-0 relative w-full sm:w-64">
              <Input type="search" placeholder="Search categories..." />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Rules</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {category.rules.slice(0, 2).map((rule, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {rule}
                          </Badge>
                        ))}
                        {category.rules.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.rules.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          category.confidence > 90 ? "default" : category.confidence > 80 ? "secondary" : "outline"
                        }
                      >
                        {category.confidence}%
                      </Badge>
                    </TableCell>
                    <TableCell>{category.transactions}</TableCell>
                    <TableCell>
                      ${category.spent.toFixed(2)} / ${category.budget}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
