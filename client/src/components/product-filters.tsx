import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ProductFiltersProps {
  onFiltersChange?: (filters: any) => void;
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const categories = [
    { id: "laptops", name: "Laptops", count: 24 },
    { id: "phones", name: "Phones", count: 18 },
    { id: "accessories", name: "Accessories", count: 36 },
  ];

  const priceRanges = [
    { id: "under-500", label: "Under $500" },
    { id: "500-1000", label: "$500 - $1000" },
    { id: "1000-2000", label: "$1000 - $2000" },
    { id: "over-2000", label: "Over $2000" },
  ];

  const brands = [
    { id: "apple", name: "Apple" },
    { id: "samsung", name: "Samsung" },
    { id: "dell", name: "Dell" },
    { id: "hp", name: "HP" },
  ];

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter(id => id !== categoryId);
    
    setSelectedCategories(newCategories);
    onFiltersChange?.({
      categories: newCategories,
      priceRange: selectedPriceRange,
      brands: selectedBrands,
    });
  };

  const handleBrandChange = (brandId: string, checked: boolean) => {
    const newBrands = checked
      ? [...selectedBrands, brandId]
      : selectedBrands.filter(id => id !== brandId);
    
    setSelectedBrands(newBrands);
    onFiltersChange?.({
      categories: selectedCategories,
      priceRange: selectedPriceRange,
      brands: newBrands,
    });
  };

  const handlePriceRangeChange = (priceRange: string) => {
    setSelectedPriceRange(priceRange);
    onFiltersChange?.({
      categories: selectedCategories,
      priceRange,
      brands: selectedBrands,
    });
  };

  return (
    <Card data-testid="card-filters">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div>
          <h4 className="font-medium mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => handleCategoryChange(category.id, !!checked)}
                  data-testid={`checkbox-category-${category.id}`}
                />
                <Label htmlFor={category.id} className="text-sm">
                  {category.name} ({category.count})
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <h4 className="font-medium mb-3">Price Range</h4>
          <RadioGroup value={selectedPriceRange} onValueChange={handlePriceRangeChange}>
            {priceRanges.map((range) => (
              <div key={range.id} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={range.id} 
                  id={range.id}
                  data-testid={`radio-price-${range.id}`}
                />
                <Label htmlFor={range.id} className="text-sm">
                  {range.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Brand Filter */}
        <div>
          <h4 className="font-medium mb-3">Brand</h4>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={brand.id}
                  checked={selectedBrands.includes(brand.id)}
                  onCheckedChange={(checked) => handleBrandChange(brand.id, !!checked)}
                  data-testid={`checkbox-brand-${brand.id}`}
                />
                <Label htmlFor={brand.id} className="text-sm">
                  {brand.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
