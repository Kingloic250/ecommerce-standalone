import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Link } from "wouter";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>
      <footer className="border-t border-border/50 bg-card py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 group mb-4 inline-flex">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-sm">
                  S
                </div>
                <span className="font-serif font-semibold text-lg tracking-tight">ShopWave</span>
              </Link>
              <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                Curated essentials for the modern lifestyle. Thoughtfully designed, responsibly crafted, and delivered with care.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-sm tracking-wider uppercase">Shop</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
                <li><Link href="/products?category=new" className="hover:text-primary transition-colors">New Arrivals</Link></li>
                <li><Link href="/products?category=bestsellers" className="hover:text-primary transition-colors">Bestsellers</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-sm tracking-wider uppercase">Support</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/orders" className="hover:text-primary transition-colors">Order Status</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} ShopWave. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
