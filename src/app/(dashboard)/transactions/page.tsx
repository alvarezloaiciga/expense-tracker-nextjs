"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { Pagination } from "@/components/ui/pagination"
import { useSettings } from "@/hooks/useSettings"

export default function TransactionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Local state for all filters/search/pagination
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedCard, setSelectedCard] = useState("All Cards")
  const [selectedDateRange, setSelectedDateRange] = useState("All")
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: 20,
  })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [creditCards, setCreditCards] = useState<CreditCard[]>([])
  const [loading, setLoading] = useState(true)
  const { defaultCurrency, enabledCurrencies } = useSettings()
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>(defaultCurrency)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const { toast } = useToast()

  // Update display currency when default currency changes
  useEffect(() => {
    setDisplayCurrency(defaultCurrency)
  }, [defaultCurrency])

  // If no enabled currencies, don't render currency toggle
  const showCurrencyToggle = enabledCurrencies && enabledCurrencies.length > 1
  
  const getCategoryId = () => {
    if (selectedCategory === "All Categories" || selectedCategory === "Uncategorized") return undefined;
    const cat = categories.find(c => c.name === selectedCategory);
    return cat ? cat.id : undefined;
  };

  const getCreditCardId = () => {
    if (selectedCard === "All Cards") return undefined;
    const card = creditCards.find(c => c.name === selectedCard);
    return card ? card.id : undefined;
  };

  const getDateRange = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1); // Start of last month
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // End of last month
    
    if (selectedDateRange === "This Week") {
      return { start: startOfWeek, end: now };
    } else if (selectedDateRange === "This Month") {
      return { start: startOfMonth, end: now };
    } else if (selectedDateRange === "Last Month") {
      return { start: startOfLastMonth, end: endOfLastMonth };
    }
    return {}; // Custom or All - no date filtering
  };

  // On mount, initialize local state from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setSearchTerm(params.get("search") || "")
    setSelectedCategory(params.get("category") || "All Categories")
    setSelectedCard(params.get("card") || "All Cards")
    setSelectedDateRange(params.get("dateRange") || "All")
    setPagination(prev => ({
      ...prev,
      current_page: parseInt(params.get("page") || "1"),
      per_page: parseInt(params.get("perPage") || "20"),
    }))
  }, [])

  // Listen for popstate (back/forward navigation) and sync local state
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search)
      setSearchTerm(params.get("search") || "")
      setSelectedCategory(params.get("category") || "All Categories")
      setSelectedCard(params.get("card") || "All Cards")
      setSelectedDateRange(params.get("dateRange") || "All")
      setPagination(prev => ({
        ...prev,
        current_page: parseInt(params.get("page") || "1"),
        per_page: parseInt(params.get("perPage") || "20"),
      }))
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  // Debounced URL update
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams()
      if (searchTerm) params.set("search", searchTerm)
      if (selectedCategory && selectedCategory !== "All Categories") params.set("category", selectedCategory)
      if (selectedCard && selectedCard !== "All Cards") params.set("card", selectedCard)
      if (selectedDateRange && selectedDateRange !== "All") params.set("dateRange", selectedDateRange)
      if (pagination.current_page !== 1) params.set("page", String(pagination.current_page))
      if (pagination.per_page !== 20) params.set("perPage", String(pagination.per_page))
      const url = params.toString() ? `?${params.toString()}` : ""
      // Use history.replaceState to avoid Next.js re-render
      window.history.replaceState(null, '', url)
    }, 500)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchTerm, selectedCategory, selectedCard, selectedDateRange, pagination.current_page, pagination.per_page])

  const loadTransactions = useCallback(async (page = pagination.current_page) => {
    setLoading(true);
    try {
      const categoryId = getCategoryId();
      const creditCardId = getCreditCardId();
      const dateRange = getDateRange();
      const params: any = {
        page,
        per_page: pagination.per_page,
        search: searchTerm || undefined,
      };
      if (categoryId) params.category_id = categoryId;
      if (selectedCategory === "Uncategorized") params.category_id = "null";
      if (creditCardId) params.credit_card_id = creditCardId;
      if (dateRange.start) params.start_date = dateRange.start.toISOString().slice(0, 10);
      if (dateRange.end) params.end_date = dateRange.end.toISOString().slice(0, 10);
      // Add more filters as needed
      const { transactions, pagination: newPagination } = await getTransactions(params);
      setTransactions(transactions);
      // Preserve the current per_page value from our state, not from server response
      setPagination({
        ...newPagination,
        per_page: pagination.per_page
      });
    } finally {
      setLoading(false);
    }
  }, [categories, creditCards, searchTerm, selectedCategory, selectedCard, selectedDateRange, pagination.per_page, pagination.current_page]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        getCategories().then(setCategories),
        getCreditCards().then(setCreditCards)
      ]);
    };
    loadInitialData();
  }, []);

  // Load transactions when filters change
  useEffect(() => {
    if (creditCards.length > 0) {
      loadTransactions(pagination.current_page);
    }
  }, [loadTransactions, creditCards.length, pagination.current_page]);

  // Load transactions when per_page changes
  useEffect(() => {
    if (categories.length > 0 && creditCards.length > 0) {
      console.log("Loading transactions", loading)
      loadTransactions(1); // Always go to page 1 when per_page changes
    }
  }, [pagination.per_page, categories.length, creditCards.length]);

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

  const getDisplayRefundAmount = (transaction: Transaction) => {
    if (!transaction.refund_amount) return null
    const refundAmount = parseFloat(transaction.refund_amount)
    if (transaction.currency === displayCurrency) {
      return formatCurrency(refundAmount, transaction.currency as CurrencyCode)
    }

    const convertedRefundAmount = convertCurrency(refundAmount, transaction.currency as CurrencyCode, displayCurrency)
    return formatCurrency(convertedRefundAmount, displayCurrency)
  }

  const getOriginalRefundAmount = (transaction: Transaction) => {
    if (!transaction.refund_amount) return null
    const refundAmount = parseFloat(transaction.refund_amount)
    if (transaction.currency === displayCurrency) {
      return null
    }
    return formatCurrency(refundAmount, transaction.currency as CurrencyCode)
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">View and manage your transaction history</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
          {showCurrencyToggle && (
            <CurrencyToggle currentCurrency={displayCurrency} onCurrencyChange={setDisplayCurrency} />
          )}
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
                    {selectedDateRange === "All" ? "Date Range" : selectedDateRange}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedDateRange("This Week")}>This Week</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedDateRange("This Month")}>This Month</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedDateRange("Last Month")}>Last Month</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedDateRange("All")}>All Time</DropdownMenuItem>
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      {searchTerm || selectedCategory !== "All Categories" || selectedCard !== "All Cards" 
                        ? "No transactions found" 
                        : "No transactions yet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
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
                          {transaction.refund_amount && (
                            <div className="text-sm text-green-600 font-medium">
                              Refund: {getDisplayRefundAmount(transaction)}
                            </div>
                          )}
                          {transaction.refund_amount && getOriginalRefundAmount(transaction) && (
                            <div className="text-xs text-muted-foreground">
                              {getOriginalRefundAmount(transaction)}
                            </div>
                          )}
                          {transaction.refunded_at && (
                            <div className="text-xs text-muted-foreground">
                              Refunded: {format(new Date(transaction.refunded_at), "MMM dd, yyyy")}
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

      {!loading && (
        <Pagination
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          pageSize={pagination.per_page}
          totalItems={pagination.total_count}
          onPageChange={(page) => {
            setPagination(prev => ({ ...prev, current_page: page }));
            loadTransactions(page);
          }}
          onPageSizeChange={(pageSize) => {
            setPagination(prev => ({ ...prev, per_page: pageSize, current_page: 1 }));
            // The loadTransactions will be triggered by the useEffect when pagination.per_page changes
          }}
        />
      )}

      {/* Edit Dialog rendered at the root, not inside Card/Table */}
      {editingTransaction && categories.length > 0 && creditCards.length > 0 && (
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
