import { Link } from "wouter";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToFavorites?: () => void;
}

export function ProductCard({ product, onAddToFavorites }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToFavorites?.();
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow" data-testid={`card-product-${product.id}`}>
      <CardContent className="p-0">
        <Link href={`/products/${product.id}`}>
          <div className="cursor-pointer">
            <div className="relative">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
                data-testid={`img-product-${product.id}`}
              />
              {product.originalPrice && (
                <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                  Sale
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={handleAddToFavorites}
                data-testid={`button-favorite-${product.id}`}
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2" data-testid={`text-product-name-${product.id}`}>
                {product.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-3" data-testid={`text-product-description-${product.id}`}>
                {product.shortDescription}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through" data-testid={`text-product-original-price-${product.id}`}>
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <div className="flex mr-2">
                    {renderStars(parseFloat(product.rating || "0"))}
                  </div>
                  <span className="text-sm text-muted-foreground" data-testid={`text-product-rating-${product.id}`}>
                    ({product.rating})
                  </span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleAddToCart}
                data-testid={`button-add-to-cart-${product.id}`}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
