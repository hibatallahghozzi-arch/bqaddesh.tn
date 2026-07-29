import React, { useState } from 'react';
import { Product } from '../types';
import { PlusCircle, X, Sparkles, Tag, DollarSign, Package } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (newProduct: Product) => void;
}

const DEFAULT_EMOJIS = ['🥒', '🥕', '🍆', '🌴', '🍉', '🍊', '🥬', '🌽', '🍇', '🍑', '🍐', '🧄', '🧅', '🫑', '🐟', '🥩'];

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [arName, setArName] = useState('');
  const [frName, setFrName] = useState('');
  const [emoji, setEmoji] = useState('🥒');
  const [price, setPrice] = useState('2.000');
  const [unit, setUnit] = useState('كغ');
  const [category, setCategory] = useState<'vegetables' | 'fruits' | 'staples'>('vegetables');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!arName.trim()) {
      setErrorMsg('الرجاء إدخال اسم المادة بالعربية');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setErrorMsg('الرجاء إدخال تسعيرة صحيحة بالدينار (مثال: 2.500)');
      return;
    }

    const newProduct: Product = {
      id: 'prod-' + Date.now(),
      name: frName.trim() || arName.trim(),
      arName: arName.trim(),
      emoji: emoji || '🥬',
      officialPrice: numPrice,
      unit: unit || 'كغ',
      category: category,
    };

    onAddProduct(newProduct);
    onClose();

    // Reset form
    setArName('');
    setFrName('');
    setPrice('2.000');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in font-ping-bold">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <PlusCircle className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-lg font-black leading-tight">إضافة مادة جديدة (+ Ajouter Article)</h3>
              <p className="text-xs text-emerald-100">إضافة خضرة، غلّة ولا مادة غذائية لمتابعة سومها</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs font-bold">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Arabic Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              اسم المادة بالعربية <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              <input
                type="text"
                required
                placeholder="مثال: خيار، سفنارية، دقلة، شفرات..."
                value={arName}
                onChange={(e) => setArName(e.target.value)}
                className="w-full pr-9 pl-3 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* French Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              الاسم بالفرنسية (Nom en français)
            </label>
            <input
              type="text"
              placeholder="Ex: Concombre, Carotte..."
              value={frName}
              onChange={(e) => setFrName(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-left dir-ltr"
            />
          </div>

          {/* Emoji Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              اختار الأيقونة (Emoji)
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {DEFAULT_EMOJIS.map((em) => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setEmoji(em)}
                  className={`text-2xl p-2 rounded-xl transition-all cursor-pointer border ${
                    emoji === em
                      ? 'bg-emerald-100 border-emerald-500 scale-110 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Unit Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                التسعيرة الرسمية (SOTUMAG PMP) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="number"
                  step="0.050"
                  min="0.100"
                  required
                  placeholder="2.000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pr-9 pl-3 py-2.5 text-xs font-black bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
              <span className="text-[10px] text-slate-400 font-bold block mt-1">بالدينار التونسي (DT)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الوحدة (Unité)
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white cursor-pointer"
              >
                <option value="كغ">كغ (Kg)</option>
                <option value="حزمة">حزمة (Botte)</option>
                <option value="قطعة">قطعة (Pièce)</option>
                <option value="لتر">لتر (Litre)</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              الصنف (Catégorie)
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setCategory('vegetables')}
                className={`py-2 px-2 rounded-xl border transition-all cursor-pointer ${
                  category === 'vegetables'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🥬 خضراوات
              </button>

              <button
                type="button"
                onClick={() => setCategory('fruits')}
                className={`py-2 px-2 rounded-xl border transition-all cursor-pointer ${
                  category === 'fruits'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🍎 غلال
              </button>

              <button
                type="button"
                onClick={() => setCategory('staples')}
                className={`py-2 px-2 rounded-xl border transition-all cursor-pointer ${
                  category === 'staples'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🐟 أسماك ومواد
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>تأكيد وإضافة المادة</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
