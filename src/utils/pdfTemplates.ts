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
    bank_name: string | null;
    bank_account_number: string | null;
    bank_ifsc: string | null;
    website: string | null;
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

export const generateSimpleLogoTemplate = (data: InvoiceData): string => {
  const { invoice, client, company, items } = data;

  return `
    <div style="max-width: 800px; margin: 0 auto; background: white; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4;">
      <!-- Header with Logo and Company Name -->
      <div style="display: flex; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #2563eb;">
        ${company?.logo_url ? `
          <div style="margin-right: 20px;">
            <img src="${company.logo_url}" alt="Company Logo" style="max-height: 80px; max-width: 120px;" />
          </div>
        ` : ''}
        <div style="flex: 1;">
          <h1 style="margin: 0; color: #1f2937; font-size: 32px; font-weight: bold; margin-bottom: 8px;">
            ${company?.company_name || 'Your Company'}
          </h1>
          <div style="color: #6b7280; font-size: 14px;">
            ${company?.address ? `<div style="margin-bottom: 4px;">${company.address}</div>` : ''}
            <div style="display: flex; gap: 15px; flex-wrap: wrap;">
              ${company?.email ? `<span>📧 ${company.email}</span>` : ''}
              ${company?.phone ? `<span>📞 ${company.phone}</span>` : ''}
              ${company?.gstin ? `<span>🏢 GSTIN: ${company.gstin}</span>` : ''}
            </div>
          </div>
        </div>
        <div style="text-align: right;">
          <h2 style="margin: 0; color: #2563eb; font-size: 36px; font-weight: bold;">TAX INVOICE</h2>
          <div style="margin-top: 10px; color: #374151;">
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">${invoice.invoice_number}</div>
            <div style="font-size: 14px;">Date: ${formatDate(invoice.invoice_date)}</div>
            ${invoice.due_date ? `<div style="font-size: 14px;">Due: ${formatDate(invoice.due_date)}</div>` : ''}
          </div>
        </div>
      </div>

      <!-- Bill To Section -->
      <div style="margin-bottom: 30px;">
        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: bold; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">BILL TO</h3>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
          <div style="font-weight: bold; font-size: 16px; color: #1f2937; margin-bottom: 8px;">
            ${client.company_name || client.name}
          </div>
          ${client.company_name && client.name !== client.company_name ? `<div style="margin-bottom: 6px; color: #374151;">${client.name}</div>` : ''}
          ${client.address ? `<div style="margin-bottom: 6px; color: #6b7280;">${client.address}</div>` : ''}
          <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-top: 8px;">
            ${client.email ? `<span style="color: #6b7280;">📧 ${client.email}</span>` : ''}
            ${client.phone ? `<span style="color: #6b7280;">📞 ${client.phone}</span>` : ''}
            ${client.gstin ? `<span style="color: #6b7280;">🏢 GSTIN: ${client.gstin}</span>` : ''}
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div style="margin-bottom: 30px;">
        <table style="width: 100%; border-collapse: collapse; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white;">
              <th style="padding: 15px 12px; text-align: left; font-weight: bold; font-size: 14px;">ITEM DESCRIPTION</th>
              <th style="padding: 15px 12px; text-align: center; font-weight: bold; font-size: 14px; width: 80px;">QTY</th>
              <th style="padding: 15px 12px; text-align: right; font-weight: bold; font-size: 14px; width: 120px;">RATE</th>
              <th style="padding: 15px 12px; text-align: center; font-weight: bold; font-size: 14px; width: 80px;">GST%</th>
              <th style="padding: 15px 12px; text-align: right; font-weight: bold; font-size: 14px; width: 120px;">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, index) => `
              <tr style="background: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 15px 12px; vertical-align: top;">
                  <div style="font-weight: bold; margin-bottom: 4px; color: #1f2937;">${item.item_name}</div>
                  ${item.description ? `<div style="font-size: 11px; color: #6b7280; line-height: 1.3;">${item.description}</div>` : ''}
                </td>
                <td style="padding: 15px 12px; text-align: center; font-weight: 600;">${item.quantity}</td>
                <td style="padding: 15px 12px; text-align: right; font-weight: 600;">${formatCurrency(item.unit_price)}</td>
                <td style="padding: 15px 12px; text-align: center; font-weight: 600;">${item.gst_rate}%</td>
                <td style="padding: 15px 12px; text-align: right; font-weight: bold; color: #1f2937;">${formatCurrency(item.line_total + item.gst_amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Totals Section -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
        <div style="width: 350px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #f8fafc;">
              <td style="padding: 12px 15px; text-align: right; font-weight: 600; color: #374151;">Subtotal:</td>
              <td style="padding: 12px 15px; text-align: right; font-weight: bold; color: #1f2937;">${formatCurrency(invoice.subtotal)}</td>
            </tr>
            <tr style="background: #ffffff;">
              <td style="padding: 12px 15px; text-align: right; font-weight: 600; color: #374151;">Total GST:</td>
              <td style="padding: 12px 15px; text-align: right; font-weight: bold; color: #1f2937;">${formatCurrency(invoice.total_gst)}</td>
            </tr>
            ${invoice.discount > 0 ? `
              <tr style="background: #f8fafc;">
                <td style="padding: 12px 15px; text-align: right; font-weight: 600; color: #374151;">Discount:</td>
                <td style="padding: 12px 15px; text-align: right; font-weight: bold; color: #dc2626;">-${formatCurrency(invoice.discount)}</td>
              </tr>
            ` : ''}
            <tr style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white;">
              <td style="padding: 15px; text-align: right; font-size: 16px; font-weight: bold;">TOTAL AMOUNT:</td>
              <td style="padding: 15px; text-align: right; font-size: 18px; font-weight: bold;">${formatCurrency(invoice.total_amount)}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Notes Section -->
      ${invoice.notes ? `
        <div style="margin-bottom: 30px;">
          <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px; font-weight: bold;">NOTES</h3>
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; line-height: 1.5; color: #92400e;">${invoice.notes}</p>
          </div>
        </div>
      ` : ''}

      <!-- Footer -->
      <div style="margin-top: 40px; padding: 20px; background: #f8fafc; border-radius: 8px; text-align: center; border-top: 3px solid #2563eb;">
        <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #1f2937;">Thank you for your business!</p>
        ${company?.email ? `<p style="margin: 0; color: #6b7280;">For any queries, please contact us at ${company.email}</p>` : ''}
      </div>
    </div>
  `;
};

export const generateFormalLetterheadTemplate = (data: InvoiceData): string => {
  const { invoice, client, company, items } = data;

  return `
    <div style="max-width: 800px; margin: 0 auto; background: white; font-family: 'Times New Roman', serif; font-size: 12px; line-height: 1.4;">
      <!-- Letterhead Header -->
      <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1e3a8a, #1e40af); color: white; margin-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          ${company?.logo_url ? `
            <div>
              <img src="${company.logo_url}" alt="Company Logo" style="max-height: 60px; filter: brightness(0) invert(1);" />
            </div>
          ` : '<div></div>'}
          <div style="flex: 1; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">
              ${company?.company_name || 'YOUR COMPANY'}
            </h1>
            ${company?.address ? `<div style="margin-top: 8px; font-size: 14px; opacity: 0.9;">${company.address}</div>` : ''}
          </div>
          <div style="text-align: right; font-size: 11px; opacity: 0.9;">
            <div style="background: rgba(255,255,255,0.2); padding: 8px; border-radius: 4px;">
              <div style="font-weight: bold; margin-bottom: 2px;">ORIGINAL</div>
              <div>INVOICE</div>
            </div>
          </div>
        </div>
        
        <!-- Company Details in Header -->
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.3);">
          <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; font-size: 11px;">
            ${company?.email ? `<span>📧 ${company.email}</span>` : ''}
            ${company?.phone ? `<span>📞 ${company.phone}</span>` : ''}
            ${company?.website ? `<span>🌐 ${company.website}</span>` : ''}
          </div>
          <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; font-size: 11px; margin-top: 8px;">
            ${company?.gstin ? `<span>GSTIN: ${company.gstin}</span>` : ''}
            ${company?.pan ? `<span>PAN: ${company.pan}</span>` : ''}
          </div>
        </div>
      </div>

      <!-- Invoice Details Bar -->
      <div style="background: #f1f5f9; padding: 15px; border-bottom: 2px solid #1e40af;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="margin: 0; color: #1e40af; font-size: 24px; font-weight: bold;">TAX INVOICE</h2>
          </div>
          <div style="text-align: right;">
            <table style="border-collapse: collapse;">
              <tr>
                <td style="padding: 4px 12px; text-align: right; font-weight: bold; background: #e2e8f0;">Invoice No:</td>
                <td style="padding: 4px 12px; font-weight: bold; color: #1e40af;">${invoice.invoice_number}</td>
              </tr>
              <tr>
                <td style="padding: 4px 12px; text-align: right; font-weight: bold; background: #e2e8f0;">Date:</td>
                <td style="padding: 4px 12px;">${formatDate(invoice.invoice_date)}</td>
              </tr>
              ${invoice.due_date ? `
                <tr>
                  <td style="padding: 4px 12px; text-align: right; font-weight: bold; background: #e2e8f0;">Due Date:</td>
                  <td style="padding: 4px 12px;">${formatDate(invoice.due_date)}</td>
                </tr>
              ` : ''}
              <tr>
                <td style="padding: 4px 12px; text-align: right; font-weight: bold; background: #e2e8f0;">Status:</td>
                <td style="padding: 4px 12px; font-weight: bold; text-transform: uppercase; color: ${
                  invoice.status === 'paid' ? '#059669' : 
                  invoice.status === 'sent' ? '#0891b2' : 
                  invoice.status === 'overdue' ? '#dc2626' : '#6b7280'
                };">${invoice.status}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <!-- Invoice From / Invoice To Section -->
      <div style="display: flex; justify-content: space-between; margin: 20px 0; gap: 20px;">
        <div style="flex: 1; border: 1px solid #d1d5db; padding: 15px; border-radius: 4px;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 14px; font-weight: bold; border-bottom: 1px solid #d1d5db; padding-bottom: 5px;">INVOICE FROM</h3>
          <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #1f2937;">
            ${company?.company_name || 'Your Company'}
          </div>
          ${company?.address ? `<div style="margin-bottom: 6px; color: #374151;">${company.address}</div>` : ''}
          <div style="font-size: 11px; color: #6b7280; line-height: 1.4;">
            ${company?.email ? `<div>Email: ${company.email}</div>` : ''}
            ${company?.phone ? `<div>Phone: ${company.phone}</div>` : ''}
            ${company?.gstin ? `<div>GSTIN: ${company.gstin}</div>` : ''}
            ${company?.pan ? `<div>PAN: ${company.pan}</div>` : ''}
          </div>
        </div>
        
        <div style="flex: 1; border: 1px solid #d1d5db; padding: 15px; border-radius: 4px;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 14px; font-weight: bold; border-bottom: 1px solid #d1d5db; padding-bottom: 5px;">INVOICE TO</h3>
          <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #1f2937;">
            ${client.company_name || client.name}
          </div>
          ${client.company_name && client.name !== client.company_name ? `<div style="margin-bottom: 6px; color: #374151;">${client.name}</div>` : ''}
          ${client.address ? `<div style="margin-bottom: 6px; color: #374151;">${client.address}</div>` : ''}
          <div style="font-size: 11px; color: #6b7280; line-height: 1.4;">
            ${client.email ? `<div>Email: ${client.email}</div>` : ''}
            ${client.phone ? `<div>Phone: ${client.phone}</div>` : ''}
            ${client.gstin ? `<div>GSTIN: ${client.gstin}</div>` : ''}
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div style="margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #374151;">
          <thead>
            <tr style="background: #374151; color: white;">
              <th style="padding: 12px 8px; text-align: left; border: 1px solid #374151; font-weight: bold; font-size: 11px;">DESCRIPTION OF GOODS/SERVICES</th>
              <th style="padding: 12px 8px; text-align: center; border: 1px solid #374151; font-weight: bold; font-size: 11px; width: 60px;">QTY</th>
              <th style="padding: 12px 8px; text-align: right; border: 1px solid #374151; font-weight: bold; font-size: 11px; width: 90px;">RATE</th>
              <th style="padding: 12px 8px; text-align: center; border: 1px solid #374151; font-weight: bold; font-size: 11px; width: 60px;">GST%</th>
              <th style="padding: 12px 8px; text-align: right; border: 1px solid #374151; font-weight: bold; font-size: 11px; width: 100px;">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, index) => `
              <tr style="border-bottom: 1px solid #d1d5db;">
                <td style="padding: 10px 8px; border: 1px solid #d1d5db; vertical-align: top; background: ${index % 2 === 0 ? '#ffffff' : '#f9fafb'};">
                  <div style="font-weight: bold; margin-bottom: 2px; font-size: 11px;">${item.item_name}</div>
                  ${item.description ? `<div style="font-size: 10px; color: #6b7280; line-height: 1.2;">${item.description}</div>` : ''}
                </td>
                <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: center; font-size: 11px; background: ${index % 2 === 0 ? '#ffffff' : '#f9fafb'};">${item.quantity}</td>
                <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-size: 11px; background: ${index % 2 === 0 ? '#ffffff' : '#f9fafb'};">${formatCurrency(item.unit_price)}</td>
                <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: center; font-size: 11px; background: ${index % 2 === 0 ? '#ffffff' : '#f9fafb'};">${item.gst_rate}%</td>
                <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-weight: bold; font-size: 11px; background: ${index % 2 === 0 ? '#ffffff' : '#f9fafb'};">${formatCurrency(item.line_total + item.gst_amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Totals Section -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
        <div style="width: 300px;">
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #374151;">
            <tr>
              <td style="padding: 8px 12px; text-align: right; border: 1px solid #d1d5db; background: #f1f5f9; font-weight: bold; font-size: 11px;">Subtotal:</td>
              <td style="padding: 8px 12px; text-align: right; border: 1px solid #d1d5db; font-weight: bold; font-size: 11px;">${formatCurrency(invoice.subtotal)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; text-align: right; border: 1px solid #d1d5db; background: #f1f5f9; font-weight: bold; font-size: 11px;">Total GST:</td>
              <td style="padding: 8px 12px; text-align: right; border: 1px solid #d1d5db; font-weight: bold; font-size: 11px;">${formatCurrency(invoice.total_gst)}</td>
            </tr>
            ${invoice.discount > 0 ? `
              <tr>
                <td style="padding: 8px 12px; text-align: right; border: 1px solid #d1d5db; background: #f1f5f9; font-weight: bold; font-size: 11px;">Discount:</td>
                <td style="padding: 8px 12px; text-align: right; border: 1px solid #d1d5db; font-weight: bold; font-size: 11px; color: #dc2626;">-${formatCurrency(invoice.discount)}</td>
              </tr>
            ` : ''}
            <tr style="background: #374151; color: white;">
              <td style="padding: 12px; text-align: right; border: 1px solid #374151; font-size: 12px; font-weight: bold;">TOTAL AMOUNT:</td>
              <td style="padding: 12px; text-align: right; border: 1px solid #374151; font-size: 14px; font-weight: bold;">${formatCurrency(invoice.total_amount)}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Notes Section -->
      ${invoice.notes ? `
        <div style="margin-bottom: 20px; border: 1px solid #d1d5db; padding: 15px; border-radius: 4px;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 12px; font-weight: bold;">TERMS & CONDITIONS / NOTES:</h3>
          <p style="margin: 0; line-height: 1.4; font-size: 11px; color: #374151;">${invoice.notes}</p>
        </div>
      ` : ''}

      <!-- Bank Details Section -->
      ${company?.bank_name || company?.bank_account_number || company?.bank_ifsc ? `
        <div style="margin-bottom: 20px; border: 1px solid #d1d5db; padding: 15px; border-radius: 4px; background: #f8fafc;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 12px; font-weight: bold;">BANK DETAILS:</h3>
          <div style="font-size: 11px; line-height: 1.4;">
            ${company?.bank_name ? `<div><strong>Bank Name:</strong> ${company.bank_name}</div>` : ''}
            ${company?.bank_account_number ? `<div><strong>Account Number:</strong> ${company.bank_account_number}</div>` : ''}
            ${company?.bank_ifsc ? `<div><strong>IFSC Code:</strong> ${company.bank_ifsc}</div>` : ''}
          </div>
        </div>
      ` : ''}

      <!-- Footer -->
      <div style="margin-top: 30px; padding: 15px; background: #f1f5f9; border-top: 2px solid #1e40af; text-align: center;">
        <div style="font-size: 11px; color: #374151; line-height: 1.4;">
          <div style="font-weight: bold; margin-bottom: 5px;">Thank you for your business!</div>
          <div>This is a computer-generated invoice and does not require a signature.</div>
          ${company?.email ? `<div style="margin-top: 5px;">For any queries, please contact us at ${company.email}</div>` : ''}
        </div>
      </div>
    </div>
  `;
};