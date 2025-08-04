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
    id?: string|number;
    item_name: string;
    description?: string | null;
    hsn_sac?: string | null;
    quantity: number;
    unit_price: number;
    line_total: number;
    gst_amount: number;
    gst_rate?: number;
  }>;
}

// --- Helper Functions ---
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
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

// --- Number To Words Helper ---
const numberToWords = (num: number): string => {
  const a = [
    "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"
  ];
  const b = [
    "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
  ];

  const toWords = (n: number): string => {
    if (n < 20) return a[n];
    let digit = n % 10;
    return `${b[Math.floor(n / 10)]}${digit ? "-" + a[digit] : ""}`;
  };

  const inWords = (n: number): string => {
    if (n < 100) return toWords(n);
    if (n < 1000) {
      return `${a[Math.floor(n / 100)]} hundred${n % 100 ? " " + toWords(n % 100) : ""}`;
    }
    const thousands = Math.floor(n / 1000);
    const remainder = n % 1000;
    let words = "";
    if (thousands > 0) {
      words += `${inWords(thousands)} thousand`;
    }
    if (remainder > 0) {
      words += ` ${inWords(remainder)}`;
    }
    return words.trim();
  };

  const rupees = inWords(Math.floor(num)).charAt(0).toUpperCase() + inWords(Math.floor(num)).slice(1);
  const paise = Math.round((num % 1) * 100);

  if (paise > 0) {
    return `Rupees ${rupees} and ${toWords(paise)} Paise Only`;
  }
  return `Rupees ${rupees} Only`;
};

// --- Main Template Generator ---
export const generateExtrapeInvoiceTemplate = async (data: InvoiceData): Promise<string> => {
  const { invoice, client, company, items } = data;

  let logoBase64 = "";
  if (company?.logo_url) {
    logoBase64 = await convertImageToBase64(company.logo_url);
  }

  return `
  <div style="background: #f3f4f6; padding: 32px; font-family: 'Inter', Arial, sans-serif; min-height: 100vh;">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap');
      .font-alex-brush { font-family: 'Alex Brush', cursive; }
      @media print {
        body * { visibility: hidden; }
        #printable-invoice, #printable-invoice * { visibility: visible; }
        #printable-invoice { position: absolute; left: 0; top: 0; width: 100%; }
      }
    </style>
    <div id="printable-invoice" style="background: white; width: 210mm; min-height: 297mm; margin: 0 auto; box-shadow: 0 2px 12px #0001; display: flex; flex-direction: column;">
      <div style="padding: 48px; flex-grow: 1;">
        <!-- Header -->
        <div style="text-align: center; padding-bottom: 16px; border-bottom: 2px solid #1f2937; position: relative;">
          <div style="position: absolute; top: 0; left: 0;">
            ${logoBase64 ? `<img src="${logoBase64}" alt="Company Logo" style="height: 40px;">` : ""}
          </div>
          <h1 class="font-alex-brush" style="font-size: 32px; color: #1f2937; font-weight: bold; margin-bottom: 0;">${company?.company_name || "Your Company"}</h1>
          <p style="color: #4b5563; font-size: 14px; margin: 0;">${company?.address || ""}</p>
          <p style="color: #4b5563; font-size: 14px; margin: 0;">Tel-${company?.phone || ""} | email: ${company?.email || ""}</p>
        </div>
        <!-- Invoice Title -->
        <div style="text-align: center; margin: 24px 0;">
          <h2 style="font-size: 20px; font-weight: bold; letter-spacing: 0.12em;">GST INVOICE</h2>
        </div>
        <!-- Invoice Details -->
        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 24px;">
          <div style="width: 48%; padding-right: 16px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="font-weight: bold;">Invoice From</td><td>: ${company?.company_name || ""}</td></tr>
              <tr><td style="font-weight: bold;">Address</td><td>: ${company?.address || ""}</td></tr>
              <tr><td style="font-weight: bold;">GSTIN</td><td>: ${company?.gstin || ""}</td></tr>
              <tr><td style="font-weight: bold;">PAN</td><td>: ${company?.pan || ""}</td></tr>
            </table>
          </div>
          <div style="width: 48%; padding-left: 16px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="font-weight: bold;">Invoice To</td><td>: ${client.name || ""}</td></tr>
              <tr><td style="font-weight: bold;">Address</td><td>: ${client.address || ""}</td></tr>
              <tr><td style="font-weight: bold;">Place of Supply</td><td>: Goa</td></tr>
              <tr><td style="font-weight: bold;">GSTIN</td><td>: ${client.gstin || ""}</td></tr>
              <tr><td style="font-weight: bold;">Invoice No.</td><td>: ${invoice.invoice_number || ""}</td></tr>
              <tr><td style="font-weight: bold;">Date</td><td>: ${formatDate(invoice.invoice_date)}</td></tr>
            </table>
          </div>
        </div>
        <!-- Items Table -->
        <table style="width: 100%; font-size: 13px; border-collapse: collapse; border: 1px solid #d1d5db;">
          <thead style="background: #f3f4f6;">
            <tr>
              <th style="padding: 8px; border: 1px solid #d1d5db; font-weight: bold; text-align: center;">S. NO</th>
              <th style="padding: 8px; border: 1px solid #d1d5db; font-weight: bold; text-align: left;">Description of Services</th>
              <th style="padding: 8px; border: 1px solid #d1d5db; font-weight: bold; text-align: center;">SAC/HSN</th>
              <th style="padding: 8px; border: 1px solid #d1d5db; font-weight: bold; text-align: center;">Quantity</th>
              <th style="padding: 8px; border: 1px solid #d1d5db; font-weight: bold; text-align: right;">Rate</th>
              <th style="padding: 8px; border: 1px solid #d1d5db; font-weight: bold; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, idx) => `
              <tr>
                <td style="padding: 8px; border: 1px solid #d1d5db; text-align: center;">${idx + 1}</td>
                <td style="padding: 8px; border: 1px solid #d1d5db;">${item.item_name}</td>
                <td style="padding: 8px; border: 1px solid #d1d5db; text-align: center;">${item.hsn_sac || ""}</td>
                <td style="padding: 8px; border: 1px solid #d1d5db; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border: 1px solid #d1d5db; text-align: right;">${item.unit_price.toFixed(2)}</td>
                <td style="padding: 8px; border: 1px solid #d1d5db; text-align: right;">${item.line_total.toFixed(2)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        <!-- Totals Section -->
        <div style="display: flex; justify-content: flex-end; margin-top: 4px;">
          <div style="width: 40%;">
            <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold;">Sub Total:</td>
                <td style="padding: 8px; text-align: right;">${formatCurrency(invoice.subtotal)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">IGST @ 18%:</td>
                <td style="padding: 8px; text-align: right;">${formatCurrency(invoice.total_gst)}</td>
              </tr>
              <tr style="font-weight: bold; background: #f3f4f6;">
                <td style="padding: 8px; border-top: 1px solid #d1d5db;">TOTAL AMOUNT PAYABLE:</td>
                <td style="padding: 8px; border-top: 1px solid #d1d5db; text-align: right;">${formatCurrency(invoice.total_amount)}</td>
              </tr>
            </table>
          </div>
        </div>
        <!-- Amount in Words -->
        <div style="font-size: 13px; margin-top: 16px;">
          <p><strong>Amount Chargeable (in words):</strong> ${numberToWords(invoice.total_amount)}</p>
          <p><strong>GST Payable under reverse charge:</strong> NO</p>
        </div>
        <!-- Tax Summary Table -->
        <div style="font-size: 13px; margin-top: 16px;">
          <table style="width: 100%; font-size: 13px; border-collapse: collapse; border: 1px solid #d1d5db;">
            <thead style="background: #f3f4f6;">
              <tr>
                <th style="padding: 8px; border: 1px solid #d1d5db; font-weight: bold; text-align: center;">SAC</th>
                <th style="padding: 8px; border: 1px solid #d1d5db; font-weight: bold; text-align: right;">Taxable Value</th>
                <th style="padding: 8px; border: 1px solid #d1d5db; font-weight: bold; text-align: right;">CGST (9%)</th>
                <th style="padding: 8px; border: 1px solid #d1d5db; font-weight: bold; text-align: right;">SGST (9%)</th>
                <th style="padding: 8px; border: 1px solid #d1d5db; font-weight: bold; text-align: right;">IGST (18%)</th>
                <th style="padding: 8px; border: 1px solid #d1d5db; font-weight: bold; text-align: right;">Total Tax Amount</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #d1d5db; text-align: center;">${item.hsn_sac || ""}</td>
                  <td style="padding: 8px; border: 1px solid #d1d5db; text-align: right;">${formatCurrency(item.line_total)}</td>
                  <td style="padding: 8px; border: 1px solid #d1d5db; text-align: right;">${formatCurrency(0)}</td>
                  <td style="padding: 8px; border: 1px solid #d1d5db; text-align: right;">${formatCurrency(0)}</td>
                  <td style="padding: 8px; border: 1px solid #d1d5db; text-align: right;">${formatCurrency(item.gst_amount)}</td>
                  <td style="padding: 8px; border: 1px solid #d1d5db; text-align: right;">${formatCurrency(item.gst_amount)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
      <!-- Footer Content Area -->
      <div style="padding: 48px; padding-top: 0;">
        <!-- Bank Details -->
        <div style="font-size: 13px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #d1d5db;">
          <p><strong>Bank Account Details:</strong></p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0;">
            <p><strong>Account No:</strong> ${company?.bank_account_number || ""}</p>
            <p><strong>Account Name:</strong> ${company?.company_name || ""}</p>
            <p><strong>Bank & Branch Name:</strong> ${company?.bank_name || ""}</p>
            <p><strong>IFSC Code:</strong> ${company?.bank_ifsc || ""}</p>
            <p><strong>Account Type:</strong> Current Account</p>
          </div>
        </div>
        <!-- Signature Section -->
        <div style="display: flex; justify-content: flex-end; margin-top: 64px;">
          <div style="text-align: center; font-size: 13px;">
            <p style="font-weight: bold;">For ${company?.company_name || "Your Company"}</p>
            <div style="height: 64px;"></div>
            <p style="border-top: 1px solid #d1d5db; padding-top: 4px;">Director / Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
};