import React, { useState } from 'react';
import { Product, LocationState, MarketSubmission, SellerType } from '../types';
import { Store, X, Plus, Check } from 'lucide-react';

interface AddMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currentLocation: LocationState;
  onAddSubmission: (newSub: MarketSubmission) => void;
}

export const AddMarketModal: React.FC<AddMarketModalProps> = ({
  isOpen,
  onClose,
  products,
  currentLocation,
  onAddSubmission,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || 'tomate');
  const [marketName, setMarketName] = useState('');
  const [price, setPrice] = useState<number>(products[0]?.officialPrice || 1.8);
  const [sellerType, setSellerType] = useState<SellerType>('neighborhood');

  if (!isOpen) return null;

  const currentProd = products.find((p) => p.id === selectedProductId) || products[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketName.trim()) return;

    const newSubmission: MarketSubmission = {
      id: `sub-${Date.now()}`,
      productId: currentProd.id,
      marketName: marketName.trim(),
      sellerType,
      price,
      lat: currentLocation.lat + (Math.random() - 0.5) * 0.008,
      lng: currentLocation.lng + (Math.random() - 0.5) * 0.008,
      timestamp: 'توّه كيف تزاد',
      districtId: currentLocation.districtId,
      votesCount: 1,
    };

    onAddSubmission(newSubmission);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
        <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-200" />
            <h3 className="text-lg font-bold">إضافة نقطة بيع أو سوق جديد</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-emerald-600 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              اختار الخضرة ولا الغلة
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                const p = products.find((item) => item.id === e.target.value);
                if (p) setPrice(p.officialPrice);
              }}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.emoji} {p.arName} (التسعيرة الرسمية: {p.officialPrice.toFixed(3)} DT)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              اسم السوق أو الخضار
            </label>
            <input
              type="text"
              required
              placeholder="مثلا: مارشي أريانة البلدي / خضار عمّ صالح"
              value={marketName}
              onChange={(e) => setMarketName(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              السوم في السوق (بالدينار DT)
            </label>
            <input
              type="number"
              step="0.050"
              min="0.100"
              required
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl font-black text-emerald-800 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              نوع نقطة البيع
            </label>
            <select
              value={sellerType}
              onChange={(e) => setSellerType(e.target.value as SellerType)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              <option value="neighborhood">خضار الحومة / عطار</option>
              <option value="central_market">سوق بلدي / سوق الجملة</option>
              <option value="supermarket">سوبرماركت كبير</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>زيد النقطة الخارطة</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
