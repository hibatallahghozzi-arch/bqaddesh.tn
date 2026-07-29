import React from 'react';
import { Product } from '../types';
import { Tag, PlusCircle } from 'lucide-react';

interface ProductSelectorProps {
  products: Product[];
  selectedProductId: string;
  onSelectProduct: (productId: string) => void;
  onOpenAddProductModal: () => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProductId,
  onSelectProduct,
  onOpenAddProductModal,
}) => {
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 py-3 shadow-2xs sticky top-[65px] z-30 font-ping-bold">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-emerald-600" />
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              اختار الخضرة ولا الغلة باش تشوف سومها والأسواق القريبة:
            </h2>
          </div>

          <button
            onClick={onOpenAddProductModal}
            className="flex items-center gap-1.5 text-xs bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200/80 px-3 py-1 rounded-full font-black transition-all cursor-pointer shrink-0 shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>أضف مادة (+ Ajouter Article)</span>
          </button>
        </div>

        {/* Horizontal Scrollable Pills */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
          {/* Add Article Quick Pill */}
          <button
            onClick={onOpenAddProductModal}
            className="group relative flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-100/60 transition-all shrink-0 cursor-pointer text-emerald-900"
            title="أضف مادة جديدة للقائمة"
          >
            <PlusCircle className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
            <div className="text-right">
              <span className="block text-xs font-black leading-tight text-emerald-900">
                + أضف مادة
              </span>
              <span className="text-[10px] font-bold leading-none text-emerald-700 block mt-0.5">
                Ajouter Article
              </span>
            </div>
          </button>

          {products.map((product) => {
            const isSelected = product.id === selectedProductId;
            return (
              <button
                key={product.id}
                onClick={() => onSelectProduct(product.id)}
                className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all duration-200 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white rounded-2xl shadow-md shadow-emerald-200/80 scale-105 border border-emerald-500'
                    : 'bg-white text-slate-700 border border-slate-200/80 rounded-2xl shadow-sm hover:border-emerald-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform shrink-0">
                  {product.emoji}
                </span>
                <div className="text-right">
                  <span
                    className={`block text-xs font-bold leading-tight ${
                      isSelected ? 'text-white font-black' : 'text-slate-800'
                    }`}
                  >
                    {product.name || product.arName}
                  </span>
                  <span
                    className={`text-[10px] font-bold leading-none block mt-0.5 ${
                      isSelected ? 'text-emerald-100 font-extrabold' : 'text-emerald-600'
                    }`}
                  >
                    {/* 🎯 قسمنا على 1000 باش تطلع 1.800 DT ولا 2.200 DT */}
                    {(product.officialPrice / 1000).toFixed(3)} DT
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};