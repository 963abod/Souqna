"use client";

import React, { useState } from "react";
import {
  X,
  Star,
  ShoppingCart,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, setIsCartOpen } =
    useShop();

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!quickViewProduct) return null;

  const handleAdd = () => {
    addToCart(quickViewProduct, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setQuickViewProduct(null);
      setIsCartOpen(true);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 text-slate-900 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 left-4 text-slate-400 hover:text-slate-800 bg-slate-100 p-2 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={quickViewProduct.image}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow">
              خصم -{quickViewProduct.discountPercentage}%
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                {quickViewProduct.category}
              </span>

              <h2 className="text-xl font-bold text-slate-900 mt-2.5 mb-2 leading-snug">
                {quickViewProduct.name}
              </h2>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1 text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded-lg font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{quickViewProduct.rating}</span>
                </div>
                <span className="text-xs text-slate-500">
                  ({quickViewProduct.reviewCount} تقييم)
                </span>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md mr-auto">
                  متوفر للمحافظات السورية
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4 border-y border-slate-100 py-3">
                {quickViewProduct.description}
              </p>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-black text-slate-900">
                  {quickViewProduct.price.toLocaleString("ar-SY")}{" "}
                  <span className="text-sm font-bold text-amber-600">ل.س</span>
                </span>
                <span className="text-sm text-slate-400 line-through">
                  {quickViewProduct.originalPrice.toLocaleString("ar-SY")} ل.س
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold text-slate-700">الكمية:</span>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-slate-700 hover:bg-slate-100 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 font-bold text-sm bg-slate-50">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 text-slate-700 hover:bg-slate-100 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
                {quickViewProduct.stock <= 4 && (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                    متبقي {quickViewProduct.stock} قطع فقط!
                  </span>
                )}
              </div>
            </div>

            <div>
              <button
                onClick={handleAdd}
                disabled={isAdded}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  isAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" /> تم الإضافة للسلة!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" /> إضافة إلى السلة الآن
                  </>
                )}
              </button>

              {/* Highlights */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-500 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-amber-500" />
                  <span>توصيل سريع</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>ضمان الأصالة</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-amber-500" />
                  <span>استبدال مجاني</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
