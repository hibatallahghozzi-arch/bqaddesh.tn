import React from 'react';
import { MarketSubmission, Product } from '../types';
import { Activity, ThumbsUp, MapPin, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface CommunityFeedProps {
  submissions: MarketSubmission[];
  products: Product[];
  onUpvoteSubmission: (submissionId: string) => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  submissions,
  products,
  onUpvoteSubmission,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm my-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-800 font-ping-bold">
            تصريحات مواطني منطقتك (لايف)
          </h3>
        </div>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          ● يتحدّث حينيّاً
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
        {submissions.slice(0, 8).map((sub) => {
          const product = products.find((p) => p.id === sub.productId) || products[0];
          const diff = sub.price - product.officialPrice;
          const isOfficial = Math.abs(diff) <= 0.05;

          return (
            <div
              key={sub.id}
              className="p-3.5 bg-slate-50 hover:bg-slate-100/90 rounded-2xl border border-slate-200/80 transition-all flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl p-2 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  {product.emoji}
                </span>

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-sm text-slate-900">
                      {product.arName}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      بـ <span className="font-black text-slate-900 text-sm">{sub.price.toFixed(3)} DT</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{sub.marketName}</span>
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {sub.timestamp}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">
                      {sub.sellerType === 'central_market'
                        ? 'سوق بلدي'
                        : sub.sellerType === 'supermarket'
                        ? 'سوبرماركت'
                        : 'خضار حومة'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and Upvote */}
              <div className="flex flex-col items-end justify-between h-full gap-2 shrink-0">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isOfficial
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : diff > 0.3
                      ? 'bg-orange-100 text-orange-800 border border-orange-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {isOfficial ? 'رسمي 🟢' : diff > 0.3 ? 'غالي 🟠' : 'معقول 🟡'}
                </span>

                <button
                  onClick={() => onUpvoteSubmission(sub.id)}
                  className="bg-white hover:bg-emerald-50 active:bg-emerald-100 text-slate-700 hover:text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-xl border border-slate-300 hover:border-emerald-300 flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                  title="صحيح هاد السوم"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{sub.votesCount || 1}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
