import { Link } from "wouter";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cart";

export default function Cart() {
  const { items, updateQuantity, removeItem, getSubtotal, getTax, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8" data-testid="text-page-title">Shopping Cart</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4" data-testid="text-empty-cart">
            Your cart is empty
          </p>
          <Link href="/products">
            <Button data-testid="button-continue-shopping">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8" data-testid="text-page-title">Shopping Cart</h1>
      
      {/* Cart Items */}
      <Card className="mb-8">
        <CardContent className="p-0">
          {items.map((item, index) => (
            <div 
              key={item.id}
              className={`flex items-center p-6 ${
                index < items.length - 1 ? 'border-b border-border' : ''
              }`}
              data-testid={`row-cart-item-${item.id}`}
            >
              <img 
                src={item.imageUrl} 
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg mr-4"
                data-testid={`img-cart-item-${item.id}`}
              />
              <div className="flex-1">
                <h3 className="font-semibold" data-testid={`text-cart-item-name-${item.id}`}>
                  {item.name}
                </h3>
                {item.selectedOptions && (
                  <p className="text-muted-foreground text-sm" data-testid={`text-cart-item-options-${item.id}`}>
                    {Object.entries(JSON.parse(item.selectedOptions))
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(', ')}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-input rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    data-testid={`button-decrease-${item.id}`}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2" data-testid={`text-quantity-${item.id}`}>
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    data-testid={`button-increase-${item.id}`}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="font-semibold w-24 text-right" data-testid={`text-item-total-${item.id}`}>
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="text-destructive hover:text-destructive/80"
                  data-testid={`button-remove-${item.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Cart Summary */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4" data-testid="text-order-summary">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span data-testid="text-subtotal">${getSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span data-testid="text-shipping">Free</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span data-testid="text-tax">${getTax().toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span data-testid="text-total">${getTotal().toFixed(2)}</span>
            </div>
          </div>
          <Link href="/checkout">
            <Button className="w-full" size="lg" data-testid="button-checkout">
              Proceed to Checkout
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
