import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import type { Favorite, Product } from "@shared/schema";

interface FavoriteWithProduct extends Favorite {
  product: Product;
}

export default function Favorites() {
  const { user, isAuthenticated } = useAuthStore();
  const addItem = useCartStore(state => state.addItem);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery<FavoriteWithProduct[]>({
    queryKey: ["/api/favorites", user?.id],
    enabled: isAuthenticated && !!user?.id,
  });

  const removeFromFavoritesMutation = useMutation({
    mutationFn: async ({ userId, productId }: { userId: string; productId: string }) => {
      return apiRequest("DELETE", `/api/favorites/${userId}/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites", user?.id] });
      toast({
        title: "Removed from favorites",
        description: "Item has been removed from your favorites.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item from favorites.",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleRemoveFromFavorites = (productId: string) => {
    if (!user?.id) return;
    removeFromFavoritesMutation.mutate({ userId: user.id, productId });
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4" data-testid="text-login-required">
            Please log in to view your favorites.
          </p>
          <p className="text-muted-foreground text-sm" data-testid="text-login-instruction">
            Click the user icon in the header to log in.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold" data-testid="text-page-title">Favorites</h1>
        <span className="text-muted-foreground" data-testid="text-favorites-count">
          {favorites?.length || 0} items
        </span>
      </div>
      
      {favorites && favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => {
            const product = favorite.product;
            if (!product) return null;
            
            return (
              <Card key={favorite.id} className="overflow-hidden" data-testid={`card-favorite-${product.id}`}>
                <CardContent className="p-0">
                  <Link href={`/products/${product.id}`}>
                    <div className="cursor-pointer">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-48 object-cover"
                        data-testid={`img-favorite-${product.id}`}
                      />
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <h3 className="font-semibold mb-2" data-testid={`text-favorite-name-${product.id}`}>
                      {product.name}
                    </h3>
                    <p className="text-primary font-bold mb-3" data-testid={`text-favorite-price-${product.id}`}>
                      ${product.price}
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1" 
                        onClick={() => handleAddToCart(product)}
                        data-testid={`button-add-to-cart-${product.id}`}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleRemoveFromFavorites(product.id)}
                        className="text-destructive hover:text-destructive/80"
                        disabled={removeFromFavoritesMutation.isPending}
                        data-testid={`button-remove-favorite-${product.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4" data-testid="text-no-favorites">
            You haven't added any items to your favorites yet.
          </p>
          <Link href="/products">
            <Button data-testid="button-browse-products">Browse Products</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
