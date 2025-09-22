import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Heart, ShoppingCart, User, Menu } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LoginModal } from "../../components/auth/login-modal";
import { RegisterModal } from "@/components/auth/register-modal";

export function Header() {
  const [location] = useLocation();
  const itemCount = useCartStore(state => state.getItemCount());
  const { user, isAuthenticated, logout } = useAuthStore();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const switchToRegister = () => {
    setLoginModalOpen(false);
    setRegisterModalOpen(true);
  };

  const switchToLogin = () => {
    setRegisterModalOpen(false);
    setLoginModalOpen(true);
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
  ];

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" data-testid="link-home">
              <span className="text-primary text-2xl font-bold">TechHub</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} data-testid={`link-${item.name.toLowerCase()}`}>
                <span className={`transition-colors ${
                  location === item.href 
                    ? "text-primary" 
                    : "text-foreground hover:text-primary"
                }`}>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" data-testid="button-search">
              <Search className="h-5 w-5" />
            </Button>
            
            <Link href="/favorites" data-testid="link-favorites">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/cart" data-testid="link-cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs cart-badge"
                    data-testid="text-cart-count"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="button-user-menu">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem data-testid="text-user-name">
                    {user?.firstName} {user?.lastName}
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <Link href="/dashboard">
                      <DropdownMenuItem data-testid="link-dashboard">Dashboard</DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuItem onClick={logout} data-testid="button-logout">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setLoginModalOpen(true)}
                data-testid="button-open-login"
              >
                <User className="h-5 w-5" />
              </Button>
            )}
            
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href} data-testid={`link-mobile-${item.name.toLowerCase()}`}>
                      <span className="text-lg hover:text-primary transition-colors">
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Auth Modals */}
      <LoginModal 
        open={loginModalOpen} 
        onOpenChange={setLoginModalOpen}
        onSwitchToRegister={switchToRegister}
      />
      <RegisterModal 
        open={registerModalOpen} 
        onOpenChange={setRegisterModalOpen}
        onSwitchToLogin={switchToLogin}
      />
    </header>
  );
}
