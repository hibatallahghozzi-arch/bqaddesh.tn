import React, { useState, useEffect } from 'react';
import { LocationState, MarketSubmission, Product } from './types';
import { INITIAL_PRODUCTS, WILAYAS_DATA, INITIAL_SUBMISSIONS } from './data/mockData';
import { Header } from './components/Header';
import { LocationModal } from './components/LocationModal';
import { ProductSelector } from './components/ProductSelector';
import { PriceAdjuster } from './components/PriceAdjuster';
import { Heatmap } from './components/Heatmap';
import { PriceChart } from './components/PriceChart';
import { KoffetElYoum } from './components/KoffetElYoum';
import { CommunityFeed } from './components/CommunityFeed';
import { AddMarketModal } from './components/AddMarketModal';
import { AddProductModal } from './components/AddProductModal';
import { Award, Heart, Share2 } from 'lucide-react';
import { supabase } from './lib/supabase';

// 🛡️ مادة افتراضية لحماية الشاشة
const DEFAULT_FALLBACK_PRODUCT: Product = {
  id: 'tomate',
  name: 'طماطم',
  category: 'vegetables',
  officialPrice: 1.8,
  emoji: '🍅',
};

export default function App() {
  // Products & Submissions state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string>('tomate');
  const [submissions, setSubmissions] = useState<MarketSubmission[]>(INITIAL_SUBMISSIONS);

  // Location state (Defaulting to Cité Ghazela, Ariana)
  const [currentLocation, setCurrentLocation] = useState<LocationState>({
    wilayaId: 'ariana',
    wilayaName: WILAYAS_DATA[0]?.name || 'أريانة',
    districtId: WILAYAS_DATA[0]?.districts[0]?.id || 'ghazela',
    districtName: WILAYAS_DATA[0]?.districts[0]?.name || 'حي الغزالة',
    lat: WILAYAS_DATA[0]?.districts[0]?.lat || 36.89,
    lng: WILAYAS_DATA[0]?.districts[0]?.lng || 10.18,
    isAutoDetected: false,
  });

  // Modals state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAddMarketModalOpen, setIsAddMarketModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // 🎯 Helper: البحث عن إحداثيات الحي من WILAYAS_DATA
  const getCoordinatesForDistrict = (districtName?: string, wilayaName?: string) => {
    for (const wilaya of WILAYAS_DATA) {
      if (!wilayaName || wilaya.name === wilayaName) {
        const dist = wilaya.districts.find((d) => d.name === districtName || d.id === districtName);
        if (dist) return { lat: dist.lat, lng: dist.lng };
      }
    }
    // Fallback إلى الموقع الحالي أو تونس العاصمة
    return {
      lat: currentLocation.lat || 36.89,
      lng: currentLocation.lng || 10.18,
    };
  };

  // 🎯 1. Fetch Products & Submissions live min Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Products
        const { data: prodData, error: prodError } = await supabase.from('products').select('*');
        if (prodError) console.error('Erreur Supabase Products:', prodError);

        let fetchedProducts: Product[] = [];
        if (prodData && prodData.length > 0) {
          fetchedProducts = prodData.map((item) => {
            const rawPrice = Number(item.official_price) || 0;
            const finalPrice = rawPrice >= 100 ? rawPrice / 1000 : rawPrice;

            return {
              id: String(item.id || Date.now()),
              name: item.name_ar || item.name || 'مادة جديدة',
              category: item.category || 'vegetables',
              officialPrice: finalPrice,
              emoji: item.emoji || '🛒',
            };
          });
          setProducts(fetchedProducts);
          if (fetchedProducts.length > 0) {
            setSelectedProductId(fetchedProducts[0].id);
          }
        }

        // Fetch Price Submissions (تصاريح المواطنين)
        const { data: subData, error: subError } = await supabase
          .from('price_submissions')
          .select('*')
          .order('created_at', { ascending: false });

        if (subError) {
          console.error('Erreur Supabase Submissions:', subError);
        } else if (subData && subData.length > 0) {
          const currentProdList = fetchedProducts.length > 0 ? fetchedProducts : INITIAL_PRODUCTS;

          const formattedSubmissions: MarketSubmission[] = subData.map((item) => {
            const matchedProd = currentProdList.find((p) => p.id === String(item.product_id));
            const rawSubPrice = Number(item.price) || 0;
            const finalSubPrice = rawSubPrice >= 100 ? rawSubPrice / 1000 : rawSubPrice;

            // 🗺️ استخراج إحداثيات آمنة للـ LatLng
            const coords = getCoordinatesForDistrict(item.district, item.wilaya);

            let formattedTime = 'الآن';
            if (item.created_at) {
              try {
                formattedTime = new Date(item.created_at).toLocaleTimeString('ar-TN', {
                  hour: '2-digit',
                  minute: '2-digit',
                });
              } catch (e) {
                formattedTime = 'اليوم';
              }
            }

            return {
              id: String(item.id || Date.now()),
              productId: String(item.product_id || ''),
              productName: matchedProd?.name || 'مادة خضار',
              price: finalSubPrice,
              officialPrice: matchedProd?.officialPrice || finalSubPrice,
              districtName: item.district || currentLocation.districtName,
              wilayaName: item.wilaya || currentLocation.wilayaName,
              storeType: item.store_type || 'خضار حومة',
              timestamp: formattedTime,
              votesCount: 1,
              lat: coords.lat, // 👈 إضافة الإحداثيات حمايةً للـ Leaflet
              lng: coords.lng, // 👈
            };
          });

          setSubmissions([...formattedSubmissions, ...INITIAL_SUBMISSIONS]);
        }
      } catch (err) {
        console.error('Critical Error in fetchData:', err);
      }
    };

    fetchData();
  }, []);

  // اختيار المنتج المحدد
  const selectedProduct =
    products.find((p) => p.id === selectedProductId) ||
    products[0] ||
    DEFAULT_FALLBACK_PRODUCT;

  // 🎯 2. Handler for Product Addition (Sync DB)
  const handleAddProduct = async (newProduct: Product) => {
    try {
      setProducts((prev) => [...prev, newProduct]);
      setSelectedProductId(newProduct.id);

      const safePrice = Number(newProduct.officialPrice) || 0;

      const { error } = await supabase.from('products').insert([
        {
          id: newProduct.id,
          name_ar: newProduct.name || 'مادة',
          category: newProduct.category || 'vegetables',
          official_price: safePrice,
          emoji: newProduct.emoji || '🛒',
        },
      ]);

      if (error) {
        console.error('Erreur insertion Product DB:', error.message);
      } else {
        console.log('🎉 Product tsajjel f-Database b-naja7!');
      }
    } catch (err) {
      console.error('Erreur handleAddProduct:', err);
    }
  };

  // 🎯 3. Handler for Price Submission (Sync DB)
  const handleNewSubmission = async (newSub: MarketSubmission) => {
    try {
      // إرفاق الإحداثيات مسبقاً قبل التحديث
      const coords = getCoordinatesForDistrict(newSub.districtName, newSub.wilayaName);
      const safeSub: MarketSubmission = {
        ...newSub,
        lat: newSub.lat || coords.lat,
        lng: newSub.lng || coords.lng,
      };

      setSubmissions((prev) => [safeSub, ...prev]);

      const safePrice = Number(newSub.price) || 0;

      const { error } = await supabase.from('price_submissions').insert([
        {
          product_id: newSub.productId || selectedProductId,
          price: safePrice,
          district: newSub.districtName || currentLocation.districtName,
          wilaya: newSub.wilayaName || currentLocation.wilayaName,
          store_type: newSub.storeType || 'خضار حومة',
        },
      ]);

      if (error) {
        console.error('Erreur insertion Price DB:', error.message);
      } else {
        console.log('🎉 Soum tsajjel f-Database b-naja7!');
      }
    } catch (err) {
      console.error('Erreur handleNewSubmission:', err);
    }
  };

  // Upvote submission
  const handleUpvoteSubmission = (submissionId: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId ? { ...s, votesCount: (s.votesCount || 1) + 1 } : s
      )
    );
  };

  // Share app action
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Bqaddech.tn - بقدّاش؟',
        text: 'تبع أسعار الخضرة والغراف في تونس حيّاً وبكل شفافية 🇹🇳',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ رابط المنصة Bqaddech.tn!');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1F8] text-slate-800 font-ping-bold flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* 1. Sticky Header */}
      <Header
        currentLocation={currentLocation}
        onUpdateLocation={setCurrentLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
      />

      {/* 2. Product Selector Bar */}
      <ProductSelector
        products={products}
        selectedProductId={selectedProductId}
        onSelectProduct={setSelectedProductId}
        onOpenAddProductModal={() => setIsAddProductModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Top Banner Ticker / Alert */}
        <div className="bg-emerald-50/90 text-emerald-950 p-4 rounded-3xl border border-emerald-200/80 flex items-center justify-between gap-3 text-xs font-bold shadow-sm backdrop-blur-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping shrink-0"></span>
            <span className="leading-relaxed">
              🇹🇳 التسعيرة الرسمية محدّثة حسب بيانات SOTUMAG (سوق الجملة ببير القصعة) وبلاغات وزارة التجارة
            </span>
          </div>
          <button
            onClick={handleShare}
            className="hidden sm:flex items-center gap-1.5 bg-white border border-emerald-200/80 hover:bg-emerald-100/60 text-emerald-900 px-3.5 py-1.5 rounded-2xl transition-all cursor-pointer text-xs font-bold shadow-xs shrink-0"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>بارتاجي المنصة</span>
          </button>
        </div>

        {/* Core Interactive Section: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Price Voting Card */}
          <div className="lg:col-span-6 space-y-8">
            <PriceAdjuster
              product={selectedProduct}
              location={currentLocation}
              submissions={submissions}
              onSubmitPrice={handleNewSubmission}
            />

            {/* Price Trend Chart (Recharts) */}
            <PriceChart
              product={selectedProduct}
              location={currentLocation}
            />
          </div>

          {/* Right Column: Live Heatmap Map */}
          <div className="lg:col-span-6 h-full">
            <Heatmap
              product={selectedProduct}
              location={currentLocation}
              submissions={submissions}
              onOpenAddMarketModal={() => setIsAddMarketModalOpen(true)}
            />
          </div>
        </div>

        {/* 3. Koffet El Youm Basket Calculator */}
        <KoffetElYoum products={products} />

        {/* 4. Live Community Feed */}
        <CommunityFeed
          submissions={submissions}
          products={products}
          onUpvoteSubmission={handleUpvoteSubmission}
        />

        {/* Information & Citizen Solidarity Banner */}
        <div className="relative overflow-hidden bg-slate-900 text-white p-7 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="flex items-center gap-4 z-10">
            <div className="w-14 h-14 rounded-2xl bg-emerald-800/80 border border-emerald-600/80 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
              <Award className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-black font-ping-bold leading-tight">
                مبادرة مواطنية 100% لتونس 🇹🇳
              </h4>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                بقدّاش هي منصة تشاركية مفتوحة تهدف لحماية المقدرة الشرائية ولتفعيل الشفافية في أسواق الخضار والأسواق البلدية. صوتك يساهم في تحديد الأسعار الحقيقية!
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddMarketModalOpen(true)}
            className="z-10 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 px-6 py-3.5 rounded-2xl font-black text-xs shrink-0 transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            + صرّح بسوم جديد في سوقك
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 mt-12 py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-2 font-black text-slate-800 text-sm">
            <span>بقدّاش؟ Bqaddech.tn</span>
            <span>•</span>
            <span className="text-emerald-700">تونس</span>
          </div>

          <p className="max-w-md mx-auto text-slate-500 leading-relaxed">
            جميع البيانات المعروضة هي نتائج مشاركات مواطنية وتحديثات حينية مقارنة بالتسعيرة الرسمية التونسية.
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-bold pt-1">
            <span>صُنع بـ</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline-block" />
            <span>من أجل المواطن التونسي</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={currentLocation}
        onSelectLocation={setCurrentLocation}
      />

      <AddMarketModal
        isOpen={isAddMarketModalOpen}
        onClose={() => setIsAddMarketModalOpen(false)}
        products={products}
        currentLocation={currentLocation}
        onAddSubmission={handleNewSubmission}
      />

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
}