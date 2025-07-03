"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ChevronDown, Filter, Search, Edit, Trash2, Eye } from "lucide-react"
import { TransactionDialog } from "@/components/transaction-dialog"
import { CurrencyToggle } from "@/components/currency-toggle"
import { formatCurrency, convertCurrency, type CurrencyCode } from "@/lib/currency"
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, getCategories, getCreditCards } from "@/services/api"
import type { Transaction, Category, CreditCard } from "@/types"
import { useToast } from "@/../../hooks/use-toast"
import { format } from "date-fns"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [creditCards, setCreditCards] = useState<CreditCard[]>([])
  const [loading, setLoading] = useState(true)
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>("USD")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories")
  const [selectedCard, setSelectedCard] = useState<string>("All Cards")
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const { toast } = useToast()

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [transactionsData, categoriesData, creditCardsData] = await Promise.all([
        getTransactions(),
        getCategories(),
        getCreditCards(),
      ])
      setTransactions(transactionsData)
      setCategories(categoriesData)
      setCreditCards(creditCardsData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.merchant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference_id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "All Categories"
      ? true
      : selectedCategory === "Uncategorized"
        ? !transaction.category_id
        : categories.find(c => c.id === transaction.category_id)?.name === selectedCategory
    
    const matchesCard = selectedCard === "All Cards" ||
                       creditCards.find(c => c.id === transaction.credit_card_id)?.name === selectedCard

    return matchesSearch && matchesCategory && matchesCard
  })

  const getDisplayAmount = (transaction: Transaction) => {
    const amount = parseFloat(transaction.amount)
    if (transaction.currency === displayCurrency) {
      return formatCurrency(amount, transaction.currency as CurrencyCode)
    }

    const convertedAmount = convertCurrency(amount, transaction.currency as CurrencyCode, displayCurrency)
    return formatCurrency(convertedAmount, displayCurrency)
  }

  const getOriginalAmount = (transaction: Transaction) => {
    const amount = parseFloat(transaction.amount)
    if (transaction.currency === displayCurrency) {
      return null
    }
    return formatCurrency(amount, transaction.currency as CurrencyCode)
  }

  const handleCreateTransaction = async (data: any) => {
    try {
      const newTransaction = await createTransaction({
        ...data,
        transaction_date: data.transaction_date.toISOString(),
      })
      setTransactions(prev => [newTransaction, ...prev])
      toast({
        title: "Success",
        description: "Transaction created successfully",
      })
    } catch (error) {
      console.error("Error creating transaction:", error)
      toast({
        title: "Error",
        description: "Failed to create transaction",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleUpdateTransaction = async (data: any) => {
    if (!editingTransaction) return

    try {
      const updatedTransaction = await updateTransaction({
        ...editingTransaction,
        ...data,
        transaction_date: data.transaction_date.toISOString(),
      })
      setTransactions(prev => prev.map(t => 
        t.id === updatedTransaction.id ? updatedTransaction : t
      ))
      setEditingTransaction(undefined)
      setEditDialogOpen(false)
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      })
    } catch (error) {
      console.error("Error updating transaction:", error)
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleDeleteTransaction = async (transaction: Transaction) => {
    try {
      await deleteTransaction(transaction.id)
      setTransactions(prev => prev.filter(t => t.id !== transaction.id))
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting transaction:", error)
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setEditDialogOpen(true)
  }

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "No Category"
    const category = categories.find(c => c.id === categoryId)
    return category?.name || "Unknown Category"
  }

  const getCategoryColor = (categoryId?: number) => {
    if (!categoryId) return "#6B7280"
    const category = categories.find(c => c.id === categoryId)
    return category?.color || "#6B7280"
  }

  const getCardName = (cardId: number) => {
    const card = creditCards.find(c => c.id === cardId)
    return card?.name || "Unknown Card"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">View and manage your transaction history</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    )
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
          <TransactionDialog
            categories={categories}
            creditCards={creditCards}
            onSubmit={handleCreateTransaction}
            mode="create"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search transactions..." 
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Categories">All Categories</SelectItem>
                  <SelectItem value="Uncategorized">Uncategorized</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCard} onValueChange={setSelectedCard}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Card" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Cards">All Cards</SelectItem>
                  {creditCards.map((card) => (
                    <SelectItem key={card.id} value={card.name}>
                      {card.name} - {card.last_four_digits}
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
                  <TableHead>Merchant</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Card</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      {searchTerm || selectedCategory !== "All Categories" || selectedCard !== "All Cards" 
                        ? "No transactions found" 
                        : "No transactions yet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {format(new Date(transaction.transaction_date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.merchant_name}</div>
                          <div className="text-sm text-muted-foreground">{transaction.reference_id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getCategoryColor(transaction.category_id) }}
                          />
                          <span className="text-sm">{getCategoryName(transaction.category_id)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{getCardName(transaction.credit_card_id)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{getDisplayAmount(transaction)}</div>
                          {getOriginalAmount(transaction) && (
                            <div className="text-sm text-muted-foreground">
                              {getOriginalAmount(transaction)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={transaction.transaction_type === "EXPENSE" ? "destructive" : "default"}>
                          {transaction.transaction_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(transaction)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this transaction? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteTransaction(transaction)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingTransaction && (
        <TransactionDialog
          transaction={editingTransaction}
          categories={categories}
          creditCards={creditCards}
          onSubmit={handleUpdateTransaction}
          mode="edit"
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </div>
  )
}
