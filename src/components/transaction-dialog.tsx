"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Edit, Calendar } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Transaction, Category, CreditCard } from "@/types"

const transactionSchema = z.object({
  credit_card_id: z.number().min(1, "Credit card is required"),
  category_id: z.number().optional(),
  amount: z.string().min(1, "Amount is required").regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  currency: z.string().min(1, "Currency is required"),
  reference_id: z.string().min(1, "Reference ID is required"),
  merchant_name: z.string().min(1, "Merchant name is required"),
  city: z.string().optional(),
  country: z.string().optional(),
  transaction_date: z.date({
    required_error: "Transaction date is required",
  }),
  authorization_code: z.string().optional(),
  transaction_type: z.enum(["EXPENSE", "INCOME"]),
})

type TransactionFormData = z.infer<typeof transactionSchema>

interface TransactionDialogProps {
  transaction?: Transaction
  categories: Category[]
  creditCards: CreditCard[]
  onSubmit: (data: TransactionFormData) => Promise<void>
  trigger?: React.ReactNode
  mode?: "create" | "edit"
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const currencies = ["USD", "CRC", "EUR", "GBP", "JPY", "CAD", "AUD"]

const getCardBrandIcon = (brand: string) => {
  switch (brand.toLowerCase()) {
    case 'visa':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-3" fill="currentColor">
          <path d="M22.4 4H1.6C.7 4 0 4.7 0 5.6v12.8C0 19.3.7 20 1.6 20h20.8c.9 0 1.6-.7 1.6-1.6V5.6C24 4.7 23.3 4 22.4 4zM7.5 15.5H4.9l1.3-8h2.6l-1.3 8zm6.5 0h-2.1l1.3-8h2.1l-1.3 8zm3.5 0h-2.6l1.3-8h2.6l-1.3 8z"/>
        </svg>
      )
    case 'mastercard':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-3" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          <circle cx="9" cy="12" r="3" fill="#ff5f00"/>
          <circle cx="15" cy="12" r="3" fill="#eb001b"/>
        </svg>
      )
    case 'amex':
    case 'american express':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-3" fill="currentColor">
          <path d="M22.4 4H1.6C.7 4 0 4.7 0 5.6v12.8C0 19.3.7 20 1.6 20h20.8c.9 0 1.6-.7 1.6-1.6V5.6C24 4.7 23.3 4 22.4 4zM12 15.5l-2.5-3.5h-1.5l3.5 5h1l3.5-5h-1.5L12 15.5z"/>
        </svg>
      )
    case 'discover':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-3" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-3" fill="currentColor">
          <rect x="2" y="6" width="20" height="12" rx="2" ry="2"/>
          <rect x="6" y="10" width="12" height="2"/>
        </svg>
      )
  }
}

export function TransactionDialog({ 
  transaction, 
  categories, 
  creditCards, 
  onSubmit, 
  trigger, 
  mode = "create",
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: TransactionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = controlledOnOpenChange || setInternalOpen
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [date, setDate] = useState<Date | undefined>(
    transaction?.transaction_date ? new Date(transaction.transaction_date) : new Date()
  )

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      credit_card_id: transaction?.credit_card_id || 0,
      category_id: transaction?.category_id || undefined,
      amount: transaction?.amount || "",
      currency: transaction?.currency || "USD",
      reference_id: transaction?.reference_id || "",
      merchant_name: transaction?.merchant_name || "",
      city: transaction?.city || "",
      country: transaction?.country || "",
      transaction_date: transaction?.transaction_date ? new Date(transaction.transaction_date) : new Date(),
      authorization_code: transaction?.authorization_code || "",
      transaction_type: transaction?.transaction_type || "EXPENSE",
    },
  })

  const watchedCreditCardId = watch("credit_card_id")
  const watchedCategoryId = watch("category_id")
  
  // Get the selected credit card to show its currencies
  const selectedCard = creditCards.find(card => card.id === watchedCreditCardId)

  useEffect(() => {
    if (transaction) {
      setValue("credit_card_id", transaction.credit_card_id)
      setValue("category_id", transaction.category_id)
      setValue("amount", transaction.amount)
      setValue("currency", transaction.currency)
      setValue("reference_id", transaction.reference_id)
      setValue("merchant_name", transaction.merchant_name)
      setValue("city", transaction.city || "")
      setValue("country", transaction.country || "")
      setValue("transaction_date", new Date(transaction.transaction_date))
      setValue("authorization_code", transaction.authorization_code || "")
      setValue("transaction_type", transaction.transaction_type)
      setDate(new Date(transaction.transaction_date))
    } else {
      reset()
      setDate(new Date())
    }
  }, [transaction, setValue, reset])

  // Set default currency when credit card changes (only for new transactions)
  useEffect(() => {
    if (!transaction && selectedCard && watchedCreditCardId) {
      setValue("currency", selectedCard.primary_currency)
    }
  }, [watchedCreditCardId, selectedCard, transaction, setValue])

  const handleFormSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      setOpen(false)
      reset()
      setDate(new Date())
    } catch (error) {
      console.error("Error submitting transaction:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      setValue("transaction_date", selectedDate)
    }
  }



  const defaultTrigger = mode === "create" ? (
    <Button>
      <Plus className="mr-2 h-4 w-4" /> Add Transaction
    </Button>
  ) : (
    <Button variant="ghost" size="icon">
      <Edit className="h-4 w-4" />
      <span className="sr-only">Edit</span>
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Only render the trigger in create mode or if a custom trigger is provided */}
      {(mode === "create" || trigger) && (
        <DialogTrigger asChild>
          {trigger || defaultTrigger}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Transaction" : "Edit Transaction"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Credit Card */}
            <div className="space-y-2">
              <Label htmlFor="credit_card_id">Credit Card *</Label>
              <Select value={watchedCreditCardId.toString()} onValueChange={(value) => setValue("credit_card_id", parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select credit card" />
                </SelectTrigger>
                <SelectContent>
                  {creditCards.map((card) => (
                    <SelectItem key={card.id} value={card.id.toString()}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-4 rounded border flex items-center justify-center text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200">
                          {getCardBrandIcon(card.brand)}
                        </div>
                        <span>{card.name} - {card.last_four_digits}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.credit_card_id && (
                <p className="text-sm text-red-500">{errors.credit_card_id.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
              <Select value={watchedCategoryId?.toString() || "none"} onValueChange={(value) => setValue("category_id", value === "none" ? undefined : parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
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
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                {...register("amount")}
                placeholder="0.00"
                type="text"
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Select value={watch("currency")} onValueChange={(value) => setValue("currency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => {
                    const isCardCurrency = selectedCard && (
                      currency === selectedCard.primary_currency || 
                      currency === selectedCard.secondary_currency
                    )
                    return (
                      <SelectItem key={currency} value={currency}>
                        <div className="flex items-center gap-2">
                          <span>{currency}</span>
                          {isCardCurrency && (
                            <span className="text-xs text-muted-foreground">
                              {currency === selectedCard.primary_currency ? '(Primary)' : '(Secondary)'}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {selectedCard && (
                <p className="text-xs text-muted-foreground">
                  Card currencies: {selectedCard.primary_currency}
                  {selectedCard.secondary_currency && `, ${selectedCard.secondary_currency}`}
                </p>
              )}
              {errors.currency && (
                <p className="text-sm text-red-500">{errors.currency.message}</p>
              )}
            </div>

            {/* Reference ID */}
            <div className="space-y-2">
              <Label htmlFor="reference_id">Reference ID *</Label>
              <Input
                id="reference_id"
                {...register("reference_id")}
                placeholder="Transaction reference"
              />
              {errors.reference_id && (
                <p className="text-sm text-red-500">{errors.reference_id.message}</p>
              )}
            </div>

            {/* Transaction Type */}
            <div className="space-y-2">
              <Label htmlFor="transaction_type">Transaction Type *</Label>
              <Select value={watch("transaction_type")} onValueChange={(value: "EXPENSE" | "INCOME") => setValue("transaction_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                  <SelectItem value="INCOME">Income</SelectItem>
                </SelectContent>
              </Select>
              {errors.transaction_type && (
                <p className="text-sm text-red-500">{errors.transaction_type.message}</p>
              )}
            </div>
          </div>

          {/* Merchant Name */}
          <div className="space-y-2">
            <Label htmlFor="merchant_name">Merchant Name *</Label>
            <Input
              id="merchant_name"
              {...register("merchant_name")}
              placeholder="Merchant or vendor name"
            />
            {errors.merchant_name && (
              <p className="text-sm text-red-500">{errors.merchant_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register("city")}
                placeholder="City"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                {...register("country")}
                placeholder="Country"
              />
            </div>
          </div>

          {/* Transaction Date */}
          <div className="space-y-2">
            <Label>Transaction Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.transaction_date && (
              <p className="text-sm text-red-500">{errors.transaction_date.message}</p>
            )}
          </div>

          {/* Authorization Code */}
          <div className="space-y-2">
            <Label htmlFor="authorization_code">Authorization Code</Label>
            <Input
              id="authorization_code"
              {...register("authorization_code")}
              placeholder="Authorization code (optional)"
            />
          </div>



          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
