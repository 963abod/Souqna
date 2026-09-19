"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  MapPin,
  Search,
  Truck,
  Sparkles,
  ChevronDown,
  X,
  PackageCheck,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { GOVERNORATES_SHIPPING } from "@/data/products";
import { Governorate } from "@/types/ecommerce";

interface HeaderProps {
  onOpenTracking: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenTracking }) => {
  const {
    selectedGovernorate,
    setSelectedGovernorate,
    shippingCost,
    isFreeShipping,
    cartCount,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
  } = useShop();

  const [isGovModalOpen, setIsGovModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-slate-950 font-bold text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-inner">
        <Sparkles className="w-4 h-4 animate-pulse" />
        <span>عروض سوقنا الكبرى: شحن مجاني للطلبات فوق 5,000 ل.س!</span>
        <Sparkles className="w-4 h-4 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Logo & Governorate Selector */}
          <div className="flex items-center gap-3 md:gap-5">
            <a href="#" className="flex items-center gap-2 group">
              <div className="bg-amber-500 text-slate-950 font-black text-2xl tracking-wider px-2.5 py-1 rounded-lg group-hover:bg-amber-400 transition-colors shadow-sm">
                سوقنا
              </div>
              <span className="hidden sm:inline text-xs text-slate-400 font-medium border-r border-slate-700 pr-2">
                Souqna
              </span>
            </a>

            {/* Location Selector Button */}
            <button
              onClick={() => setIsGovModalOpen(true)}
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
              title="تغيير المحافظة"
            >
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-right hidden xs:block">
                <span className="block text-[10px] text-slate-400">التوصيل إلى</span>
                <span className="font-bold text-white flex items-center gap-1">
                  {selectedGovernorate}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </span>
              </div>
              <span className="xs:hidden font-bold">{selectedGovernorate}</span>
            </button>
          </div>

          {/* Dynamic Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="ابحث عن أزياء، بنوك طاقة، أدوات منزلية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 text-slate-100 placeholder-slate-400 text-sm rounded-xl py-2.5 pr-10 pl-9 border border-slate-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Order Tracking Button */}
            <button
              onClick={onOpenTracking}
              className="hidden md:flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl border border-slate-700 transition-colors"
            >
              <PackageCheck className="w-4 h-4 text-amber-400" />
              <span className="font-medium">تتبع طلبي</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-transform active:scale-95 shadow-md"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline">السلة</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Governorate Selection Modal */}
      {isGovModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setIsGovModalOpen(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4 text-amber-400">
              <MapPin className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">اختر المحافظة لتحديد تكلفة التوصيل</h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              يتم حساب أجور الشحن تلقائياً بناءً على موقع التوصيل. الشحن مجاني لأي طلب يتجاوز 5,000 ل.س.
            </p>

            <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-1">
              {GOVERNORATES_SHIPPING.map((gov) => {
                const isSelected = selectedGovernorate === gov.name;
                return (
                  <button
                    key={gov.name}
                    onClick={() => {
                      setSelectedGovernorate(gov.name as Governorate);
                      setIsGovModalOpen(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all text-right ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/10 text-amber-400 font-bold"
                        : "border-slate-800 hover:border-slate-700 bg-slate-800/50 text-slate-200"
                    }`}
                  >
                    <span className="text-sm">{gov.name}</span>
                    <span className="text-xs text-slate-400 font-semibold">
                      {isFreeShipping ? "شحن مجاني 🎉" : `أجور الشحن: ${gov.cost} ل.س`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
