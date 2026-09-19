"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Product,
  CartItem,
  Governorate,
  Order,
  PaymentMethod,
  Category,
} from "@/types/ecommerce";
import { MOCK_PRODUCTS, GOVERNORATES_SHIPPING } from "@/data/products";

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;

  selectedGovernorate: Governorate;
  setSelectedGovernorate: (gov: Governorate) => void;
  shippingCost: number;
  isFreeShipping: boolean;

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (c: Category) => void;

  couponCode: string;
  discountPercentage: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  placeOrder: (details: {
    phone: string;
    address: string;
    paymentMethod: PaymentMethod;
  }) => Order;
  trackOrderById: (orderId: string) => Order | undefined;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 5000;

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedGovernorate, setSelectedGovernorate] =
    useState<Governorate>("دمشق");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("الكل");

  const [couponCode, setCouponCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Load saved state from localStorage if available
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("souqna_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedGov = localStorage.getItem("souqna_gov");
      if (savedGov) setSelectedGovernorate(savedGov as Governorate);

      const savedOrders = localStorage.getItem("souqna_orders");
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch {
      // ignore
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("souqna_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("souqna_gov", selectedGovernorate);
    } catch {}
  }, [selectedGovernorate]);

  useEffect(() => {
    try {
      localStorage.setItem("souqna_orders", JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode("");
    setDiscountPercentage(0);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const govObj =
    GOVERNORATES_SHIPPING.find((g) => g.name === selectedGovernorate) ||
    GOVERNORATES_SHIPPING[0];

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping ? 0 : govObj.cost;

  const applyCoupon = (code: string) => {
    const formatted = code.trim().toUpperCase();
    if (formatted === "SOUQNA10") {
      setCouponCode("SOUQNA10");
      setDiscountPercentage(10);
      return { success: true, message: "تم تطبيق خصم 10% بنجاح!" };
    } else if (formatted === "SOUQNA20") {
      setCouponCode("SOUQNA20");
      setDiscountPercentage(20);
      return { success: true, message: "تم تطبيق خصم 20% بنجاح!" };
    } else {
      return { success: false, message: "كود الخصم غير صالح. جرب SOUQNA10 أو SOUQNA20" };
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setDiscountPercentage(0);
  };

  const placeOrder = (details: {
    phone: string;
    address: string;
    paymentMethod: PaymentMethod;
  }) => {
    const discountAmt = Math.round((subtotal * discountPercentage) / 100);
    const codFee = details.paymentMethod === "cod" ? 50 : 0;
    const finalTotal = subtotal - discountAmt + shippingCost + codFee;

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      id: `#SQN-ORD-${randomNum}`,
      items: [...cart],
      subtotal,
      discountAmount: discountAmt,
      shippingCost,
      codFee,
      total: finalTotal,
      governorate: selectedGovernorate,
      phone: details.phone,
      address: details.address,
      paymentMethod: details.paymentMethod,
      createdAt: new Date().toISOString(),
      status: "received",
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const trackOrderById = (orderId: string) => {
    return orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase());
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        selectedGovernorate,
        setSelectedGovernorate,
        shippingCost,
        isFreeShipping,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        couponCode,
        discountPercentage,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        quickViewProduct,
        setQuickViewProduct,
        orders,
        activeOrder,
        setActiveOrder,
        placeOrder,
        trackOrderById,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
