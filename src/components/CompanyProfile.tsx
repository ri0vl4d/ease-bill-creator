import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, Save } from "lucide-react";

interface CompanyData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
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
    gstin: "",
    pan: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  const handleInputChange = (field: keyof CompanyData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to database
    toast({
      title: "Company profile saved",
      description: "Your company information has been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary to-primary-glow text-white">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-full">
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
        <Card>
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
        <Card>
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

        {/* Bank Details */}
        <Card className="lg:col-span-2">
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
        <Button onClick={handleSave} variant="gradient" size="lg">
          <Save className="h-4 w-4" />
          Save Company Profile
        </Button>
      </div>
    </div>
  );
};