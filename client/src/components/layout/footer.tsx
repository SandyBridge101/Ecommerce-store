import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4" data-testid="text-footer-brand">TechHub</h3>
            <p className="text-muted-foreground text-sm" data-testid="text-footer-description">
              Your trusted partner for the latest in professional technology and electronics.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products?category=laptops" data-testid="link-footer-laptops">
                <span className="hover:text-foreground transition-colors">Laptops</span>
              </Link></li>
              <li><Link href="/products?category=mobile-devices" data-testid="link-footer-smartphones">
                <span className="hover:text-foreground transition-colors">Smartphones</span>
              </Link></li>
              <li><Link href="/products?category=accessories" data-testid="link-footer-accessories">
                <span className="hover:text-foreground transition-colors">Accessories</span>
              </Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Help Center</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Contact Us</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Shipping Info</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Returns</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover:text-foreground transition-colors cursor-pointer">About Us</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Careers</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p data-testid="text-copyright">&copy; 2024 TechHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
