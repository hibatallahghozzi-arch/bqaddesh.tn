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

export default function App() {
  // Products & Submissions state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string>('tomate');
  const [submissions, setSubmissions] = useState<MarketSubmission[]>(INITIAL_SUBMISSIONS);

  // Location state (Defaulting to Cité Ghazela, Ariana)
  const [currentLocation, setCurrentLocation] = useState<LocationState>({
    wilayaId: 'ariana',
    wilayaName: WILAYAS_DATA[0].name,
    districtId: WILAYAS_DATA[0].districts[0].id,
    districtName: WILAYAS_DATA[0].districts[0].name,
    lat: WILAYAS_DATA[0].districts[0].lat,
    lng: WILAYAS_DATA[0].districts[0].lng,
    isAutoDetected: false,
  });

  // Modals state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAddMarketModalOpen, setIsAddMarketModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // 🎯 1. Fetch Products & Submissions live min Supabase
  useEffect(() => {
    const fetchData = async () => {
      // Fetch Products
      const { data: prodData, error: prodError } = await supabase.from('products').select('*');
      if (prodError) console.error('Erreur Supabase Products:', prodError);

      let fetchedProducts: Product[] = INITIAL_PRODUCTS;
      if (prodData && prodData.length > 0) {
        fetchedProducts = prodData.map((item) => ({
          id: item.id,
          name: item.name_ar,
          category: item.category as any,
          officialPrice: item.official_price,
          emoji: item.emoji || '🛒',
        }));
        setProducts(fetchedProducts);
        if (fetchedProducts[0]?.id) {
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
        const formattedSubmissions: MarketSubmission[] = subData.map((item) => {
          const matchedProd = fetchedProducts.find((p) => p.id === item.product_id);
          return {
            id: item.id,
            productId: item.product_id,
            productName: matchedProd?.name || 'مادة خضار',
            price: Number(item.price) || 0,
            officialPrice: matchedProd?.officialPrice || item.price,
            districtName: item.district || currentLocation.districtName,
            wilayaName: item.wilaya || currentLocation.wilayaName,
            storeType: item.store_type || 'خضار حومة',
            // 🛡️ حماية الإحداثيات للخارطة باش متطيحش الشاشة بيضاء
            lat: Number(item.lat) || currentLocation.lat || 36.8065,
            lng: Number(item.lng) || currentLocation.lng || 10.1815,
            timestamp: new Date(item.created_at).toLocaleTimeString('ar-TN', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            votesCount: 1,
          };
        });

        // N'dmajou l-Data mta3 DB m3a l-mock initial submissions
        setSubmissions([...formattedSubmissions, ...INITIAL_SUBMISSIONS]);
      }
    };

    fetchData();
  }, []);

  // 🛡️ حماية المنتج المحدد باش ديما يرجع منتج وما يعطيش undefined
  const selectedProduct =
    products.find((p) => p.id === selectedProductId) ||
    products[0] ||
    INITIAL_PRODUCTS[0];

  // 🎯 2. Handler for Product Addition (Sync DB)
  const handleAddProduct = async (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
    setSelectedProductId(newProduct.id);

    const { error } = await supabase.from('products').insert([
      {
        name_ar: newProduct.name,
        category: newProduct.category,
        official_price: newProduct.officialPrice,
        emoji: newProduct.emoji,
      },
    ]);

    if (error) console.error('Erreur insertion Product DB:', error.message);
  };

  // 🎯 3. Handler for Price Submission (Sync DB with Math.round)
  const handleNewSubmission = async (newSub: MarketSubmission) => {
    // Ensure fallback coords
    const completeSub = {
      ...newSub,
      lat: newSub.lat || currentLocation.lat,
      lng: newSub.lng || currentLocation.lng,
    };

    // UI update immediate
    setSubmissions((prev) => [completeSub, ...prev]);

    // تحويل السوم لعدد صحيح بالمليمات
    const cleanIntegerPrice = Math.round(Number(newSub.price));

    // Save to Supabase DB
    const { error } = await supabase.from('price_submissions').insert([
      {
        product_id: newSub.productId || selectedProductId,
        price: cleanIntegerPrice,
        district: newSub.districtName || currentLocation.districtName,
        wilaya: newSub.wilayaName || currentLocation.wilayaName,
        store_type: newSub.storeType || 'خضار حومة',
        lat: completeSub.lat,
        lng: completeSub.lng,
      },
    ]);

    if (error) {
      console.error('Erreur insertion Price DB:', error.message);
    } else {
      console.log('🎉 Soum tsajjel f-Database b-naja7!');
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

  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-[#F4F1F8] flex items-center justify-center font-bold text-slate-600">
        جاري تحميل البيانات... 🇹🇳
      </div>
    );
  }

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