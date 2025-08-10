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

export const generateCorporateTemplate = (data: InvoiceData): string => {
  const { invoice, client, company, items } = data;
  
  return `
    <div style="max-width: 800px; margin: 0 auto; background: white; font-family: 'Arial', sans-serif;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 40px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -30px; left: -30px; width: 150px; height: 150px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
        <div style="position: relative; z-index: 2;">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
              ${company?.logo_url ? `<img src="${company.logo_url}" alt="Company Logo" style="max-height: 70px; margin-bottom: 20px; filter: brightness(0) invert(1);" />` : ''}
              <h1 style="margin: 0; font-size: 32px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                ${company?.company_name || 'Your Company'}
              </h1>
              ${company?.address ? `<p style="margin: 10px 0; opacity: 0.9; font-size: 16px;">${company.address}</p>` : ''}
              <div style="margin-top: 15px; opacity: 0.9;">
                ${company?.email ? `<p style="margin: 3px 0; font-size: 14px;">✉ ${company.email}</p>` : ''}
                ${company?.phone ? `<p style="margin: 3px 0; font-size: 14px;">📞 ${company.phone}</p>` : ''}
                ${company?.gstin ? `<p style="margin: 3px 0; font-size: 14px;">🏢 GSTIN: ${company.gstin}</p>` : ''}
              </div>
            </div>
            <div style="text-align: right; background: rgba(255,255,255,0.2); padding: 25px; border-radius: 15px; backdrop-filter: blur(10px);">
              <h2 style="margin: 0; font-size: 36px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">INVOICE</h2>
              <p style="margin: 10px 0; font-size: 20px; font-weight: 600;">${invoice.invoice_number}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoice Details -->
      <div style="padding: 40px; background: #f0fdf4;">
        <div style="display: flex; justify-content: space-between; gap: 30px;">
          <div style="flex: 1;">
            <h3 style="margin: 0 0 20px 0; color: #059669; font-size: 20px; font-weight: bold; border-bottom: 3px solid #059669; padding-bottom: 10px;">BILL TO</h3>
            <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 5px solid #10b981;">
              <p style="margin: 0 0 12px 0; font-weight: bold; font-size: 20px; color: #1f2937;">
                ${client.company_name || client.name}
              </p>
              ${client.address ? `<p style="margin: 0 0 10px 0; color: #4b5563; line-height: 1.5;">${client.address}</p>` : ''}
              <div style="margin-top: 15px;">
                ${client.email ? `<p style="margin: 0 0 8px 0; color: #4b5563;">📧 ${client.email}</p>` : ''}
                ${client.phone ? `<p style="margin: 0 0 8px 0; color: #4b5563;">📱 ${client.phone}</p>` : ''}
                ${client.gstin ? `<p style="margin: 0; color: #4b5563;">🏢 GSTIN: ${client.gstin}</p>` : ''}
              </div>
            </div>
          </div>
          <div style="flex: 1;">
            <h3 style="margin: 0 0 20px 0; color: #059669; font-size: 20px; font-weight: bold; border-bottom: 3px solid #059669; padding-bottom: 10px;">INVOICE DETAILS</h3>
            <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 5px solid #10b981;">
              <div style="margin-bottom: 15px;">
                <p style="margin: 0 0 8px 0; color: #4b5563; font-size: 14px;">Invoice Date</p>
                <p style="margin: 0; font-weight: bold; font-size: 16px; color: #1f2937;">📅 ${formatDate(invoice.invoice_date)}</p>
              </div>
              ${invoice.due_date ? `
                <div style="margin-bottom: 15px;">
                  <p style="margin: 0 0 8px 0; color: #4b5563; font-size: 14px;">Due Date</p>
                  <p style="margin: 0; font-weight: bold; font-size: 16px; color: #1f2937;">⏰ ${formatDate(invoice.due_date)}</p>
                </div>
              ` : ''}
              <div>
                <p style="margin: 0 0 8px 0; color: #4b5563; font-size: 14px;">Status</p>
                <p style="margin: 0; font-weight: bold; font-size: 16px; text-transform: uppercase; color: #059669;">✅ ${invoice.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div style="padding: 40px;">
        <h3 style="margin: 0 0 25px 0; color: #059669; font-size: 22px; font-weight: bold;">INVOICE ITEMS</h3>
        <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: linear-gradient(135deg, #059669, #10b981); color: white;">
                <th style="padding: 20px; text-align: left; font-weight: bold; font-size: 16px;">DESCRIPTION</th>
                <th style="padding: 20px; text-align: center; font-weight: bold; font-size: 16px; width: 80px;">QTY</th>
                <th style="padding: 20px; text-align: right; font-weight: bold; font-size: 16px; width: 120px;">RATE</th>
                <th style="padding: 20px; text-align: center; font-weight: bold; font-size: 16px; width: 80px;">GST%</th>
                <th style="padding: 20px; text-align: right; font-weight: bold; font-size: 16px; width: 140px;">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((item, index) => `
                <tr style="border-bottom: 1px solid #e5e7eb; ${index % 2 === 0 ? 'background: #f9fafb;' : 'background: white;'}">
                  <td style="padding: 20px; vertical-align: top;">
                    <div style="font-weight: bold; margin-bottom: 6px; color: #1f2937; font-size: 16px;">${item.item_name}</div>
                    ${item.description ? `<div style="font-size: 14px; color: #6b7280; line-height: 1.4;">${item.description}</div>` : ''}
                  </td>
                  <td style="padding: 20px; text-align: center; font-size: 16px; font-weight: 600; color: #059669;">${item.quantity}</td>
                  <td style="padding: 20px; text-align: right; font-size: 16px; color: #374151;">${formatCurrency(item.unit_price)}</td>
                  <td style="padding: 20px; text-align: center; font-size: 16px; color: #374151;">${item.gst_rate}%</td>
                  <td style="padding: 20px; text-align: right; font-weight: bold; font-size: 16px; color: #1f2937;">${formatCurrency(item.line_total + item.gst_amount)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Totals -->
      <div style="padding: 0 40px 40px; display: flex; justify-content: flex-end;">
        <div style="width: 400px;">
          <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="padding: 25px; border-bottom: 1px solid #e5e7eb;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #6b7280; font-size: 16px;">Subtotal:</span>
                <span style="font-weight: bold; color: #1f2937; font-size: 16px;">${formatCurrency(invoice.subtotal)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #6b7280; font-size: 16px;">Total GST:</span>
                <span style="font-weight: bold; color: #1f2937; font-size: 16px;">${formatCurrency(invoice.total_gst)}</span>
              </div>
              ${invoice.discount > 0 ? `
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #6b7280; font-size: 16px;">Discount:</span>
                  <span style="font-weight: bold; color: #dc2626; font-size: 16px;">-${formatCurrency(invoice.discount)}</span>
                </div>
              ` : ''}
            </div>
            <div style="padding: 25px; background: linear-gradient(135deg, #059669, #10b981); color: white;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 20px; font-weight: bold;">TOTAL AMOUNT:</span>
                <span style="font-size: 28px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${formatCurrency(invoice.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${invoice.notes ? `
        <div style="padding: 0 40px 40px;">
          <div style="background: #f0fdf4; border-left: 5px solid #10b981; padding: 25px; border-radius: 0 12px 12px 0;">
            <h4 style="margin: 0 0 15px 0; color: #059669; font-size: 18px; font-weight: bold;">📝 NOTES</h4>
            <p style="margin: 0; color: #374151; line-height: 1.6; font-size: 16px;">${invoice.notes}</p>
          </div>
        </div>
      ` : ''}

      <!-- Footer -->
      <div style="background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
        <div style="position: relative; z-index: 2;">
          <p style="margin: 0; font-size: 20px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">🙏 Thank you for your business!</p>
          ${company?.email ? `<p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">For any queries, please contact us at ${company.email}</p>` : ''}
        </div>
      </div>
    </div>
  `;
};