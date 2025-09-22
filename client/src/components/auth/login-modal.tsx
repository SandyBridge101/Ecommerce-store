import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToRegister: () => void;
}

export function LoginModal({ open, onOpenChange, onSwitchToRegister }: LoginModalProps) {
  const { login } = useAuthStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest("POST", "/api/auth/login", {
        email: data.email,
        password: data.password,
      });
      
      const user = await response.json();
      login(user);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold" data-testid="text-login-title">
            Welcome back
          </DialogTitle>
          <p className="text-center text-muted-foreground" data-testid="text-login-subtitle">
            Sign in to your account
          </p>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      {...field} 
                      data-testid="input-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter your password" 
                      {...field} 
                      data-testid="input-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-remember-me"
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Remember me</FormLabel>
                  </FormItem>
                )}
              />
              <Button type="button" variant="link" className="px-0 text-sm" data-testid="button-forgot-password">
                Forgot password?
              </Button>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
              data-testid="button-sign-in"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
        
        <div className="text-center mt-4">
          <p className="text-muted-foreground text-sm">
            Don't have an account?{" "}
            <Button 
              variant="link" 
              className="px-0 text-sm" 
              onClick={onSwitchToRegister}
              data-testid="button-switch-to-register"
            >
              Sign up
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}