import { Link, useLocation } from "wouter";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-xl group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="font-serif font-semibold text-xl tracking-tight hidden sm:block">ShopWave</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link 
              href="/" 
              className={`hover:text-primary transition-colors ${isActive("/") ? "text-primary" : "text-muted-foreground"}`}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className={`hover:text-primary transition-colors ${isActive("/products") ? "text-primary" : "text-muted-foreground"}`}
            >
              Shop All
            </Link>
            {isAuthenticated && (
              <Link 
                href="/orders" 
                className={`hover:text-primary transition-colors ${isActive("/orders") ? "text-primary" : "text-muted-foreground"}`}
              >
                Orders
              </Link>
            )}
            {user?.role === "admin" && (
              <Link 
                href="/admin" 
                className={`hover:text-primary transition-colors ${isActive("/admin") ? "text-primary" : "text-muted-foreground"}`}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/products">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/10" aria-label="Search">
              <Search className="w-5 h-5" />
            </Button>
          </Link>
          
          <Link href="/cart" className="relative group">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/10" aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
            </Button>
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center rounded-full animate-in zoom-in group-hover:scale-110 transition-transform">
                {totalItems}
              </span>
            )}
          </Link>

          <div className="hidden sm:flex items-center gap-2 border-l border-border pl-4 ml-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground truncate max-w-[120px]">
                  Hi, {user?.name?.split(' ')[0] || 'User'}
                </span>
                <Button variant="outline" size="sm" onClick={logout} className="rounded-full text-xs">
                  Log out
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="rounded-full text-sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="rounded-full text-sm px-4">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md animate-in slide-in-from-top-4">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-md font-medium ${isActive("/") ? "bg-primary/10 text-primary" : "text-foreground"}`}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-md font-medium ${isActive("/products") ? "bg-primary/10 text-primary" : "text-foreground"}`}
            >
              Shop All
            </Link>
            
            {isAuthenticated && (
              <Link 
                href="/orders" 
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2 rounded-md font-medium ${isActive("/orders") ? "bg-primary/10 text-primary" : "text-foreground"}`}
              >
                My Orders
              </Link>
            )}
            
            {user?.role === "admin" && (
              <Link 
                href="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2 rounded-md font-medium ${isActive("/admin") ? "bg-primary/10 text-primary" : "text-foreground"}`}
              >
                Admin Dashboard
              </Link>
            )}
            
            <div className="border-t border-border mt-2 pt-4 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <div className="p-2 text-sm text-muted-foreground">
                    Logged in as <span className="font-medium text-foreground">{user?.email}</span>
                  </div>
                  <Button variant="outline" className="w-full justify-center" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                    Log out
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Log in</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
