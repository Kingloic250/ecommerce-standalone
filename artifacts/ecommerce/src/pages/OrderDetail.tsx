import { useParams, Link } from "wouter";
import { useGetOrder } from "@workspace/api-client-react";
import { getGetOrderQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Package, Truck, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function OrderDetail() {
  const params = useParams();
  const orderId = parseInt(params.id || "0");
  
  const { data: order, isLoading, isError } = useGetOrder(orderId, {
    query: {
      enabled: !!orderId,
      queryKey: getGetOrderQueryKey(orderId)
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-40 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
          <div>
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif mb-4">Order not found</h2>
        <Link href="/orders" className="text-primary hover:underline">
          Return to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in">
      <Link href="/orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to orders
      </Link>

      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-semibold">Order #{order.id}</h1>
          <p className="text-muted-foreground mt-2">
            Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        <div className={`px-4 py-2 text-sm font-medium uppercase tracking-wider rounded-full ${
          order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
          order.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
          order.status === 'shipped' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
          order.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
          'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
        }`}>
          {order.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" /> Items ({order.items.reduce((acc, item) => acc + item.quantity, 0)})
            </h2>
            <div className="space-y-6">
              {order.items.map(item => (
                <div key={item.productId} className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-background shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex justify-between">
                    <div>
                      <Link href={`/products/${item.productId}`} className="font-medium hover:text-primary transition-colors">
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h2 className="text-lg font-medium mb-4">Summary</h2>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${(order.totalPrice - (order.totalPrice > 150 ? 0 : 10) - order.totalPrice * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{order.totalPrice > 150 ? 'Free' : '$10.00'}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span>${(order.totalPrice * 0.08).toFixed(2)}</span>
              </div>
            </div>
            <div className="pt-4 border-t border-border flex justify-between font-medium text-lg">
              <span>Total</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Shipping Address
            </h2>
            <p className="text-muted-foreground text-sm whitespace-pre-line">
              {order.shippingAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
