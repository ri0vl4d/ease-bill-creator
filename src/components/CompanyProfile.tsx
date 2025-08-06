import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, Save, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CompanyData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
  gstin: string;
  pan: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

export const CompanyProfile = () => {
  const { toast } = useToast();
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    website: "",
    logoUrl: "",
    gstin: "",
    pan: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load company profile data on component mount
  useEffect(() => {
    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_profile')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCompanyData({
          name: data.company_name || "",
          address: data.address || "",
          city: "", // Not in database schema
          state: "", // Not in database schema
          zipCode: "", // Not in database schema
          phone: data.phone || "",
          email: data.email || "",
          website: data.website || "",
          logoUrl: data.logo_url || "",
          gstin: data.gstin || "",
          pan: data.pan || "",
          bankName: data.bank_name || "",
          accountNumber: data.bank_account_number || "",
          ifscCode: data.bank_ifsc || "",
        });
      }
    } catch (error) {
      console.error('Error loading company profile:', error);
      toast({
        title: "Error loading profile",
        description: "Failed to load company profile data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CompanyData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('company_profile')
        .upsert({
          company_name: companyData.name,
          address: companyData.address,
          phone: companyData.phone,
          email: companyData.email,
          website: companyData.website,
          logo_url: companyData.logoUrl,
          gstin: companyData.gstin,
          pan: companyData.pan,
          bank_name: companyData.bankName,
          bank_account_number: companyData.accountNumber,
          bank_ifsc: companyData.ifscCode,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Company profile saved",
        description: "Your company information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving company profile:', error);
      toast({
        title: "Error saving profile",
        description: "Failed to save company profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/25 rounded-full">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Company Profile</h2>
              <p className="text-white/90">
                Set up your company information for invoices
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={companyData.name}
                onChange={handleInputChange("name")}
                placeholder="Your Company Name"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={companyData.address}
                onChange={handleInputChange("address")}
                placeholder="Street Address"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={companyData.city}
                  onChange={handleInputChange("city")}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={companyData.state}
                  onChange={handleInputChange("state")}
                  placeholder="State"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={companyData.zipCode}
                onChange={handleInputChange("zipCode")}
                placeholder="ZIP Code"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={companyData.phone}
                onChange={handleInputChange("phone")}
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={companyData.email}
                onChange={handleInputChange("email")}
                placeholder="company@example.com"
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={companyData.website}
                onChange={handleInputChange("website")}
                placeholder="www.company.com"
              />
            </div>

            <div>
              <Label htmlFor="gstin">GSTIN</Label>
              <Input
                id="gstin"
                value={companyData.gstin}
                onChange={handleInputChange("gstin")}
                placeholder="22AAAAA0000A1Z5"
              />
            </div>

            <div>
              <Label htmlFor="pan">PAN</Label>
              <Input
                id="pan"
                value={companyData.pan}
                onChange={handleInputChange("pan")}
                placeholder="AAAAA0000A"
              />
            </div>
          </CardContent>
        </Card>

        {/* Company Logo */}
        <Card className="lg:col-span-2 border border-gray-200">
          <CardHeader>
            <CardTitle>Company Logo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  value={companyData.logoUrl}
                  onChange={handleInputChange("logoUrl")}
                  placeholder="https://example.com/logo.png"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Enter a direct URL to your company logo image
                </p>
              </div>
              <div className="flex-shrink-0">
                <Label>Logo Preview</Label>
                <div className="mt-2 w-32 h-32 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center bg-muted/10">
                  {companyData.logoUrl ? (
                    <img
                      src={companyData.logoUrl}
                      alt="Company Logo"
                      className="max-w-full max-h-full object-contain rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="text-center text-muted-foreground"><Building2 class="h-8 w-8 mx-auto mb-2" /><p class="text-sm">Invalid URL</p></div>';
                      }}
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Building2 className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">No logo</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card className="lg:col-span-2 border border-gray-200">
          <CardHeader>
            <CardTitle>Bank Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={companyData.bankName}
                  onChange={handleInputChange("bankName")}
                  placeholder="State Bank of India"
                />
              </div>
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={companyData.accountNumber}
                  onChange={handleInputChange("accountNumber")}
                  placeholder="1234567890"
                />
              </div>
              <div>
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input
                  id="ifscCode"
                  value={companyData.ifscCode}
                  onChange={handleInputChange("ifscCode")}
                  placeholder="SBIN0001234"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200" size="lg" disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save Company Profile"}
        </Button>
      </div>
    </div>
  );
};