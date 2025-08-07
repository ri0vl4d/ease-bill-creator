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

export const generateModernMinimalTemplate = async (data: InvoiceData): Promise<string> => {
  const { invoice, client, company, items } = data;
  
  let logoBase64 = '';
  if (company?.logo_url) {
    logoBase64 = await convertImageToBase64(company.logo_url);
  }

  return `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: white; color: #1a1a1a;">
      <!-- Modern Header -->
      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 60px;">
        <div style="display: flex; align-items: center; gap: 20px;">
          ${logoBase64 ? `<img src="${logoBase64}" alt="Company Logo" style="width: 70px; height: 70px; object-fit: contain; border-radius: 12px;">` : ''}
          <div>
            <h1 style="font-family: 'Alex Brush', cursive; font-size: 32px; margin: 0; color: #2563eb; font-weight: normal;">${company?.company_name || 'Your Company'}</h1>
            <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.5;">${company?.address || ''}</p>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; padding: 12px 24px; border-radius: 8px; margin-bottom: 12px;">
            <div style="font-size: 14px; opacity: 0.9;">INVOICE</div>
            <div style="font-size: 20px; font-weight: 600;">#${invoice.invoice_number}</div>
          </div>
          <div style="color: #64748b; font-size: 14px;">${formatDate(invoice.invoice_date)}</div>
        </div>
      </div>

      <!-- Clean Client Info -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 50px;">
        <div>
          <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; border-radius: 0 8px 8px 0;">
            <h3 style="font-size: 12px; font-weight: 600; color: #2563eb; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 1px;">From</h3>
            <div style="font-weight: 600; font-size: 16px; margin-bottom: 8px; color: #0f172a;">${company?.company_name || ''}</div>
            ${company?.address ? `<div style="color: #64748b; margin-bottom: 4px; line-height: 1.5;">${company.address}</div>` : ''}
            ${company?.email ? `<div style="color: #64748b; font-size: 14px;">${company.email}</div>` : ''}
            ${company?.gstin ? `<div style="color: #64748b; font-size: 14px; margin-top: 8px;">GSTIN: ${company.gstin}</div>` : ''}
          </div>
        </div>
        <div>
          <div style="background: #f8fafc; border-left: 4px solid #10b981; padding: 20px; border-radius: 0 8px 8px 0;">
            <h3 style="font-size: 12px; font-weight: 600; color: #10b981; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 1px;">To</h3>
            <div style="font-weight: 600; font-size: 16px; margin-bottom: 8px; color: #0f172a;">${client.name}</div>
            ${client.company_name ? `<div style="color: #64748b; margin-bottom: 4px;">${client.company_name}</div>` : ''}
            ${client.address ? `<div style="color: #64748b; margin-bottom: 4px; line-height: 1.5;">${client.address}</div>` : ''}
            ${client.email ? `<div style="color: #64748b; font-size: 14px;">${client.email}</div>` : ''}
            ${client.gstin ? `<div style="color: #64748b; font-size: 14px; margin-top: 8px;">GSTIN: ${client.gstin}</div>` : ''}
          </div>
        </div>
      </div>

      <!-- Invoice Details -->
      <div style="display: flex; gap: 30px; margin-bottom: 40px; align-items: center;">
        ${invoice.due_date ? `
          <div>
            <div style="font-size: 12px; color: #64748b; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Due Date</div>
            <div style="font-weight: 600; color: #0f172a;">${formatDate(invoice.due_date)}</div>
          </div>
        ` : ''}
        <div style="margin-left: auto;">
          <span style="background: #ecfdf5; color: #059669; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 500;">
            ${invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
        </div>
      </div>

      <!-- Modern Items Table -->
      <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 40px;">
        <div style="background: #f8fafc; padding: 16px 24px; border-bottom: 1px solid #e2e8f0;">
          <div style="display: grid; grid-template-columns: 2fr 80px 120px 100px 120px; gap: 16px; font-size: 12px; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">
            <div>Item</div>
            <div style="text-align: center;">Qty</div>
            <div style="text-align: right;">Rate</div>
            <div style="text-align: right;">GST</div>
            <div style="text-align: right;">Total</div>
          </div>
        </div>
        ${items.map((item, index) => `
          <div style="padding: 20px 24px; border-bottom: ${index < items.length - 1 ? '1px solid #f1f5f9' : 'none'};">
            <div style="display: grid; grid-template-columns: 2fr 80px 120px 100px 120px; gap: 16px; align-items: start;">
              <div>
                <div style="font-weight: 600; color: #0f172a; margin-bottom: 4px;">${item.item_name}</div>
                ${item.description ? `<div style="font-size: 13px; color: #64748b; line-height: 1.4;">${item.description}</div>` : ''}
              </div>
              <div style="text-align: center; color: #0f172a; font-weight: 500;">${item.quantity}</div>
              <div style="text-align: right; color: #0f172a;">${formatCurrency(item.unit_price)}</div>
              <div style="text-align: right; color: #64748b;">${item.gst_rate}%</div>
              <div style="text-align: right; color: #0f172a; font-weight: 600;">${formatCurrency(item.line_total)}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Clean Totals -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
        <div style="background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; min-width: 320px;">
          <div style="padding: 16px 24px; border-bottom: 1px solid #f1f5f9;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #64748b;">Subtotal</span>
              <span style="color: #0f172a; font-weight: 500;">${formatCurrency(invoice.subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #64748b;">GST</span>
              <span style="color: #0f172a; font-weight: 500;">${formatCurrency(invoice.total_gst)}</span>
            </div>
            ${invoice.discount > 0 ? `
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #ef4444;">Discount</span>
                <span style="color: #ef4444; font-weight: 500;">-${formatCurrency(invoice.discount)}</span>
              </div>
            ` : ''}
          </div>
          <div style="background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; padding: 20px 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 14px; opacity: 0.9;">Total Amount</span>
              <span style="font-size: 20px; font-weight: 700;">${formatCurrency(invoice.total_amount)}</span>
            </div>
          </div>
        </div>
      </div>

      ${company?.bank_name || company?.bank_account_number || invoice.notes ? `
        <div style="display: grid; grid-template-columns: ${company?.bank_name || company?.bank_account_number ? '1fr' : ''} ${invoice.notes ? '1fr' : ''}; gap: 30px; margin-top: 50px;">
          ${company?.bank_name || company?.bank_account_number ? `
            <div style="background: #f8fafc; border-radius: 12px; padding: 24px;">
              <h3 style="font-size: 14px; font-weight: 600; color: #374151; margin: 0 0 16px 0;">Payment Details</h3>
              ${company.bank_name ? `<div style="margin-bottom: 8px; color: #6b7280;"><span style="color: #374151; font-weight: 500;">Bank:</span> ${company.bank_name}</div>` : ''}
              ${company.bank_account_number ? `<div style="margin-bottom: 8px; color: #6b7280;"><span style="color: #374151; font-weight: 500;">Account:</span> ${company.bank_account_number}</div>` : ''}
              ${company.bank_ifsc ? `<div style="color: #6b7280;"><span style="color: #374151; font-weight: 500;">IFSC:</span> ${company.bank_ifsc}</div>` : ''}
            </div>
          ` : ''}
          
          ${invoice.notes ? `
            <div style="background: #f8fafc; border-radius: 12px; padding: 24px;">
              <h3 style="font-size: 14px; font-weight: 600; color: #374151; margin: 0 0 16px 0;">Notes</h3>
              <p style="margin: 0; color: #6b7280; line-height: 1.6;">${invoice.notes}</p>
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- Subtle Footer -->
      <div style="text-align: center; margin-top: 60px; padding-top: 30px; border-top: 1px solid #f1f5f9;">
        <p style="margin: 0; color: #94a3b8; font-size: 13px;">Thank you for your business</p>
      </div>
    </div>
  `;
};