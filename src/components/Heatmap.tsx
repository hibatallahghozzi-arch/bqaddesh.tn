import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Product, LocationState, MarketSubmission } from '../types';
import { MapPin, Navigation, Info, ExternalLink, Layers, Globe, Filter } from 'lucide-react';

interface HeatmapProps {
  product: Product;
  location: LocationState;
  submissions: MarketSubmission[];
  onOpenAddMarketModal?: () => void;
}

// Custom Teardrop Pin Generator (matching the pin shapes & dark outlines in the screenshot)
const createTeardropPinIcon = (color: string, isSelected: boolean = false) => {
  const width = isSelected ? 34 : 28;
  const height = isSelected ? 46 : 38;
  
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 3px 6px rgba(0,0,0,0.3)); cursor: pointer; transition: transform 0.15s ease;">
      <path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="${color}" stroke="#0f172a" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="16" cy="14" r="6" fill="#0f172a"/>
      <circle cx="16" cy="14" r="3" fill="#ffffff"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-pin-icon',
    html: svg,
    iconSize: [width, height],
    iconAnchor: [width / 2, height],
    popupAnchor: [0, -height + 4],
    tooltipAnchor: [width / 2, -height / 2],
  });
};

// User current location blue pin icon
const createUserPinIcon = () => {
  const svg = `
    <svg width="34" height="44" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 8px rgba(37,99,235,0.45));">
      <path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="#2563eb" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="16" cy="14" r="6.5" fill="#ffffff"/>
      <circle cx="16" cy="14" r="3.5" fill="#1d4ed8"/>
    </svg>
  `;
  return L.divIcon({
    className: 'user-pin-icon',
    html: svg,
    iconSize: [34, 44],
    iconAnchor: [17, 44],
    popupAnchor: [0, -40],
  });
};

// Tile options
const TILE_LAYERS = {
  carto_voyager: {
    name: 'Carto Voyager (واضحة مبيّنة)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
  },
  carto_light: {
    name: 'Carto Light (خفيفة)',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  osm: {
    name: 'OpenStreetMap (كلاسيك)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
};

// Recenter Component
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

export const Heatmap: React.FC<HeatmapProps> = ({
  product,
  location,
  submissions,
  onOpenAddMarketModal,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [mapScope, setMapScope] = useState<'district' | 'tunisia'>('district');
  const [selectedTileKey, setSelectedTileKey] = useState<keyof typeof TILE_LAYERS>('carto_voyager');
  const [selectedColorFilter, setSelectedColorFilter] = useState<'all' | 'green' | 'yellow' | 'orange' | 'red'>('all');
  const [activePinId, setActivePinId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter submissions for current product
  const productSubmissions = useMemo(() => {
    return submissions.filter((s) => s.productId === product.id);
  }, [submissions, product.id]);

  // Color & Status categorization helper
  const getMarkerTier = (price: number, official: number) => {
    const diff = price - official;
    if (diff <= 0) {
      return {
        color: '#22c55e', // Vibrant Green 🟢
        tierKey: 'green' as const,
        statusText: 'رخيص جداً (تحت التسعيرة) 🟢',
        badgeBg: 'bg-emerald-500 text-white',
      };
    } else if (diff <= 0.150) {
      return {
        color: '#84cc16', // Lime Green 🟢
        tierKey: 'green' as const,
        statusText: 'في التسعيرة الرسمية 🟢',
        badgeBg: 'bg-lime-600 text-white',
      };
    } else if (diff <= 0.350) {
      return {
        color: '#facc15', // Sun Yellow 🟡
        tierKey: 'yellow' as const,
        statusText: 'سعر معقول / متوسط 🟡',
        badgeBg: 'bg-amber-400 text-slate-900',
      };
    } else if (diff <= 0.600) {
      return {
        color: '#f97316', // Bright Orange 🟠
        tierKey: 'orange' as const,
        statusText: 'سوم زايد / مرتفع 🟠',
        badgeBg: 'bg-orange-500 text-white',
      };
    } else {
      return {
        color: '#ef4444', // Red 🔴
        tierKey: 'red' as const,
        statusText: 'غالي جداً / شاطط 🔴',
        badgeBg: 'bg-red-600 text-white',
      };
    }
  };

  // Filtered pins based on color filter selection
  const filteredSubmissions = useMemo(() => {
    if (selectedColorFilter === 'all') return productSubmissions;
    return productSubmissions.filter((sub) => {
      const tier = getMarkerTier(sub.price, product.officialPrice);
      return tier.tierKey === selectedColorFilter;
    });
  }, [productSubmissions, selectedColorFilter, product.officialPrice]);

  // Counts for legend
  const tierCounts = useMemo(() => {
    let green = 0;
    let yellow = 0;
    let orange = 0;
    let red = 0;
    productSubmissions.forEach((sub) => {
      const tier = getMarkerTier(sub.price, product.officialPrice);
      if (tier.tierKey === 'green') green++;
      else if (tier.tierKey === 'yellow') yellow++;
      else if (tier.tierKey === 'orange') orange++;
      else if (tier.tierKey === 'red') red++;
    });
    return { green, yellow, orange, red, total: productSubmissions.length };
  }, [productSubmissions, product.officialPrice]);

  // Center position calculation
  const mapCenter: [number, number] = useMemo(() => {
    if (mapScope === 'tunisia') {
      return [35.5000, 10.0000]; // Center of Tunisia
    }
    return [location.lat, location.lng];
  }, [mapScope, location.lat, location.lng]);

  const mapZoom = mapScope === 'tunisia' ? 7 : 13;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-800 font-cairo">
              خارطة الأسعار المباشرة بالدبابيس (Heatmap)
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            توزيع نقاط بيع {product.emoji} <span className="font-bold text-slate-700">{product.arName}</span> بالألوان حسب السوم مقارنة بالتسعيرة الرسمية ({product.officialPrice.toFixed(3)} DT)
          </p>
        </div>

        {/* View Scope Toggle Buttons (District vs All Tunisia) */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/80 shrink-0">
          <button
            onClick={() => setMapScope('district')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mapScope === 'district'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{location.districtName}</span>
          </button>
          <button
            onClick={() => setMapScope('tunisia')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mapScope === 'tunisia'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>تونس كاملة 🇹🇳</span>
          </button>
        </div>
      </div>

      {/* Filter Chips & Legend bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap text-xs font-bold">
          <span className="text-slate-400 text-[11px] flex items-center gap-1">
            <Filter className="w-3 h-3" /> فلترة:
          </span>
          <button
            onClick={() => setSelectedColorFilter('all')}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer border ${
              selectedColorFilter === 'all'
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            الكل ({tierCounts.total})
          </button>

          <button
            onClick={() => setSelectedColorFilter('green')}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border ${
              selectedColorFilter === 'green'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] border border-slate-900 inline-block"></span>
            <span>رخيص/رسمي ({tierCounts.green})</span>
          </button>

          <button
            onClick={() => setSelectedColorFilter('yellow')}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border ${
              selectedColorFilter === 'yellow'
                ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-xs'
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#facc15] border border-slate-900 inline-block"></span>
            <span>معقول ({tierCounts.yellow})</span>
          </button>

          <button
            onClick={() => setSelectedColorFilter('orange')}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border ${
              selectedColorFilter === 'orange'
                ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                : 'bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] border border-slate-900 inline-block"></span>
            <span>غالي ({tierCounts.orange})</span>
          </button>

          <button
            onClick={() => setSelectedColorFilter('red')}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border ${
              selectedColorFilter === 'red'
                ? 'bg-red-600 text-white border-red-600 shadow-xs'
                : 'bg-red-50 text-red-900 border-red-200 hover:bg-red-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] border border-slate-900 inline-block"></span>
            <span>شاطط ({tierCounts.red})</span>
          </button>
        </div>

        {/* Map Tile Layer Selector */}
        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold bg-slate-50 px-2 py-1 rounded-xl border border-slate-200">
          <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedTileKey}
            onChange={(e) => setSelectedTileKey(e.target.value as any)}
            className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer"
          >
            {Object.entries(TILE_LAYERS).map(([key, val]) => (
              <option key={key} value={key}>
                {val.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
        {isMounted ? (
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <MapController center={mapCenter} zoom={mapZoom} />

            {/* Selected Tile Layer */}
            <TileLayer
              attribution={TILE_LAYERS[selectedTileKey].attribution}
              url={TILE_LAYERS[selectedTileKey].url}
            />

            {/* User Location Marker (if in district mode) */}
            {mapScope === 'district' && (
              <Marker
                position={[location.lat, location.lng]}
                icon={createUserPinIcon()}
              >
                <Tooltip permanent direction="top" offset={[0, -38]}>
                  <span className="font-bold text-xs text-blue-900">موقعك الآن 📍 ({location.districtName})</span>
                </Tooltip>
              </Marker>
            )}

            {/* Submissions Teardrop Pin Markers */}
            {filteredSubmissions.map((submission) => {
              const tier = getMarkerTier(submission.price, product.officialPrice);
              const isSelected = activePinId === submission.id;
              const pinIcon = createTeardropPinIcon(tier.color, isSelected);

              return (
                <Marker
                  key={submission.id}
                  position={[submission.lat, submission.lng]}
                  icon={pinIcon}
                  eventHandlers={{
                    click: () => setActivePinId(submission.id),
                  }}
                >
                  {/* Tooltip on hover */}
                  <Tooltip direction="top" offset={[0, -36]}>
                    <div className="font-bold text-xs text-right space-y-0.5">
                      <div className="text-slate-900 font-extrabold">{submission.marketName}</div>
                      <div className="text-emerald-700 font-black">
                        {submission.price.toFixed(3)} DT
                      </div>
                    </div>
                  </Tooltip>

                  {/* Detailed Popup */}
                  <Popup>
                    <div className="p-1 min-w-[210px] text-right font-ping-bold">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-2">
                        <span className="font-black text-sm text-slate-800">
                          {submission.marketName}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-black ${tier.badgeBg}`}>
                          {submission.price.toFixed(3)} DT
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600">
                        <p>
                          <span className="font-bold text-slate-500">حالة السوم:</span>{' '}
                          <span className="font-black text-slate-800">{tier.statusText}</span>
                        </p>
                        <p>
                          <span className="font-bold text-slate-500">نوع المحل:</span>{' '}
                          {submission.sellerType === 'central_market'
                            ? 'سوق بلدي / جملة 🏬'
                            : submission.sellerType === 'supermarket'
                            ? 'سوبرماركت 🛒'
                            : 'خضار الحومة / عطّار 🥬'}
                        </p>
                        <p>
                          <span className="font-bold text-slate-500">التصريح:</span>{' '}
                          {submission.timestamp} ({submission.votesCount} مصدّق)
                        </p>
                      </div>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${submission.lat},${submission.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors text-center shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>توجه للسوق على Google Maps</span>
                      </a>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        ) : (
          <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 font-bold text-sm">
            جاري تحضير الخارطة المباشرة...
          </div>
        )}

        {/* Floating Add Market Button over map */}
        {onOpenAddMarketModal && (
          <button
            onClick={onOpenAddMarketModal}
            className="absolute bottom-3 right-3 z-[1000] bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2.5 rounded-2xl shadow-lg border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>+ زيد سوق ولا خضار جديّد</span>
          </button>
        )}
      </div>

      {/* Footer Summary */}
      <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between flex-wrap gap-2">
        <span className="flex items-center gap-1.5 font-semibold">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          الدبابيس الملوّنة تتحدّد مباشرة من مصداقية تصريحات المواطنين والأسواق المجاورة
        </span>
        <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
          {filteredSubmissions.length} دبوس موثّق على الخارطة
        </span>
      </div>
    </div>
  );
};

