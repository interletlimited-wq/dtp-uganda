// Deep-download exporters for a government report panel (spec A22 — deep reports
// downloadable in CSV, Excel and PDF). Each report carries title, description,
// alignment, stats[], insights[], detail{columns, rows} and an optional note.
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const slug = (s) => String(s || "report").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const fileName = (meta, report, ext) => `${slug(meta.institution)}-${report.id}.${ext}`;

function csvCell(v) {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function exportReportCSV(report, meta = {}) {
  const lines = [[report.title]];
  if (report.description) lines.push([report.description]);
  if (report.alignment) lines.push([report.alignment]);
  if (meta.asOf) lines.push([`Data as of: ${meta.asOf}`]);
  lines.push([]);
  lines.push(["Key metrics", "Value", "Detail"]);
  (report.stats || []).forEach((s) => lines.push([s.label, s.value, s.sub || ""]));
  if (report.insights?.length) {
    lines.push([]);
    lines.push(["Insights"]);
    report.insights.forEach((i) => lines.push([i]));
  }
  if (report.detail) {
    lines.push([]);
    lines.push(["Detailed entries"]);
    lines.push(report.detail.columns);
    report.detail.rows.forEach((r) => lines.push(r));
  }
  if (meta.note) {
    lines.push([]);
    lines.push([meta.note]);
  }
  const csv = lines.map((row) => (row || []).map(csvCell).join(",")).join("\r\n");
  triggerDownload(new Blob([csv], { type: "text/csv;charset=utf-8;" }), fileName(meta, report, "csv"));
}

export function exportReportXLSX(report, meta = {}) {
  const wb = XLSX.utils.book_new();

  const summary = [[report.title]];
  if (report.description) summary.push([report.description]);
  if (report.alignment) summary.push([report.alignment]);
  if (meta.asOf) summary.push([`Data as of: ${meta.asOf}`]);
  summary.push([]);
  summary.push(["Key metrics", "Value", "Detail"]);
  (report.stats || []).forEach((s) => summary.push([s.label, s.value, s.sub || ""]));
  if (report.insights?.length) {
    summary.push([]);
    summary.push(["Insights"]);
    report.insights.forEach((i) => summary.push([i]));
  }
  if (meta.note) {
    summary.push([]);
    summary.push([meta.note]);
  }
  const ws1 = XLSX.utils.aoa_to_sheet(summary);
  ws1["!cols"] = [{ wch: 44 }, { wch: 20 }, { wch: 28 }];
  XLSX.utils.book_append_sheet(wb, ws1, "Summary");

  if (report.detail) {
    const ws2 = XLSX.utils.aoa_to_sheet([report.detail.columns, ...report.detail.rows]);
    ws2["!cols"] = report.detail.columns.map(() => ({ wch: 22 }));
    XLSX.utils.book_append_sheet(wb, ws2, "Detailed entries");
  }
  XLSX.writeFile(wb, fileName(meta, report, "xlsx"));
}

export function exportReportPDF(report, meta = {}) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const M = 40;
  const wrapW = 760;
  let y = M;

  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.setTextColor(41, 41, 41);
  doc.text(report.title, M, y);
  y += 16;

  doc.setFont(undefined, "normal");
  doc.setFontSize(9);
  if (report.description) {
    doc.setTextColor(90, 90, 86);
    const l = doc.splitTextToSize(report.description, wrapW);
    doc.text(l, M, y);
    y += l.length * 11 + 2;
  }
  if (report.alignment) {
    doc.setTextColor(138, 98, 0);
    const l = doc.splitTextToSize(report.alignment, wrapW);
    doc.text(l, M, y);
    y += l.length * 11 + 2;
  }
  if (meta.asOf) {
    doc.setTextColor(150, 150, 150);
    doc.text(`Data as of: ${meta.asOf}`, M, y);
    y += 12;
  }

  if (report.stats?.length) {
    autoTable(doc, {
      startY: y + 4,
      head: [["Key metric", "Value", "Detail"]],
      body: report.stats.map((s) => [s.label, String(s.value), s.sub || ""]),
      theme: "grid",
      headStyles: { fillColor: [41, 41, 41] },
      styles: { fontSize: 8 },
      margin: { left: M, right: M },
    });
    y = doc.lastAutoTable.finalY + 12;
  }

  if (report.insights?.length) {
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.setTextColor(41, 41, 41);
    doc.text("Insights", M, y);
    y += 12;
    doc.setFontSize(8);
    doc.setFont(undefined, "normal");
    doc.setTextColor(60, 60, 60);
    report.insights.forEach((i) => {
      const l = doc.splitTextToSize("• " + i, wrapW);
      doc.text(l, M, y);
      y += l.length * 10;
    });
    y += 6;
  }

  if (report.detail) {
    autoTable(doc, {
      startY: y + 4,
      head: [report.detail.columns],
      body: report.detail.rows.map((r) => r.map((c) => String(c))),
      theme: "striped",
      headStyles: { fillColor: [247, 185, 15], textColor: [41, 41, 41] },
      styles: { fontSize: 7 },
      margin: { left: M, right: M },
    });
  }

  if (meta.note) {
    const fy = (doc.lastAutoTable?.finalY || y) + 14;
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(doc.splitTextToSize(meta.note, wrapW), M, fy);
  }

  doc.save(fileName(meta, report, "pdf"));
}

export function exportReport(report, format, meta = {}) {
  if (format === "xlsx") return exportReportXLSX(report, meta);
  if (format === "pdf") return exportReportPDF(report, meta);
  return exportReportCSV(report, meta);
}
