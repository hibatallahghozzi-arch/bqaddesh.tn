import React, { useState } from 'react';
import { WILAYAS_DATA } from '../data/mockData';
import { LocationState } from '../types';
import { MapPin, X, Check, Search } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationState;
  onSelectLocation: (newLoc: LocationState) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const [selectedWilayaId, setSelectedWilayaId] = useState<string>(
    currentLocation.wilayaId || WILAYAS_DATA[0].id
  );
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const currentWilayaObj = WILAYAS_DATA.find((w) => w.id === selectedWilayaId) || WILAYAS_DATA[0];

  const filteredDistricts = currentWilayaObj.districts.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currentWilayaObj.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectDistrict = (district: typeof currentWilayaObj.districts[0]) => {
    onSelectLocation({
      wilayaId: currentWilayaObj.id,
      wilayaName: currentWilayaObj.name,
      districtId: district.id,
      districtName: district.name,
      lat: district.lat,
      lng: district.lng,
      isAutoDetected: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-200" />
            <h3 className="text-lg font-bold">اختيار البلاصة والمنطقة</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-emerald-600 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              placeholder="فركّس على ولاية ولا منطقة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Wilaya Cascading Dropdown / Tabs */}
        <div className="p-3 border-b border-slate-100 flex gap-2 overflow-x-auto no-scrollbar bg-slate-50">
          {WILAYAS_DATA.map((w) => {
            const isSelected = w.id === selectedWilayaId;
            return (
              <button
                key={w.id}
                onClick={() => {
                  setSelectedWilayaId(w.id);
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {w.name}
              </button>
            );
          })}
        </div>

        {/* District list */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          <p className="text-xs font-semibold text-slate-500 mb-2">
            المعتمديات والمناطق المتوفرة في {currentWilayaObj.name}:
          </p>
          {filteredDistricts.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              مالقيناش منطقة بهاد الاسم
            </div>
          ) : (
            filteredDistricts.map((d) => {
              const isCurrent = d.id === currentLocation.districtId;
              return (
                <button
                  key={d.id}
                  onClick={() => handleSelectDistrict(d)}
                  className={`w-full p-3 rounded-xl border text-right flex items-center justify-between transition-all ${
                    isCurrent
                      ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-bold shadow-xs'
                      : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${isCurrent ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-sm">{d.name}</span>
                  </div>
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                      <Check className="w-3.5 h-3.5" /> هنا توّه
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            اختيار المنطقة يخليك تشوف الأسعار الحقيقية القريبة ليك 🇹🇳
          </p>
        </div>
      </div>
    </div>
  );
};
