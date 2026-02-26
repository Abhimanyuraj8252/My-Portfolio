import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const fmtCurrency = (n, currencyCode = "INR") => {
    try {
        // Use a simple format that avoids special font characters (like ₹)
        // because standard PDF fonts don't support them.
        const num = Number(n || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return `${currencyCode} ${num}`;
    } catch (e) {
        return `${currencyCode} ${Number(n || 0).toFixed(2)}`;
    }
};

const fmtDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

/**
 * Generates a premium, professional A4 PDF invoice.
 * @param {Object} invoice — full invoice data
 * @param {Object} company — sender details
 * @param {String} mode — 'download' (default) or 'preview'
 */
export const generateInvoicePDF = (invoice, company = {}, mode = 'download') => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const W = doc.internal.pageSize.getWidth();   // ~595
    const H = doc.internal.pageSize.getHeight();  // ~842
    const M = 40; // margin

    const currency = invoice.currency || invoice.metadata?.currency || "INR";

    // Premium Vibrant Colors (Violet Theme)
    const primary = [109, 40, 217]; // Violet 600
    const primaryDark = [46, 24, 106]; // Deep Violet
    const primaryLight = [237, 233, 254]; // Violet 100
    const textDark = [30, 41, 59]; // Slate 800
    const textMuted = [100, 116, 139]; // Slate 500
    const white = [255, 255, 255];
    const bgLight = [248, 250, 252]; // Slate 50
    const border = [226, 232, 240]; // Slate 200

    // ─── HEADER BLOCK (Colorful & Premium) ──────────────
    doc.setFillColor(...primaryDark);
    doc.rect(0, 0, W, 160, "F");

    let y = 45;

    // Logo or Company Name
    if (company.logoBase64) {
        try {
            // Extract format from data URI (e.g., data:image/jpeg;base64,...)
            const formatMatch = company.logoBase64.match(/^data:image\/(png|jpeg|jpg);base64,/);
            const format = formatMatch ? formatMatch[1].toUpperCase() : 'PNG';

            // Add logo (assuming square/rectangular aspect ratio for simplicity, max height 50)
            doc.addImage(company.logoBase64, format === 'JPG' ? 'JPEG' : format, M, y - 25, 50, 50);
            y += 40;
        } catch (e) {
            console.error("Error adding logo to PDF", e);
            doc.setFontSize(26);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...white);
            doc.text(company.name || "Your Business", M, y);
            y += 18;
        }
    } else {
        doc.setFontSize(26);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...white);
        doc.text(company.name || "Your Business", M, y);
        y += 18;
    }

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 190, 255); // Soft violet-white
    if (company.tagline) {
        doc.text(company.tagline, M, y);
        y += 14;
    }

    const contactLines = [];
    if (company.email) contactLines.push(company.email);
    if (company.phone) contactLines.push(company.phone);
    if (contactLines.length) {
        doc.text(contactLines.join("  |  "), M, y);
        y += 14;
    }
    if (company.website) {
        doc.text(company.website, M, y);
    }

    // INVOICE Title (Right)
    doc.setFontSize(36);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...white);
    doc.text("INVOICE", W - M, 55, { align: "right" });

    // Invoice Meta (Right)
    let rightY = 85;
    const drawMeta = (label, value) => {
        // Label
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(200, 190, 255);
        doc.text(label, W - M - 130, rightY);

        // Value
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...white);
        doc.text(String(value), W - M, rightY, { align: "right" });
        rightY += 16;
    };

    drawMeta("Invoice No:", invoice.invoiceNumber);
    drawMeta("Date:", fmtDate(invoice.date));
    drawMeta("Due Date:", fmtDate(invoice.dueDate));

    // Status Badge
    rightY += 4;
    const isPaid = invoice.status === 'Paid';
    const isOverdue = invoice.status === 'Overdue';
    const badgeBg = isPaid ? [34, 197, 94] : (isOverdue ? [239, 68, 68] : [245, 158, 11]);

    doc.setFillColor(...badgeBg);
    doc.roundedRect(W - M - 70, rightY - 12, 70, 18, 4, 4, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...white);
    doc.text(invoice.status.toUpperCase(), W - M - 35, rightY, { align: "center" });

    // ─── ADDRESSES SECTION ──────────────────────────────
    y = 195;

    // From Address (Left)
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primary);
    doc.text("FROM:", M, y);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...textDark);
    doc.text(company.name || "Your Business", M, y + 16);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textMuted);
    let fromY = y + 30;
    if (company.address) {
        const fromAddr = doc.splitTextToSize(company.address, 220);
        doc.text(fromAddr, M, fromY);
        fromY += fromAddr.length * 12;
    }
    if (company.gstNo) {
        fromY += 4;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...textDark);
        doc.text(`GSTIN: ${company.gstNo}`, M, fromY);
        fromY += 12;
    }

    // Bill To Address (Right)
    const toX = W / 2 + 20;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primary);
    doc.text("BILL TO:", toX, y);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...textDark);
    doc.text(invoice.clientName || "Client Name", toX, y + 16);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textMuted);
    let toY = y + 30;
    if (invoice.clientEmail) { doc.text(invoice.clientEmail, toX, toY); toY += 12; }

    const clientPhone = invoice.clientPhone || invoice.metadata?.clientPhone;
    if (clientPhone) { doc.text(clientPhone, toX, toY); toY += 12; }

    const clientAddress = invoice.clientAddress || invoice.metadata?.clientAddress;
    if (clientAddress) {
        const toAddr = doc.splitTextToSize(clientAddress, 220);
        doc.text(toAddr, toX, toY);
        toY += toAddr.length * 12;
    }

    y = Math.max(fromY, toY) + 30;

    // ─── ITEMS TABLE ────────────────────────────────────
    const items = Array.isArray(invoice.items) ? invoice.items : [];
    const gstPercent = invoice.gstPercent ?? invoice.metadata?.gstPercent ?? 0;
    const hasGST = gstPercent > 0;

    autoTable(doc, {
        startY: y,
        margin: { left: M, right: M },
        head: [["Item Description", "Quantity", "Rate", "Amount"]],
        body: items.map((it) => {
            const amt = (parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0);
            const title = it.serviceName || it.description || "Item";
            const desc = it.description && it.serviceName ? `\n${it.description}` : "";
            return [
                title + desc,
                it.qty,
                fmtCurrency(it.price, currency),
                fmtCurrency(amt, currency),
            ];
        }),
        theme: 'grid',
        styles: {
            font: "helvetica",
            fontSize: 9,
            textColor: textDark,
            cellPadding: 10,
            lineColor: border,
            lineWidth: 0.5,
        },
        headStyles: {
            fillColor: primary,
            textColor: white,
            fontStyle: "bold",
            fontSize: 10,
            cellPadding: 10,
        },
        alternateRowStyles: {
            fillColor: bgLight,
        },
        columnStyles: {
            0: { halign: "left" },
            1: { halign: "center" },
            2: { halign: "right" },
            3: { halign: "right" },
        },
    });

    y = doc.lastAutoTable.finalY + 25;

    // Check if there's enough space for totals, otherwise add a new page
    if (y > H - 180) {
        doc.addPage();
        y = M + 20;
    }

    // ─── TOTALS & NOTES ─────────────────────────────────
    const leftX = M;
    const rightX = W - M - 210;
    const valX = W - M;

    let leftY = y + 10;
    let rightY2 = y + 10;

    // Totals (Right Side)
    const drawSummaryLine = (label, value, isTotal = false, isDiscount = false) => {
        doc.setFontSize(isTotal ? 12 : 10);
        doc.setFont("helvetica", isTotal ? "bold" : "normal");
        doc.setTextColor(...(isTotal ? primaryDark : textMuted));
        doc.text(label, rightX, rightY2);

        doc.setFont("helvetica", isTotal ? "bold" : "normal");
        doc.setTextColor(...(isTotal ? primaryDark : (isDiscount ? [34, 197, 94] : textDark)));
        doc.text(fmtCurrency(value, currency), valX, rightY2, { align: "right" });
        rightY2 += isTotal ? 24 : 20;
    };

    const subtotal_val = invoice.subtotal || invoice.totalAmount;
    drawSummaryLine("Subtotal", subtotal_val);

    const dsPercent = invoice.discountPercent ?? invoice.metadata?.discountPercent ?? 0;
    const dsAmount = invoice.discountAmount ?? (subtotal_val * dsPercent / 100);
    if (dsAmount > 0) {
        drawSummaryLine(`Discount (${dsPercent}%)`, -dsAmount, false, true);
    }

    const gAmount = invoice.gstAmount ?? ((subtotal_val - dsAmount) * gstPercent / 100);
    if (hasGST) {
        drawSummaryLine(`CGST (${gstPercent / 2}%)`, gAmount / 2);
        drawSummaryLine(`SGST (${gstPercent / 2}%)`, gAmount / 2);
    }

    rightY2 += 10;
    doc.setDrawColor(...border);
    doc.setLineWidth(1);
    doc.line(rightX, rightY2 - 16, valX, rightY2 - 16);

    // Grand Total Box
    doc.setFillColor(...primaryLight);
    doc.roundedRect(rightX - 10, rightY2 - 14, 230, 36, 6, 6, "F");
    rightY2 += 10;

    // Explicitly bold and larger for Total
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryDark);
    doc.text("Grand Total", rightX, rightY2);
    doc.text(fmtCurrency(invoice.totalAmount, currency), valX, rightY2, { align: "right" });

    // Notes & Bank Details (Left Side after Table)
    const notes = invoice.notes || invoice.metadata?.notes;
    if (notes) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...primaryDark);
        doc.text("Notes:", leftX, leftY);
        leftY += 16;

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...textMuted);
        const noteLines = doc.splitTextToSize(notes, 250);
        doc.text(noteLines, leftX, leftY);
        leftY += noteLines.length * 12 + 15;
    }

    // Bank Details & UPI (Left Side)
    if (company.bankDetails || company.upiId) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...primaryDark);
        doc.text("Payment Details:", leftX, leftY);
        leftY += 16;

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...textDark);

        if (company.bankDetails) {
            const bankLines = doc.splitTextToSize(company.bankDetails, 250);
            doc.text(bankLines, leftX, leftY);
            leftY += bankLines.length * 12 + 8;
        }

        if (company.upiId) {
            doc.setFont("helvetica", "bold");
            doc.text(`UPI ID: ${company.upiId}`, leftX, leftY);
            leftY += 15;
        }
    }

    // Payment Method (Left Side)
    const paymentMethod = invoice.paymentMethod || invoice.metadata?.paymentMethod;
    if (paymentMethod) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...primaryDark);
        doc.text("Payment Method: ", leftX, leftY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...textDark);
        const pmWidth = doc.getTextWidth("Payment Method: ");
        doc.text(paymentMethod, leftX + pmWidth, leftY);
    }

    // Terms & Conditions - Always below BOTH notes and totals
    const terms = invoice.terms || invoice.metadata?.terms;
    if (terms) {
        let termsY = Math.max(leftY, rightY2) + 40;

        // Ensure we have enough space for at least a couple of lines, else new page
        if (termsY > H - 100) {
            doc.addPage();
            termsY = M + 40;
        }

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...primaryDark);
        doc.text("Terms & Conditions:", M, termsY);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...textMuted);
        const termLines = doc.splitTextToSize(terms, W - (M * 2));
        doc.text(termLines, M, termsY + 14);
    }

    // ─── FOOTER ─────────────────────────────────────────
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        const fY = H - 40;
        doc.setDrawColor(...border);
        doc.setLineWidth(0.5);
        doc.line(M, fY - 15, W - M, fY - 15);

        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...primary);
        doc.text("Thank you for your business!", W / 2, fY, { align: "center" });
    }

    if (mode === 'preview') {
        window.open(doc.output('bloburl'), '_blank');
    } else {
        doc.save(`${invoice.invoiceNumber}.pdf`);
    }
};
