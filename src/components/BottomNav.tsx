"use client";

import React from "react";
import { Home, Zap, Grid, ShoppingBag, PackageCheck } from "lucide-react";
import { useShop } from "@/context/ShopContext";

interface BottomNavProps {
  onOpenTracking: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenTracking }) => {
  const { cartCount, setIsCartOpen, setSelectedCategory } = useShop();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-300 px-3 py-2">
      <div className="flex items-center justify-around">
        <button
          onClick={() => scrollToSection("top")}
          className="flex flex-col items-center gap-1 text-[11px] font-medium hover:text-amber-400 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>الرئيسية</span>
        </button>

        <button
          onClick={() => {
            setSelectedCategory("الكل");
            scrollToSection("product-grid");
          }}
          className="flex flex-col items-center gap-1 text-[11px] font-medium hover:text-amber-400 transition-colors"
        >
          <Grid className="w-5 h-5" />
          <span>الأقسام</span>
        </button>

        <button
          onClick={() => scrollToSection("flash-deals")}
          className="flex flex-col items-center gap-1 text-[11px] font-medium text-amber-400 hover:text-amber-300 transition-colors"
        >
          <Zap className="w-5 h-5 fill-amber-400" />
          <span>العروض</span>
        </button>

        <button
          onClick={onOpenTracking}
          className="flex flex-col items-center gap-1 text-[11px] font-medium hover:text-amber-400 transition-colors"
        >
          <PackageCheck className="w-5 h-5" />
          <span>تتبع طلبي</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-1 text-[11px] font-medium hover:text-amber-400 transition-colors relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span>السلة</span>
        </button>
      </div>
    </nav>
  );
};
