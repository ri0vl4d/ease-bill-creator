import { Database } from "@/integrations/supabase/types";
import { calculateGst } from "@/lib/gstUtils" // Assuming gstUtils.ts is in the same lib folder

// Define a comprehensive type for all data needed by the template
interface InvoiceData {
  invoice: Database["public"]["Tables"]["invoices"]["Row"];
  items: Database["public"]["Tables"]["invoice_items"]["Row"][];
  client: Database["public"]["Tables"]["clients"]["Row"];
  company: Database["public"]["Tables"]["company_profile"]["Row"];
}

// --- Helper Functions ---
const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatCurrency = (amount: number | null) => {
    if (amount === null) return '0.00';
    return amount.toFixed(2);
}

const numberToWords = (num: number): string => {
    const a = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const b = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    const toWords = (n: number): string => {
        if (n < 20) return a[n];
        let digit = n % 10;
        return `${b[Math.floor(n / 10)]}${digit ? "-" + a[digit] : ""}`;
    };
    const inWords = (n: number): string => {
        if (n < 100) return toWords(n);
        if (n < 1000) return `${a[Math.floor(n / 100)]} hundred${n % 100 ? " " + toWords(n % 100) : ""}`;
        const thousands = Math.floor(n / 1000);
        const remainder = n % 1000;
        let words = "";
        if (thousands > 0) words += `${inWords(thousands)} thousand`;
        if (remainder > 0) words += ` ${inWords(remainder)}`;
        return words.trim();
    };
    const rupees = inWords(Math.floor(num)).charAt(0).toUpperCase() + inWords(Math.floor(num)).slice(1);
    const paise = Math.round((num % 1) * 100);
    if (paise > 0) return `Rupees ${rupees} and ${toWords(paise)} Paise Only`;
    return `Rupees ${rupees} Only`;
};


// --- Main Template Generation Function ---
export const generateExtrapeTemplate = (data: InvoiceData): string => {
  const { invoice, items, client, company } = data;
  
  // Calculate total taxable value for the summary
  const totalTaxableValue = items.reduce((sum, item) => sum + (item.line_total || 0), 0);

  // Use the utility to determine GST breakdown
  const { igst_amount, cgst_amount, sgst_amount } = calculateGst(
      totalTaxableValue,
      18, // Assuming a standard rate for the total, individual items can vary
      company.state || "",
      client.state || ""
  );

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GST Invoice Template</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href='https://fonts.googleapis.com/css?family=Alex Brush' rel='stylesheet'>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
            body { font-family: 'Roboto', sans-serif; }
            .page {
                background: white;
                width: 210mm;
                min-height: 297mm;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
            }
            .content-body { padding: 15mm; flex-grow: 1; }
            .footer-content { padding: 15mm; padding-top: 0; }
        </style>
    </head>
    <body>
        <div class="page">
            <div class="content-body">
                <header class="flex items-center justify-between pb-2 border-b-2 border-gray-800">
                    <div class="flex-shrink-0">
                         <img src="${company.logo_url || 'https://placehold.co/120x60?text=Your+Logo'}" alt="Company Logo" class="h-16 p-px m-px">
                    </div>
                    <div class="text-center flex-grow">
                        <h1 class="text-5xl font-bold text-gray-800" style="font-family: 'Alex Brush';">${company.company_name}</h1>
                        <p class="text-sm text-gray-600">${company.address}</p>
                        <p class="text-sm text-gray-600">Tel-${company.phone} | email: ${company.email}</p>
                    </div>
                </header>

                <div class="text-center my-6">
                    <h2 class="text-xl font-bold tracking-wider">GST INVOICE</h2>
                </div>

                <div class="flex justify-between text-xs mb-6">
                    <div class="w-1/2 pr-4">
                        <div class="grid grid-cols-3 gap-x-2 gap-y-1">
                            <p class="font-bold col-span-1">Invoice From</p><p class="col-span-2">: ${company.company_name}</p>
                            <p class="font-bold col-span-1">Address</p><p class="col-span-2">: ${company.address}</p>
                            <p class="font-bold col-span-1">GSTIN</p><p class="col-span-2">: ${company.gstin}</p>
                            <p class="font-bold col-span-1">PAN</p><p class="col-span-2">: ${company.pan}</p>
                        </div>
                    </div>
                    <div class="w-1/2 pl-4">
                         <div class="grid grid-cols-3 gap-x-2 gap-y-1">
                            <p class="font-bold col-span-1">Invoice To</p><p class="col-span-2">: ${client.name}</p>
                            <p class="font-bold col-span-1">Address</p><p class="col-span-2">: ${client.address}, ${client.city}, ${client.state} - ${client.pin_code}</p>
                            <p class="font-bold col-span-1">Place of Supply</p><p class="col-span-2">: ${client.state}</p>
                            <p class="font-bold col-span-1">GSTIN</p><p class="col-span-2">: ${client.gstin}</p>
                            <p class="font-bold col-span-1">Invoice No.</p><p class="col-span-2">: ${invoice.invoice_number}</p>
                            <p class="font-bold col-span-1">Date</p><p class="col-span-2">: ${formatDate(invoice.invoice_date)}</p>
                        </div>
                    </div>
                </div>

                <table class="w-full text-xs border">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="p-2 border font-bold text-center">S. NO</th>
                            <th class="p-2 border font-bold text-left">Description of Services</th>
                            <th class="p-2 border font-bold text-center">SAC/HSN</th>
                            <th class="p-2 border font-bold text-center">Quantity</th>
                            <th class="p-2 border font-bold text-right">Rate</th>
                            <th class="p-2 border font-bold text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map((item, index) => `
                        <tr>
                            <td class="p-2 border text-center">${index + 1}</td>
                            <td class="p-2 border">${item.item_name}</td>
                            <td class="p-2 border text-center">${item.hsn_sac}</td>
                            <td class="p-2 border text-center">${item.quantity}</td>
                            <td class="p-2 border text-right">${formatCurrency(item.unit_price)}</td>
                            <td class="p-2 border text-right">${formatCurrency(item.line_total)}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="flex justify-end mt-1">
                    <div class="w-2/5">
                        <table class="w-full text-xs">
                            <tbody>
                                <tr>
                                    <td class="p-2 font-bold">Sub Total:</td>
                                    <td class="p-2 text-right">₹ ${formatCurrency(invoice.subtotal)}</td>
                                </tr>
                                <tr>
                                    <td class="p-2 font-bold">IGST @ 18%:</td>
                                    <td class="p-2 text-right">₹ ${formatCurrency(igst_amount)}</td>
                                </tr>
                                <tr>
                                    <td class="p-2 font-bold">SGST @ 9%:</td>
                                    <td class="p-2 text-right">₹ ${formatCurrency(sgst_amount)}</td>
                                </tr>
                                <tr>
                                    <td class="p-2 font-bold">CGST @ 9%:</td>
                                    <td class="p-2 text-right">₹ ${formatCurrency(cgst_amount)}</td>
                                </tr>
                                <tr class="font-bold bg-gray-100">
                                    <td class="p-2 border-y">TOTAL AMOUNT PAYABLE:</td>
                                    <td class="p-2 border-y text-right">₹ ${formatCurrency(invoice.total_amount)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="text-xs mt-4">
                    <p><strong>Amount Chargeable (in words):</strong> ${numberToWords(invoice.total_amount || 0)}</p>
                    <p><strong>GST Payable under reverse charge:</strong> ${invoice.gst_payable_reverse_charge ? 'YES' : 'NO'}</p>
                </div>

                 <div class="text-xs mt-4">
                    <table class="w-full text-xs border">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="p-2 border font-bold text-center">SAC</th>
                                <th class="p-2 border font-bold text-right">Taxable Value</th>
                                <th class="p-2 border font-bold text-right">CGST (9%)</th>
                                <th class="p-2 border font-bold text-right">SGST (9%)</th>
                                <th class="p-2 border font-bold text-right">IGST (18%)</th>
                                <th class="p-2 border font-bold text-right">Total Tax Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="p-2 border text-center">${items[0]?.hsn_sac || ''}</td>
                                <td class="p-2 border text-right">₹ ${formatCurrency(totalTaxableValue)}</td>
                                <td class="p-2 border text-right">₹ ${formatCurrency(cgst_amount)}</td>
                                <td class="p-2 border text-right">₹ ${formatCurrency(sgst_amount)}</td>
                                <td class="p-2 border text-right">₹ ${formatCurrency(igst_amount)}</td>
                                <td class="p-2 border text-right">₹ ${formatCurrency(invoice.total_gst)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="footer-content">
                <div class="text-xs mt-4 pt-4 border-t">
                    <p><strong>Bank Account Details:</strong></p>
                    <div class="grid grid-cols-2">
                        <p><strong>Account No:</strong> ${company.bank_account_number}</p>
                        <p><strong>Account Name:</strong> ${company.company_name}</p>
                        <p><strong>Bank & Branch Name:</strong> ${company.bank_name}</p>
                        <p><strong>IFSC Code:</strong> ${company.bank_ifsc}</p>
                        <p><strong>Account Type:</strong> Current Account</p>
                    </div>
                </div>

                <div class="flex justify-end mt-16">
                    <div class="text-center text-xs">
                        <p class="font-bold">For ${company.company_name}</p>
                        <div class="h-16"></div>
                        <p class="border-t pt-1">Director / Authorized Signatory</p>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};
