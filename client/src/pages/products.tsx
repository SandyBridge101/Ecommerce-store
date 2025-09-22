import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Grid3X3, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "@/components/product-filters";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@shared/schema";

export default function Products() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const categoryParam = searchParams.get('category');
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState({});

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-16" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-96 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Products</h1>
          <p className="text-muted-foreground mt-1" data-testid="text-page-subtitle">
            Discover our complete collection
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48" data-testid="select-sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Sort by: Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex border border-input rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
              data-testid="button-view-grid"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
              data-testid="button-view-list"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters onFiltersChange={setFilters} />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {products && products.length > 0 ? (
            <>
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`} data-testid="grid-products">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" data-testid="button-prev-page">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="default" data-testid="button-page-1">1</Button>
                  <Button variant="outline" data-testid="button-page-2">2</Button>
                  <Button variant="outline" data-testid="button-page-3">3</Button>
                  <Button variant="outline" size="icon" data-testid="button-next-page">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground" data-testid="text-no-products">
                No products found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
