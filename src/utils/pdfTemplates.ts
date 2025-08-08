export interface InvoiceData {
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

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const INVOICE_TEMPLATES: TemplateConfig[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean and modern design with blue accents',
    preview: '/templates/modern-preview.png',
    colors: {
      primary: '#2563eb',
      secondary: '#f8fafc',
      accent: '#3b82f6'
    }
  },
  {
    id: 'classic',
    name: 'Classic Business',
    description: 'Traditional business invoice with elegant styling',
    preview: '/templates/classic-preview.png',
    colors: {
      primary: '#1f2937',
      secondary: '#f9fafb',
      accent: '#6b7280'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Minimalist design focusing on content clarity',
    preview: '/templates/minimal-preview.png',
    colors: {
      primary: '#374151',
      secondary: '#ffffff',
      accent: '#9ca3af'
    }
  },
  {
    id: 'corporate',
    name: 'Corporate Elite',
    description: 'Professional corporate design with green accents',
    preview: '/templates/corporate-preview.png',
    colors: {
      primary: '#059669',
      secondary: '#f0fdf4',
      accent: '#10b981'
    }
  }
];

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

export const TEMPLATE_GENERATORS = {
  modern: generateModernTemplate,
  classic: generateClassicTemplate,
  minimal: generateMinimalTemplate,
  corporate: generateCorporateTemplate,
};