import { useGetOrders } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function Orders() {
  const { data: orders, isLoading } = useGetOrders();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-in fade-in">
      <h1 className="text-3xl font-serif font-semibold mb-8">Order History</h1>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
          <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h2 className="text-xl font-medium mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">When you place an order, it will appear here.</p>
          <Link href="/products" className="inline-flex items-center text-primary font-medium hover:underline">
            Start shopping <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <Link key={order.id} href={`/orders/${order.id}`} className="block">
              <div className="bg-card hover:bg-accent border border-border rounded-2xl p-6 transition-colors group">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="font-medium text-lg">Order #{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      Placed on {format(new Date(order.createdAt), "MMMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-lg">${order.totalPrice.toFixed(2)}</span>
                    <span className={`px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 overflow-x-auto pb-2">
                  {order.items.slice(0, 5).map(item => (
                    <div key={item.productId} className="shrink-0 relative w-16 h-16 rounded-lg overflow-hidden bg-background">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {order.items.length > 5 && (
                    <div className="shrink-0 w-16 h-16 rounded-lg bg-background flex items-center justify-center text-sm font-medium text-muted-foreground">
                      +{order.items.length - 5}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
