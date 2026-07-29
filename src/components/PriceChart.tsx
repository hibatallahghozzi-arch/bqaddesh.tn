import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Product, LocationState, PriceHistoryPoint } from '../types';
import { MOCK_PRICE_HISTORY } from '../data/mockData';
import { LineChart as ChartIcon, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';

interface PriceChartProps {
  product: Product;
  location: LocationState;
}

export const PriceChart: React.FC<PriceChartProps> = ({ product, location }) => {
  const historyData: PriceHistoryPoint[] =
    MOCK_PRICE_HISTORY[product.id] || MOCK_PRICE_HISTORY['tomate'];

  // Calculate statistics
  const submittedPrices = historyData.map((d) => d.submittedAvg);
  const highestPrice = Math.max(...submittedPrices);
  const lowestPrice = Math.min(...submittedPrices);
  const currentPrice = historyData[historyData.length - 1].submittedAvg;
  const officialPrice = product.officialPrice;

  const inflationRate = (((currentPrice - officialPrice) / officialPrice) * 100).toFixed(1);

  // Custom Tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs font-cairo">
          <p className="font-bold text-amber-300 mb-1">{label}</p>
          <p className="text-emerald-300">
            السوم المصرّح بيه: <span className="font-bold">{payload[0].value.toFixed(3)} DT</span>
          </p>
          <p className="text-slate-300">
            التسعيرة الرسمية: <span className="font-bold">{officialPrice.toFixed(3)} DT</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <ChartIcon className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-800 font-ping-bold">
              تطور السوم في الـ 7 أيّام الإخرانين
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            مقارنة معدّل السوم المصرّح بيه في {location.districtName} مع خط التسعيرة الرسمية
          </p>
        </div>

        {/* Inflation Callout Badge */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl text-xs font-bold">
          {Number(inflationRate) > 0 ? (
            <div className="flex items-center gap-1 text-orange-700">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span>فايد التسعيرة بـ +{inflationRate}%</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-emerald-700">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              <span>مطابق للتسعيرة (0%)</span>
            </div>
          )}
        </div>
      </div>

      {/* Recharts LineChart */}
      <div className="w-full h-[260px] my-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'Cairo' }}
              stroke="#cbd5e1"
            />
            <YAxis
              domain={[
                (dataMin: number) => Math.max(0, Math.floor(dataMin * 0.8 * 10) / 10),
                (dataMax: number) => Math.ceil(dataMax * 1.2 * 10) / 10,
              ]}
              tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'Cairo' }}
              stroke="#cbd5e1"
              tickFormatter={(v) => `${v.toFixed(2)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', fontFamily: 'Cairo', paddingTop: '8px' }}
              formatter={(value) => (value === 'submittedAvg' ? 'السوم المصرّح بيه' : 'التسعيرة الرسمية')}
            />

            {/* Official Price Static Line */}
            <Line
              type="monotone"
              dataKey="officialPrice"
              name="officialPrice"
              stroke="#16a34a"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />

            {/* Submitted Avg Evolution Line */}
            <Line
              type="monotone"
              dataKey="submittedAvg"
              name="submittedAvg"
              stroke="#f59e0b"
              strokeWidth={3}
              activeDot={{ r: 7, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
              dot={{ r: 4, fill: '#f59e0b' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* High/Low Summary Callouts */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center text-xs">
        <div className="bg-emerald-50/60 p-2 rounded-xl border border-emerald-100">
          <span className="text-slate-500 block text-[10px] font-semibold">التسعيرة</span>
          <span className="font-black text-emerald-800 text-sm">{officialPrice.toFixed(3)} DT</span>
        </div>
        <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-100">
          <span className="text-slate-500 block text-[10px] font-semibold">أغلى يوم (السبت)</span>
          <span className="font-black text-amber-800 text-sm">{highestPrice.toFixed(3)} DT</span>
        </div>
        <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="text-slate-500 block text-[10px] font-semibold">أرخص يوم (الثلاثاء)</span>
          <span className="font-black text-slate-800 text-sm">{lowestPrice.toFixed(3)} DT</span>
        </div>
      </div>
    </div>
  );
};
