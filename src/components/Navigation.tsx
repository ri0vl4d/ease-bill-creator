import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Users, Package, Building2, LayoutDashboard } from "lucide-react";

interface NavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Navigation = ({ activeTab = "dashboard", onTabChange }: NavigationProps) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "invoices", label: "Invoices", icon: FileText },
    { id: "clients", label: "Clients", icon: Users },
    { id: "products", label: "Products", icon: Package },
    { id: "company", label: "Company", icon: Building2 },
  ];

  return (
    <Card className="m-4 mb-0 p-1 bg-gradient-to-r from-primary to-primary-glow">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-white" />
          <h1 className="text-xl font-bold text-white">InvoiceHub</h1>
        </div>
        
        <nav className="flex space-x-1 bg-white/20 rounded-lg p-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onTabChange?.(item.id)}
              className={`
                ${activeTab === item.id 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-white hover:bg-white/20"
                }
              `}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </Card>
  );
};