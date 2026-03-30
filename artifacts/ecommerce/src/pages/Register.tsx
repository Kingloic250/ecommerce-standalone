import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { useRegister } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(useSearch());
  const redirect = searchParams.get("redirect") || "/";
  
  const { login: setAuth } = useAuth();
  const registerMutation = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ data: { name, email, password } }, {
      onSuccess: (data) => {
        setAuth(data.token, data.user);
        toast.success("Account created successfully!");
        setLocation(redirect);
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to register");
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
          <h1 className="text-3xl font-serif font-semibold">Create account</h1>
          <p className="text-muted-foreground mt-2">Join ShopWave to shop curations.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                required 
                value={name}
                onChange={e => setName(e.target.value)}
                className="h-12 bg-background rounded-xl"
              />
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="h-12 bg-background rounded-xl"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 rounded-full text-base" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Creating account..." : "Create account"}
            {!registerMutation.isPending && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
