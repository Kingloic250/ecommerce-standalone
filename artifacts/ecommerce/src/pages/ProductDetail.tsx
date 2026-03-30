import { useParams, Link } from "wouter";
import { useGetProduct } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Minus, Plus, ShoppingBag, Truck, ShieldAlert } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useState } from "react";
import { getGetProductQueryKey } from "@workspace/api-client-react";

export default function ProductDetail() {
  const params = useParams();
  const productId = parseInt(params.id || "0");
  
  const { data: product, isLoading, isError } = useGetProduct(productId, {
    query: {
      enabled: !!productId,
      queryKey: getGetProductQueryKey(productId)
    }
  });

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-6 pt-8">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif mb-4">Product not found</h2>
        <Link href="/products">
          <Button variant="outline">Return to shop</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in duration-500">
      <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to all products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Images */}
        <div className="relative aspect-[4/5] md:aspect-square bg-card rounded-2xl overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="object-cover w-full h-full"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col pt-4 md:pt-10">
          <div className="mb-2">
            <Link href={`/products?category=${product.category}`} className="text-primary text-sm font-medium uppercase tracking-wider hover:underline">
              {product.category}
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4 leading-tight">
            {product.name}
          </h1>
          
          <div className="text-2xl font-medium mb-8">
            ${product.price.toFixed(2)}
          </div>
          
          <p className="text-muted-foreground leading-relaxed mb-8 whitespace-pre-line">
            {product.description}
          </p>

          <div className="space-y-6 mt-auto border-t border-border pt-8">
            <div className="flex items-center gap-4">
              <span className="font-medium text-sm">Quantity</span>
              <div className="flex items-center border border-border rounded-full h-10 w-32">
                <button 
                  className="flex-1 flex justify-center items-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="flex-1 text-center font-medium text-sm">{quantity}</span>
                <button 
                  className="flex-1 flex justify-center items-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  onClick={() => setQuantity(q => Math.min(product.countInStock, q + 1))}
                  disabled={quantity >= product.countInStock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.countInStock > 0 ? `${product.countInStock} available` : 'Out of stock'}
              </span>
            </div>

            <Button 
              size="lg" 
              className="w-full h-14 text-base rounded-full gap-2" 
              onClick={handleAddToCart}
              disabled={product.countInStock <= 0}
            >
              <ShoppingBag className="w-5 h-5" />
              {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-border text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="font-medium text-foreground">Free Shipping</p>
                <p>On orders over $150.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="font-medium text-foreground">Returns</p>
                <p>30-day return policy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
