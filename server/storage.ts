import { 
  type User, 
  type InsertUser, 
  type Product, 
  type InsertProduct,
  type Category, 
  type InsertCategory,
  type CartItem, 
  type InsertCartItem,
  type Favorite, 
  type InsertFavorite,
  type Order, 
  type InsertOrder,
  type OrderItem, 
  type InsertOrderItem
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(): Promise<User[]>;

  // Categories
  getCategory(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  getAllCategories(): Promise<Category[]>;

  // Products
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;

  // Cart
  getCartItems(userId: string): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(userId: string): Promise<boolean>;

  // Favorites
  getFavorites(userId: string): Promise<Favorite[]>;
  addToFavorites(favorite: InsertFavorite): Promise<Favorite>;
  removeFromFavorites(userId: string, productId: string): Promise<boolean>;

  // Orders
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  getUserOrders(userId: string): Promise<Order[]>;
  addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private categories: Map<string, Category> = new Map();
  private products: Map<string, Product> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private favorites: Map<string, Favorite> = new Map();
  private orders: Map<string, Order> = new Map();
  private orderItems: Map<string, OrderItem> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const laptopCategory: Category = {
      id: "cat-1",
      name: "Laptops",
      slug: "laptops",
      description: "Professional and gaming laptops",
    };
    const phoneCategory: Category = {
      id: "cat-2",
      name: "Mobile Devices",
      slug: "mobile-devices",
      description: "Smartphones and tablets",
    };
    const accessoryCategory: Category = {
      id: "cat-3",
      name: "Accessories",
      slug: "accessories",
      description: "Audio, storage, and more",
    };

    this.categories.set(laptopCategory.id, laptopCategory);
    this.categories.set(phoneCategory.id, phoneCategory);
    this.categories.set(accessoryCategory.id, accessoryCategory);

    // Seed products
    const products: Product[] = [
      {
        id: "prod-1",
        name: "Apple MacBook Pro 2024 14\"",
        description: "The MacBook Pro 14-inch with M3 chip delivers exceptional performance for professionals. Features include a stunning Liquid Retina XDR display, advanced camera and audio, and all-day battery life. Perfect for creative work, development, and demanding applications.",
        shortDescription: "Professional laptop with M3 chip and advanced features",
        price: "1999.00",
        originalPrice: "2199.00",
        categoryId: laptopCategory.id,
        brand: "Apple",
        sku: "MBP-14-2024-SG",
        stock: 25,
        rating: "4.8",
        reviewCount: 142,
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        images: [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
          "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        ],
        specifications: JSON.stringify({
          processor: "Apple M3 Pro chip",
          display: "14.2-inch Liquid Retina XDR",
          memory: "16GB unified memory",
          storage: "512GB SSD",
          graphics: "18-core GPU",
          battery: "Up to 18 hours",
          weight: "3.5 pounds (1.6 kg)",
          ports: "3x Thunderbolt 4, HDMI, SD card"
        }),
        featured: true,
        createdAt: new Date(),
      },
      {
        id: "prod-2",
        name: "iPhone 15 Pro Max",
        description: "Latest iPhone with titanium design and A17 Pro chip. Advanced camera system with 5x telephoto zoom and Action Button for quick access to features.",
        shortDescription: "Latest iPhone with titanium design and A17 Pro chip",
        price: "1199.00",
        originalPrice: null,
        categoryId: phoneCategory.id,
        brand: "Apple",
        sku: "IPHONE-15-PRO-MAX",
        stock: 50,
        rating: "4.6",
        reviewCount: 89,
        imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"],
        specifications: JSON.stringify({
          display: "6.7-inch Super Retina XDR",
          chip: "A17 Pro",
          storage: "256GB",
          camera: "48MP Main, 12MP Ultra Wide, 12MP Telephoto",
          battery: "Up to 29 hours video playback",
          material: "Titanium"
        }),
        featured: true,
        createdAt: new Date(),
      },
      {
        id: "prod-3",
        name: "Sony WH-1000XM5",
        description: "Industry-leading noise canceling wireless headphones with premium sound quality and all-day comfort.",
        shortDescription: "Noise canceling wireless headphones",
        price: "399.00",
        originalPrice: null,
        categoryId: accessoryCategory.id,
        brand: "Sony",
        sku: "SONY-XM5-BK",
        stock: 15,
        rating: "4.9",
        reviewCount: 256,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"],
        specifications: JSON.stringify({
          type: "Over-ear",
          connectivity: "Bluetooth 5.2, 3.5mm",
          battery: "30 hours with ANC",
          features: "Active Noise Canceling, Touch controls",
          weight: "250g"
        }),
        featured: true,
        createdAt: new Date(),
      },
      {
        id: "prod-4",
        name: "Samsung Galaxy S24 Ultra",
        description: "Premium Android smartphone with S Pen, exceptional camera system, and titanium build quality.",
        shortDescription: "256GB, 12GB RAM, S Pen included",
        price: "1299.00",
        originalPrice: null,
        categoryId: phoneCategory.id,
        brand: "Samsung",
        sku: "SGS24-256-TB",
        stock: 30,
        rating: "4.6",
        reviewCount: 124,
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"],
        specifications: JSON.stringify({
          display: "6.8-inch Dynamic AMOLED 2X",
          processor: "Snapdragon 8 Gen 3",
          storage: "256GB",
          ram: "12GB",
          camera: "200MP Main, 50MP Periscope Telephoto",
          battery: "5000mAh"
        }),
        featured: false,
        createdAt: new Date(),
      },
      {
        id: "prod-5",
        name: "ASUS ROG Strix G15",
        description: "High-performance gaming laptop with RTX graphics and advanced cooling system for demanding games.",
        shortDescription: "Gaming laptop with RTX 4060, 16GB RAM",
        price: "1499.00",
        originalPrice: null,
        categoryId: laptopCategory.id,
        brand: "ASUS",
        sku: "ASUS-ROG-G15",
        stock: 12,
        rating: "4.2",
        reviewCount: 67,
        imageUrl: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        images: ["https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"],
        specifications: JSON.stringify({
          processor: "AMD Ryzen 7 7735HS",
          graphics: "NVIDIA RTX 4060",
          memory: "16GB DDR5",
          storage: "1TB PCIe SSD",
          display: "15.6-inch 144Hz IPS"
        }),
        featured: false,
        createdAt: new Date(),
      },
      {
        id: "prod-6",
        name: "iPad Pro 12.9\"",
        description: "Most advanced iPad with M2 chip, Liquid Retina XDR display, and Apple Pencil support.",
        shortDescription: "M2 chip, 128GB, WiFi + Cellular",
        price: "1099.00",
        originalPrice: null,
        categoryId: phoneCategory.id,
        brand: "Apple",
        sku: "IPAD-PRO-129",
        stock: 20,
        rating: "4.7",
        reviewCount: 98,
        imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"],
        specifications: JSON.stringify({
          chip: "Apple M2",
          display: "12.9-inch Liquid Retina XDR",
          storage: "128GB",
          connectivity: "WiFi + Cellular",
          camera: "12MP Wide, 10MP Ultra Wide",
          battery: "Up to 10 hours"
        }),
        featured: false,
        createdAt: new Date(),
      },
    ];

    products.forEach(product => this.products.set(product.id, product));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "customer",
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Categories
  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { 
      ...insertCategory, 
      id,
      description: insertCategory.description || null
    };
    this.categories.set(id, category);
    return category;
  }

  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  // Products
  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      originalPrice: insertProduct.originalPrice || null,
      shortDescription: insertProduct.shortDescription || null,
      images: insertProduct.images || null,
      specifications: insertProduct.specifications || null,
      featured: insertProduct.featured || false,
      rating: insertProduct.rating || "0",
      reviewCount: insertProduct.reviewCount || 0,
      stock: insertProduct.stock || 0,
      createdAt: new Date() 
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updateData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.categoryId === categoryId);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.featured);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.brand.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Cart
  async getCartItems(userId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.userId === userId);
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    const id = randomUUID();
    const cartItem: CartItem = { 
      ...insertCartItem, 
      id,
      quantity: insertCartItem.quantity || 1,
      selectedOptions: insertCartItem.selectedOptions || null,
      createdAt: new Date() 
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    const updatedItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: string): Promise<boolean> {
    const userCartItems = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.userId === userId);
    
    userCartItems.forEach(([id]) => this.cartItems.delete(id));
    return true;
  }

  // Favorites
  async getFavorites(userId: string): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(fav => fav.userId === userId);
  }

  async addToFavorites(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = randomUUID();
    const favorite: Favorite = { 
      ...insertFavorite, 
      id, 
      createdAt: new Date() 
    };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async removeFromFavorites(userId: string, productId: string): Promise<boolean> {
    const favorite = Array.from(this.favorites.entries())
      .find(([_, fav]) => fav.userId === userId && fav.productId === productId);
    
    if (favorite) {
      return this.favorites.delete(favorite[0]);
    }
    return false;
  }

  // Orders
  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id,
      status: insertOrder.status || "pending",
      createdAt: new Date() 
    };
    this.orders.set(id, order);
    return order;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async addOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const orderItem: OrderItem = { 
      ...insertOrderItem, 
      id,
      selectedOptions: insertOrderItem.selectedOptions || null
    };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }
}

export const storage = new MemStorage();
