import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(useSearch());
  const redirect = searchParams.get("redirect") || "/";
  
  const { login: setAuth } = useAuth();
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ data: { email, password } }, {
      onSuccess: (data) => {
        setAuth(data.token, data.user);
        toast.success("Welcome back!");
        setLocation(redirect);
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to login");
      }
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[70vh] py-12 px-4 animate-in fade-in">
      <div className="w-full max-w-md space-y-8 bg-card p-8 md:p-12 rounded-3xl border border-border shadow-sm">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-2xl mx-auto mb-6">
            S
          </div>
          <h1 className="text-3xl font-serif font-semibold">Welcome back</h1>
          <p className="text-muted-foreground mt-2">Enter your details to access your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-12 bg-background rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="h-12 bg-background rounded-xl"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 rounded-full text-base" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
            {!loginMutation.isPending && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href={`/register?redirect=${encodeURIComponent(redirect)}`} className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
