import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InvoiceData {
  invoice: {
    id: string;
    invoice_number: string;
    invoice_date: string;
    due_date: string | null;
    status: string;
    subtotal: number;
    total_gst: number;
    total_amount: number;
    discount: number;
    notes: string | null;
  };
  client: {
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    company_name: string | null;
    gstin: string | null;
  };
  company: {
    company_name: string;
    address: string | null;
    email: string | null;
    phone: string | null;
    gstin: string | null;
    pan: string | null;
    logo_url: string | null;
  } | null;
  items: Array<{
    item_name: string;
    description: string | null;
    quantity: number;
    unit_price: number;
    gst_rate: number;
    line_total: number;
    gst_amount: number;
  }>;
}

export const generateInvoicePDF = async (data: InvoiceData) => {
  const { invoice, client, company, items } = data;

  // Create a temporary div for PDF content
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '210mm'; // A4 width
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.padding = '20px';
  tempDiv.style.fontFamily = 'Arial, sans-serif';
  tempDiv.style.fontSize = '12px';
  tempDiv.style.lineHeight = '1.4';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generate HTML content for the invoice
  tempDiv.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto; background: white;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb;">
        <div>
          ${company?.logo_url ? `<img src="${company.logo_url}" alt="Company Logo" style="max-height: 60px; margin-bottom: 10px;" />` : ''}
          <h1 style="margin: 0; color: #1f2937; font-size: 24px; font-weight: bold;">
            ${company?.company_name || 'Your Company'}
          </h1>
          ${company?.address ? `<p style="margin: 5px 0; color: #6b7280;">${company.address}</p>` : ''}
          <div style="margin-top: 10px;">
            ${company?.email ? `<p style="margin: 2px 0; color: #6b7280;">Email: ${company.email}</p>` : ''}
            ${company?.phone ? `<p style="margin: 2px 0; color: #6b7280;">Phone: ${company.phone}</p>` : ''}
            ${company?.gstin ? `<p style="margin: 2px 0; color: #6b7280;">GSTIN: ${company.gstin}</p>` : ''}
            ${company?.pan ? `<p style="margin: 2px 0; color: #6b7280;">PAN: ${company.pan}</p>` : ''}
          </div>
        </div>
        <div style="text-align: right;">
          <h2 style="margin: 0; color: #1f2937; font-size: 28px; font-weight: bold;">INVOICE</h2>
          <p style="margin: 5px 0; font-size: 16px; font-weight: bold;">${invoice.invoice_number}</p>
          <div style="margin-top: 15px;">
            <p style="margin: 2px 0;"><strong>Date:</strong> ${formatDate(invoice.invoice_date)}</p>
            ${invoice.due_date ? `<p style="margin: 2px 0;"><strong>Due Date:</strong> ${formatDate(invoice.due_date)}</p>` : ''}
            <p style="margin: 2px 0;"><strong>Status:</strong> <span style="text-transform: uppercase; font-weight: bold; color: ${
              invoice.status === 'paid' ? '#059669' : 
              invoice.status === 'sent' ? '#0891b2' : 
              invoice.status === 'overdue' ? '#dc2626' : '#6b7280'
            };">${invoice.status}</span></p>
          </div>
        </div>
      </div>

      <!-- Bill To Section -->
      <div style="margin-bottom: 30px;">
        <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px; font-weight: bold;">Bill To:</h3>
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
          <p style="margin: 0 0 5px 0; font-weight: bold; font-size: 14px;">
            ${client.company_name || client.name}
          </p>
          ${client.company_name && client.name !== client.company_name ? `<p style="margin: 0 0 5px 0;">${client.name}</p>` : ''}
          ${client.address ? `<p style="margin: 0 0 5px 0;">${client.address}</p>` : ''}
          ${client.email ? `<p style="margin: 0 0 5px 0;">Email: ${client.email}</p>` : ''}
          ${client.phone ? `<p style="margin: 0 0 5px 0;">Phone: ${client.phone}</p>` : ''}
          ${client.gstin ? `<p style="margin: 0 0 5px 0;">GSTIN: ${client.gstin}</p>` : ''}
        </div>
      </div>

      <!-- Items Table -->
      <div style="margin-bottom: 30px;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 12px 8px; text-align: left; border: 1px solid #d1d5db; font-weight: bold;">Item</th>
              <th style="padding: 12px 8px; text-align: center; border: 1px solid #d1d5db; font-weight: bold; width: 80px;">Qty</th>
              <th style="padding: 12px 8px; text-align: right; border: 1px solid #d1d5db; font-weight: bold; width: 100px;">Rate</th>
              <th style="padding: 12px 8px; text-align: center; border: 1px solid #d1d5db; font-weight: bold; width: 80px;">GST%</th>
              <th style="padding: 12px 8px; text-align: right; border: 1px solid #d1d5db; font-weight: bold; width: 100px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td style="padding: 12px 8px; border: 1px solid #d1d5db; vertical-align: top;">
                  <div style="font-weight: bold; margin-bottom: 2px;">${item.item_name}</div>
                  ${item.description ? `<div style="font-size: 11px; color: #6b7280;">${item.description}</div>` : ''}
                </td>
                <td style="padding: 12px 8px; border: 1px solid #d1d5db; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px 8px; border: 1px solid #d1d5db; text-align: right;">${formatCurrency(item.unit_price)}</td>
                <td style="padding: 12px 8px; border: 1px solid #d1d5db; text-align: center;">${item.gst_rate}%</td>
                <td style="padding: 12px 8px; border: 1px solid #d1d5db; text-align: right;">${formatCurrency(item.line_total + item.gst_amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Totals Section -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
        <div style="width: 300px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 12px; text-align: right; border-top: 1px solid #d1d5db;">Subtotal:</td>
              <td style="padding: 8px 12px; text-align: right; border-top: 1px solid #d1d5db; font-weight: bold;">${formatCurrency(invoice.subtotal)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; text-align: right;">Total GST:</td>
              <td style="padding: 8px 12px; text-align: right; font-weight: bold;">${formatCurrency(invoice.total_gst)}</td>
            </tr>
            ${invoice.discount > 0 ? `
              <tr>
                <td style="padding: 8px 12px; text-align: right;">Discount:</td>
                <td style="padding: 8px 12px; text-align: right; font-weight: bold;">-${formatCurrency(invoice.discount)}</td>
              </tr>
            ` : ''}
            <tr style="background: #f3f4f6;">
              <td style="padding: 12px; text-align: right; border-top: 2px solid #d1d5db; font-size: 16px; font-weight: bold;">Total Amount:</td>
              <td style="padding: 12px; text-align: right; border-top: 2px solid #d1d5db; font-size: 16px; font-weight: bold;">${formatCurrency(invoice.total_amount)}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Notes Section -->
      ${invoice.notes ? `
        <div style="margin-bottom: 30px;">
          <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px; font-weight: bold;">Notes:</h3>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; line-height: 1.5;">${invoice.notes}</p>
          </div>
        </div>
      ` : ''}

      <!-- Footer -->
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #d1d5db; text-align: center; color: #6b7280; font-size: 11px;">
        <p style="margin: 0;">Thank you for your business!</p>
        ${company?.email ? `<p style="margin: 5px 0 0 0;">For any queries, please contact us at ${company.email}</p>` : ''}
      </div>
    </div>
  `;

  document.body.appendChild(tempDiv);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: tempDiv.scrollWidth,
      height: tempDiv.scrollHeight,
    });

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Download the PDF
    pdf.save(`Invoice-${invoice.invoice_number}.pdf`);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    // Clean up
    document.body.removeChild(tempDiv);
  }
};