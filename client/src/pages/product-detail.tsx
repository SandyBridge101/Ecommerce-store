import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useState } from "react";
import { Star, Heart, ShoppingCart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState("512GB");
  const [selectedMemory, setSelectedMemory] = useState("16GB");
  const addItem = useCartStore(state => state.addItem);
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", id],
  });

  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ["/api/products", { category: product?.categoryId }],
    enabled: !!product?.categoryId,
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    const selectedOptions = JSON.stringify({
      storage: selectedStorage,
      memory: selectedMemory,
    });
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
      selectedOptions,
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-6 w-96 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Skeleton className="w-full h-96 mb-4" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground" data-testid="text-product-not-found">
            Product not found.
          </p>
          <Link href="/products">
            <Button className="mt-4" data-testid="button-back-to-products">
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const specifications = product.specifications ? JSON.parse(product.specifications) : {};
  const images = product.images || [product.imageUrl];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" data-testid="link-breadcrumb-home">
              <span className="hover:text-foreground">Home</span>
            </Link>
          </li>
          <li><ChevronRight className="w-4 h-4" /></li>
          <li>
            <Link href="/products" data-testid="link-breadcrumb-products">
              <span className="hover:text-foreground">Products</span>
            </Link>
          </li>
          <li><ChevronRight className="w-4 h-4" /></li>
          <li className="text-foreground" data-testid="text-breadcrumb-current">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            <img 
              src={images[selectedImage]} 
              alt={product.name}
              className="w-full rounded-lg"
              data-testid="img-product-main"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} ${index + 1}`}
                className={`rounded-lg border cursor-pointer hover:border-primary transition-colors ${
                  selectedImage === index ? 'border-primary' : 'border-border'
                }`}
                onClick={() => setSelectedImage(index)}
                data-testid={`img-product-thumbnail-${index}`}
              />
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div>
          <h1 className="text-3xl font-bold mb-4" data-testid="text-product-name">
            {product.name}
          </h1>
          
          {/* Rating and Reviews */}
          <div className="flex items-center mb-6">
            <div className="flex mr-3">
              {renderStars(parseFloat(product.rating || "0"))}
            </div>
            <span className="text-muted-foreground" data-testid="text-product-reviews">
              {product.reviewCount} reviews
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <span className="text-4xl font-bold text-primary" data-testid="text-product-price">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through ml-3" data-testid="text-product-original-price">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Product Options */}
          {product.name.includes("MacBook") && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Storage</label>
                  <div className="flex space-x-2">
                    {['512GB', '1TB (+$200)', '2TB (+$600)'].map((storage) => (
                      <Button
                        key={storage}
                        variant={selectedStorage === storage ? 'default' : 'outline'}
                        onClick={() => setSelectedStorage(storage)}
                        data-testid={`button-storage-${storage.split(' ')[0]}`}
                      >
                        {storage}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Memory</label>
                  <div className="flex space-x-2">
                    {['16GB', '32GB (+$400)'].map((memory) => (
                      <Button
                        key={memory}
                        variant={selectedMemory === memory ? 'default' : 'outline'}
                        onClick={() => setSelectedMemory(memory)}
                        data-testid={`button-memory-${memory.split(' ')[0]}`}
                      >
                        {memory}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="flex space-x-4 mb-8">
            <Button 
              className="flex-1" 
              onClick={handleAddToCart}
              data-testid="button-add-to-cart"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="icon" data-testid="button-add-to-favorites">
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          {/* Product Description */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-product-description">
              {product.description}
            </p>
          </div>

          {/* Specifications */}
          {Object.keys(specifications).length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Specifications</h3>
              <div className="bg-muted rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} data-testid={`spec-${key}`}>
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {value as string}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 1 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8" data-testid="text-related-products">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts
              .filter(p => p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
