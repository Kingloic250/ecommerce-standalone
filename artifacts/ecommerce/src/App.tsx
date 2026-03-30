import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { MainLayout } from "@/components/layout/MainLayout";

import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Orders from "@/pages/Orders";
import OrderDetail from "@/pages/OrderDetail";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminOrders from "@/pages/admin/Orders";
import NotFound from "@/pages/not-found";
import { ReactNode } from "react";

const queryClient = new QueryClient();

function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { user, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  if (adminOnly && user?.role !== "admin") {
    setLocation("/");
    return null;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/products/:id" component={ProductDetail} />
        <Route path="/cart" component={Cart} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/orders">
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        </Route>
        <Route path="/orders/:id">
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        </Route>
        <Route path="/admin">
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/products">
          <ProtectedRoute adminOnly>
            <AdminProducts />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/orders">
          <ProtectedRoute adminOnly>
            <AdminOrders />
          </ProtectedRoute>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
