"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColorPicker } from "@/components/ui/color-picker"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Edit } from "lucide-react"
import type { Category } from "@/types"

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryDialogProps {
  category?: Category
  onSubmit: (data: CategoryFormData) => Promise<void>
  trigger?: React.ReactNode
  mode?: "create" | "edit"
}



export function CategoryDialog({ category, onSubmit, trigger, mode = "create" }: CategoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      color: category?.color || "#3B82F6",
    },
  })

  // Watch the color value for real-time preview
  const currentColor = watch("color")

  useEffect(() => {
    if (category) {
      setValue("name", category.name)
      setValue("color", category.color)
    } else {
      reset()
    }
  }, [category, setValue, reset])

  const handleFormSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      setOpen(false)
      reset()
    } catch (error) {
      console.error("Error submitting category:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleColorChange = (color: string) => {
    setValue("color", color)
  }

  const defaultTrigger = mode === "create" ? (
    <Button>
      <Plus className="mr-2 h-4 w-4" /> Add Category
    </Button>
  ) : (
    <Button variant="ghost" size="icon">
      <Edit className="h-4 w-4" />
      <span className="sr-only">Edit</span>
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Category" : "Edit Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter category name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <ColorPicker
            value={currentColor}
            onChange={handleColorChange}
            label="Color"
          />
          {errors.color && (
            <p className="text-sm text-red-500">{errors.color.message}</p>
          )}

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