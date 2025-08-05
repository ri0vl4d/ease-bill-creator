import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="m-4 mb-0 p-1 bg-gradient-to-r from-primary to-primary-glow">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-white" />
          <h1 className="text-xl font-bold text-white">InvoiceHub</h1>
        </div>
        
        <div className="flex items-center space-x-2">
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
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-white hover:bg-white/20"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};