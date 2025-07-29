import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Package, DollarSign, Plus, TrendingUp } from "lucide-react";

interface DashboardProps {
  onTabChange: (tab: string) => void;
}

export const Dashboard = ({ onTabChange }: DashboardProps) => {
  const stats = [
    {
      title: "Total Invoices",
      value: "0",
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Clients",
      value: "0",
      icon: Users,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Products",
      value: "0",
      icon: Package,
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      title: "Revenue",
      value: "₹0",
      icon: DollarSign,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-primary to-primary-glow text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to InvoiceHub</h2>
              <p className="text-white/90">
                Manage your invoices, clients, and business efficiently
              </p>
            </div>
            <TrendingUp className="h-16 w-16 text-white/50" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="gradient"
              size="lg"
              onClick={() => onTabChange("invoices")}
              className="h-20 flex flex-col space-y-2"
            >
              <Plus className="h-6 w-6" />
              <span>Create Invoice</span>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => onTabChange("clients")}
              className="h-20 flex flex-col space-y-2"
            >
              <Users className="h-6 w-6" />
              <span>Add Client</span>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => onTabChange("products")}
              className="h-20 flex flex-col space-y-2"
            >
              <Package className="h-6 w-6" />
              <span>Add Product</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No recent activity yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start by creating your first invoice or adding clients
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};