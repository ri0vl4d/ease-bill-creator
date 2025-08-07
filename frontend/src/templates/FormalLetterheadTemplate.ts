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

export const generateFormalLetterheadTemplate = async (data: InvoiceData): Promise<string> => {
  const { invoice, client, company, items } = data;
  
  let logoBase64 = '';
  if (company?.logo_url) {
    logoBase64 = await convertImageToBase64(company.logo_url);
  }

  return `
    <div style="font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 20px; background: white;">
      <!-- Formal Letterhead -->
      <div style="text-align: center; border-bottom: 3px solid #1f2937; padding-bottom: 20px; margin-bottom: 30px;">
        ${logoBase64 ? `<img src="${logoBase64}" alt="Company Logo" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 15px;">` : ''}
        <h1 style="font-family: 'Alex Brush', cursive; font-size: 36px; margin: 0; color: #1f2937; letter-spacing: 1px;">${company?.company_name || 'Your Company'}</h1>
        <div style="margin-top: 10px; color: #4b5563; font-size: 14px; line-height: 1.6;">
          ${company?.address ? `<div>${company.address}</div>` : ''}
          <div style="margin-top: 5px;">
            ${company?.phone ? `Tel: ${company.phone}` : ''} 
            ${company?.phone && company?.email ? ' | ' : ''}
            ${company?.email ? `Email: ${company.email}` : ''}
          </div>
          ${company?.website ? `<div>Website: ${company.website}</div>` : ''}
          ${company?.gstin ? `<div style="margin-top: 5px;">GSTIN: ${company.gstin} ${company?.pan ? `| PAN: ${company.pan}` : ''}</div>` : ''}
        </div>
      </div>

      <!-- Invoice Title and Number -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="font-size: 28px; margin: 0; color: #1f2937; letter-spacing: 2px; border: 2px solid #1f2937; padding: 10px; display: inline-block;">GST INVOICE</h2>
        <p style="margin: 10px 0 0 0; font-size: 18px; color: #6b7280;">Invoice No: ${invoice.invoice_number}</p>
      </div>

      <!-- Invoice Details -->
      <div style="display: grid; grid-template-columns: 1fr auto; gap: 30px; margin-bottom: 30px;">
        <div>
          <p style="margin: 0; font-size: 16px;"><strong>Date:</strong> ${formatDate(invoice.invoice_date)}</p>
          ${invoice.due_date ? `<p style="margin: 10px 0 0 0; font-size: 16px;"><strong>Due Date:</strong> ${formatDate(invoice.due_date)}</p>` : ''}
        </div>
        <div>
          <span style="background: #1f2937; color: white; padding: 8px 16px; border-radius: 4px; font-size: 14px; text-transform: uppercase;">
            ${invoice.status}
          </span>
        </div>
      </div>

      <!-- Billing Information -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
        <div>
          <h3 style="font-size: 18px; margin: 0 0 15px 0; color: #1f2937; border-bottom: 1px solid #d1d5db; padding-bottom: 5px;">Invoice From:</h3>
          <div style="padding: 15px; border: 1px solid #d1d5db; background: #fafafa;">
            <p style="margin: 0; font-weight: bold; font-size: 16px;">${company?.company_name || ''}</p>
            ${company?.address ? `<p style="margin: 8px 0 0 0;">${company.address}</p>` : ''}
            ${company?.email ? `<p style="margin: 8px 0 0 0;">Email: ${company.email}</p>` : ''}
            ${company?.phone ? `<p style="margin: 8px 0 0 0;">Phone: ${company.phone}</p>` : ''}
            ${company?.gstin ? `<p style="margin: 8px 0 0 0;"><strong>GSTIN:</strong> ${company.gstin}</p>` : ''}
          </div>
        </div>
        <div>
          <h3 style="font-size: 18px; margin: 0 0 15px 0; color: #1f2937; border-bottom: 1px solid #d1d5db; padding-bottom: 5px;">Invoice To:</h3>
          <div style="padding: 15px; border: 1px solid #d1d5db; background: #fafafa;">
            <p style="margin: 0; font-weight: bold; font-size: 16px;">${client.name}</p>
            ${client.company_name ? `<p style="margin: 8px 0 0 0;">${client.company_name}</p>` : ''}
            ${client.address ? `<p style="margin: 8px 0 0 0;">${client.address}</p>` : ''}
            ${client.email ? `<p style="margin: 8px 0 0 0;">Email: ${client.email}</p>` : ''}
            ${client.phone ? `<p style="margin: 8px 0 0 0;">Phone: ${client.phone}</p>` : ''}
            ${client.gstin ? `<p style="margin: 8px 0 0 0;"><strong>GSTIN:</strong> ${client.gstin}</p>` : ''}
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 2px solid #1f2937;">
        <thead>
          <tr style="background: #1f2937; color: white;">
            <th style="border: 1px solid #1f2937; padding: 15px; text-align: left; font-size: 14px;">Description</th>
            <th style="border: 1px solid #1f2937; padding: 15px; text-align: center; font-size: 14px;">Quantity</th>
            <th style="border: 1px solid #1f2937; padding: 15px; text-align: right; font-size: 14px;">Unit Price</th>
            <th style="border: 1px solid #1f2937; padding: 15px; text-align: right; font-size: 14px;">GST Rate</th>
            <th style="border: 1px solid #1f2937; padding: 15px; text-align: right; font-size: 14px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item, index) => `
            <tr style="background: ${index % 2 === 0 ? '#f9fafb' : 'white'};">
              <td style="border: 1px solid #d1d5db; padding: 15px;">
                <div style="font-weight: bold; font-size: 16px;">${item.item_name}</div>
                ${item.description ? `<div style="font-size: 13px; color: #6b7280; margin-top: 4px;">${item.description}</div>` : ''}
              </td>
              <td style="border: 1px solid #d1d5db; padding: 15px; text-align: center; font-size: 16px;">${item.quantity}</td>
              <td style="border: 1px solid #d1d5db; padding: 15px; text-align: right; font-size: 16px;">${formatCurrency(item.unit_price)}</td>
              <td style="border: 1px solid #d1d5db; padding: 15px; text-align: right; font-size: 16px;">${item.gst_rate}%</td>
              <td style="border: 1px solid #d1d5db; padding: 15px; text-align: right; font-size: 16px; font-weight: bold;">${formatCurrency(item.line_total)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Totals Section -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
        <div style="width: 350px; border: 2px solid #1f2937;">
          <div style="background: #1f2937; color: white; padding: 12px; text-align: center; font-size: 18px; font-weight: bold;">
            INVOICE SUMMARY
          </div>
          <div style="padding: 15px;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 16px;">
              <span>Subtotal:</span>
              <span>${formatCurrency(invoice.subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 16px;">
              <span>Total GST:</span>
              <span>${formatCurrency(invoice.total_gst)}</span>
            </div>
            ${invoice.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 16px; color: #dc2626;">
                <span>Discount:</span>
                <span>-${formatCurrency(invoice.discount)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; padding: 15px 0; border-top: 2px solid #1f2937; font-size: 20px; font-weight: bold; background: #f9fafb;">
              <span>TOTAL AMOUNT:</span>
              <span>${formatCurrency(invoice.total_amount)}</span>
            </div>
          </div>
        </div>
      </div>

      ${company?.bank_name || company?.bank_account_number ? `
        <!-- Bank Details -->
        <div style="border: 1px solid #d1d5db; padding: 20px; margin-bottom: 30px; background: #fafafa;">
          <h3 style="font-size: 18px; margin: 0 0 15px 0; color: #1f2937; border-bottom: 1px solid #d1d5db; padding-bottom: 5px;">Bank Details:</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            ${company.bank_name ? `<div><strong>Bank Name:</strong> ${company.bank_name}</div>` : ''}
            ${company.bank_account_number ? `<div><strong>Account Number:</strong> ${company.bank_account_number}</div>` : ''}
            ${company.bank_ifsc ? `<div><strong>IFSC Code:</strong> ${company.bank_ifsc}</div>` : ''}
          </div>
        </div>
      ` : ''}

      ${invoice.notes ? `
        <!-- Notes -->
        <div style="border: 1px solid #d1d5db; padding: 20px; margin-bottom: 30px; background: #f9fafb;">
          <h3 style="font-size: 18px; margin: 0 0 15px 0; color: #1f2937;">Terms & Notes:</h3>
          <p style="margin: 0; color: #4b5563; line-height: 1.6; font-size: 14px;">${invoice.notes}</p>
        </div>
      ` : ''}

      <!-- Footer -->
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #d1d5db; color: #6b7280; font-size: 12px;">
        <p style="margin: 0;">Thank you for your business!</p>
        ${company?.email || company?.phone ? `
          <p style="margin: 10px 0 0 0;">
            ${company?.email ? `Email: ${company.email}` : ''} 
            ${company?.email && company?.phone ? ' | ' : ''}
            ${company?.phone ? `Phone: ${company.phone}` : ''}
          </p>
        ` : ''}
      </div>
    </div>
  `;
};