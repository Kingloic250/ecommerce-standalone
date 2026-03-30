import { useCart } from "@/contexts/CartContext";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useCreateOrder } from "@workspace/api-client-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  
  const createOrder = useCreateOrder();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login to complete your purchase");
      setLocation("/login?redirect=/cart");
      return;
    }
    
    if (!address.trim()) {
      toast.error("Please enter a shipping address");
      return;
    }

    createOrder.mutate({
      data: {
        shippingAddress: address,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      }
    }, {
      onSuccess: (order) => {
        toast.success("Order placed successfully!");
        clearCart();
        setLocation(`/orders/${order.id}`);
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to place order");
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center mx-auto mb-6">
          <Trash2 className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <h1 className="text-3xl font-serif mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link href="/products">
          <Button size="lg" className="rounded-full px-8">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-in fade-in">
      <h1 className="text-3xl font-serif font-semibold mb-8">Shopping Cart ({totalItems})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-4 py-6 border-b border-border/50 first:pt-0">
              <Link href={`/products/${item.product.id}`} className="shrink-0 relative w-24 h-32 rounded-xl bg-card overflow-hidden">
                <img 
                  src={item.product.image} 
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </Link>
              
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <Link href={`/products/${item.product.id}`} className="font-medium hover:text-primary transition-colors text-lg">
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground capitalize mt-1">{item.product.category}</p>
                  </div>
                  <span className="font-medium whitespace-nowrap">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="flex items-center border border-border rounded-full h-9">
                    <button 
                      className="w-9 h-full flex justify-center items-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      className="w-9 h-full flex justify-center items-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      onClick={() => updateQuantity(item.product.id, Math.min(item.product.countInStock, item.quantity + 1))}
                      disabled={item.quantity >= item.product.countInStock}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card p-6 md:p-8 rounded-3xl sticky top-24">
            <h2 className="text-xl font-serif font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{totalPrice > 150 ? 'Free' : '$10.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-border flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">${(totalPrice + (totalPrice > 150 ? 0 : 10) + totalPrice * 0.08).toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <label className="text-sm font-medium">Shipping Address</label>
              <textarea 
                placeholder="Enter your full shipping address..." 
                className="w-full flex min-h-[100px] rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <Button 
              className="w-full h-12 text-base rounded-full" 
              onClick={handleCheckout}
              disabled={createOrder.isPending}
            >
              {createOrder.isPending ? "Processing..." : "Checkout"}
              {!createOrder.isPending && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
            
            {!isAuthenticated && (
              <p className="text-xs text-center text-muted-foreground mt-4">
                You will be redirected to login first.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
