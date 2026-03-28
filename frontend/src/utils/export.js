import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Download data as CSV
 * @param {Array} data - Array of objects
 * @param {string} filename - Filename to save as
 */
export const downloadCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) return

  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((field) => {
          let val = row[field] === null || row[field] === undefined ? '' : String(row[field])
          // Remove potential newlines for CSV safety
          val = val.replace(/\n/g, ' ')
          const escaped = val.replace(/"/g, '""')
          return `"${escaped}"`
        })
        .join(',')
    ),
  ]

  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Download data as PDF
 * @param {Array} data - Array of objects
 * @param {string} title - Title in the PDF
 * @param {string} filename - Filename to save as
 */
export const downloadPDF = (data, title = 'Data Export', filename = 'export.pdf') => {
  if (!data || data.length === 0) return

  const doc = new jsPDF()
  const headers = Object.keys(data[0])
  const rows = data.map((item) => Object.values(item))

  doc.setFontSize(18)
  doc.text(title, 14, 22)
  doc.setFontSize(11)
  doc.setTextColor(100)
  doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 30)

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [7, 89, 133] }, // Azure/Cyan theme
  })

  doc.save(filename)
}
