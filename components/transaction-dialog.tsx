"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye } from "lucide-react"
import { formatCurrency, CURRENCIES, type CurrencyCode } from "@/lib/currency"

const categories = ["Groceries", "Dining", "Entertainment", "Transportation", "Shopping", "Other"]

const cards = ["Chase Sapphire", "Amex Gold", "BAC Visa", "BCR Mastercard"]

interface Transaction {
  id: string
  date: string
  vendor: string
  amount: number
  currency: CurrencyCode
  category: string
  card: string
}

interface TransactionDialogProps {
  transaction: Transaction
}

export function TransactionDialog({ transaction }: TransactionDialogProps) {
  const [open, setOpen] = useState(false)
  const [editedTransaction, setEditedTransaction] = useState(transaction)

  const handleSave = () => {
    // In a real app, you would save the changes to your backend
    console.log("Saving transaction:", editedTransaction)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
          <span className="sr-only">View transaction</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>View and edit transaction information</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="email">Email Source</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={editedTransaction.date}
                  onChange={(e) =>
                    setEditedTransaction({
                      ...editedTransaction,
                      date: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                    {CURRENCIES[editedTransaction.currency].symbol}
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    step={editedTransaction.currency === "CRC" ? "1" : "0.01"}
                    value={editedTransaction.amount}
                    onChange={(e) =>
                      setEditedTransaction({
                        ...editedTransaction,
                        amount: Number.parseFloat(e.target.value),
                      })
                    }
                    className="rounded-l-none"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                value={editedTransaction.vendor}
                onChange={(e) =>
                  setEditedTransaction({
                    ...editedTransaction,
                    vendor: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={editedTransaction.currency}
                  onValueChange={(value: CurrencyCode) =>
                    setEditedTransaction({
                      ...editedTransaction,
                      currency: value,
                    })
                  }
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CURRENCIES).map(([code, info]) => (
                      <SelectItem key={code} value={code}>
                        {info.symbol} {info.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={editedTransaction.category}
                  onValueChange={(value) =>
                    setEditedTransaction({
                      ...editedTransaction,
                      category: value,
                    })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="card">Card</Label>
                <Select
                  value={editedTransaction.card}
                  onValueChange={(value) =>
                    setEditedTransaction({
                      ...editedTransaction,
                      card: value,
                    })
                  }
                >
                  <SelectTrigger id="card">
                    <SelectValue placeholder="Select card" />
                  </SelectTrigger>
                  <SelectContent>
                    {cards.map((card) => (
                      <SelectItem key={card} value={card}>
                        {card}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm font-medium">Formatted Amount:</p>
              <p className="text-lg font-bold">
                {formatCurrency(editedTransaction.amount, editedTransaction.currency)}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="email" className="space-y-4 py-4">
            <div className="rounded-md bg-muted p-4 font-mono text-sm">
              <p className="text-xs text-muted-foreground mb-2">
                Original email received on {new Date(editedTransaction.date).toLocaleString()}
              </p>
              <p>
                <strong>From:</strong> {editedTransaction.vendor}@notifications.com
              </p>
              <p>
                <strong>Subject:</strong> Your purchase receipt
              </p>
              <div className="mt-4 border-t pt-4">
                <p>Thank you for your purchase!</p>
                <p className="mt-2">
                  You were charged {formatCurrency(editedTransaction.amount, editedTransaction.currency)} on your{" "}
                  {editedTransaction.card}.
                </p>
                <p className="mt-2">Transaction date: {new Date(editedTransaction.date).toLocaleDateString()}</p>
                <p className="mt-2">Category: {editedTransaction.category}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
