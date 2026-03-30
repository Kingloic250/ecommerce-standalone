import { useState } from "react";
import { useGetProducts, useGetCategories } from "@workspace/api-client-react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Products() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  
  // Debounced search for API
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  // Quick and dirty debounce
  useState(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: products, isLoading: isLoadingProducts } = useGetProducts({
    search: debouncedSearch || undefined,
    category: category || undefined,
  });

  const { data: categories } = useGetCategories();
  const { addToCart } = useCart();

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setCategory("");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in">
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-serif font-semibold">The Collection</h1>
        <p className="text-muted-foreground max-w-2xl">
          Thoughtfully crafted objects for modern living. Explore our full range of products below.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Filters - Desktop */}
        <aside className="w-full lg:w-64 shrink-0 hidden lg:block sticky top-24 space-y-8">
          <div className="space-y-4">
            <h3 className="font-medium text-sm uppercase tracking-wider">Search</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-9 bg-card border-border"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-sm uppercase tracking-wider">Categories</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setCategory("")}
                className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${category === "" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
              >
                All Products
              </button>
              {categories?.map((c) => (
                <button 
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`block w-full text-left px-3 py-2 text-sm capitalize rounded-md transition-colors ${category === c ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {(search || category) && (
            <Button variant="ghost" onClick={clearFilters} className="w-full text-sm text-muted-foreground">
              <X className="w-4 h-4 mr-2" /> Clear Filters
            </Button>
          )}
        </aside>

        {/* Mobile Filters */}
        <div className="w-full lg:hidden flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-9 bg-card border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium text-sm uppercase tracking-wider">Categories</h3>
                  <div className="space-y-1">
                    <button 
                      onClick={() => setCategory("")}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md ${category === "" ? "bg-primary/10 text-primary" : ""}`}
                    >
                      All Products
                    </button>
                    {categories?.map((c) => (
                      <button 
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`block w-full text-left px-3 py-2 text-sm capitalize rounded-md ${category === c ? "bg-primary/10 text-primary" : ""}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                {(search || category) && (
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Clear Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Product Grid */}
        <div className="flex-1 w-full">
          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {products.map((product) => (
                <div key={product.id} className="group relative flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${product.id * 50}ms` }}>
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-accent">
                    <Link href={`/products/${product.id}`} className="block w-full h-full">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                    </Link>
                    {product.countInStock === 0 && (
                      <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm px-2 py-1 text-xs font-medium rounded-md text-foreground">
                        Sold Out
                      </div>
                    )}
                    <button
                      className="absolute bottom-4 left-4 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 flex items-center gap-2 bg-white text-gray-900 font-medium text-sm px-4 py-2 rounded-full shadow-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                        toast.success(`Added to cart`);
                      }}
                      disabled={product.countInStock <= 0}
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="w-4 h-4 shrink-0" />
                      <span>Add to cart</span>
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-1 px-1">
                    <div className="flex justify-between items-start gap-2">
                      <Link href={`/products/${product.id}`} className="font-medium text-base hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </Link>
                      <span className="font-medium text-base whitespace-nowrap">${product.price.toFixed(2)}</span>
                    </div>
                    <span className="text-sm text-muted-foreground capitalize">{product.category}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">We couldn't find anything matching your search.</p>
              <Button onClick={clearFilters} variant="outline" className="rounded-full">
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
