"use client";

import React, { useState } from "react";
import { ShopProvider } from "@/context/ShopContext";
import { Header } from "@/components/Header";
import { FlashDeals } from "@/components/FlashDeals";
import { ProductGrid } from "@/components/ProductGrid";
import { QuickViewModal } from "@/components/QuickViewModal";
import { CartDrawer } from "@/components/CartDrawer";
import { OrderTrackingModal } from "@/components/OrderTrackingModal";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";

function ShopApp() {
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  return (
    <div id="top" className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans">
      <Header onOpenTracking={() => setIsTrackingOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6">
        <div id="flash-deals">
          <FlashDeals />
        </div>

        <div id="product-grid">
          <ProductGrid />
        </div>
      </main>

      <Footer />

      <QuickViewModal />
      <CartDrawer onOrderCompleted={() => setIsTrackingOpen(true)} />
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />
      <BottomNav onOpenTracking={() => setIsTrackingOpen(true)} />
    </div>
  );
}

export default function Home() {
  return (
    <ShopProvider>
      <ShopApp />
    </ShopProvider>
  );
}
