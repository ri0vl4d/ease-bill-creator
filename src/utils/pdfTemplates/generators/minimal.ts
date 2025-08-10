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

export const generateMinimalTemplate = (data: InvoiceData): string => {
  const { invoice, client, company, items } = data;
  
  return `
    <div style="max-width: 800px; margin: 0 auto; background: white; font-family: 'Helvetica Neue', Arial, sans-serif; color: #374151;">
      <!-- Header -->
      <div style="padding: 50px 0 30px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div>
            ${company?.logo_url ? `<img src="${company.logo_url}" alt="Company Logo" style="max-height: 50px; margin-bottom: 20px; opacity: 0.8;" />` : ''}
            <h1 style="margin: 0; font-size: 24px; font-weight: 300; color: #374151; letter-spacing: 2px;">
              ${company?.company_name || 'YOUR COMPANY'}
            </h1>
            ${company?.address ? `<p style="margin: 8px 0; color: #9ca3af; font-size: 14px;">${company.address}</p>` : ''}
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; font-size: 48px; font-weight: 100; color: #374151; letter-spacing: 3px;">INVOICE</h2>
            <p style="margin: 10px 0; font-size: 16px; color: #9ca3af;">${invoice.invoice_number}</p>
          </div>
        </div>
      </div>

      <!-- Invoice Details -->
      <div style="padding: 40px 0;">
        <div style="display: flex; justify-content: space-between;">
          <div style="width: 45%;">
            <h3 style="margin: 0 0 20px 0; color: #374151; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Bill To</h3>
            <div>
              <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: 500; color: #1f2937;">
                ${client.company_name || client.name}
              </p>
              ${client.address ? `<p style="margin: 0 0 6px 0; color: #6b7280; font-size: 14px;">${client.address}</p>` : ''}
              ${client.email ? `<p style="margin: 0 0 6px 0; color: #6b7280; font-size: 14px;">${client.email}</p>` : ''}
              ${client.phone ? `<p style="margin: 0 0 6px 0; color: #6b7280; font-size: 14px;">${client.phone}</p>` : ''}
              ${client.gstin ? `<p style="margin: 0; color: #6b7280; font-size: 14px;">GSTIN: ${client.gstin}</p>` : ''}
            </div>
          </div>
          <div style="width: 45%; text-align: right;">
            <h3 style="margin: 0 0 20px 0; color: #374151; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Invoice Details</h3>
            <div>
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Date: <span style="color: #1f2937; font-weight: 500;">${formatDate(invoice.invoice_date)}</span></p>
              ${invoice.due_date ? `<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Due: <span style="color: #1f2937; font-weight: 500;">${formatDate(invoice.due_date)}</span></p>` : ''}
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Status: <span style="color: #1f2937; font-weight: 500; text-transform: uppercase;">${invoice.status}</span></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div style="margin: 40px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid #374151;">
              <th style="padding: 20px 0; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #374151;">Description</th>
              <th style="padding: 20px 0; text-align: center; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #374151; width: 80px;">Qty</th>
              <th style="padding: 20px 0; text-align: right; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #374151; width: 100px;">Rate</th>
              <th style="padding: 20px 0; text-align: center; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #374151; width: 80px;">GST%</th>
              <th style="padding: 20px 0; text-align: right; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #374151; width: 120px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 20px 0; vertical-align: top;">
                  <div style="font-size: 16px; font-weight: 500; margin-bottom: 4px; color: #1f2937;">${item.item_name}</div>
                  ${item.description ? `<div style="font-size: 14px; color: #9ca3af;">${item.description}</div>` : ''}
                </td>
                <td style="padding: 20px 0; text-align: center; font-size: 16px; color: #6b7280;">${item.quantity}</td>
                <td style="padding: 20px 0; text-align: right; font-size: 16px; color: #6b7280;">${formatCurrency(item.unit_price)}</td>
                <td style="padding: 20px 0; text-align: center; font-size: 16px; color: #6b7280;">${item.gst_rate}%</td>
                <td style="padding: 20px 0; text-align: right; font-size: 16px; font-weight: 500; color: #1f2937;">${formatCurrency(item.line_total + item.gst_amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div style="display: flex; justify-content: flex-end; margin: 40px 0;">
        <div style="width: 300px;">
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #6b7280; font-size: 14px;">Subtotal</span>
              <span style="color: #1f2937; font-size: 14px; font-weight: 500;">${formatCurrency(invoice.subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #6b7280; font-size: 14px;">GST</span>
              <span style="color: #1f2937; font-size: 14px; font-weight: 500;">${formatCurrency(invoice.total_gst)}</span>
            </div>
            ${invoice.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #6b7280; font-size: 14px;">Discount</span>
                <span style="color: #dc2626; font-size: 14px; font-weight: 500;">-${formatCurrency(invoice.discount)}</span>
              </div>
            ` : ''}
            <div style="border-top: 2px solid #374151; padding-top: 20px; margin-top: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #374151; font-size: 18px; font-weight: 300; text-transform: uppercase; letter-spacing: 1px;">Total</span>
                <span style="color: #1f2937; font-size: 24px; font-weight: 500;">${formatCurrency(invoice.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${invoice.notes ? `
        <div style="margin: 50px 0;">
          <h4 style="margin: 0 0 15px 0; color: #374151; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Notes</h4>
          <p style="margin: 0; color: #6b7280; line-height: 1.6; font-size: 14px;">${invoice.notes}</p>
        </div>
      ` : ''}

      <!-- Footer -->
      <div style="margin-top: 60px; padding-top: 30px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Thank you for your business</p>
        ${company?.email ? `<p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 12px;">${company.email}</p>` : ''}
      </div>
    </div>
  `;
};