"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Edit, Trash2, Search } from "lucide-react"
import { CategoryDialog } from "@/components/category-dialog"
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/services/api"
import type { Category } from "@/types"
import { useToast } from "@/../../hooks/use-toast"
import { useAuth } from "@/hooks/useAuth0"
import { useTranslation } from "@/hooks/useTranslation"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const { toast } = useToast()
  const { getAccessToken } = useAuth()
  const { t } = useTranslation()

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const accessToken = await getAccessToken()
      const categoriesData = await getCategories(accessToken)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: t("common.error"),
        description: t("categories.failedToLoad"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast, getAccessToken])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleCreateCategory = async (data: { name: string; color: string; budget: number }) => {
    try {
      const accessToken = await getAccessToken()
      const newCategory = await createCategory(data, accessToken)
      setCategories(prev => [...prev, newCategory])
      toast({
        title: t("common.success"),
        description: t("categories.categoryCreated"),
      })
    } catch (error) {
      console.error("Error creating category:", error)
      toast({
        title: t("common.error"),
        description: t("categories.failedToCreate"),
        variant: "destructive",
      })
      throw error
    }
  }

  const handleUpdateCategory = async (data: { name: string; color: string; budget: number }) => {
    if (!editingCategory) return

    try {
      const accessToken = await getAccessToken()
      const updatedCategory = await updateCategory({
        ...editingCategory,
        ...data,
      }, accessToken)
      setCategories(prev => prev.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      ))
      setEditingCategory(undefined)
      setEditDialogOpen(false)
      toast({
        title: t("common.success"),
        description: t("categories.categoryUpdated"),
      })
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: t("common.error"),
        description: t("categories.failedToUpdate"),
        variant: "destructive",
      })
      throw error
    }
  }

  const handleDeleteCategory = async (category: Category) => {
    try {
      const accessToken = await getAccessToken()
      await deleteCategory(category.id, accessToken)
      setCategories(prev => prev.filter(cat => cat.id !== category.id))
      toast({
        title: t("common.success"),
        description: t("categories.categoryDeleted"),
      })
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: t("common.error"),
        description: t("categories.failedToDelete"),
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (category: Category) => {
    setEditingCategory(category)
    setEditDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("categories.title")}</h1>
            <p className="text-muted-foreground">{t("categories.subtitle")}</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{t("categories.loadingCategories")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("categories.title")}</h1>
          <p className="text-muted-foreground">{t("categories.subtitle")}</p>
        </div>
        <CategoryDialog
          onSubmit={handleCreateCategory}
          mode="create"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <CardTitle>{t("categories.allCategories")}</CardTitle>
            <div className="mt-2 sm:mt-0 relative w-full sm:w-64">
              <Input type="search" placeholder={t("categories.searchPlaceholder")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("common.category")}</TableHead>
                  <TableHead>{t("categories.transactions")}</TableHead>
                  <TableHead>{t("categories.budget")}</TableHead>
                  <TableHead>{t("categories.spent")}</TableHead>
                  <TableHead>{t("categories.progress")}</TableHead>
                  <TableHead className="text-right">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      {searchTerm ? t("categories.noCategoriesFound") : t("categories.noCategoriesYet")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => {
                    const budget = category.budget != null ? category.budget : 0
                    const percent = budget > 0 ? (category.total_spent / budget) * 100 : 0
                    return (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                          {category.name}
                        </TableCell>
                        <TableCell>{category.transaction_count}</TableCell>
                        <TableCell>${budget ? budget.toLocaleString() : "—"}</TableCell>
                        <TableCell>${category.total_spent.toFixed(2)}</TableCell>
                        <TableCell style={{ minWidth: 120 }}>
                          <div className="flex items-center gap-2">
                            <Progress value={percent} className="h-2 flex-1" />
                            <span className="text-xs">{Math.round(percent)}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(category)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">{t("common.edit")}</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">{t("common.delete")}</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{t("categories.deleteCategory")}</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {t("categories.deleteConfirmation", { name: category.name })}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteCategory(category)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    {t("common.delete")}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingCategory && (
        <CategoryDialog
          category={editingCategory}
          onSubmit={handleUpdateCategory}
          mode="edit"
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </div>
  )
}
