import { jsPDF } from "jspdf";

export async function exportElementToPdf(elementId: string, filename: string) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#0f172a" });
  const img = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const w = pdf.internal.pageSize.getWidth();
  const h = (canvas.height * w) / canvas.width;
  pdf.addImage(img, "PNG", 0, 0, w, Math.min(h, 280));
  pdf.save(filename);
}

export function downloadBase64Png(base64: string, filename: string) {
  const link = document.createElement("a");
  link.href = `data:image/png;base64,${base64}`;
  link.download = filename;
  link.click();
}

export function copyText(text: string) {
  navigator.clipboard.writeText(text);
}
