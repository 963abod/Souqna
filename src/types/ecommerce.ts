export type Category = "الكل" | "أزياء وهوديات" | "إلكترونيات وبنوك طاقة" | "أجهزة منزلية ومطابخ";

export interface Product {
  id: string;
  name: string;
  category: "أزياء وهوديات" | "إلكترونيات وبنوك طاقة" | "أجهزة منزلية ومطابخ";
  price: number; // in ل.س
  originalPrice: number; // in ل.س
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  image: string;
  stock: number; // mock stock count, e.g. 4
  description: string;
  isFlashDeal?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Governorate =
  | "دمشق"
  | "ريف دمشق"
  | "حلب"
  | "حمص"
  | "اللاذقية/طرطوس"
  | "حماة"
  | "السويداء/درعا";

export interface GovernorateShipping {
  name: Governorate;
  cost: number;
}

export type PaymentMethod = "syriatel" | "mtn" | "bank_card" | "cod";

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  codFee: number;
  total: number;
  governorate: Governorate;
  phone: string;
  address: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  status: "received" | "preparing" | "shipped" | "delivering" | "delivered";
}
