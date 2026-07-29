import React, { useState } from 'react';
import { LocationState } from '../types';
import { WILAYAS_DATA } from '../data/mockData';
import { MapPin, Navigation, Edit3, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface HeaderProps {
  currentLocation: LocationState;
  onUpdateLocation: (newLoc: LocationState) => void;
  onOpenLocationModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onUpdateLocation,
  onOpenLocationModal,
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const handleAutoGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('الـ GPS مش مدعوم في متصفحك');
      return;
    }

    setIsDetecting(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Attempt Nominatim reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ar,fr`
          );
          const data = await response.json();
          const address = data.address || {};
          const detectedCity =
            address.suburb ||
            address.town ||
            address.city_district ||
            address.city ||
            address.state ||
            'حي الغزالة';

          // Match closest mock district or set detected
          onUpdateLocation({
            wilayaId: currentLocation.wilayaId,
            wilayaName: currentLocation.wilayaName,
            districtId: currentLocation.districtId,
            districtName: `📍 ${detectedCity}`,
            lat: latitude,
            lng: longitude,
            isAutoDetected: true,
          });
        } catch {
          // Fallback to coordinates
          onUpdateLocation({
            ...currentLocation,
            lat: latitude,
            lng: longitude,
            isAutoDetected: true,
          });
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setIsDetecting(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError('لازم تسمح بتحديد الموقع باش يتفعل الـ GPS');
        } else {
          setGpsError('تعذر تحديد موقعك بالـ GPS، جرب بدّل يدويّاً');
        }
        setTimeout(() => setGpsError(null), 4000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo & Platform Name */}
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl shrink-0">🇹🇳</span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-black text-emerald-600 tracking-tight font-ping-bold leading-tight flex items-baseline gap-1.5">
                    <span>بقدّاش؟</span>
                    <span className="text-slate-400 font-normal text-base md:text-lg">Bqaddech.tn</span>
                  </h1>
                  <span className="hidden md:inline-flex items-center gap-1 text-[11px] bg-emerald-100/90 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> لايف في تونس
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-bold hidden md:block">
                  المنصة التونسية التشاركية لمراقبة أسعار الخضار والأسواق
                </p>
              </div>
            </div>

            {/* Mobile Location Badge summary */}
            <div className="sm:hidden flex items-center gap-1.5">
              <button
                onClick={onOpenLocationModal}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs px-3.5 py-2 rounded-full flex items-center gap-1 border border-emerald-200 font-bold shadow-xs cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span className="max-w-[110px] truncate">{currentLocation.districtName}</span>
              </button>
            </div>
          </div>

          {/* Location Controls on Desktop & Tablet */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Location Pill */}
            <div className="hidden sm:flex items-center gap-2.5 bg-emerald-50/80 border border-emerald-200/80 px-4 py-2 rounded-full shadow-xs">
              <MapPin className="w-4 h-4 text-emerald-600 animate-bounce shrink-0" />
              <div className="text-right">
                <span className="text-[10px] text-emerald-600 block font-bold leading-tight">
                  {currentLocation.isAutoDetected ? 'تحديد تلقائي بالـ GPS' : 'المنطقة الحالية'}
                </span>
                <span className="text-xs md:text-sm font-black text-emerald-950">
                  {currentLocation.districtName} ({currentLocation.wilayaName.split(' ')[0]})
                </span>
              </div>
            </div>

            {/* Auto GPS Detector Button */}
            <button
              onClick={handleAutoGPS}
              disabled={isDetecting}
              className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-all shadow-xs hover:shadow-md border border-emerald-500 disabled:opacity-60 cursor-pointer"
              title="حدد موقعي بالـ GPS"
            >
              {isDetecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-100" />
                  <span>جاري التحديد...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 text-emerald-100" />
                  <span>GPS تلقائي</span>
                </>
              )}
            </button>

            {/* Manual Location Switcher Modal Button */}
            <button
              onClick={onOpenLocationModal}
              className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>✏️ تبديل البلاصة</span>
            </button>
          </div>
        </div>

        {/* GPS Error Alert Banner */}
        {gpsError && (
          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}
      </div>
    </header>
  );
};
