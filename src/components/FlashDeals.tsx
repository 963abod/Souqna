"use client";

import React, { useState, useEffect } from "react";
import { Zap, Clock, ShoppingCart, Check, Eye } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { Product } from "@/types/ecommerce";

export const FlashDeals: React.FC = () => {
  const { products, addToCart, setQuickViewProduct } = useShop();
  const flashProducts = products.filter((p) => p.isFlashDeal);

  // Active countdown timer state (e.g., 04:23:15)
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 23,
    seconds: 15,
  });

  const [addedIds, setAddedIds] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 5, minutes: 45, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const formatNum = (num: number) => String(num).padStart(2, "0");

  if (flashProducts.length === 0) return null;

  return (
    <section className="bg-gradient-to-l from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-4 sm:p-6 my-6 text-white shadow-xl overflow-hidden relative">
      {/* Background Decorative Circles */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 relative z-10 border-b border-white/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-white text-amber-600 p-2.5 rounded-2xl shadow-lg animate-bounce">
            <Zap className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              صفقات خاطفة <span className="text-xs bg-slate-900/80 text-amber-400 px-2.5 py-0.5 rounded-full font-bold">تخفيضات تصل لـ 50%</span>
            </h2>
            <p className="text-xs text-amber-100/90 font-medium mt-0.5">
              عروض حصريّة لفترة محدودة جدّاً - سارع بالشراء قبل نفاد الكميّة!
            </p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 bg-slate-950/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 self-start sm:self-auto">
          <Clock className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: "10s" }} />
          <span className="text-xs font-bold text-amber-100 ml-1">وينتهي العرض خلال:</span>
          <div className="flex items-center gap-1 font-mono font-black text-sm dir-ltr">
            <span className="bg-slate-900 text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/30">
              {formatNum(timeLeft.hours)}
            </span>
            <span>:</span>
            <span className="bg-slate-900 text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/30">
              {formatNum(timeLeft.minutes)}
            </span>
            <span>:</span>
            <span className="bg-slate-900 text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/30">
              {formatNum(timeLeft.seconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Deals Carousel */}
      <div className="flex gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth relative z-10">
        {flashProducts.map((product) => {
          const isAdded = addedIds[product.id];
          return (
            <div
              key={product.id}
              onClick={() => setQuickViewProduct(product)}
              className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-2xl p-3 min-w-[210px] sm:min-w-[230px] max-w-[230px] flex-shrink-0 flex flex-col justify-between group cursor-pointer hover:border-amber-400 hover:shadow-2xl transition-all duration-300"
            >
              <div>
                {/* Image & Discount Badge */}
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-slate-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-rose-600 text-white font-black text-xs px-2 py-1 rounded-lg shadow-md">
                    -{product.discountPercentage}%
                  </div>
                  {product.stock <= 4 && (
                    <div className="absolute bottom-2 right-2 bg-amber-500/90 backdrop-blur-sm text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-md">
                      متبقي {product.stock} قطع فقط
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewProduct(product);
                    }}
                    className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <span className="bg-white/90 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow">
                      <Eye className="w-3.5 h-3.5" /> نظرة سريعة
                    </span>
                  </button>
                </div>

                {/* Category & Title */}
                <span className="text-[10px] text-amber-400 font-semibold block mb-1">
                  {product.category}
                </span>
                <h3 className="font-bold text-sm text-white line-clamp-2 mb-2 group-hover:text-amber-300 transition-colors">
                  {product.name}
                </h3>
              </div>

              {/* Price & Add Button */}
              <div className="mt-2 pt-2 border-t border-slate-800">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-black text-lg text-amber-400">
                    {product.price.toLocaleString("ar-SY")} ل.س
                  </span>
                  <span className="text-xs text-slate-500 line-through">
                    {product.originalPrice.toLocaleString("ar-SY")} ل.س
                  </span>
                </div>

                <button
                  onClick={(e) => handleAdd(product, e)}
                  disabled={isAdded}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : "bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95 shadow-md"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" /> تم الإضافة!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" /> إضافة سريعة
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
