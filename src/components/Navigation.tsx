import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { authLib } from "@/lib/auth";
import { FileText, Users, Package, Building2, LayoutDashboard, LogOut } from "lucide-react";

interface NavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Navigation = ({ activeTab = "dashboard", onTabChange }: NavigationProps) => {
  const { toast } = useToast();
  
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "invoices", label: "Invoices", icon: FileText },
    { id: "clients", label: "Clients", icon: Users },
    { id: "products", label: "Products", icon: Package },
    { id: "company", label: "Company", icon: Building2 },
  ];

  const handleLogout = async () => {
    authLib.logout();
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
    // Trigger a page refresh to update auth state
    window.location.reload();
  };

  return (
    <Card className="m-4 mb-0 p-1 bg-gradient-to-r from-blue-600 to-indigo-600 border-0 shadow-lg">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-white" />
          <h1 className="text-xl font-bold text-white">InvoiceHub</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <nav className="flex space-x-1 bg-white/25 rounded-lg p-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                className={`
                  ${activeTab === item.id 
                    ? "bg-white text-blue-600 shadow-sm font-medium" 
                    : "text-white hover:bg-white/20 font-normal"
                  } transition-all duration-200
                `}
                size="sm"
                onClick={() => onTabChange?.(item.id)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
          
          <Button
            className="text-white hover:bg-white/20 transition-all duration-200"
            size="sm"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};