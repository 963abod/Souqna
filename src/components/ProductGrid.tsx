"use client";

import React, { useState } from "react";
import {
  Star,
  ShoppingCart,
  Check,
  Eye,
  SlidersHorizontal,
  Package,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { Category, Product } from "@/types/ecommerce";

const CATEGORIES: Category[] = [
  "الكل",
  "أزياء وهوديات",
  "إلكترونيات وبنوك طاقة",
  "أجهزة منزلية ومطابخ",
];

export const ProductGrid: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    addToCart,
    setQuickViewProduct,
  } = useShop();

  const [addedIds, setAddedIds] = useState<{ [key: string]: boolean }>({});

  // Filter products by category and search query
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "الكل" || p.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <section className="my-6">
      {/* Categories Bar & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-slate-900 text-amber-400 shadow-md ring-2 ring-amber-500/20"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <SlidersHorizontal className="w-4 h-4 text-amber-500" />
          <span>تم العثور على {filteredProducts.length} منتج</span>
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto my-8">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-lg mb-1">
            لا توجد نتائج مطابقة
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            لم نجد أي منتجات تطابق خيارات البحث الحالية. جرب البحث عن كلمة أخرى أو تغيير القسم.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("الكل");
            }}
            className="text-xs bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl hover:bg-amber-400 transition-colors"
          >
            عرض كافة المنتجات
          </button>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredProducts.map((product) => {
            const isAdded = addedIds[product.id];
            return (
              <div
                key={product.id}
                onClick={() => setQuickViewProduct(product)}
                className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col justify-between group cursor-pointer hover:border-amber-400 hover:shadow-xl transition-all duration-300 relative"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Discount Badge */}
                    <div className="absolute top-2.5 right-2.5 bg-rose-600 text-white font-black text-xs px-2 py-0.5 rounded-lg shadow">
                      -{product.discountPercentage}%
                    </div>

                    {/* Stock indicator badge */}
                    {product.stock <= 4 && (
                      <div className="absolute bottom-2.5 right-2.5 bg-amber-500/90 backdrop-blur-sm text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-md shadow">
                        متبقي {product.stock} قطع فقط
                      </div>
                    )}

                    {/* Quick View Button on Hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                      className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                        <Eye className="w-3.5 h-3.5" /> نظرة سريعة
                      </span>
                    </button>
                  </div>

                  {/* Category & Rating */}
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{product.rating}</span>
                      <span className="text-slate-400 text-[10px]">
                        ({product.reviewCount})
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-2 mb-2 group-hover:text-amber-600 transition-colors">
                    {product.name}
                  </h3>
                </div>

                {/* Price & Action */}
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-black text-base text-slate-900">
                      {product.price.toLocaleString("ar-SY")}{" "}
                      <span className="text-xs text-amber-600 font-bold">ل.س</span>
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {product.originalPrice.toLocaleString("ar-SY")}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleAdd(product, e)}
                    disabled={isAdded}
                    className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white active:scale-95 shadow-sm"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" /> تم الإضافة بنجاح!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" /> إضافة للسلة
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
