import { useGetAllOrders, useUpdateOrderStatus, getGetAllOrdersQueryKey, getGetAdminStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { OrderStatusInputStatus } from "@workspace/api-client-react/src/generated/api.schemas";
import { format } from "date-fns";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useGetAllOrders();
  const updateStatusMutation = useUpdateOrderStatus();

  const handleUpdateStatus = (id: number, status: OrderStatusInputStatus) => {
    updateStatusMutation.mutate({ id, data: { status } }, {
      onSuccess: () => {
        toast.success(`Order #${id} status updated to ${status}`);
        queryClient.invalidateQueries({ queryKey: getGetAllOrdersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
      },
      onError: () => {
        toast.error("Failed to update status");
      }
    });
  };

  const statusOptions: OrderStatusInputStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-semibold">Manage Orders</h1>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading orders...</td></tr>
              ) : orders?.map((order) => (
                <tr key={order.id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4 font-medium">#{order.id}</td>
                  <td className="px-6 py-4">{format(new Date(order.createdAt), "MMM d, yyyy h:mm a")}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{order.userName || 'Guest'}</p>
                      <p className="text-xs text-muted-foreground">User ID: {order.userId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">${order.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium uppercase rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          Update Status <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {statusOptions.map(status => (
                          <DropdownMenuItem 
                            key={status} 
                            onClick={() => handleUpdateStatus(order.id, status)}
                            disabled={order.status === status}
                            className="capitalize"
                          >
                            Mark as {status}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
