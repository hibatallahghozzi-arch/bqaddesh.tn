import React, { useState } from 'react';
import { Product, BasketItem } from '../types';
import { ShoppingBag, Plus, Minus, Trash2, Sparkles, ArrowRight, ShieldCheck, Store, Home } from 'lucide-react';

interface KoffetElYoumProps {
  products: Product[];
}

export const KoffetElYoum: React.FC<KoffetElYoumProps> = ({ products }) => {
  // Initial default basket with standard items
  const [basket, setBasket] = useState<BasketItem[]>([
    { product: products.find((p) => p.id === 'tomate') || products[0], quantity: 2.0 },
    { product: products.find((p) => p.id === 'batata') || products[1], quantity: 2.0 },
    { product: products.find((p) => p.id === 'felfel') || products[3], quantity: 1.0 },
    { product: products.find((p) => p.id === 'banane') || products[2], quantity: 1.0 },
  ]);

  const [selectedAddProductId, setSelectedAddProductId] = useState<string>(
    products[0]?.id || 'tomate'
  );

  // Update item quantity
  const handleUpdateQuantity = (productId: string, delta: number) => {
    setBasket((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = Math.max(0.5, Number((item.quantity + delta).toFixed(1)));
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove item
  const handleRemoveItem = (productId: string) => {
    setBasket((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Add new product to basket
  const handleAddItem = () => {
    const prodToAdd = products.find((p) => p.id === selectedAddProductId);
    if (!prodToAdd) return;

    setBasket((prev) => {
      const existing = prev.find((item) => item.product.id === prodToAdd.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === prodToAdd.id
            ? { ...item, quantity: Number((item.quantity + 1.0).toFixed(1)) }
            : item
        );
      }
      return [...prev, { product: prodToAdd, quantity: 1.0 }];
    });
  };

  // Calculations:
  // 1. Official Total
  const officialTotal = basket.reduce(
    (sum, item) => sum + item.product.officialPrice * item.quantity,
    0
  );

  // 2. Central Market Total (usually ~5% above official or right at official)
  const centralMarketTotal = basket.reduce(
    (sum, item) => sum + item.product.officialPrice * 1.02 * item.quantity,
    0
  );

  // 3. Neighborhood Sellers Total (typically ~15-25% higher)
  const neighborhoodTotal = basket.reduce(
    (sum, item) => sum + item.product.officialPrice * 1.18 * item.quantity,
    0
  );

  // Savings between neighborhood and central market
  const potentialSavings = Math.max(0, neighborhoodTotal - centralMarketTotal);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm my-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-2xs">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 font-ping-bold">
              حسّابة "قفّة اليوم" 🧺
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              احسب المشتريات وقارن مجموع القفّة بين التسعيرة، سوق الجملة، وخضار الحومة
            </p>
          </div>
        </div>

        {/* Potential Savings Highlight */}
        {potentialSavings > 0 && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-md shadow-emerald-200/80 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse shrink-0" />
            <div>
              <span className="text-[10px] text-emerald-100 block font-bold leading-tight">
                وفر في قضيتك اليوم
              </span>
              <span className="text-sm font-black font-ping-bold">
                توفّر {potentialSavings.toFixed(3)} DT كي تشري من سوق الجملة!
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Main Column: Basket items list & Add product control */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-700">محتويات القفّة:</h4>
            <span className="text-xs text-slate-500 font-semibold">
              ({basket.length} مواد مختارة)
            </span>
          </div>

          {/* Item Add Control */}
          <div className="flex items-center gap-2 bg-slate-50/90 p-2.5 rounded-2xl border border-slate-200/80">
            <select
              value={selectedAddProductId}
              onChange={(e) => setSelectedAddProductId(e.target.value)}
              className="flex-1 text-xs p-2.5 bg-white border border-slate-300/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.emoji} {p.arName} (التسعيرة: {p.officialPrice.toFixed(3)} DT/{p.unit})
                </option>
              ))}
            </select>
            <button
              onClick={handleAddItem}
              className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>زيد للقفة</span>
            </button>
          </div>

          {/* Basket Items List */}
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {basket.length === 0 ? (
              <div className="py-10 text-center text-slate-400 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold">القفّة فارغة! زيد فيها خضرة ولا غلّة من الفوق</p>
              </div>
            ) : (
              basket.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3 bg-slate-50/80 hover:bg-slate-100/90 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-1.5 bg-white rounded-xl shadow-xs">
                      {item.product.emoji}
                    </span>
                    <div>
                      <h5 className="text-sm font-bold text-slate-800">
                        {item.product.arName}
                      </h5>
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        رسمي: {item.product.officialPrice.toFixed(3)} DT/{item.product.unit}
                      </span>
                    </div>
                  </div>

                  {/* Quantity adjustment & Total for item */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-white border border-slate-300/80 rounded-xl p-1 shadow-2xs">
                      <button
                        onClick={() => handleUpdateQuantity(item.product.id, -0.5)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-slate-800 w-12 text-center">
                        {item.quantity} {item.product.unit}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product.id, 0.5)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[75px]">
                      <span className="text-xs font-black text-slate-900 block">
                        {(item.product.officialPrice * item.quantity).toFixed(3)} DT
                      </span>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                      title="فسخ من القفة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: 3 Modern Bento Stats Cards (Pastel Backgrounds: bg-emerald-50, bg-amber-50, bg-purple-50) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3 bg-slate-50/60 p-4 rounded-3xl border border-slate-200/80">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-0.5">
            مقارنة مجموع القفّة الكاملة:
          </h4>

          {/* Bento Card 1: Official Price Total (Pastel Emerald) */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-800 block">
                  1. حسب التسعيرة الرسمية
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">(السعر المحدّد قانونياً)</span>
              </div>
            </div>
            <div className="text-left">
              <span className="text-2xl font-black font-ping-bold text-emerald-900">
                {officialTotal.toFixed(3)} <span className="text-xs font-extrabold text-emerald-700">DT</span>
              </span>
            </div>
          </div>

          {/* Bento Card 2: Central Market Total (Pastel Amber) */}
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-950 rounded-2xl shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-900 block">
                  2. في سوق الجملة / المارشي
                </span>
                <span className="text-[11px] text-amber-800 font-semibold">(الأقرب للتسعيرة)</span>
              </div>
            </div>
            <div className="text-left">
              <span className="text-2xl font-black font-ping-bold text-amber-950">
                {centralMarketTotal.toFixed(3)} <span className="text-xs font-extrabold text-amber-800">DT</span>
              </span>
            </div>
          </div>

          {/* Bento Card 3: Neighborhood Sellers Total (Pastel Purple) */}
          <div className="p-4 bg-purple-50 border border-purple-200 text-purple-950 rounded-2xl shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-900 block">
                  3. عند خضار الحومة
                </span>
                <span className="text-[11px] text-purple-700 font-semibold">(يشمل هامش الربح والقرُب)</span>
              </div>
            </div>
            <div className="text-left">
              <span className="text-2xl font-black font-ping-bold text-purple-950">
                {neighborhoodTotal.toFixed(3)} <span className="text-xs font-extrabold text-purple-800">DT</span>
              </span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 font-bold text-center border-t border-slate-200/80">
            💡 ملاحظة: أسعار الأسواق تتحدث بصفة مستمرة بمصادقة المواطنين في منطقتك.
          </div>
        </div>
      </div>
    </div>
  );
};
