"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface PdfExportProps {
  elementId: string
  fileName?: string
  buttonText?: string
}

export function PdfExport({
  elementId,
  fileName = "finance-dashboard.pdf",
  buttonText = "Export as PDF",
}: PdfExportProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToPdf = async () => {
    const element = document.getElementById(elementId)
    if (!element) {
      console.error(`Element with ID "${elementId}" not found`)
      return
    }

    setIsExporting(true)

    try {
      // Create a canvas from the element
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Allow loading of images from other domains
        logging: false,
        backgroundColor: document.documentElement.classList.contains("dark") ? "#1e1e1e" : "#ffffff",
      })

      // Calculate dimensions
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4")
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, imgHeight)

      // Save the PDF
      pdf.save(fileName)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button onClick={exportToPdf} disabled={isExporting} variant="outline" size="sm">
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          {buttonText}
        </>
      )}
    </Button>
  )
}
