import { useGetFeaturedProducts, useGetCategories } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export default function Home() {
  const { data: featuredProducts, isLoading: isLoadingFeatured } = useGetFeaturedProducts();
  const { data: categories, isLoading: isLoadingCategories } = useGetCategories();
  const { addToCart } = useCart();

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative w-full min-h-[70vh] flex items-center bg-card overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-xl space-y-6">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium uppercase tracking-wider">
              New Collection
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-semibold leading-tight text-foreground">
              Curated for the modern life.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Discover our thoughtfully selected range of premium essentials, designed to elevate your everyday experience.
            </p>
            <div className="flex gap-4 pt-4">
              <Link href="/products">
                <Button size="lg" className="rounded-full px-8 text-base">
                  Shop Collection
                </Button>
              </Link>
              <Link href="/products?category=bestsellers">
                <Button size="lg" variant="outline" className="rounded-full px-8 text-base bg-background/50 backdrop-blur-sm">
                  View Bestsellers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-semibold">Shop by Category</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {isLoadingCategories ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-2xl" />
              ))
            ) : (
              categories?.map((category) => (
                <Link key={category} href={`/products?category=${category}`}>
                  <Card className="group cursor-pointer overflow-hidden border-none bg-card hover:bg-accent transition-colors h-40 rounded-2xl flex items-center justify-center relative">
                    <CardContent className="p-6 text-center z-10">
                      <h3 className="font-medium text-lg capitalize tracking-wide">{category}</h3>
                      <div className="mt-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 text-primary text-sm">
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-serif font-semibold">Featured Edit</h2>
            <Link href="/products" className="hidden sm:flex items-center text-primary font-medium hover:underline">
              View all products <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoadingFeatured ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))
            ) : (
              featuredProducts?.map((product) => (
                <div key={product.id} className="group relative flex flex-col gap-4" data-testid={`card-product-${product.id}`}>
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-background">
                    <Link href={`/products/${product.id}`} className="block w-full h-full">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                    </Link>
                    <button
                      className="absolute bottom-4 left-4 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 flex items-center gap-2 bg-white text-gray-900 font-medium text-sm px-4 py-2 rounded-full shadow-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                        toast.success(`Added ${product.name} to cart`);
                      }}
                      disabled={product.countInStock <= 0}
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="w-4 h-4 shrink-0" />
                      <span>Add to cart</span>
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start gap-2">
                      <Link href={`/products/${product.id}`} className="font-medium text-base hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </Link>
                      <span className="font-medium text-base">${product.price.toFixed(2)}</span>
                    </div>
                    <span className="text-sm text-muted-foreground capitalize">{product.category}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-8 flex justify-center sm:hidden">
            <Link href="/products">
              <Button variant="outline" className="rounded-full px-8">
                View all products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
