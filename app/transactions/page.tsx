"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Filter, Search } from "lucide-react"
import { TransactionDialog } from "@/components/transaction-dialog"
import { CurrencyToggle } from "@/components/currency-toggle"
import { formatCurrency, convertCurrency, type CurrencyCode } from "@/lib/currency"

const transactions = [
  {
    id: "1",
    date: "2023-05-30",
    vendor: "Whole Foods",
    amount: 87.32,
    currency: "USD" as CurrencyCode,
    category: "Groceries",
    card: "Chase Sapphire",
  },
  {
    id: "2",
    date: "2023-05-29",
    vendor: "Amazon",
    amount: 34.56,
    currency: "USD" as CurrencyCode,
    category: "Shopping",
    card: "Amex Gold",
  },
  {
    id: "3",
    date: "2023-05-28",
    vendor: "Starbucks",
    amount: 5.67,
    currency: "USD" as CurrencyCode,
    category: "Dining",
    card: "Chase Sapphire",
  },
  {
    id: "4",
    date: "2023-05-27",
    vendor: "Uber",
    amount: 23.45,
    currency: "USD" as CurrencyCode,
    category: "Transportation",
    card: "Amex Gold",
  },
  {
    id: "5",
    date: "2023-05-26",
    vendor: "Netflix",
    amount: 14.99,
    currency: "USD" as CurrencyCode,
    category: "Entertainment",
    card: "Chase Sapphire",
  },
  {
    id: "6",
    date: "2023-05-25",
    vendor: "Supermercado MegaSuper",
    amount: 35420,
    currency: "CRC" as CurrencyCode,
    category: "Groceries",
    card: "BAC Visa",
  },
  {
    id: "7",
    date: "2023-05-24",
    vendor: "Restaurante Típico",
    amount: 6500,
    currency: "CRC" as CurrencyCode,
    category: "Dining",
    card: "BCR Mastercard",
  },
  {
    id: "8",
    date: "2023-05-23",
    vendor: "Gasolinera Delta",
    amount: 23750,
    currency: "CRC" as CurrencyCode,
    category: "Transportation",
    card: "BAC Visa",
  },
  {
    id: "9",
    date: "2023-05-22",
    vendor: "Spotify Costa Rica",
    amount: 5200,
    currency: "CRC" as CurrencyCode,
    category: "Entertainment",
    card: "BCR Mastercard",
  },
  {
    id: "10",
    date: "2023-05-21",
    vendor: "Automercado",
    amount: 29500,
    currency: "CRC" as CurrencyCode,
    category: "Groceries",
    card: "BAC Visa",
  },
]

const categories = ["All Categories", "Groceries", "Dining", "Entertainment", "Transportation", "Shopping", "Other"]

const cards = ["All Cards", "Chase Sapphire", "Amex Gold", "BAC Visa", "BCR Mastercard"]

export default function TransactionsPage() {
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>("USD")

  const getDisplayAmount = (transaction: (typeof transactions)[0]) => {
    if (transaction.currency === displayCurrency) {
      return formatCurrency(transaction.amount, transaction.currency)
    }

    const convertedAmount = convertCurrency(transaction.amount, transaction.currency, displayCurrency)
    return formatCurrency(convertedAmount, displayCurrency)
  }

  const getOriginalAmount = (transaction: (typeof transactions)[0]) => {
    if (transaction.currency === displayCurrency) {
      return null
    }
    return formatCurrency(transaction.amount, transaction.currency)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">View and manage your transaction history</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
          <CurrencyToggle currentCurrency={displayCurrency} onCurrencyChange={setDisplayCurrency} />
          <Button variant="outline" size="sm">
            Export CSV
          </Button>
          <Button size="sm">Bulk Edit</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search transactions..." className="w-full pl-8" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select defaultValue="All Categories">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select defaultValue="All Cards">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Card" />
                </SelectTrigger>
                <SelectContent>
                  {cards.map((card) => (
                    <SelectItem key={card} value={card}>
                      {card}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10">
                    <Filter className="mr-2 h-4 w-4" />
                    Date Range
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                  <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                  <DropdownMenuItem>Last 90 days</DropdownMenuItem>
                  <DropdownMenuItem>Custom range</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Card</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => {
                  const originalAmount = getOriginalAmount(transaction)
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.vendor}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{getDisplayAmount(transaction)}</span>
                          {originalAmount && <span className="text-xs text-muted-foreground">({originalAmount})</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.category}</Badge>
                      </TableCell>
                      <TableCell>{transaction.card}</TableCell>
                      <TableCell className="text-right">
                        <TransactionDialog transaction={transaction} />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
