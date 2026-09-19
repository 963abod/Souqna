"use client";

import React from "react";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  MapPin,
  Sparkles,
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-16 pt-12 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Value Propositions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-slate-800/80 text-center">
          <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/40">
            <Truck className="w-6 h-6 text-amber-500" />
            <h4 className="font-bold text-white text-sm">توصيل شامل لكل المحافظات</h4>
            <p className="text-[11px] text-slate-400">دمشق، ريفها، حلب، حمص، اللاذقية وكافة المدن</p>
          </div>

          <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/40">
            <ShieldCheck className="w-6 h-6 text-amber-500" />
            <h4 className="font-bold text-white text-sm">دفع إلكتروني ونقدي آمن</h4>
            <p className="text-[11px] text-slate-400">سيريتل كاش، MTN كاش، بطاقة مصرفية، والدفع عند الاستلام</p>
          </div>

          <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/40">
            <RotateCcw className="w-6 h-6 text-amber-500" />
            <h4 className="font-bold text-white text-sm">سياسة استبدال مرنة</h4>
            <p className="text-[11px] text-slate-400">ضمان سلامة وجودة جميع المنتجات في الكتالوج</p>
          </div>

          <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/40">
            <Headphones className="w-6 h-6 text-amber-500" />
            <h4 className="font-bold text-white text-sm">دعم فني وتتبع مباشر</h4>
            <p className="text-[11px] text-slate-400">تتبع أوقات الشحنة والوصول لحظة بلحظة</p>
          </div>
        </div>

        {/* Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 border-b border-slate-800/80">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-amber-500 text-slate-950 font-black text-xl px-2.5 py-0.5 rounded-lg">
                سوقنا
              </div>
              <span className="text-white font-bold text-sm">Souqna</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              منصة التجارة الإلكترونية الشاملة والحديثة الموجهة جغرافياً داخل المحافظات السورية بأسعار تنافسية وتجربة تسوق خاطفة وممتعة.
            </p>
          </div>

          {/* Quick Nav */}
          <div>
            <h5 className="font-bold text-white text-sm mb-3">أقسام التسوق</h5>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-amber-400 transition-colors">أزياء وهوديات</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">إلكترونيات وبنوك طاقة</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">أجهزة منزلية ومطابخ</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">صفقات خاطفة وتخفيضات</a></li>
            </ul>
          </div>

          {/* Shipping Governorates */}
          <div>
            <h5 className="font-bold text-white text-sm mb-3">المحافظات المغطاة</h5>
            <div className="flex flex-wrap gap-1.5">
              {["دمشق", "ريف دمشق", "حلب", "حمص", "اللاذقية", "طرطوس", "حماة", "السويداء", "درعا"].map((city) => (
                <span key={city} className="bg-slate-900 border border-slate-800 text-[11px] px-2.5 py-1 rounded-md text-slate-300">
                  {city}
                </span>
              ))}
            </div>
          </div>

          {/* Sandbox Notice */}
          <div>
            <h5 className="font-bold text-amber-400 text-sm mb-2 flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> بيئة عرض محاكاة (Mock Sandbox)
            </h5>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              جميع المنتجات، الأسعار، وبوابات الدفع المسجلة في هذا المنصة هي لاغراض المحاكاة والتجربة التفاعلية بنسبة 100%.
            </p>
          </div>
        </div>

        {/* Copyright & Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} سوقنا - جميع الحقوق محفوظة.
          </p>

          {/* Mandatory Developer Link */}
          <p className="text-xs text-slate-500">
            Developer{" "}
            <a
              href="https://aboudweb.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-amber-500 hover:text-amber-400 underline decoration-amber-500/40 transition-colors"
            >
              Aboud Web
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
