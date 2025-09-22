import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCartItemSchema, insertFavoriteSchema, insertOrderSchema, insertOrderItemSchema, type Product } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Login failed" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search, featured } = req.query;
      let products: Product[] = [];
      
      if (featured === "true") {
        products = await storage.getFeaturedProducts();
      } else if (category) {
        const categoryData = await storage.getCategoryBySlug(category as string);
        if (categoryData) {
          products = await storage.getProductsByCategory(categoryData.id);
        } else {
          products = [];
        }
      } else if (search) {
        products = await storage.searchProducts(search as string);
      } else {
        products = await storage.getAllProducts();
      }
      console.log("Listed products: ",products);
      
      res.json(products);
    } catch (error) {
      console.log("Listed products fetch failed");
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Cart routes
  app.get("/api/cart/:userId", async (req, res) => {
    try {
      const cartItems = await storage.getCartItems(req.params.userId);
      
      // Enrich cart items with product data
      const enrichedItems = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return { ...item, product };
        })
      );
      
      res.json(enrichedItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const cartItemData = insertCartItemSchema.parse(req.body);
      
      // Check if item already exists in cart
      const existingItems = await storage.getCartItems(cartItemData.userId);
      const existingItem = existingItems.find(item => 
        item.productId === cartItemData.productId && 
        item.selectedOptions === cartItemData.selectedOptions
      );
      
      if (existingItem) {
        // Update quantity instead of creating new item
        const updatedItem = await storage.updateCartItem(
          existingItem.id, 
          existingItem.quantity + (cartItemData.quantity || 1)
        );
        res.json(updatedItem);
      } else {
        const cartItem = await storage.addToCart(cartItemData);
        res.json(cartItem);
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid cart item data" });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(req.params.id, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const success = await storage.removeFromCart(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  // Favorites routes
  app.get("/api/favorites/:userId", async (req, res) => {
    try {
      const favorites = await storage.getFavorites(req.params.userId);
      
      // Enrich favorites with product data
      const enrichedFavorites = await Promise.all(
        favorites.map(async (favorite) => {
          const product = await storage.getProduct(favorite.productId);
          return { ...favorite, product };
        })
      );
      
      res.json(enrichedFavorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const favoriteData = insertFavoriteSchema.parse(req.body);
      const favorite = await storage.addToFavorites(favoriteData);
      res.json(favorite);
    } catch (error) {
      res.status(400).json({ message: "Invalid favorite data" });
    }
  });

  app.delete("/api/favorites/:userId/:productId", async (req, res) => {
    try {
      const success = await storage.removeFromFavorites(req.params.userId, req.params.productId);
      if (!success) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  // Orders routes
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.get("/api/orders/:userId", async (req, res) => {
    try {
      const orders = await storage.getUserOrders(req.params.userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Users management routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const success = await storage.deleteUser(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
