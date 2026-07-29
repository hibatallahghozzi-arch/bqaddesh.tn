export interface Product {
  id: string;
  name: string;
  arName: string;
  emoji: string;
  officialPrice: number; // in DT (e.g., 1.800)
  unit: string; // e.g., "كغ"
  category: 'vegetables' | 'fruits' | 'staples';
}

export interface District {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface Wilaya {
  id: string;
  name: string;
  districts: District[];
}

export interface LocationState {
  wilayaId: string;
  wilayaName: string;
  districtId: string;
  districtName: string;
  lat: number;
  lng: number;
  isAutoDetected: boolean;
}

export type SellerType = 'central_market' | 'neighborhood' | 'supermarket';

export interface MarketSubmission {
  id: string;
  productId: string;
  marketName: string;
  sellerType: SellerType;
  price: number; // e.g., 1.900 DT
  lat: number;
  lng: number;
  timestamp: string; // relative or formatted string e.g. "منذ 15 دقيقة"
  districtId: string;
  votesCount?: number;
}

export interface PriceHistoryPoint {
  date: string;
  submittedAvg: number;
  officialPrice: number;
}

export interface BasketItem {
  product: Product;
  quantity: number; // e.g. 2.0 kg
}
