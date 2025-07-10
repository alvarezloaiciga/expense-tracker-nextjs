"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { CreditCard } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, CreditCard as CreditCardIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency, CURRENCIES, type CurrencyCode } from "@/lib/currency"
import { useSettings } from "@/hooks/useSettings"
import { useAuth } from "@/hooks/useAuth0"
import { useTranslation } from "@/hooks/useTranslation"
import api from '@/services/api'

const BRANDS = [
  { value: "Visa", label: "Visa", logo: <svg className="w-8 h-6 block" viewBox="0 0 32 20" fill="none"><rect width="32" height="20" rx="3" fill="#fff"/><text x="16" y="14" textAnchor="middle" fontSize="9" fill="#1A1F71" fontWeight="bold">VISA</text></svg> },
  { value: "Mastercard", label: "Mastercard", logo: <svg className="w-8 h-6 block" viewBox="0 0 32 20" fill="none"><rect width="32" height="20" rx="3" fill="#fff"/><circle cx="14" cy="10" r="6" fill="#EB001B"/><circle cx="18" cy="10" r="6" fill="#F79E1B" fillOpacity="0.8"/></svg> },
  { value: "Amex", label: "Amex", logo: <svg className="w-8 h-6 block" viewBox="0 0 32 20" fill="none"><rect width="32" height="20" rx="3" fill="#fff"/><text x="16" y="14" textAnchor="middle" fontSize="9" fill="#2E77BB" fontWeight="bold">AMEX</text></svg> },
  { value: "Discover", label: "Discover", logo: <svg className="w-8 h-6 block" viewBox="0 0 32 20" fill="none"><rect width="32" height="20" rx="3" fill="#fff"/><text x="16" y="14" textAnchor="middle" fontSize="9" fill="#F76B1C" fontWeight="bold">DISC</text></svg> },
]

function getBrandLogo(brand: string) {
  const found = BRANDS.find(b => b.value === brand)
  return (
    <div className="flex items-center justify-center pr-2 flex-shrink-0 whitespace-nowrap">{found ? found.logo : <CreditCardIcon className="h-8 w-6 text-muted-foreground" />}</div>
  )
}

export default function CreditCardsPage() {
  const queryClient = useQueryClient()
  const { settings } = useSettings()
  const { getAccessToken } = useAuth()
  const { t } = useTranslation()
  const { data: cards = [], isLoading } = useQuery({
    queryKey: ["credit-cards"],
    queryFn: async () => {
      const accessToken = await getAccessToken()
      return api.getCreditCards(accessToken)
    },
  })

  // Dialog state
  const [open, setOpen] = useState(false)
  const [editCard, setEditCard] = useState<CreditCard | null>(null)
  const [deleteCard, setDeleteCard] = useState<CreditCard | null>(null)

  // Form state
  const [form, setForm] = useState<Partial<CreditCard>>({
    primary_currency: "USD"
  })

  // Mutations
  const addOrEditMutation = useMutation({
    mutationFn: async (card: Partial<CreditCard>) => {
      const accessToken = await getAccessToken()
      if (editCard) {
        return api.updateCreditCard({ ...editCard, ...card } as CreditCard, accessToken)
      } else {
        return api.createCreditCard({
          name: card.name!,
          last_four_digits: card.last_four_digits!,
          brand: card.brand!,
          primary_currency: card.primary_currency!,
          secondary_currency: card.secondary_currency,
        }, accessToken)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credit-cards"] })
      setOpen(false)
      setEditCard(null)
      setForm({})
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (card: CreditCard) => {
      const accessToken = await getAccessToken()
      return api.deleteCreditCard(card.id, accessToken)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credit-cards"] })
      setDeleteCard(null)
    },
  })

  // Handlers
  const openAdd = () => {
    setEditCard(null)
    setForm({})
    setOpen(true)
  }
  const openEdit = (card: CreditCard) => {
    setEditCard(card)
    setForm(card)
    setOpen(true)
  }
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }
  const handleBrandChange = (value: string) => {
    setForm((f) => ({ ...f, brand: value }))
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addOrEditMutation.mutate(form)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("creditCards.title")}</h1>
          <p className="text-muted-foreground">{t("creditCards.subtitle")}</p>
        </div>
        <Button onClick={openAdd} variant="default">
          <Plus className="mr-2 h-4 w-4" /> {t("creditCards.addCard")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.id} className="relative">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">{getBrandLogo(card.brand)}
                    <CardTitle className="text-lg font-semibold">{card.name}</CardTitle>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(card)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteCard(card)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("creditCards.last4")}</span>
                  <span className="font-mono">{card.last_four_digits}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("creditCards.currencies")}</span>
                  <span className="text-sm font-medium">
                    {CURRENCIES[card.primary_currency as CurrencyCode]?.symbol} {card.primary_currency}
                    {card.secondary_currency && (
                      <span className="text-muted-foreground ml-1">
                        / {CURRENCIES[card.secondary_currency as CurrencyCode]?.symbol} {card.secondary_currency}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("creditCards.totalExpenses")}</span>
                  <span className="font-semibold flex flex-col items-end gap-0">
                    {Object.entries(card.expenses_by_currency).length > 0 ? (
                      Object.entries(card.expenses_by_currency).map(([currency, amount]) => (
                        <span key={currency}> {formatCurrency(amount, currency as any)} </span>
                      ))
                    ) : (
                      <span>-</span>
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editCard ? t("creditCards.editCard") : t("creditCards.addCard")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{t("creditCards.name")}</Label>
              <Input name="name" id="name" value={form.name || ""} onChange={handleFormChange} required />
            </div>
            <div>
              <Label htmlFor="brand">{t("creditCards.brand")}</Label>
              <Select value={form.brand || ""} onValueChange={handleBrandChange} required>
                <SelectTrigger id="brand">
                  <SelectValue placeholder={t("creditCards.selectBrand")} />
                </SelectTrigger>
                <SelectContent>
                  {BRANDS.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      <span className="flex items-center">{getBrandLogo(b.value)}{b.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="last_four_digits">{t("creditCards.last4Digits")}</Label>
              <Input name="last_four_digits" id="last_four_digits" value={form.last_four_digits || ""} maxLength={4} onChange={handleFormChange} required />
            </div>
            <div>
              <Label htmlFor="primary_currency">{t("creditCards.primaryCurrency")}</Label>
              <Select value={form.primary_currency || ""} onValueChange={(value) => setForm((f) => ({ ...f, primary_currency: value }))} required>
                <SelectTrigger id="primary_currency">
                  <SelectValue placeholder={t("creditCards.selectPrimaryCurrency")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CURRENCIES).map(([code, info]) => (
                    <SelectItem key={code} value={code}>
                      {info.symbol} {info.name} ({info.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="secondary_currency">{t("creditCards.secondaryCurrency")}</Label>
              <Select value={form.secondary_currency || "none"} onValueChange={(value) => setForm((f) => ({ ...f, secondary_currency: value === "none" ? null : value }))}>
                <SelectTrigger id="secondary_currency">
                  <SelectValue placeholder={t("creditCards.selectSecondaryCurrency")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("creditCards.none")}</SelectItem>
                  {Object.entries(CURRENCIES).map(([code, info]) => (
                    <SelectItem key={code} value={code}>
                      {info.symbol} {info.name} ({info.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={addOrEditMutation.isPending}>
                {editCard ? t("creditCards.saveChanges") : t("creditCards.addCard")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteCard} onOpenChange={() => setDeleteCard(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("creditCards.deleteCard")}</DialogTitle>
          </DialogHeader>
          <p>{t("creditCards.deleteConfirmation", { name: deleteCard?.name || "" })}</p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteCard(null)}>
              {t("common.cancel")}
            </Button>
            <Button type="button" variant="destructive" onClick={() => deleteCard && deleteMutation.mutate(deleteCard)}>
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 