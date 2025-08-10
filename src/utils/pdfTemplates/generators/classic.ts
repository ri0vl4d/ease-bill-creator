import { InvoiceData } from '../types';

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

export const generateClassicTemplate = (data: InvoiceData): string => {
  const { invoice, client, company, items } = data;
  
  return `
    <div style="max-width: 800px; margin: 0 auto; background: white; font-family: 'Times New Roman', serif; border: 2px solid #1f2937;">
      <!-- Header -->
      <div style="padding: 40px; border-bottom: 3px solid #1f2937;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            ${company?.logo_url ? `<img src="${company.logo_url}" alt="Company Logo" style="max-height: 80px; margin-bottom: 20px;" />` : ''}
            <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #1f2937; letter-spacing: 1px;">
              ${company?.company_name || 'Your Company'}
            </h1>
            ${company?.address ? `<p style="margin: 10px 0; color: #4b5563; font-size: 14px;">${company.address}</p>` : ''}
            <div style="margin-top: 15px;">
              ${company?.email ? `<p style="margin: 3px 0; color: #4b5563; font-size: 14px;">Email: ${company.email}</p>` : ''}
              ${company?.phone ? `<p style="margin: 3px 0; color: #4b5563; font-size: 14px;">Phone: ${company.phone}</p>` : ''}
              ${company?.gstin ? `<p style="margin: 3px 0; color: #4b5563; font-size: 14px;">GSTIN: ${company.gstin}</p>` : ''}
            </div>
          </div>
          <div style="text-align: right; border: 3px solid #1f2937; padding: 20px;">
            <h2 style="margin: 0; font-size: 36px; font-weight: bold; color: #1f2937;">INVOICE</h2>
            <p style="margin: 10px 0; font-size: 20px; font-weight: bold; color: #4b5563;">${invoice.invoice_number}</p>
          </div>
        </div>
      </div>

      <!-- Invoice Info -->
      <div style="padding: 30px; background: #f9fafb;">
        <div style="display: flex; justify-content: space-between;">
          <div style="width: 48%;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px; text-decoration: underline;">BILL TO:</h3>
            <div style="border: 2px solid #d1d5db; padding: 20px; background: white;">
              <p style="margin: 0 0 10px 0; font-weight: bold; font-size: 18px; color: #1f2937;">
                ${client.company_name || client.name}
              </p>
              ${client.address ? `<p style="margin: 0 0 8px 0; color: #4b5563;">${client.address}</p>` : ''}
              ${client.email ? `<p style="margin: 0 0 8px 0; color: #4b5563;">${client.email}</p>` : ''}
              ${client.phone ? `<p style="margin: 0 0 8px 0; color: #4b5563;">${client.phone}</p>` : ''}
              ${client.gstin ? `<p style="margin: 0; color: #4b5563;">GSTIN: ${client.gstin}</p>` : ''}
            </div>
          </div>
          <div style="width: 48%;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px; text-decoration: underline;">INVOICE DETAILS:</h3>
            <div style="border: 2px solid #d1d5db; padding: 20px; background: white;">
              <p style="margin: 0 0 10px 0; color: #4b5563;"><strong>Invoice Date:</strong> ${formatDate(invoice.invoice_date)}</p>
              ${invoice.due_date ? `<p style="margin: 0 0 10px 0; color: #4b5563;"><strong>Due Date:</strong> ${formatDate(invoice.due_date)}</p>` : ''}
              <p style="margin: 0; color: #4b5563;"><strong>Status:</strong> <span style="text-transform: uppercase; font-weight: bold;">${invoice.status}</span></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div style="padding: 30px;">
        <table style="width: 100%; border-collapse: collapse; border: 2px solid #1f2937;">
          <thead>
            <tr style="background: #1f2937; color: white;">
              <th style="padding: 15px; text-align: left; border-right: 1px solid #4b5563; font-size: 16px;">DESCRIPTION</th>
              <th style="padding: 15px; text-align: center; border-right: 1px solid #4b5563; font-size: 16px; width: 80px;">QTY</th>
              <th style="padding: 15px; text-align: right; border-right: 1px solid #4b5563; font-size: 16px; width: 100px;">RATE</th>
              <th style="padding: 15px; text-align: center; border-right: 1px solid #4b5563; font-size: 16px; width: 80px;">GST%</th>
              <th style="padding: 15px; text-align: right; font-size: 16px; width: 120px;">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr style="border-bottom: 1px solid #d1d5db;">
                <td style="padding: 15px; border-right: 1px solid #d1d5db; vertical-align: top;">
                  <div style="font-weight: bold; margin-bottom: 5px; color: #1f2937; font-size: 16px;">${item.item_name}</div>
                  ${item.description ? `<div style="font-size: 14px; color: #6b7280; font-style: italic;">${item.description}</div>` : ''}
                </td>
                <td style="padding: 15px; text-align: center; border-right: 1px solid #d1d5db; font-size: 16px;">${item.quantity}</td>
                <td style="padding: 15px; text-align: right; border-right: 1px solid #d1d5db; font-size: 16px;">${formatCurrency(item.unit_price)}</td>
                <td style="padding: 15px; text-align: center; border-right: 1px solid #d1d5db; font-size: 16px;">${item.gst_rate}%</td>
                <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 16px;">${formatCurrency(item.line_total + item.gst_amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div style="padding: 0 30px 30px; display: flex; justify-content: flex-end;">
        <div style="width: 400px;">
          <table style="width: 100%; border-collapse: collapse; border: 2px solid #1f2937;">
            <tr style="border-bottom: 1px solid #d1d5db;">
              <td style="padding: 12px 20px; text-align: right; font-size: 16px; color: #4b5563;">Subtotal:</td>
              <td style="padding: 12px 20px; text-align: right; font-weight: bold; font-size: 16px;">${formatCurrency(invoice.subtotal)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #d1d5db;">
              <td style="padding: 12px 20px; text-align: right; font-size: 16px; color: #4b5563;">Total GST:</td>
              <td style="padding: 12px 20px; text-align: right; font-weight: bold; font-size: 16px;">${formatCurrency(invoice.total_gst)}</td>
            </tr>
            ${invoice.discount > 0 ? `
              <tr style="border-bottom: 1px solid #d1d5db;">
                <td style="padding: 12px 20px; text-align: right; font-size: 16px; color: #4b5563;">Discount:</td>
                <td style="padding: 12px 20px; text-align: right; font-weight: bold; font-size: 16px; color: #dc2626;">-${formatCurrency(invoice.discount)}</td>
              </tr>
            ` : ''}
            <tr style="background: #1f2937; color: white;">
              <td style="padding: 20px; text-align: right; font-size: 20px; font-weight: bold;">TOTAL AMOUNT:</td>
              <td style="padding: 20px; text-align: right; font-size: 24px; font-weight: bold;">${formatCurrency(invoice.total_amount)}</td>
            </tr>
          </table>
        </div>
      </div>

      ${invoice.notes ? `
        <div style="padding: 0 30px 30px;">
          <div style="border: 2px solid #d1d5db; padding: 20px; background: #f9fafb;">
            <h4 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; text-decoration: underline;">NOTES:</h4>
            <p style="margin: 0; color: #4b5563; line-height: 1.8; font-size: 16px;">${invoice.notes}</p>
          </div>
        </div>
      ` : ''}

      <!-- Footer -->
      <div style="padding: 30px; text-align: center; border-top: 3px solid #1f2937; background: #f9fafb;">
        <p style="margin: 0; color: #1f2937; font-size: 18px; font-weight: bold;">Thank you for your business!</p>
        ${company?.email ? `<p style="margin: 10px 0 0 0; color: #4b5563; font-size: 14px;">For any queries, please contact us at ${company.email}</p>` : ''}
      </div>
    </div>
  `;
};