"use client";

import React, { useState } from "react";
import {
  X,
  Trash2,
  ShoppingBag,
  Plus,
  Minus,
  Tag,
  CreditCard,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  Wallet,
  Coins,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { GOVERNORATES_SHIPPING } from "@/data/products";
import { Governorate, PaymentMethod } from "@/types/ecommerce";

interface CartDrawerProps {
  onOrderCompleted: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOrderCompleted }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    selectedGovernorate,
    setSelectedGovernorate,
    shippingCost,
    isFreeShipping,
    couponCode,
    discountPercentage,
    applyCoupon,
    removeCoupon,
    placeOrder,
  } = useShop();

  const [step, setStep] = useState<"cart" | "checkout">("cart");

  // Form State
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("syriatel");

  // Coupons State
  const [inputCoupon, setInputCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  // Payment Simulators State
  const [syriatelPhone, setSyriatelPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [mtnPhone, setMtnPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const codFee = paymentMethod === "cod" ? 50 : 0;
  const finalTotal = subtotal - discountAmount + shippingCost + codFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponMessage({ text: res.message, isError: !res.success });
    if (res.success) setInputCoupon("");
  };

  const handleSendSyriatelOtp = () => {
    if (!syriatelPhone || !syriatelPhone.startsWith("09")) {
      setFormError("يرجى إدخال رقم سيريتل صحسح يبدأ بـ 09");
      return;
    }
    setFormError("");
    setOtpSent(true);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validate phone
    if (!phone || !/^09\d{8}$/.test(phone)) {
      setFormError("يرجى إدخال رقم هاتف سوري صحيح يتكون من 10 أرقام (مثال: 0987654321)");
      return;
    }

    // Validate address
    if (!address.trim() || address.trim().length < 5) {
      setFormError("يرجى كتابة تفاصيل العنوان بوضوح (الحي، الشارع، أقرب نقطة دالة)");
      return;
    }

    // Payment validation
    if (paymentMethod === "syriatel") {
      if (!otpSent) {
        setFormError("يرجى طلب رمز التحقق (OTP) لسيريتل كاش أولاً");
        return;
      }
      if (otpCode.trim() !== "123456") {
        setFormError("رمز التحقق غير صحيح! رمز التحقق التجريبي هو: 123456");
        return;
      }
    } else if (paymentMethod === "mtn") {
      if (!mtnPhone || !mtnPhone.startsWith("09")) {
        setFormError("يرجى إدخال رقم MTN كاش الصحيح يبدأ بـ 09");
        return;
      }
    } else if (paymentMethod === "bank_card") {
      if (cardNumber.replace(/\s/g, "").length < 16) {
        setFormError("يرجى إدخال رقم بطاقة مصرفية صحيح مكون من 16 رقماً");
        return;
      }
      if (!cardExpiry || !cardCvv) {
        setFormError("يرجى إكمال بيانات البطاقة المصرفية");
        return;
      }
    }

    // Process order
    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder({
        phone,
        address,
        paymentMethod,
      });
      setIsSubmitting(false);
      setIsCartOpen(false);
      setStep("cart");
      onOrderCompleted();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="bg-slate-900 border-r border-slate-800 text-white w-full max-w-lg h-full flex flex-col shadow-2xl relative">
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            {step === "checkout" && (
              <button
                onClick={() => setStep("cart")}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-1"
                title="العودة للسلة"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-lg text-white">
              {step === "cart" ? "سلة التسوق" : "إتمام الطلب والدفع"}
            </h2>
            <span className="text-xs bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full font-bold">
              {cart.reduce((s, i) => s + i.quantity, 0)} عنصر
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-200 mb-1">
                سلتك فارغة حالياً
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mb-6">
                استمتع بتصفح العروض والمنتجات المميزة في متجر سوقنا وأضف ما يعجبك.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-lg"
              >
                تصفح العروض الآن
              </button>
            </div>
          ) : step === "cart" ? (
            /* STEP 1: CART ITEMS & SUMMARY */
            <>
              {/* Items List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 flex items-center gap-3"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-xl bg-slate-700 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">
                        {item.product.name}
                      </h4>
                      <div className="text-amber-400 font-black text-sm">
                        {item.product.price.toLocaleString("ar-SY")} ل.س
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="px-2 py-0.5 text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 py-0.5 text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="px-2 py-0.5 text-slate-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-500 hover:text-rose-400 text-xs p-1"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-2">
                  <Tag className="w-4 h-4" />
                  <span>هل لديك كوبون خصم؟</span>
                </div>

                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-2.5 text-xs text-emerald-400">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-bold">كوبون ({couponCode}) مفعل ({discountPercentage}% خصم)</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-slate-400 hover:text-rose-400 font-bold"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="أدخل الكود (مثال: SOUQNA10)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="flex-1 bg-slate-800 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0"
                    >
                      تطبيق
                    </button>
                  </form>
                )}

                {couponMessage && (
                  <p
                    className={`text-[11px] mt-2 ${
                      couponMessage.isError ? "text-rose-400" : "text-emerald-400"
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}

                <div className="flex gap-2 mt-2.5">
                  <span
                    onClick={() => {
                      applyCoupon("SOUQNA10");
                    }}
                    className="cursor-pointer text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2 py-1 rounded-md"
                  >
                    جرب: SOUQNA10 (-10%)
                  </span>
                  <span
                    onClick={() => {
                      applyCoupon("SOUQNA20");
                    }}
                    className="cursor-pointer text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2 py-1 rounded-md"
                  >
                    جرب: SOUQNA20 (-20%)
                  </span>
                </div>
              </div>

              {/* Governorate Selection */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>محافظة التوصيل:</span>
                  </label>
                  <span className="text-[11px] text-amber-400 font-bold">
                    {isFreeShipping ? "شحن مجاني 🎉" : `${shippingCost} ل.س`}
                  </span>
                </div>

                <select
                  value={selectedGovernorate}
                  onChange={(e) =>
                    setSelectedGovernorate(e.target.value as Governorate)
                  }
                  className="w-full bg-slate-800 text-white text-xs rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
                >
                  {GOVERNORATES_SHIPPING.map((gov) => (
                    <option key={gov.name} value={gov.name}>
                      {gov.name} ({gov.cost} ل.س أجور توصيل)
                    </option>
                  ))}
                </select>

                {!isFreeShipping && (
                  <p className="text-[10px] text-slate-400 mt-2">
                    💡 أضف منتجات بقيمة{" "}
                    <span className="text-amber-400 font-bold">
                      {(5000 - subtotal).toLocaleString("ar-SY")} ل.س
                    </span>{" "}
                    إضافية للحصول على شحن مجاني!
                  </p>
                )}
              </div>
            </>
          ) : (
            /* STEP 2: CHECKOUT & MOCK PAYMENT FORM */
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              {formError && (
                <div className="bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Delivery Details */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 space-y-3">
                <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  <span>بيانات الاتصال والتوصيل داخل سوريا</span>
                </h3>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    رقم الهاتف المستلم (بصيغة 09xxxxxxxx) *
                  </label>
                  <input
                    type="tel"
                    placeholder="0987654321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-800 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    عنوان التوصيل بالتفصيل (المحافظة: {selectedGovernorate}) *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="المدينة / الحي / الشارع / مقابل أو بالقرب من..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-800 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Payment Gateways Selection */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 space-y-3">
                <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  <span>اختر طريقة الدفع (بيئة محاكاة تجريبية 100%)</span>
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  {/* Syriatel Cash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("syriatel")}
                    className={`p-3 rounded-xl border text-right transition-all flex flex-col gap-1 ${
                      paymentMethod === "syriatel"
                        ? "border-amber-500 bg-amber-500/10 text-white"
                        : "border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-amber-400">
                      <Wallet className="w-4 h-4" />
                      <span>سيريتل كاش</span>
                    </div>
                    <span className="text-[10px] text-slate-400">محفظة إلكترونية</span>
                  </button>

                  {/* MTN Cash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("mtn")}
                    className={`p-3 rounded-xl border text-right transition-all flex flex-col gap-1 ${
                      paymentMethod === "mtn"
                        ? "border-amber-500 bg-amber-500/10 text-white"
                        : "border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-amber-400">
                      <Coins className="w-4 h-4" />
                      <span>كاش إم تي إن</span>
                    </div>
                    <span className="text-[10px] text-slate-400">خصم مباشر</span>
                  </button>

                  {/* Local Bank Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank_card")}
                    className={`p-3 rounded-xl border text-right transition-all flex flex-col gap-1 ${
                      paymentMethod === "bank_card"
                        ? "border-amber-500 bg-amber-500/10 text-white"
                        : "border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-amber-400">
                      <Building2 className="w-4 h-4" />
                      <span>بطاقة مصرفية محلية</span>
                    </div>
                    <span className="text-[10px] text-slate-400">بطاقات البنوك السورية</span>
                  </button>

                  {/* Cash on Delivery */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-3 rounded-xl border text-right transition-all flex flex-col gap-1 ${
                      paymentMethod === "cod"
                        ? "border-amber-500 bg-amber-500/10 text-white"
                        : "border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-amber-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>الدفع عند الاستلام</span>
                    </div>
                    <span className="text-[10px] text-slate-400">+50 ل.س رسوم تحصيل</span>
                  </button>
                </div>

                {/* Gateway Inputs */}
                <div className="pt-2 border-t border-slate-800">
                  {paymentMethod === "syriatel" && (
                    <div className="space-y-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <label className="block text-[11px] text-slate-300">
                        رقم حساب سيريتل كاش:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          placeholder="09xxxxxxxx"
                          value={syriatelPhone}
                          onChange={(e) => setSyriatelPhone(e.target.value)}
                          className="flex-1 bg-slate-800 text-white text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-amber-500"
                        />
                        <button
                          type="button"
                          onClick={handleSendSyriatelOtp}
                          className="bg-amber-500 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs hover:bg-amber-400 shrink-0"
                        >
                          {otpSent ? "إعادة إرسال" : "طلب OTP"}
                        </button>
                      </div>

                      {otpSent && (
                        <div className="mt-2 pt-2 border-t border-slate-800">
                          <p className="text-[10px] text-emerald-400 mb-1">
                            ✅ تم إرسال الرمز التجريبي! أدخل الرمز:{" "}
                            <span className="font-bold underline">123456</span>
                          </p>
                          <input
                            type="text"
                            placeholder="رمز التحقق OTP (123456)"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="w-full bg-slate-800 text-white text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {paymentMethod === "mtn" && (
                    <div className="space-y-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <label className="block text-[11px] text-slate-300">
                        رقم MTN كاش لتأكيد الخصم المباشر:
                      </label>
                      <input
                        type="tel"
                        placeholder="09xxxxxxxx"
                        value={mtnPhone}
                        onChange={(e) => setMtnPhone(e.target.value)}
                        className="w-full bg-slate-800 text-white text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-amber-500"
                      />
                      <p className="text-[10px] text-slate-400">
                        سيتم خصم القيمة تلقائياً من رصيد محفظتك عند التأكيد.
                      </p>
                    </div>
                  )}

                  {paymentMethod === "bank_card" && (
                    <div className="space-y-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">
                          رقم البطاقة (16 رقماً):
                        </label>
                        <input
                          type="text"
                          placeholder="4000 1234 5678 9010"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-slate-800 text-white text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-slate-300 mb-1">
                            تاريخ الانتهاء:
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-slate-800 text-white text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-300 mb-1">
                            رمز الأمان CVV:
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full bg-slate-800 text-white text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "cod" && (
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                      <p>
                        ستدفع نقداً لمندوب التوصيل عند استلام الطلب. تم إضافة رسم تحصيل إضافي بقيمة{" "}
                        <span className="text-amber-400 font-bold">50 ل.س</span>.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Summary & Actions */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-slate-200">
                  {subtotal.toLocaleString("ar-SY")} ل.س
                </span>
              </div>

              {discountPercentage > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>الخصم ({discountPercentage}%):</span>
                  <span className="font-bold">
                    -{discountAmount.toLocaleString("ar-SY")} ل.س
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>رسوم التوصيل ({selectedGovernorate}):</span>
                <span className="font-bold text-slate-200">
                  {isFreeShipping ? "مجاني 🎉" : `${shippingCost} ل.س`}
                </span>
              </div>

              {paymentMethod === "cod" && step === "checkout" && (
                <div className="flex justify-between text-amber-400">
                  <span>رسوم التحصيل النقدي (COD):</span>
                  <span className="font-bold">+50 ل.س</span>
                </div>
              )}

              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                <span>المجموع النهائي:</span>
                <span className="text-amber-400">
                  {finalTotal.toLocaleString("ar-SY")} ل.س
                </span>
              </div>
            </div>

            {step === "cart" ? (
              <button
                onClick={() => setStep("checkout")}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xl"
              >
                <span>الانتقال لإتمام الطلب</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>جاري معالجة الطلب...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>تأكيد الطلب والدفع ({finalTotal.toLocaleString("ar-SY")} ل.س)</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
