import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Download, Calendar, Building2, Mail, Phone, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { generateInvoicePDF } from "@/utils/pdfGenerator";
import { TemplateSelector } from "./TemplateSelector";

interface InvoiceItem {
  id: string;
  item_name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  gst_rate: number;
  line_total: number;
  gst_amount: number;
}

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  company_name: string | null;
  gstin: string | null;
}

interface CompanyProfile {
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
}

interface Invoice {
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
  client_id: string;
  gst_payable_reverse_charge?: boolean; // Add this line

}

interface InvoiceDetailProps {
  invoice: Invoice;
  onEdit: () => void;
  onClose: () => void;
}

export const InvoiceDetail = ({ invoice, onEdit, onClose }: InvoiceDetailProps) => {
  const { toast } = useToast();
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  useEffect(() => {
    fetchInvoiceDetails();
  }, [invoice.id]);

  const fetchInvoiceDetails = async () => {
    try {
      // Fetch invoice items
      const { data: itemsData, error: itemsError } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", invoice.id);

      if (itemsError) throw itemsError;

      // Fetch client details
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", invoice.client_id)
        .single();

      if (clientError) throw clientError;

      // Fetch company profile
      const { data: companyData, error: companyError } = await supabase
        .from("company_profile")
        .select("*")
        .limit(1)
        .single();

      if (companyError && companyError.code !== 'PGRST116') {
        throw companyError;
      }

      setItems(itemsData || []);
      setClient(clientData);
      setCompany(companyData);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "default";
      case "sent":
        return "secondary";
      case "overdue":
        return "destructive";
      default:
        return "outline";
    }
  };

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

  const handleDownloadPDF = async (templateId: string = selectedTemplate) => {
    if (!client || !items.length) {
      toast({
        title: "Error",
        description: "Unable to generate PDF. Missing invoice data.",
        variant: "destructive",
      });
      return;
    }

    setDownloadingPDF(true);
    try {
      await generateInvoicePDF({
        invoice,
        client,
        company,
        items: items.map(item => ({
          item_name: item.item_name,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          gst_rate: item.gst_rate,
          line_total: item.line_total,
          gst_amount: item.gst_amount,
        })),
      }, templateId);

      toast({
        title: "Success",
        description: "Invoice PDF downloaded successfully!",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleTemplateSelect = () => {
    setShowTemplateSelector(true);
  };

  const handleTemplateConfirm = () => {
    setShowTemplateSelector(false);
    handleDownloadPDF(selectedTemplate);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading invoice details...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Invoice {invoice.invoice_number}
                  <Badge variant={getStatusVariant(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Created on {formatDate(invoice.invoice_date)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                onClick={handleTemplateSelect}
                disabled={downloadingPDF}
              >
                <Download className="h-4 w-4 mr-2" />
                {downloadingPDF ? "Generating..." : "Download PDF"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Invoice Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              From
            </CardTitle>
          </CardHeader>
          <CardContent>
            {company ? (
              <div className="space-y-2">
                <h3 className="font-semibold">{company.company_name}</h3>
                {company.address && (
                  <p className="text-sm text-muted-foreground">{company.address}</p>
                )}
                <div className="space-y-1">
                  {company.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3" />
                      {company.email}
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3" />
                      {company.phone}
                    </div>
                  )}
                </div>
                {company.gstin && (
                  <p className="text-sm">
                    <strong>GSTIN:</strong> {company.gstin}
                  </p>
                )}
                {company.pan && (
                  <p className="text-sm">
                    <strong>PAN:</strong> {company.pan}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Company profile not configured
              </p>
            )}
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Bill To</CardTitle>
          </CardHeader>
          <CardContent>
            {client && (
              <div className="space-y-2">
                <h3 className="font-semibold">
                  {client.company_name || client.name}
                </h3>
                {client.company_name && client.name !== client.company_name && (
                  <p className="text-sm">{client.name}</p>
                )}
                {client.address && (
                  <p className="text-sm text-muted-foreground">{client.address}</p>
                )}
                <div className="space-y-1">
                  {client.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3" />
                      {client.email}
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3" />
                      {client.phone}
                    </div>
                  )}
                </div>
                {client.gstin && (
                  <p className="text-sm">
                    <strong>GSTIN:</strong> {client.gstin}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Invoice Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Invoice Date</p>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(invoice.invoice_date)}
              </p>
            </div>
            {invoice.due_date && (
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(invoice.due_date)}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={getStatusVariant(invoice.status)} className="mt-1">
                {invoice.status}
              </Badge>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Reverse Charge</p>
                <p className={`font-medium flex items-center gap-2 ${invoice.gst_payable_reverse_charge ? 'text-destructive' : 'text-muted-foreground'}`}>
                    <AlertCircle className="h-4 w-4" />
                    {invoice.gst_payable_reverse_charge ? "Yes" : "No"}
                </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.item_name}</h4>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Qty: {item.quantity}</span>
                      <span>Rate: {formatCurrency(item.unit_price)}</span>
                      <span>GST: {item.gst_rate}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.line_total)}</p>
                    <p className="text-sm text-muted-foreground">
                      +{formatCurrency(item.gst_amount)} GST
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total GST:</span>
              <span>{formatCurrency(invoice.total_gst)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-{formatCurrency(invoice.discount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount:</span>
              <span>{formatCurrency(invoice.total_amount)}</span>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">Notes</h4>
              <p className="text-sm text-muted-foreground">{invoice.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onTemplateSelect={setSelectedTemplate}
          onClose={() => setShowTemplateSelector(false)}
          onConfirm={handleTemplateConfirm}
        />
      )}
    </div>
  );
};