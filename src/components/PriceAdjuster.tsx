import React, { useState, useEffect } from 'react';
import { Product, LocationState, MarketSubmission } from '../types';
import {
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Send,
  Plus,
  Minus,
  Lock,
  Sparkles,
} from 'lucide-react';

interface PriceAdjusterProps {
  product: Product;
  location: LocationState;
  submissions: MarketSubmission[];
  onSubmitPrice: (newSubmission: MarketSubmission) => void;
}

export const PriceAdjuster: React.FC<PriceAdjusterProps> = ({
  product,
  location,
  submissions,
  onSubmitPrice,
}) => {
  const todayDateStr = new Date().toISOString().split('T')[0];
  const storageKey = `voted_${product.id}_${todayDateStr}_${location.districtId}`;

  // Calculate current average price submitted today for this product in this location (in millimes)
  const productSubmissions = submissions.filter((s) => s.productId === product.id);
  const totalSubmissionsCount = productSubmissions.length;
  const currentAvgPrice =
    totalSubmissionsCount > 0
      ? productSubmissions.reduce((acc, curr) => acc + curr.price, 0) / totalSubmissionsCount
      : product.officialPrice;

  // Local state for interactive voting adjustment (stored in Millimes, e.g., 2200)
  const [submittedPrice, setSubmittedPrice] = useState<number>(Math.round(currentAvgPrice));
  const [marketName, setMarketName] = useState<string>('');
  const [sellerType, setSellerType] = useState<'central_market' | 'neighborhood' | 'supermarket'>('neighborhood');
  const [hasVotedToday, setHasVotedToday] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  // Sync state when product or location changes
  useEffect(() => {
    const isVoted = localStorage.getItem(storageKey) === 'true';
    setHasVotedToday(isVoted);
    setSubmittedPrice(Math.round(currentAvgPrice));
  }, [product.id, location.districtId, currentAvgPrice, storageKey]);

  // Adjust price by +/- 100 millimes (0.100 DT)
  const handleAdjustPrice = (deltaMillimes: number) => {
    if (hasVotedToday) return;
    setSubmittedPrice((prev) => Math.max(100, prev + deltaMillimes));
  };

  const handleConfirmVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasVotedToday) return;

    // Trigger device vibration if available
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([100, 50, 100]);
      } catch {
        // Ignore if blocked
      }
    }

    const defaultMarketName = marketName.trim() || `خضار في ${location.districtName}`;

    const newSub: MarketSubmission = {
      id: `sub-${Date.now()}`,
      productId: product.id,
      marketName: defaultMarketName,
      sellerType,
      price: Math.round(submittedPrice), // Send clean integer millimes
      lat: location.lat + (Math.random() - 0.5) * 0.005,
      lng: location.lng + (Math.random() - 0.5) * 0.005,
      timestamp: 'توّه كيف تفرز',
      districtId: location.districtId,
      votesCount: 1,
    };

    // Save vote in localStorage
    localStorage.setItem(storageKey, 'true');
    setHasVotedToday(true);
    setShowSuccessToast(true);

    onSubmitPrice(newSub);

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 5000);
  };

  // Price difference vs official price (in millimes)
  const priceDiff = submittedPrice - product.officialPrice;
  const isOverPriced = priceDiff > 300; // > 300 millimes over official price

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm transition-all space-y-5 font-ping-bold">
      {/* Header Badge & Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="text-4xl p-3 bg-slate-50/80 rounded-2xl border border-slate-100 shadow-2xs">
            {product.emoji}
          </span>
          <div>
            <h3 className="text-xl font-black text-slate-900 font-ping-bold">
              {product.name || product.arName} <span className="text-xs font-bold text-slate-400">({product.unit || 'كغ'})</span>
            </h3>
            <p className="text-xs text-slate-500 font-bold mt-0.5">
              في {location.districtName}
            </p>
          </div>
        </div>

        {/* Official Price Badge */}
        <div className="bg-emerald-50/80 border border-emerald-200/80 px-4 py-2 rounded-2xl text-right shadow-2xs">
          <span className="text-[10px] font-bold text-emerald-700 block leading-none mb-1">
            التسعيرة الرسمية
          </span>
          <span className="text-lg font-black text-emerald-900 tracking-tight font-ping-bold">
            {(product.officialPrice / 1000).toFixed(3)} DT
          </span>
        </div>
      </div>

      {/* Submitted District Average Comparison */}
      <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <TrendingUp className="w-5 h-5 text-orange-500 shrink-0" />
          <div>
            <span className="text-xs text-slate-500 font-bold block">
              معدّل السوم المصرح بيه اليوم ({totalSubmissionsCount} تصريح)
            </span>
            <span className="text-sm font-black text-slate-900">
              {(currentAvgPrice / 1000).toFixed(3)} DT / {product.unit || 'كغ'}
            </span>
          </div>
        </div>

        {/* Diff badge */}
        <div
          className={`text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0 ${
            currentAvgPrice > product.officialPrice
              ? 'bg-orange-100/80 text-orange-900 border border-orange-200'
              : 'bg-emerald-100/80 text-emerald-900 border border-emerald-200'
          }`}
        >
          {currentAvgPrice > product.officialPrice ? (
            <span>+{((currentAvgPrice - product.officialPrice) / 1000).toFixed(3)} DT غالي</span>
          ) : (
            <span>مطابق للتسعيرة</span>
          )}
        </div>
      </div>

      {/* Main Interactive Price Voting Controls */}
      <form onSubmit={handleConfirmVote} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            قداش لقيت سوم الـ {product.name || product.arName} اليوم في الحومة؟
          </label>

          <div className="bg-slate-50/90 rounded-2xl p-5 border border-slate-200/80 flex flex-col items-center">
            <span className="text-xs font-bold text-slate-400 mb-2">السوم اللي باش تصرح بيه</span>
            <div className="flex items-center justify-center gap-6 my-2">
              <button
                type="button"
                onClick={() => handleAdjustPrice(-100)} // 👈 تنقيص 100 مليم
                disabled={hasVotedToday}
                className="w-14 h-14 bg-white border border-slate-200 rounded-2xl text-slate-800 text-2xl font-black flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-sm hover:shadow-md"
                title="تنقيص 100 فرنك"
              >
                <Minus className="w-6 h-6 stroke-[3]" />
              </button>

              <div className="text-center min-w-[130px]">
                <span className="text-4xl font-black text-slate-900 tracking-tight font-ping-bold">
                  {(submittedPrice / 1000).toFixed(3)} {/* 👈 قسمنا على 1000 */}
                </span>
                <span className="text-sm font-black text-slate-500 mr-1.5">DT</span>
                <span className="text-[11px] text-slate-500 block mt-1 font-bold">
                  (= {Math.round(submittedPrice)} فرنك / ميليم)
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleAdjustPrice(100)} // 👈 زيادة 100 مليم
                disabled={hasVotedToday}
                className="w-14 h-14 bg-white border border-slate-200 rounded-2xl text-slate-800 text-2xl font-black flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-sm hover:shadow-md"
                title="زيادة 100 فرنك"
              >
                <Plus className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>

        {/* Optional Market Details */}
        {!hasVotedToday && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                اسم السوق ولا الخضار (اختياري)
              </label>
              <input
                type="text"
                placeholder="مثلا: خضار حومة حي الغزالة"
                value={marketName}
                onChange={(e) => setMarketName(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                نوع المحل
              </label>
              <select
                value={sellerType}
                onChange={(e) => setSellerType(e.target.value as any)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="neighborhood">خضار الحومة / عطّار</option>
                <option value="central_market">سوق بلدي / سوق الجملة</option>
                <option value="supermarket">سوبرماركت كبير</option>
              </select>
            </div>
          </div>
        )}

        {/* Price status warning notice */}
        {isOverPriced && (
          <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-xl text-orange-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" />
            <span>تنبيه: هاد السوم أغلى بـ {Math.round(priceDiff)} فرنك من التسعيرة الرسمية!</span>
          </div>
        )}

        {/* Confirmation Button or Locked State Message */}
        {hasVotedToday ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-sm font-bold flex items-center justify-center gap-2 shadow-2xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>✓ سجلت السوم اليوم في بلاستك! يعطيك الصحة 🇹🇳</span>
            <Lock className="w-4 h-4 text-emerald-500 mr-auto" />
          </div>
        ) : (
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-5 h-5" />
            <span>تأكيد السوم اليوم</span>
          </button>
        )}
      </form>

      {/* Success Toast banner */}
      {showSuccessToast && (
        <div className="mt-3 p-3 bg-slate-900 text-white rounded-2xl text-xs flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>تم تسجيل صوتك بنجاح! تحيّنت الخارطة التفاعلية للأسعار.</span>
        </div>
      )}
    </div>
  );
};