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

export const generateModernTemplate = (data: InvoiceData): string => {
  const { invoice, client, company, items } = data;
  
  return `
    <div style="max-width: 800px; margin: 0 auto; background: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; padding: 30px; border-radius: 8px 8px 0 0;">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div>
            ${company?.logo_url ? `<img src="${company.logo_url}" alt="Company Logo" style="max-height: 60px; margin-bottom: 15px;" />` : ''}
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">
              ${company?.company_name || 'Your Company'}
            </h1>
            ${company?.address ? `<p style="margin: 8px 0; opacity: 0.9;">${company.address}</p>` : ''}
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; font-size: 32px; font-weight: bold;">INVOICE</h2>
            <p style="margin: 5px 0; font-size: 18px; font-weight: 600;">${invoice.invoice_number}</p>
          </div>
        </div>
      </div>

      <!-- Invoice Details -->
      <div style="padding: 30px; background: #f8fafc;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div>
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Bill To:</h3>
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px; color: #1f2937;">
                ${client.company_name || client.name}
              </p>
              ${client.address ? `<p style="margin: 0 0 8px 0; color: #6b7280;">${client.address}</p>` : ''}
              ${client.email ? `<p style="margin: 0 0 8px 0; color: #6b7280;">Email: ${client.email}</p>` : ''}
              ${client.phone ? `<p style="margin: 0 0 8px 0; color: #6b7280;">Phone: ${client.phone}</p>` : ''}
              ${client.gstin ? `<p style="margin: 0; color: #6b7280;">GSTIN: ${client.gstin}</p>` : ''}
            </div>
          </div>
          <div style="text-align: right;">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <p style="margin: 0 0 8px 0; color: #6b7280;"><strong>Date:</strong> ${formatDate(invoice.invoice_date)}</p>
              ${invoice.due_date ? `<p style="margin: 0 0 8px 0; color: #6b7280;"><strong>Due Date:</strong> ${formatDate(invoice.due_date)}</p>` : ''}
              <p style="margin: 0; color: #6b7280;"><strong>Status:</strong> <span style="text-transform: uppercase; font-weight: bold; color: #2563eb;">${invoice.status}</span></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div style="padding: 0 30px;">
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <thead>
            <tr style="background: #2563eb; color: white;">
              <th style="padding: 15px; text-align: left; font-weight: 600;">Item</th>
              <th style="padding: 15px; text-align: center; font-weight: 600; width: 80px;">Qty</th>
              <th style="padding: 15px; text-align: right; font-weight: 600; width: 100px;">Rate</th>
              <th style="padding: 15px; text-align: center; font-weight: 600; width: 80px;">GST%</th>
              <th style="padding: 15px; text-align: right; font-weight: 600; width: 120px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, index) => `
              <tr style="border-bottom: 1px solid #e5e7eb; ${index % 2 === 0 ? 'background: #f9fafb;' : 'background: white;'}">
                <td style="padding: 15px; vertical-align: top;">
                  <div style="font-weight: 600; margin-bottom: 4px; color: #1f2937;">${item.item_name}</div>
                  ${item.description ? `<div style="font-size: 12px; color: #6b7280;">${item.description}</div>` : ''}
                </td>
                <td style="padding: 15px; text-align: center; color: #374151;">${item.quantity}</td>
                <td style="padding: 15px; text-align: right; color: #374151;">${formatCurrency(item.unit_price)}</td>
                <td style="padding: 15px; text-align: center; color: #374151;">${item.gst_rate}%</td>
                <td style="padding: 15px; text-align: right; font-weight: 600; color: #1f2937;">${formatCurrency(item.line_total + item.gst_amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div style="padding: 30px; display: flex; justify-content: flex-end;">
        <div style="width: 350px;">
          <div style="background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">
            <div style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #6b7280;">Subtotal:</span>
                <span style="font-weight: 600; color: #1f2937;">${formatCurrency(invoice.subtotal)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #6b7280;">Total GST:</span>
                <span style="font-weight: 600; color: #1f2937;">${formatCurrency(invoice.total_gst)}</span>
              </div>
              ${invoice.discount > 0 ? `
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #6b7280;">Discount:</span>
                  <span style="font-weight: 600; color: #dc2626;">-${formatCurrency(invoice.discount)}</span>
                </div>
              ` : ''}
            </div>
            <div style="padding: 20px; background: #2563eb; color: white;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 18px; font-weight: bold;">Total Amount:</span>
                <span style="font-size: 24px; font-weight: bold;">${formatCurrency(invoice.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${invoice.notes ? `
        <div style="padding: 0 30px 30px;">
          <div style="background: #f0f9ff; border-left: 4px solid #2563eb; padding: 20px; border-radius: 0 8px 8px 0;">
            <h4 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px;">Notes:</h4>
            <p style="margin: 0; color: #374151; line-height: 1.6;">${invoice.notes}</p>
          </div>
        </div>
      ` : ''}

      <!-- Footer -->
      <div style="padding: 30px; text-align: center; background: #f8fafc; border-radius: 0 0 8px 8px;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">Thank you for your business!</p>
        ${company?.email ? `<p style="margin: 8px 0 0 0; color: #6b7280; font-size: 12px;">For any queries, please contact us at ${company.email}</p>` : ''}
      </div>
    </div>
  `;
};