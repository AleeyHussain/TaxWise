import jsPDF from "jspdf";
import type { RecommendationResult } from "@/types";

export function exportRecommendationPdf(result: RecommendationResult) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const primaryColor = [30, 58, 138]; // #1E3A8A Navy
  const textColor = [15, 23, 42]; // Slate 900
  const mutedColor = [100, 116, 139]; // Slate 500

  // Header Bar
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 24, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("TaxWise — Tax Plan Recommendation", 15, 15);

  let y = 36;

  // Title & Price Box
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(20);
  doc.text(result.recommendedProductName, 15, y);

  doc.setFontSize(16);
  doc.setTextColor(5, 150, 105); // Emerald 600
  const priceText = result.price === 0 ? "Free ($0)" : `$${result.price}`;
  doc.text(priceText, 195 - doc.getTextWidth(priceText), y);

  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.setFont("helvetica", "normal");
  doc.text(`Match Confidence: ${result.confidence.toUpperCase()}`, 15, y);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 195 - doc.getTextWidth(`Generated on: ${new Date().toLocaleDateString()}`), y);

  // Divider
  y += 6;
  doc.setDrawColor(226, 232, 240);
  doc.line(15, y, 195, y);
  y += 10;

  // Reasons Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text("Why this plan was selected:", 15, y);
  y += 7;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  result.reasons.forEach((reason) => {
    const lines = doc.splitTextToSize(`• ${reason}`, 180);
    doc.text(lines, 18, y);
    y += lines.length * 5.5;
  });

  // Matched Inputs
  if (result.matchedInputs.length > 0) {
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Matched Profile Factors:", 15, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    const inputsText = result.matchedInputs.join(", ");
    const lines = doc.splitTextToSize(inputsText, 180);
    doc.text(lines, 18, y);
    y += lines.length * 5.5;
  }

  // Warnings / Upgrades
  if (result.optionalUpgrade) {
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 83, 9); // Amber 700
    doc.text(`Optional Upgrade: ${result.optionalUpgrade.productName}`, 15, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(result.optionalUpgrade.reason, 180);
    doc.text(lines, 18, y);
    y += lines.length * 5.5;
  }

  // Disclaimer Section
  y = Math.max(y + 8, 240);
  doc.setDrawColor(226, 232, 240);
  doc.line(15, y, 195, y);
  y += 6;

  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  const disclaimerLines = doc.splitTextToSize(result.disclaimer, 180);
  doc.text(disclaimerLines, 15, y);

  // Footer
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("TaxWise Recommender · Confidential and personalized for client evaluation", 15, 285);

  doc.save("taxwise-recommendation.pdf");
}
