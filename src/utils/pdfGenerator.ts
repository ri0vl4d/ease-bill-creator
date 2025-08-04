import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PDFStyle } from '@/types/pdfStyles';
import { generateSimpleLogoTemplate } from '@/templates/SimpleLogoTemplate';
import { generateFormalLetterheadTemplate } from '@/templates/FormalLetterheadTemplate';
import { generateModernMinimalTemplate } from '@/templates/ModernMinimalTemplate';

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
  pdfStyle?: PDFStyle;
}

export const generateInvoicePDF = async (data: InvoiceData) => {
  const { invoice, client, company, items, pdfStyle = PDFStyle.SIMPLE_LOGO } = data;

  // Create a temporary div for PDF content
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '210mm'; // A4 width
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.padding = '20px';
  tempDiv.style.fontFamily = 'Arial, sans-serif';
  tempDiv.style.fontSize = '12px';
  tempDiv.style.lineHeight = '1.4';

  // Generate HTML content based on selected style
  let htmlContent: string;
  
  switch (pdfStyle) {
    case PDFStyle.FORMAL_LETTERHEAD:
      htmlContent = await generateFormalLetterheadTemplate(data);
      break;
    case PDFStyle.MODERN_MINIMAL:
      htmlContent = await generateModernMinimalTemplate(data);
      break;
    case PDFStyle.SIMPLE_LOGO:
    default:
      htmlContent = await generateSimpleLogoTemplate(data);
      break;
  }

  tempDiv.innerHTML = htmlContent;

  document.body.appendChild(tempDiv);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: tempDiv.scrollWidth,
      height: tempDiv.scrollHeight,
    });

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Download the PDF
    pdf.save(`Invoice-${invoice.invoice_number}.pdf`);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    // Clean up
    document.body.removeChild(tempDiv);
  }
};