"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  Search,
  ArrowLeft,
  Sparkles,
  Building2,
  Phone,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { Order } from "@/types/ecommerce";

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIMELINE_STEPS = [
  { status: "received", label: "تم استلام الطلب", desc: "تم تأكيد طلبك في النظام" },
  { status: "preparing", label: "قيد التجهيز في المستودع", desc: "جاري فحص وتغليف العناصر" },
  { status: "shipped", label: "تم التسليم لشركة الشحن", desc: "خرجت الشحنة من مستودع سوقنا" },
  { status: "delivering", label: "قيد التوصيل", desc: "مندوب التوصيل في طريقه إليك" },
  { status: "delivered", label: "تم الاستلام", desc: "تم تسليم الطلب بنجاح" },
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { activeOrder, trackOrderById, setActiveOrder } = useShop();

  const [searchId, setSearchId] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState("");

  if (!isOpen) return null;

  const currentDisplayOrder = searchedOrder || activeOrder;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    if (!searchId.trim()) return;

    const formatted = searchId.trim().startsWith("#")
      ? searchId.trim()
      : `#${searchId.trim()}`;

    const found = trackOrderById(formatted);
    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchError("لم نجد أي طلب بهذا الرقم. تأكد من إدخال الرقم الصحيح مثل #SQN-ORD-849102");
    }
  };

  const getStepIndex = (status: Order["status"]) => {
    switch (status) {
      case "received":
        return 0;
      case "preparing":
        return 1;
      case "shipped":
        return 2;
      case "delivering":
        return 3;
      case "delivered":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 sm:p-7 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-6 border-b border-slate-800 pb-4">
          <Package className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-bold text-white">تتبع حالة الشحنة والطلب</h2>
        </div>

        {/* Manual Order Search Input */}
        <form onSubmit={handleSearch} className="mb-6">
          <label className="block text-xs text-slate-400 mb-1.5 font-medium">
            بحث برقم الطلب (مثال: SQN-ORD-849102):
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="#SQN-ORD-XXXXXX"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full bg-slate-800 text-white placeholder-slate-500 text-xs rounded-xl py-2.5 pr-9 pl-3 border border-slate-700 focus:outline-none focus:border-amber-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
            </div>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shrink-0"
            >
              بحث
            </button>
          </div>
          {searchError && (
            <p className="text-rose-400 text-[11px] mt-1.5">{searchError}</p>
          )}
        </form>

        {/* Order Details View */}
        {currentDisplayOrder ? (
          <div className="space-y-6">
            {/* Success Header Banner */}
            <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  تم اعتماد الطلب بنجاح
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  رقم الطلب: {currentDisplayOrder.id}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  التاريخ: {new Date(currentDisplayOrder.createdAt).toLocaleDateString("ar-SY")}
                </p>
              </div>
              <div className="text-left dir-ltr">
                <span className="text-xl font-black text-amber-400 block">
                  {currentDisplayOrder.total.toLocaleString("ar-SY")} ل.س
                </span>
                <span className="text-[10px] text-slate-400">
                  {currentDisplayOrder.governorate}
                </span>
              </div>
            </div>

            {/* Interactive Timeline */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 sm:p-6">
              <h4 className="text-xs font-bold text-amber-400 mb-6 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>الخط الزمني لحالة الشحنة</span>
              </h4>

              <div className="relative pr-4 border-r-2 border-slate-800 space-y-6 mr-2">
                {TIMELINE_STEPS.map((step, idx) => {
                  const currentIdx = getStepIndex(currentDisplayOrder.status);
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step.status} className="relative flex items-start gap-4">
                      {/* Timeline Circle */}
                      <div
                        className={`absolute -right-[23px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCurrent
                            ? "bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 shadow-lg animate-pulse"
                            : isDone
                            ? "bg-emerald-500 text-slate-950"
                            : "bg-slate-800 text-slate-500 border border-slate-700"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <h5
                          className={`text-xs font-bold ${
                            isDone ? "text-white" : "text-slate-500"
                          }`}
                        >
                          {step.label}
                        </h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items & Shipping info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
                <h4 className="font-bold text-amber-400 flex items-center gap-1 mb-2">
                  <MapPin className="w-3.5 h-3.5" /> تفاصيل التوصيل
                </h4>
                <p className="text-slate-300">
                  <span className="text-slate-400">المحافظة:</span>{" "}
                  {currentDisplayOrder.governorate}
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-400">الهاتف:</span>{" "}
                  {currentDisplayOrder.phone}
                </p>
                <p className="text-slate-300 line-clamp-2">
                  <span className="text-slate-400">العنوان:</span>{" "}
                  {currentDisplayOrder.address}
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-400">طريقة الدفع:</span>{" "}
                  {currentDisplayOrder.paymentMethod === "syriatel"
                    ? "سيريتل كاش"
                    : currentDisplayOrder.paymentMethod === "mtn"
                    ? "كاش إم تي إن"
                    : currentDisplayOrder.paymentMethod === "bank_card"
                    ? "بطاقة مصرفية محلية"
                    : "الدفع عند الاستلام (COD)"}
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-xs space-y-2 max-h-40 overflow-y-auto">
                <h4 className="font-bold text-amber-400 flex items-center gap-1 mb-2">
                  <Package className="w-3.5 h-3.5" /> العناصر المشتراة
                </h4>
                {currentDisplayOrder.items.map((it) => (
                  <div
                    key={it.product.id}
                    className="flex items-center justify-between py-1 border-b border-slate-800/60 last:border-0"
                  >
                    <span className="text-slate-300 truncate max-w-[150px]">
                      {it.product.name}
                    </span>
                    <span className="text-slate-400 font-bold">
                      {it.quantity}x {it.product.price.toLocaleString("ar-SY")} ل.س
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs transition-colors shadow-lg"
              >
                متابعة التسوق في سوقنا
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
            <Package className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p>لا يوجد طلب نشط حالياً للعرض. جرب البحث برقم الطلب اعلاه.</p>
          </div>
        )}
      </div>
    </div>
  );
};
