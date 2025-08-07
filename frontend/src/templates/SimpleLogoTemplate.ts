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

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const convertImageToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return '';
  }
};

export const generateSimpleLogoTemplate = async (data: InvoiceData): Promise<string> => {
  const { invoice, client, company, items } = data;
  
  let logoBase64 = '';
  if (company?.logo_url) {
    logoBase64 = await convertImageToBase64(company.logo_url);
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: white;">
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 15px;">
          ${logoBase64 ? `<img src="${logoBase64}" alt="Company Logo" style="width: 60px; height: 60px; object-fit: contain;">` : ''}
          <div>
            <h1 style="font-family: 'Alex Brush', cursive; font-size: 28px; margin: 0; color: #1f2937;">${company?.company_name || 'Your Company'}</h1>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">${company?.address || ''}</p>
          </div>
        </div>
        <div style="text-align: right;">
          <h2 style="font-size: 24px; margin: 0; color: #1f2937;">GST INVOICE</h2>
          <p style="margin: 5px 0 0 0; color: #6b7280;">#${invoice.invoice_number}</p>
        </div>
      </div>

      <!-- Company and Client Info -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <div>
          <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 10px 0; color: #1f2937;">From:</h3>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold;">${company?.company_name || ''}</p>
            ${company?.address ? `<p style="margin: 5px 0 0 0;">${company.address}</p>` : ''}
            ${company?.email ? `<p style="margin: 5px 0 0 0;">Email: ${company.email}</p>` : ''}
            ${company?.phone ? `<p style="margin: 5px 0 0 0;">Phone: ${company.phone}</p>` : ''}
            ${company?.gstin ? `<p style="margin: 5px 0 0 0;">GSTIN: ${company.gstin}</p>` : ''}
          </div>
        </div>
        <div>
          <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 10px 0; color: #1f2937;">To:</h3>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold;">${client.name}</p>
            ${client.company_name ? `<p style="margin: 5px 0 0 0;">${client.company_name}</p>` : ''}
            ${client.address ? `<p style="margin: 5px 0 0 0;">${client.address}</p>` : ''}
            ${client.email ? `<p style="margin: 5px 0 0 0;">Email: ${client.email}</p>` : ''}
            ${client.phone ? `<p style="margin: 5px 0 0 0;">Phone: ${client.phone}</p>` : ''}
            ${client.gstin ? `<p style="margin: 5px 0 0 0;">GSTIN: ${client.gstin}</p>` : ''}
          </div>
        </div>
      </div>

      <!-- Invoice Details -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <div>
          <p style="margin: 0;"><strong>Invoice Date:</strong> ${formatDate(invoice.invoice_date)}</p>
          ${invoice.due_date ? `<p style="margin: 10px 0 0 0;"><strong>Due Date:</strong> ${formatDate(invoice.due_date)}</p>` : ''}
        </div>
        <div style="text-align: right;">
          <span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 14px;">
            ${invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
        </div>
      </div>

      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Item</th>
            <th style="border: 1px solid #d1d5db; padding: 12px; text-align: center;">Qty</th>
            <th style="border: 1px solid #d1d5db; padding: 12px; text-align: right;">Rate</th>
            <th style="border: 1px solid #d1d5db; padding: 12px; text-align: right;">GST</th>
            <th style="border: 1px solid #d1d5db; padding: 12px; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td style="border: 1px solid #d1d5db; padding: 12px;">
                <div style="font-weight: bold;">${item.item_name}</div>
                ${item.description ? `<div style="font-size: 12px; color: #6b7280;">${item.description}</div>` : ''}
              </td>
              <td style="border: 1px solid #d1d5db; padding: 12px; text-align: center;">${item.quantity}</td>
              <td style="border: 1px solid #d1d5db; padding: 12px; text-align: right;">${formatCurrency(item.unit_price)}</td>
              <td style="border: 1px solid #d1d5db; padding: 12px; text-align: right;">${item.gst_rate}%</td>
              <td style="border: 1px solid #d1d5db; padding: 12px; text-align: right;">${formatCurrency(item.line_total)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
        <div style="width: 300px;">
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
            <span>Subtotal:</span>
            <span>${formatCurrency(invoice.subtotal)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
            <span>Total GST:</span>
            <span>${formatCurrency(invoice.total_gst)}</span>
          </div>
          ${invoice.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
              <span>Discount:</span>
              <span>-${formatCurrency(invoice.discount)}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; padding: 12px 0; border-top: 2px solid #1f2937; font-size: 18px; font-weight: bold;">
            <span>Total:</span>
            <span>${formatCurrency(invoice.total_amount)}</span>
          </div>
        </div>
      </div>

      ${company?.bank_name || company?.bank_account_number ? `
        <!-- Bank Details -->
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 10px 0; color: #1f2937;">Bank Details:</h3>
          ${company.bank_name ? `<p style="margin: 0;">Bank: ${company.bank_name}</p>` : ''}
          ${company.bank_account_number ? `<p style="margin: 5px 0 0 0;">Account: ${company.bank_account_number}</p>` : ''}
          ${company.bank_ifsc ? `<p style="margin: 5px 0 0 0;">IFSC: ${company.bank_ifsc}</p>` : ''}
        </div>
      ` : ''}

      ${invoice.notes ? `
        <!-- Notes -->
        <div style="margin-top: 20px;">
          <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 10px 0; color: #1f2937;">Notes:</h3>
          <p style="margin: 0; color: #6b7280;">${invoice.notes}</p>
        </div>
      ` : ''}
    </div>
  `;
};