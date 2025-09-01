import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Laptop, Smartphone, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@shared/schema";

export default function Home() {
  const { data: featuredProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { featured: "true" }],
  });

  if (isLoading) {
    return (
      <div>
        {/* Hero Skeleton */}
        <div className="relative bg-gradient-to-r from-primary to-blue-600 text-white">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <Skeleton className="h-16 w-96 mx-auto mb-6" />
            <Skeleton className="h-8 w-64 mx-auto mb-8" />
            <Skeleton className="h-12 w-32 mx-auto" />
          </div>
        </div>
        
        {/* Products Skeleton */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Skeleton className="h-8 w-64 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="w-full h-48 mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-blue-600 text-white" data-testid="section-hero">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="text-hero-title">
            Next-Gen Mobility
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90" data-testid="text-hero-subtitle">
            Discover the latest in professional technology
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary" data-testid="button-shop-now">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Top Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" data-testid="text-trending-title">
          Top Trending Products
        </h2>
        
        {featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground" data-testid="text-no-products">
              No featured products available.
            </p>
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12" data-testid="text-categories-title">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/products?category=laptops">
              <div className="bg-card rounded-lg p-8 text-center hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-category-laptops">
                <Laptop className="w-12 h-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Laptops</h3>
                <p className="text-muted-foreground">Professional and gaming laptops</p>
              </div>
            </Link>
            
            <Link href="/products?category=mobile-devices">
              <div className="bg-card rounded-lg p-8 text-center hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-category-mobile">
                <Smartphone className="w-12 h-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Mobile Devices</h3>
                <p className="text-muted-foreground">Smartphones and tablets</p>
              </div>
            </Link>
            
            <Link href="/products?category=accessories">
              <div className="bg-card rounded-lg p-8 text-center hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-category-accessories">
                <Headphones className="w-12 h-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Accessories</h3>
                <p className="text-muted-foreground">Audio, storage, and more</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
