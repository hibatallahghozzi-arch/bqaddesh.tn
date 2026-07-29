import { Product, Wilaya, MarketSubmission, PriceHistoryPoint } from '../types';

// Benchmark SOTUMAG (سوق الجملة ببير القصعة) Prix Moyen Pondéré (PMP) & Ministry of Trade official prices
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'tomate',
    name: 'Tomate',
    arName: 'طماطم',
    emoji: '🍅',
    officialPrice: 1.600, // SOTUMAG PMP ~ 1.600 DT/Kg
    unit: 'كغ',
    category: 'vegetables',
  },
  {
    id: 'batata',
    name: 'Pomme de terre',
    arName: 'بطاطا',
    emoji: '🥔',
    officialPrice: 1.500, // SOTUMAG PMP ~ 1.500 DT/Kg
    unit: 'كغ',
    category: 'vegetables',
  },
  {
    id: 'felfel',
    name: 'Piment / Poivron',
    arName: 'فلفل حار/حلو',
    emoji: '🌶️',
    officialPrice: 2.400, // SOTUMAG PMP ~ 2.400 DT/Kg
    unit: 'كغ',
    category: 'vegetables',
  },
  {
    id: 'bsal',
    name: 'Oignon',
    arName: 'بصل جاف',
    emoji: '🧅',
    officialPrice: 1.300, // SOTUMAG PMP ~ 1.300 DT/Kg
    unit: 'كغ',
    category: 'vegetables',
  },
  {
    id: 'banane',
    name: 'Banane',
    arName: 'بنان',
    emoji: '🍌',
    officialPrice: 5.000, // Plafonné ~ 5.000 DT/Kg
    unit: 'كغ',
    category: 'fruits',
  },
  {
    id: 'teffah',
    name: 'Pomme',
    arName: 'تفاح',
    emoji: '🍎',
    officialPrice: 3.200, // SOTUMAG PMP ~ 3.200 DT/Kg
    unit: 'كغ',
    category: 'fruits',
  },
  {
    id: 'qares',
    name: 'Citron',
    arName: 'قارص',
    emoji: '🍋',
    officialPrice: 2.500, // SOTUMAG PMP ~ 2.500 DT/Kg
    unit: 'كغ',
    category: 'fruits',
  },
  {
    id: 'frawla',
    name: 'Fraise',
    arName: 'فراولة',
    emoji: '🍓',
    officialPrice: 4.500, // SOTUMAG PMP ~ 4.500 DT/Kg
    unit: 'كغ',
    category: 'fruits',
  },
  {
    id: 'khiar',
    name: 'Concombre',
    arName: 'خيار',
    emoji: '🥒',
    officialPrice: 2.100, // SOTUMAG PMP ~ 2.100 DT/Kg
    unit: 'كغ',
    category: 'vegetables',
  },
  {
    id: 'sfnarya',
    name: 'Carotte',
    arName: 'سفنارية / جزر',
    emoji: '🥕',
    officialPrice: 1.200, // SOTUMAG PMP ~ 1.200 DT/Kg
    unit: 'كغ',
    category: 'vegetables',
  },
  {
    id: 'betnjal',
    name: 'Aubergine',
    arName: 'بتنجال / باذنجان',
    emoji: '🍆',
    officialPrice: 1.800, // SOTUMAG PMP ~ 1.800 DT/Kg
    unit: 'كغ',
    category: 'vegetables',
  },
  {
    id: 'degla',
    name: 'Dattes Deglet Nour',
    arName: 'دقلة النور',
    emoji: '🌴',
    officialPrice: 6.800, // SOTUMAG PMP ~ 6.800 DT/Kg
    unit: 'كغ',
    category: 'fruits',
  },
];

// Comprehensive All-24 Tunisian Governorates dataset with Delegations & GPS Coordinates
// Based on official Tunisian admin divisions & Benyoubilel/TUNISIAN-CITIES-JSON
export const WILAYAS_DATA: Wilaya[] = [
  {
    id: 'ariana',
    name: 'أريانة (Ariana)',
    districts: [
      { id: 'ghazela', name: 'حي الغزالة (Cité Ghazela)', lat: 36.8920, lng: 10.1880 },
      { id: 'ariana_ville', name: 'أريانة المدينة (Ariana Ville)', lat: 36.8625, lng: 10.1950 },
      { id: 'ennasr', name: 'النصر (Ennasr)', lat: 36.8580, lng: 10.1580 },
      { id: 'mnihla', name: 'المنيهلة (Mnihla)', lat: 36.8430, lng: 10.1150 },
      { id: 'soukra', name: 'سكرَة (La Soukra)', lat: 36.8870, lng: 10.2520 },
      { id: 'raoued', name: 'رواد (Raoued)', lat: 36.9240, lng: 10.2050 },
      { id: 'kalaat_landalous', name: 'قلعة الأندلس', lat: 37.0610, lng: 10.1160 },
    ]
  },
  {
    id: 'tunis',
    name: 'تونس العاصمة (Tunis)',
    districts: [
      { id: 'marche_central', name: 'المارشي سنترال (وسط البلد)', lat: 36.7992, lng: 10.1782 },
      { id: 'la_marsa', name: 'المرسى (La Marsa)', lat: 36.8780, lng: 10.3240 },
      { id: 'bardo', name: 'باردو (Le Bardo)', lat: 36.8090, lng: 10.1410 },
      { id: 'hay_khadhra', name: 'حي الخضراء', lat: 36.8320, lng: 10.1980 },
      { id: 'lac', name: 'ضفاف البحيرة (Les Berges du Lac)', lat: 36.8370, lng: 10.2410 },
      { id: 'carthage', name: 'قرطاج (Carthage)', lat: 36.8520, lng: 10.3300 },
      { id: 'sidi_bou_said', name: 'سيدي بوسعيد', lat: 36.8700, lng: 10.3470 },
      { id: 'bab_bhar', name: 'باب البحر / باب الفلة', lat: 36.7890, lng: 10.1720 },
      { id: 'el_menzah', name: 'المنزه (El Menzah)', lat: 36.8380, lng: 10.1770 },
    ]
  },
  {
    id: 'ben_arous',
    name: 'بن عروس (Ben Arous)',
    districts: [
      { id: 'bir_el_bey', name: 'بير القسعة (سوق الجملة المركزي)', lat: 36.7280, lng: 10.2310 },
      { id: 'ben_arous_ville', name: 'بن عروس المدينة', lat: 36.7530, lng: 10.2180 },
      { id: 'ezzahra', name: 'الزهراء (Ezzahra)', lat: 36.7440, lng: 10.3080 },
      { id: 'rades', name: 'رادس (Radès)', lat: 36.7700, lng: 10.2800 },
      { id: 'hammam_lif', name: 'حمام الأنف (Hammam Lif)', lat: 36.7290, lng: 10.3390 },
      { id: 'megrine', name: 'مقرين (Mégurine)', lat: 36.7720, lng: 10.2350 },
      { id: 'fouchana', name: 'فوشانة (Fouchana)', lat: 36.6890, lng: 10.1700 },
      { id: 'mornag', name: 'مرناق (Mornag)', lat: 36.6800, lng: 10.2900 },
    ]
  },
  {
    id: 'manouba',
    name: 'منوبة (Manouba)',
    districts: [
      { id: 'manouba_ville', name: 'منوبة المدينة', lat: 36.8080, lng: 10.0970 },
      { id: 'den_den', name: 'الدندان (Denden)', lat: 36.8020, lng: 10.1160 },
      { id: 'oued_ellil', name: 'وادي الليل (Oued Ellil)', lat: 36.8370, lng: 10.0400 },
      { id: 'douar_hicher', name: 'دوار هيشر', lat: 36.8290, lng: 10.0820 },
      { id: 'tebourba', name: 'طبربة (Tebourba)', lat: 36.8280, lng: 9.8420 },
      { id: 'mornaguia', name: 'المرناقية', lat: 36.7450, lng: 10.0050 },
    ]
  },
  {
    id: 'nabeul',
    name: 'نابل (Nabeul / Cap Bon)',
    districts: [
      { id: 'nabeul_ville', name: 'نابل المدينة', lat: 36.4560, lng: 10.7370 },
      { id: 'hammamet', name: 'الحمامات', lat: 36.4000, lng: 10.6160 },
      { id: 'kelibia', name: 'قليبية (Kélibia)', lat: 36.8480, lng: 11.0930 },
      { id: 'korba', name: 'قربة (Korba)', lat: 36.5780, lng: 10.8580 },
      { id: 'menzel_temime', name: 'منزل تميم', lat: 36.7820, lng: 10.9900 },
      { id: 'soliman', name: 'سليمان (Soliman)', lat: 36.6960, lng: 10.4900 },
      { id: 'grombalia', name: 'قرمبالية (Grombalia)', lat: 36.6020, lng: 10.4970 },
      { id: 'dar_chaabane', name: 'دار شعبان الفهري', lat: 36.4680, lng: 10.7520 },
    ]
  },
  {
    id: 'bizerte',
    name: 'بنزرت (Bizerte)',
    districts: [
      { id: 'bizerte_nord', name: 'بنزرت المدينة / المارشي البلدي', lat: 37.2740, lng: 9.8730 },
      { id: 'menzel_bourguiba', name: 'منزل بورقيبة', lat: 37.1550, lng: 9.7880 },
      { id: 'ras_jebel', name: 'رأس الجبل', lat: 37.2150, lng: 10.1200 },
      { id: 'ghar_el_melh', name: 'غار الملح', lat: 37.1690, lng: 10.1880 },
      { id: 'mateur', name: 'ماطر (Mateur)', lat: 37.0400, lng: 9.6650 },
    ]
  },
  {
    id: 'sousse',
    name: 'سوسة (Sousse)',
    districts: [
      { id: 'sousse_medina', name: 'سوسة المدينة / سوق الأحد', lat: 35.8250, lng: 10.6360 },
      { id: 'khzama', name: 'خزامة (Khzama)', lat: 35.8350, lng: 10.6250 },
      { id: 'hammam_sousse', name: 'حمام سوسة', lat: 35.8590, lng: 10.5980 },
      { id: 'kantaoui', name: 'مرسى القنطاوي', lat: 35.8920, lng: 10.5920 },
      { id: 'akouda', name: 'أكودة (Akouda)', lat: 35.8710, lng: 10.5690 },
      { id: 'msaken', name: 'مساكن (Msaken)', lat: 35.7300, lng: 10.5820 },
      { id: 'kalaa_kebira', name: 'القلعة الكبرى', lat: 35.8720, lng: 10.5370 },
      { id: 'enfidha', name: 'النفيضة', lat: 36.1350, lng: 10.3800 },
    ]
  },
  {
    id: 'monastir',
    name: 'المنستير (Monastir)',
    districts: [
      { id: 'monastir_ville', name: 'المنستير المدينة', lat: 35.7770, lng: 10.8260 },
      { id: 'ksar_hellal', name: 'قصر هلال', lat: 35.6480, lng: 10.8910 },
      { id: 'moknine', name: 'مكنين (Moknine)', lat: 35.6260, lng: 10.9020 },
      { id: 'teboulba', name: 'طبلبة (Téboulba)', lat: 35.6420, lng: 10.9660 },
      { id: 'jemmal', name: 'جمّال (Jemmal)', lat: 35.6190, lng: 10.7570 },
      { id: 'sahline', name: 'الساحلين', lat: 35.7500, lng: 10.7080 },
    ]
  },
  {
    id: 'mahdia',
    name: 'المهدية (Mahdia)',
    districts: [
      { id: 'mahdia_ville', name: 'المهدية المدينة', lat: 35.5040, lng: 11.0620 },
      { id: 'ksour_essef', name: 'قصور الساف', lat: 35.3530, lng: 11.0370 },
      { id: 'chebba', name: 'الشابة (La Chebba)', lat: 35.2370, lng: 11.1150 },
      { id: 'el_jem', name: 'الجم (El Jem)', lat: 35.3020, lng: 10.7160 },
    ]
  },
  {
    id: 'sfax',
    name: 'صفاقس (Sfax)',
    districts: [
      { id: 'sfax_ville', name: 'صفاقس المدينة / باب الجبلي', lat: 34.7400, lng: 10.7600 },
      { id: 'sakiet_ezzit', name: 'ساقية الزيت', lat: 34.7980, lng: 10.7710 },
      { id: 'sakiet_eddaier', name: 'ساقية الداير', lat: 34.7800, lng: 10.8000 },
      { id: 'thyna', name: 'طينة (Thyna)', lat: 34.6750, lng: 10.7010 },
      { id: 'agareb', name: 'عقارب (Agareb)', lat: 34.7290, lng: 10.5360 },
      { id: 'jebiniana', name: 'جبنيانة', lat: 35.0310, lng: 10.9080 },
      { id: 'mahares', name: 'المحرس (Maharès)', lat: 34.5360, lng: 10.5050 },
    ]
  },
  {
    id: 'kairouan',
    name: 'القيروان (Kairouan)',
    districts: [
      { id: 'kairouan_nord', name: 'القيروان المدينة', lat: 35.6780, lng: 10.0960 },
      { id: 'bou_hajla', name: 'بوحجلة', lat: 35.3950, lng: 10.0520 },
      { id: 'chebika', name: 'الشبيكة', lat: 35.6200, lng: 9.9200 },
      { id: 'haffouz', name: 'حفوز', lat: 35.6320, lng: 9.6760 },
    ]
  },
  {
    id: 'kef',
    name: 'الكاف (Le Kef)',
    districts: [
      { id: 'kef_ville', name: 'الكاف المدينة', lat: 36.1820, lng: 8.7140 },
      { id: 'dahmani', name: 'الدهماني', lat: 35.9440, lng: 8.8290 },
      { id: 'tajerouine', name: 'تاجروين', lat: 35.8920, lng: 8.5520 },
      { id: 'sakiet_sidi_youssef', name: 'ساقية سيدي يوسف', lat: 36.2230, lng: 8.3540 },
    ]
  },
  {
    id: 'jendouba',
    name: 'جندوبة (Jendouba)',
    districts: [
      { id: 'jendouba_ville', name: 'جندوبة المدينة', lat: 36.5010, lng: 8.7800 },
      { id: 'tabarka', name: 'طبرقة (Tabarka)', lat: 36.9540, lng: 8.7580 },
      { id: 'ain_draham', name: 'عين دراهم', lat: 36.7830, lng: 8.6870 },
      { id: 'bou_salem', name: 'بوسالم', lat: 36.6110, lng: 8.9690 },
    ]
  },
  {
    id: 'beja',
    name: 'باجة (Béja)',
    districts: [
      { id: 'beja_ville', name: 'باجة المدينة', lat: 36.7250, lng: 9.1810 },
      { id: 'testour', name: 'تستور (Testour)', lat: 36.5520, lng: 9.4450 },
      { id: 'medjez_el_bab', name: 'مجاز الباب', lat: 36.6480, lng: 9.6100 },
      { id: 'teboursouk', name: 'تبرسق', lat: 36.4580, lng: 9.2480 },
    ]
  },
  {
    id: 'siliana',
    name: 'سليانة (Siliana)',
    districts: [
      { id: 'siliana_ville', name: 'سليانة المدينة', lat: 36.0840, lng: 9.3700 },
      { id: 'makthar', name: 'مكثر (Makthar)', lat: 35.8580, lng: 9.2060 },
      { id: 'bou_arada', name: 'بوعرادة', lat: 36.3530, lng: 9.6220 },
    ]
  },
  {
    id: 'zaghouan',
    name: 'زغوان (Zaghouan)',
    districts: [
      { id: 'zaghouan_ville', name: 'زغوان المدينة', lat: 36.4020, lng: 10.1420 },
      { id: 'el_fahs', name: 'الفحص (El Fahs)', lat: 36.3740, lng: 9.9070 },
      { id: 'bir_mcherga', name: 'بئر مشارقة', lat: 36.5120, lng: 10.0120 },
    ]
  },
  {
    id: 'kasserine',
    name: 'القصرين (Kasserine)',
    districts: [
      { id: 'kasserine_ville', name: 'القصرين المدينة', lat: 35.1670, lng: 8.8360 },
      { id: 'sbeitla', name: 'سبيطلة (Sbeïtla)', lat: 35.2280, lng: 9.1240 },
      { id: 'feriana', name: 'فريانة', lat: 34.9540, lng: 8.5720 },
      { id: 'thala', name: 'تالة (Thala)', lat: 35.5720, lng: 8.6700 },
    ]
  },
  {
    id: 'sidi_bouzid',
    name: 'سيدي بوزيد (Sidi Bouzid)',
    districts: [
      { id: 'sidi_bouzid_ville', name: 'سيدي بوزيد المدينة', lat: 35.0380, lng: 9.4850 },
      { id: 'regueb', name: 'الرقاب (Regueb)', lat: 34.8600, lng: 9.7870 },
      { id: 'meknassy', name: 'المكناسي', lat: 34.6060, lng: 9.6100 },
    ]
  },
  {
    id: 'gafsa',
    name: 'قفصة (Gafsa)',
    districts: [
      { id: 'gafsa_ville', name: 'قفصة المدينة', lat: 34.4250, lng: 8.7840 },
      { id: 'metlaoui', name: 'المتلوي (Métlaoui)', lat: 34.3310, lng: 8.3990 },
      { id: 'redeyef', name: 'الرديف', lat: 34.3820, lng: 8.1560 },
      { id: 'moulares', name: 'أم العرائس', lat: 34.4880, lng: 8.2610 },
    ]
  },
  {
    id: 'tozeur',
    name: 'توزر (Tozeur)',
    districts: [
      { id: 'tozeur_ville', name: 'توزر المدينة', lat: 33.9190, lng: 8.1330 },
      { id: 'nefta', name: 'نفطة (Nefta)', lat: 33.8730, lng: 7.8770 },
      { id: 'degache', name: 'دقاش', lat: 33.9780, lng: 8.2110 },
    ]
  },
  {
    id: 'kebili',
    name: 'قبلي (Kebili)',
    districts: [
      { id: 'kebili_ville', name: 'قبلي المدينة', lat: 33.7050, lng: 8.9690 },
      { id: 'douz', name: 'دوز (Douz)', lat: 33.4660, lng: 9.0200 },
      { id: 'souk_lahad', name: 'سوق الأحد', lat: 33.7800, lng: 8.9000 },
    ]
  },
  {
    id: 'gabes',
    name: 'قابس (Gabès)',
    districts: [
      { id: 'gabes_ville', name: 'قابس المدينة / المارشي', lat: 33.8810, lng: 10.0980 },
      { id: 'el_hamma', name: 'الحامة (El Hamma)', lat: 33.8860, lng: 9.7960 },
      { id: 'mareth', name: 'مارث (Mareth)', lat: 33.6120, lng: 10.2700 },
      { id: 'matmata', name: 'مطماطة', lat: 33.5430, lng: 9.9660 },
    ]
  },
  {
    id: 'medenine',
    name: 'مدنين (Médenine / Djerba)',
    districts: [
      { id: 'medenine_ville', name: 'مدنين المدينة', lat: 33.3540, lng: 10.5050 },
      { id: 'houmt_souk', name: 'جربة حومة السوق', lat: 33.8760, lng: 10.8580 },
      { id: 'midoun', name: 'جربة ميدون', lat: 33.8080, lng: 11.0000 },
      { id: 'zarzis', name: 'جرجيس (Zarzis)', lat: 33.5030, lng: 11.1120 },
      { id: 'ben_guerdane', name: 'بن قردان', lat: 33.1380, lng: 11.2170 },
    ]
  },
  {
    id: 'tataouine',
    name: 'تطاوين (Tataouine)',
    districts: [
      { id: 'tataouine_ville', name: 'تطاوين المدينة', lat: 32.9290, lng: 10.4510 },
      { id: 'ghomrassen', name: 'غمراسن', lat: 33.0590, lng: 10.3390 },
      { id: 'remada', name: 'رمادة', lat: 32.3180, lng: 10.3950 },
    ]
  }
];

export const INITIAL_SUBMISSIONS: MarketSubmission[] = [
  // --- Ariana & Ghazela Area ---
  {
    id: 'sub-1',
    productId: 'tomate',
    marketName: 'سوق الجملة أريانة البلدي',
    sellerType: 'central_market',
    price: 1.600, // SOTUMAG PMP
    lat: 36.8625,
    lng: 10.1950,
    timestamp: 'منذ 10 دقائق',
    districtId: 'ghazela',
    votesCount: 24,
  },
  {
    id: 'sub-2',
    productId: 'tomate',
    marketName: 'خضار حومة حي الغزالة (عمّ الحبيب)',
    sellerType: 'neighborhood',
    price: 1.750,
    lat: 36.8920,
    lng: 10.1880,
    timestamp: 'منذ 25 دقيقة',
    districtId: 'ghazela',
    votesCount: 18,
  },
  {
    id: 'sub-3',
    productId: 'tomate',
    marketName: 'عطّار النخيل الغزالة',
    sellerType: 'supermarket',
    price: 1.900,
    lat: 36.8950,
    lng: 10.1840,
    timestamp: 'منذ ساعة',
    districtId: 'ghazela',
    votesCount: 9,
  },
  {
    id: 'sub-4',
    productId: 'tomate',
    marketName: 'محلّ خضراوات الراقي Ennasr',
    sellerType: 'neighborhood',
    price: 2.200,
    lat: 36.8580,
    lng: 10.1580,
    timestamp: 'منذ ساعتين',
    districtId: 'ennasr',
    votesCount: 14,
  },
  {
    id: 'sub-5',
    productId: 'tomate',
    marketName: 'سوق الجملة بير القصعة المركزي',
    sellerType: 'central_market',
    price: 1.550,
    lat: 36.7280,
    lng: 10.2310,
    timestamp: 'منذ 5 دقائق',
    districtId: 'bir_el_bey',
    votesCount: 88,
  },
  {
    id: 'sub-tun-1',
    productId: 'tomate',
    marketName: 'المارشي سنترال تونس العاصمة',
    sellerType: 'central_market',
    price: 1.600,
    lat: 36.7992,
    lng: 10.1782,
    timestamp: 'منذ 15 دقيقة',
    districtId: 'marche_central',
    votesCount: 52,
  },
  {
    id: 'sub-6',
    productId: 'batata',
    marketName: 'سوق الجملة أريانة البلدي',
    sellerType: 'central_market',
    price: 1.500,
    lat: 36.8625,
    lng: 10.1950,
    timestamp: 'منذ 15 دقيقة',
    districtId: 'ghazela',
    votesCount: 42,
  },
  {
    id: 'sub-7',
    productId: 'batata',
    marketName: 'خضار حومة حي الغزالة (عمّ الحبيب)',
    sellerType: 'neighborhood',
    price: 1.650,
    lat: 36.8920,
    lng: 10.1880,
    timestamp: 'منذ 30 دقيقة',
    districtId: 'ghazela',
    votesCount: 22,
  },
  {
    id: 'sub-8',
    productId: 'batata',
    marketName: 'سوق بير القصعة جملة',
    sellerType: 'central_market',
    price: 1.450,
    lat: 36.7280,
    lng: 10.2310,
    timestamp: 'منذ 10 دقائق',
    districtId: 'bir_el_bey',
    votesCount: 61,
  },
  {
    id: 'sub-9',
    productId: 'banane',
    marketName: 'خضار حومة حي الغزالة (عمّ الحبيب)',
    sellerType: 'neighborhood',
    price: 5.200,
    lat: 36.8920,
    lng: 10.1880,
    timestamp: 'منذ 5 دقائق',
    districtId: 'ghazela',
    votesCount: 50,
  },
  {
    id: 'sub-10',
    productId: 'banane',
    marketName: 'سوق أريانة سنتر',
    sellerType: 'central_market',
    price: 5.000,
    lat: 36.8625,
    lng: 10.1950,
    timestamp: 'منذ 12 دقيقة',
    districtId: 'ghazela',
    votesCount: 65,
  }
];

export const MOCK_PRICE_HISTORY: Record<string, PriceHistoryPoint[]> = {
  tomate: [
    { date: 'الخميس', submittedAvg: 1.800, officialPrice: 1.600 },
    { date: 'الجمعة', submittedAvg: 1.750, officialPrice: 1.600 },
    { date: 'السبت', submittedAvg: 1.850, officialPrice: 1.600 },
    { date: 'الأحد', submittedAvg: 1.800, officialPrice: 1.600 },
    { date: 'الإثنين', submittedAvg: 1.700, officialPrice: 1.600 },
    { date: 'الثلاثاء', submittedAvg: 1.650, officialPrice: 1.600 },
    { date: 'اليوم', submittedAvg: 1.680, officialPrice: 1.600 },
  ],
  batata: [
    { date: 'الخميس', submittedAvg: 1.700, officialPrice: 1.500 },
    { date: 'الجمعة', submittedAvg: 1.650, officialPrice: 1.500 },
    { date: 'السبت', submittedAvg: 1.750, officialPrice: 1.500 },
    { date: 'الأحد', submittedAvg: 1.700, officialPrice: 1.500 },
    { date: 'الإثنين', submittedAvg: 1.600, officialPrice: 1.500 },
    { date: 'الثلاثاء', submittedAvg: 1.580, officialPrice: 1.500 },
    { date: 'اليوم', submittedAvg: 1.600, officialPrice: 1.500 },
  ],
  banane: [
    { date: 'الخميس', submittedAvg: 5.600, officialPrice: 5.000 },
    { date: 'الجمعة', submittedAvg: 5.500, officialPrice: 5.000 },
    { date: 'السبت', submittedAvg: 5.700, officialPrice: 5.000 },
    { date: 'الأحد', submittedAvg: 5.500, officialPrice: 5.000 },
    { date: 'الإثنين', submittedAvg: 5.300, officialPrice: 5.000 },
    { date: 'الثلاثاء', submittedAvg: 5.200, officialPrice: 5.000 },
    { date: 'اليوم', submittedAvg: 5.150, officialPrice: 5.000 },
  ]
};
