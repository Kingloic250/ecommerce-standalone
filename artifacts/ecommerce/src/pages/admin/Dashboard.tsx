import { useGetAdminStats } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { DollarSign, Package, ShoppingBag, Users } from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Total Orders", value: stats.totalOrders, icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Products", value: stats.totalProducts, icon: ShoppingBag, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-semibold">Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/admin/products" className="text-sm font-medium text-primary hover:underline">
            Manage Products
          </Link>
          <Link href="/admin/orders" className="text-sm font-medium text-primary hover:underline">
            Manage Orders
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-2xl flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm text-muted-foreground hover:text-primary">
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-muted-foreground border-b border-border">
                  <tr>
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-accent/50 transition-colors">
                      <td className="py-4">
                        <Link href={`/admin/orders`} className="font-medium hover:text-primary">
                          #{order.id}
                        </Link>
                      </td>
                      <td className="py-4">{format(new Date(order.createdAt), "MMM d, yyyy")}</td>
                      <td className="py-4">{order.userName || `User ${order.userId}`}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 text-xs font-medium uppercase rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-right font-medium">${order.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Orders by Status</h2>
            <div className="space-y-4">
              {stats.ordersByStatus.map((status) => (
                <div key={status.status} className="flex items-center justify-between">
                  <span className="capitalize">{status.status}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-accent rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${(status.count / stats.totalOrders) * 100}%` }}
                      />
                    </div>
                    <span className="font-medium w-6 text-right">{status.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
