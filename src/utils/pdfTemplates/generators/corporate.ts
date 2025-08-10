import { InvoiceData } from '../types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const generateCorporateTemplate = (data: InvoiceData): string => {
  const { invoice, client, company, items, taxSummary, bank } = data;

  // Calculate totals and taxes
  const subTotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const igst = (invoice.igst || 0);
  const cgst = (invoice.cgst || 0);
  const sgst = (invoice.sgst || 0);
  const total = subTotal + igst + cgst + sgst;

  // Helpers for safe access and fallbacks
  const safe = (val: string | undefined, fallback = "") => val || fallback;

  return `
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>GST Invoice Template</title>
    <link href="https://fonts.googleapis.com/css?family=Alex+Brush" rel="stylesheet"/>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
      body {
        font-family: 'Roboto', sans-serif;
        background-color: #f0f2f5;
      }
      .page {
        background: white;
        width: 210mm;
        min-height: 297mm;
        margin: 20px auto;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
      }
      .content-body {
        padding: 15mm;
        flex-grow: 1;
      }
      .footer-content {
        padding: 15mm;
        padding-top: 0;
      }
      @media print {
        body {
          background: none;
        }
        .page {
          margin: 0;
          box-shadow: none;
          border: none;
          height: auto;
        }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <!-- Main Content Area -->
      <div class="content-body">
        <!-- Header Section -->
        <header class="flex items-center justify-between pb-2 border-b-2 border-gray-800" style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #1f2937; padding-bottom: 0.5rem;">
          <div class="flex-shrink-0">
            <img src="${safe(company?.logo_url, 'https://placehold.co/120x60?text=Your+Logo')}" alt="Company Logo" class="h-16 p-px m-px" style="height: 64px;" />
          </div>
          <div class="text-center flex-grow" style="flex-grow: 1; text-align: center;">
            <h1 class="text-5xl font-bold text-gray-800" style="font-family: 'Alex Brush'; font-size: 3rem; font-weight: bold; color: #1f2937; margin-bottom: 0.25em;">${safe(company?.company_name, 'Your Company')}</h1>
            <p class="text-sm text-gray-600" style="font-size: 0.875rem; color: #4b5563;">${safe(company?.address, 'Company Address')}</p>
            <p class="text-sm text-gray-600" style="font-size: 0.875rem; color: #4b5563;">Tel-${safe(company?.phone)} | email: ${safe(company?.email)}</p>
          </div>
        </header>

        <!-- Invoice Title -->
        <div class="text-center my-6" style="text-align: center; margin: 1.5rem 0;">
          <h2 class="text-xl font-bold tracking-wider" style="font-size: 1.25rem; font-weight: bold; letter-spacing: 0.05em;">GST INVOICE</h2>
        </div>

        <!-- Invoice Details Section -->
        <div class="flex justify-between text-xs mb-6" style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 1.5rem;">
          <div class="w-1/2 pr-4" style="width: 50%; padding-right: 1rem;">
            <div class="grid grid-cols-3 gap-x-2 gap-y-1" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.5rem 0.5rem;">
              <p class="font-bold col-span-1" style="font-weight:bold;">Invoice From</p><p class="col-span-2">: ${safe(company?.company_name)}</p>
              <p class="font-bold col-span-1" style="font-weight:bold;">Address</p><p class="col-span-2">: ${safe(company?.address)}</p>
              <p class="font-bold col-span-1" style="font-weight:bold;">GSTIN</p><p class="col-span-2">: ${safe(company?.gstin)}</p>
              <p class="font-bold col-span-1" style="font-weight:bold;">PAN</p><p class="col-span-2">: ${safe(company?.pan)}</p>
            </div>
          </div>
          <div class="w-1/2 pl-4" style="width: 50%; padding-left: 1rem;">
            <div class="grid grid-cols-3 gap-x-2 gap-y-1" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.5rem 0.5rem;">
              <p class="font-bold col-span-1" style="font-weight:bold;">Invoice To</p><p class="col-span-2">: ${safe(client?.company_name)}</p>
              <p class="font-bold col-span-1" style="font-weight:bold;">Address</p><p class="col-span-2">: ${safe(client?.address)}</p>
              <p class="font-bold col-span-1" style="font-weight:bold;">Place of Supply</p><p class="col-span-2">: ${safe(invoice?.place_of_supply)}</p>
              <p class="font-bold col-span-1" style="font-weight:bold;">GSTIN</p><p class="col-span-2">: ${safe(client?.gstin)}</p>
              <p class="font-bold col-span-1" style="font-weight:bold;">Invoice No.</p><p class="col-span-2">: ${safe(invoice?.invoice_no)}</p>
              <p class="font-bold col-span-1" style="font-weight:bold;">Date</p><p class="col-span-2">: ${safe(invoice?.date)}</p>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <table class="w-full text-xs border" style="width: 100%; font-size: 0.75rem; border-collapse: collapse; border: 1px solid #d1d5db;">
          <thead class="bg-gray-100" style="background-color: #f3f4f6;">
            <tr>
              <th class="p-2 border font-bold text-center" style="padding: 0.5rem; border: 1px solid #d1d5db; font-weight: bold; text-align: center;">S. NO</th>
              <th class="p-2 border font-bold text-left" style="padding: 0.5rem; border: 1px solid #d1d5db; font-weight: bold; text-align: left;">Description of Services</th>
              <th class="p-2 border font-bold text-center" style="padding: 0.5rem; border: 1px solid #d1d5db; font-weight: bold; text-align: center;">SAC/HSN</th>
              <th class="p-2 border font-bold text-center" style="padding: 0.5rem; border: 1px solid #d1d5db; font-weight: bold; text-align: center;">Quantity</th>
              <th class="p-2 border font-bold text-right" style="padding: 0.5rem; border: 1px solid #d1d5db; font-weight: bold; text-align: right;">Rate</th>
              <th class="p-2 border font-bold text-right" style="padding: 0.5rem; border: 1px solid #d1d5db; font-weight: bold; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, idx) => `
              <tr>
                <td class="p-2 border text-center" style="padding: 0.5rem; border: 1px solid #d1d5db; text-align: center;">${idx + 1}</td>
                <td class="p-2 border" style="padding: 0.5rem; border: 1px solid #d1d5db;">${safe(item.description)}</td>
                <td class="p-2 border text-center" style="padding: 0.5rem; border: 1px solid #d1d5db; text-align: center;">${safe(item.hsn_sac)}</td>
                <td class="p-2 border text-center" style="padding: 0.5rem; border: 1px solid #d1d5db; text-align: center;">${item.quantity ?? ''}</td>
                <td class="p-2 border text-right" style="padding: 0.5rem; border: 1px solid #d1d5db; text-align: right;">${formatCurrency(item.rate || 0)}</td>
                <td class="p-2 border text-right" style="padding: 0.5rem; border: 1px solid #d1d5db; text-align: right;">${formatCurrency(item.amount || 0)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Totals Section -->
        <div class="flex justify-end mt-1" style="display:flex; justify-content:flex-end; margin-top: 0.25rem;">
          <div class="w-2/5" style="width:40%;">
            <table class="w-full text-xs" style="width:100%; font-size:0.75rem;">
              <tbody>
                <tr>
                  <td class="p-2 font-bold" style="padding:0.5rem; font-weight:bold;">Sub Total:</td>
                  <td class="p-2 text-right" style="padding:0.5rem; text-align:right;">${formatCurrency(subTotal)}</td>
                </tr>
                ${igst > 0 ? `
                <tr>
                  <td class="p-2 font-bold" style="padding:0.5rem; font-weight:bold;">IGST @ 18%:</td>
                  <td class="p-2 text-right" style="padding:0.5rem; text-align:right;">${formatCurrency(igst)}</td>
                </tr>
                ` : `
                <tr>
                  <td class="p-2 font-bold" style="padding:0.5rem; font-weight:bold;">SGST @ 9%:</td>
                  <td class="p-2 text-right" style="padding:0.5rem; text-align:right;">${formatCurrency(sgst)}</td>
                </tr>
                <tr>
                  <td class="p-2 font-bold" style="padding:0.5rem; font-weight:bold;">CGST @ 9%:</td>
                  <td class="p-2 text-right" style="padding:0.5rem; text-align:right;">${formatCurrency(cgst)}</td>
                </tr>
                `}
                <tr class="font-bold bg-gray-100" style="font-weight:bold; background-color:#f3f4f6;">
                  <td class="p-2 border-y" style="padding:0.5rem; border-top:1px solid #d1d5db; border-bottom:1px solid #d1d5db;">TOTAL AMOUNT PAYABLE:</td>
                  <td class="p-2 border-y text-right" style="padding:0.5rem; border-top:1px solid #d1d5db; border-bottom:1px solid #d1d5db; text-align:right;">${formatCurrency(total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Amount in Words -->
        <div class="text-xs mt-4" style="font-size:0.75rem; margin-top:1rem;">
          <p><strong>Amount Chargeable (in words):</strong> ${safe(invoice.amount_words, "")}</p>
          <p><strong>GST Payable under reverse charge:</strong> ${invoice.reverse_charge ? "YES" : "NO"}</p>
        </div>

        <!-- Tax Summary Table -->
        <div class="text-xs mt-4" style="font-size:0.75rem; margin-top:1rem;">
          <table class="w-full text-xs border" style="width:100%; font-size:0.75rem; border-collapse:collapse; border:1px solid #d1d5db;">
            <thead class="bg-gray-100" style="background-color:#f3f4f6;">
              <tr>
                <th class="p-2 border font-bold text-center" style="padding:0.5rem; border:1px solid #d1d5db; font-weight:bold; text-align:center;">SAC</th>
                <th class="p-2 border font-bold text-right" style="padding:0.5rem; border:1px solid #d1d5db; font-weight:bold; text-align:right;">Taxable Value</th>
                <th class="p-2 border font-bold text-right" style="padding:0.5rem; border:1px solid #d1d5db; font-weight:bold; text-align:right;">CGST (9%)</th>
                <th class="p-2 border font-bold text-right" style="padding:0.5rem; border:1px solid #d1d5db; font-weight:bold; text-align:right;">SGST (9%)</th>
                <th class="p-2 border font-bold text-right" style="padding:0.5rem; border:1px solid #d1d5db; font-weight:bold; text-align:right;">IGST (18%)</th>
                <th class="p-2 border font-bold text-right" style="padding:0.5rem; border:1px solid #d1d5db; font-weight:bold; text-align:right;">Total Tax Amount</th>
              </tr>
            </thead>
            <tbody>
              ${(taxSummary && taxSummary.length > 0 ? taxSummary : [{
                sac: items[0]?.hsn_sac || '',
                taxable_value: subTotal,
                cgst: cgst,
                sgst: sgst,
                igst: igst,
                total: igst + cgst + sgst,
              }]).map((row: any) => `
                <tr>
                  <td class="p-2 border text-center" style="padding:0.5rem; border:1px solid #d1d5db; text-align:center;">${row.sac}</td>
                  <td class="p-2 border text-right" style="padding:0.5rem; border:1px solid #d1d5db; text-align:right;">${formatCurrency(row.taxable_value)}</td>
                  <td class="p-2 border text-right" style="padding:0.5rem; border:1px solid #d1d5db; text-align:right;">${formatCurrency(row.cgst)}</td>
                  <td class="p-2 border text-right" style="padding:0.5rem; border:1px solid #d1d5db; text-align:right;">${formatCurrency(row.sgst)}</td>
                  <td class="p-2 border text-right" style="padding:0.5rem; border:1px solid #d1d5db; text-align:right;">${formatCurrency(row.igst)}</td>
                  <td class="p-2 border text-right" style="padding:0.5rem; border:1px solid #d1d5db; text-align:right;">${formatCurrency(row.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer Content Area -->
      <div class="footer-content">
        <!-- Bank Details -->
        <div class="text-xs mt-4 pt-4 border-t" style="font-size:0.75rem; margin-top:1rem; padding-top:1rem; border-top:1px solid #d1d5db;">
          <p><strong>Bank Account Details:</strong></p>
          <div class="grid grid-cols-2" style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr));">
            <p><strong>Account No:</strong> ${safe(bank?.account_no)}</p>
            <p><strong>Account Name:</strong> ${safe(bank?.account_name)}</p>
            <p><strong>Bank & Branch Name:</strong> ${safe(bank?.bank_name)}</p>
            <p><strong>IFSC Code:</strong> ${safe(bank?.ifsc)}</p>
            <p><strong>Account Type:</strong> ${safe(bank?.account_type)}</p>
          </div>
        </div>

        <!-- Signature Section -->
        <div class="flex justify-end mt-16" style="display:flex; justify-content:flex-end; margin-top:4rem;">
          <div class="text-center text-xs" style="text-align:center; font-size:0.75rem;">
            <p class="font-bold" style="font-weight:bold;">For ${safe(company?.company_name)}</p>
            <div class="h-16" style="height:4rem;"></div>
            <p class="border-t pt-1" style="border-top:1px solid #d1d5db; padding-top:0.25rem;">Director / Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
};