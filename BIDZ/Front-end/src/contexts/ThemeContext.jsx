import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

// ── Translations ────────────────────────────────────────────────────────────
const translations = {
  en: {
    // Nav
    auctions: "Auctions",
    howItWorks: "How it Works",
    about: "About",
    signIn: "Sign In",
    getStarted: "Get Started",
    newListing: "New Listing",
    placeBid: "Place Bid",
    notifications: "Notifications",

    // Dashboard common
    overview: "Overview",
    myBids: "My Bids",
    watchlist: "Watchlist",
    orders: "Orders",
    wallet: "Wallet",
    myChats: "My Chats",
    aiAssistant: "AI Assistant",
    analytics: "Analytics",
    settings: "Settings",
    signOut: "Sign Out",
    addProduct: "Add Product",
    createAuction: "Create Auction",
    browseAuctions: "Browse Auctions",
    myProducts: "My Products",
    myAuctions: "My Auctions",
    viewAll: "View All",
    loading: "Loading...",

    // Buyer dashboard
    welcomeBack: "Welcome back",
    activeBids: "Active Bids",
    auctionsWon: "Auctions Won",
    totalOrders: "Total Orders",
    walletOverview: "Wallet Overview",
    locked: "Locked",
    escrow: "Escrow",
    bidActivity: "Bid Activity",
    last7Days: "Last 7 days",
    bidStatus: "Bid Status",
    currentBreakdown: "Current breakdown",
    leading: "Leading",
    outbid: "Outbid",
    won: "Won",
    lost: "Lost",
    noActiveBids: "No bids yet. Start bidding!",
    item: "Item",
    lot: "Lot #",
    closes: "Closes",
    yourBid: "Your Bid",
    status: "Status",

    // Seller dashboard
    totalRevenue: "Total Revenue",
    walletBalance: "Wallet Balance",
    escrowBalance: "Escrow Balance",
    avgSalePrice: "Avg. Sale Price",
    totalAuctions: "Total Auctions",
    activeAuctions: "Active Auctions",
    pendingOrders: "Pending Orders",
    deliveredOrders: "Delivered Orders",
    monthlyRevenue: "Monthly Revenue",
    last6Months: "Last 6 months",
    recentBuyers: "Recent Buyers",
    recentAuctions: "Recent Auctions",
    noProductsYet: "No products yet",
    noAuctionsYet: "No auctions yet",

    // Admin
    adminDashboard: "Admin Dashboard",
    platformAnalytics: "Platform-wide analytics and management.",
    totalUsers: "Total Users",
    totalAuctionsLabel: "Total Auctions",
    totalOrdersLabel: "Total Orders",
    buyers: "Buyers",
    sellers: "Sellers",
    pendingReports: "Pending Reports",
    platformWallet: "Platform Wallet",
    totalEscrow: "Total Escrow",
    completedOrders: "Completed Orders",
    revenueTrend: "Revenue Trend",
    topSellers: "Top Sellers",
    recentUsers: "Recent Users",
    recentOrders: "Recent Orders",
    byRevenue: "By revenue",
    latestRegistrations: "Latest registrations",
    latestCompleted: "Latest completed",

    // Auctions page
    liveAuctions: "Live Auctions",
    filters: "Filters",
    resetAll: "Reset all",
    statusLabel: "Status",
    allListings: "All Listings",
    active: "Active",
    ended: "Ended",
    priceRange: "Price Range",
    sortBy: "Sort By",
    endingSoon: "Ending Soon",
    newestFirst: "Newest First",
    lowestPrice: "Lowest Price",
    highestBid: "Highest Bid",
    searchPlaceholder: "Search auctions, sellers...",
    currentBid: "Current Bid",
    timeLeft: "Time Left",
    noAuctionsFound: "No auctions match your filters.",
    clearFilters: "Clear Filters",

    // Login
    welcomeBackLogin: "Welcome Back",
    accessDashboard: "Access your auction dashboard",
    emailAddress: "Email Address",
    password: "Password",
    keepSignedIn: "Keep me signed in",
    signInBtn: "Sign In",
    signingIn: "Signing in...",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    signUp: "Sign Up",
    demoAccounts: "Demo Accounts",
    clickToFill: "Click to auto-fill",

    // Reports
    reports: "Reports",
    pending: "Pending",
    resolved: "Resolved",
    rejected: "Rejected",
    reporter: "Reporter",
    target: "Target",
    reason: "Reason",
    date: "Date",
    review: "Review",
    resolveReport: "Resolve Report",
    action: "Action",
    adminNote: "Admin Note",
    submit: "Submit",
    cancel: "Cancel",
  },

  ar: {
    // Nav
    auctions: "المزادات",
    howItWorks: "كيف يعمل",
    about: "عن المنصة",
    signIn: "تسجيل الدخول",
    getStarted: "ابدأ الآن",
    newListing: "إضافة مزاد",
    placeBid: "قدم عرضاً",
    notifications: "الإشعارات",

    // Dashboard common
    overview: "نظرة عامة",
    myBids: "عروضي",
    watchlist: "قائمة المتابعة",
    orders: "الطلبات",
    wallet: "المحفظة",
    myChats: "محادثاتي",
    aiAssistant: "مساعد الذكاء",
    analytics: "التحليلات",
    settings: "الإعدادات",
    signOut: "تسجيل الخروج",
    addProduct: "إضافة منتج",
    createAuction: "إنشاء مزاد",
    browseAuctions: "تصفح المزادات",
    myProducts: "منتجاتي",
    myAuctions: "مزاداتي",
    viewAll: "عرض الكل",
    loading: "جاري التحميل...",

    // Buyer dashboard
    welcomeBack: "مرحباً بعودتك",
    activeBids: "العروض النشطة",
    auctionsWon: "المزادات المكسوبة",
    totalOrders: "إجمالي الطلبات",
    walletOverview: "نظرة على المحفظة",
    locked: "محجوز",
    escrow: "ضمان",
    bidActivity: "نشاط العروض",
    last7Days: "آخر 7 أيام",
    bidStatus: "حالة العروض",
    currentBreakdown: "التوزيع الحالي",
    leading: "في المقدمة",
    outbid: "تم تجاوزه",
    won: "فاز",
    lost: "خسر",
    noActiveBids: "لا توجد عروض بعد. ابدأ المزايدة!",
    item: "المنتج",
    lot: "رقم القطعة",
    closes: "ينتهي",
    yourBid: "عرضك",
    status: "الحالة",

    // Seller dashboard
    totalRevenue: "إجمالي الإيرادات",
    walletBalance: "رصيد المحفظة",
    escrowBalance: "رصيد الضمان",
    avgSalePrice: "متوسط سعر البيع",
    totalAuctions: "إجمالي المزادات",
    activeAuctions: "المزادات النشطة",
    pendingOrders: "الطلبات المعلقة",
    deliveredOrders: "الطلبات المسلمة",
    monthlyRevenue: "الإيرادات الشهرية",
    last6Months: "آخر 6 أشهر",
    recentBuyers: "آخر المشترين",
    recentAuctions: "آخر المزادات",
    noProductsYet: "لا توجد منتجات بعد",
    noAuctionsYet: "لا توجد مزادات بعد",

    // Admin
    adminDashboard: "لوحة الإدارة",
    platformAnalytics: "تحليلات وإدارة المنصة",
    totalUsers: "إجمالي المستخدمين",
    totalAuctionsLabel: "إجمالي المزادات",
    totalOrdersLabel: "إجمالي الطلبات",
    buyers: "المشترون",
    sellers: "البائعون",
    pendingReports: "البلاغات المعلقة",
    platformWallet: "محفظة المنصة",
    totalEscrow: "إجمالي الضمان",
    completedOrders: "الطلبات المكتملة",
    revenueTrend: "اتجاه الإيرادات",
    topSellers: "أفضل البائعين",
    recentUsers: "آخر المستخدمين",
    recentOrders: "آخر الطلبات",
    byRevenue: "حسب الإيرادات",
    latestRegistrations: "آخر التسجيلات",
    latestCompleted: "آخر المكتملة",

    // Auctions page
    liveAuctions: "المزادات المباشرة",
    filters: "الفلاتر",
    resetAll: "إعادة تعيين",
    statusLabel: "الحالة",
    allListings: "جميع القوائم",
    active: "نشط",
    ended: "منتهي",
    priceRange: "نطاق السعر",
    sortBy: "ترتيب حسب",
    endingSoon: "ينتهي قريباً",
    newestFirst: "الأحدث أولاً",
    lowestPrice: "أقل سعر",
    highestBid: "أعلى عرض",
    searchPlaceholder: "ابحث عن مزادات، بائعين...",
    currentBid: "العرض الحالي",
    timeLeft: "الوقت المتبقي",
    noAuctionsFound: "لا توجد مزادات تطابق الفلاتر.",
    clearFilters: "مسح الفلاتر",

    // Login
    welcomeBackLogin: "مرحباً بعودتك",
    accessDashboard: "ادخل إلى لوحة المزادات",
    emailAddress: "البريد الإلكتروني",
    password: "كلمة المرور",
    keepSignedIn: "ابق متصلاً",
    signInBtn: "تسجيل الدخول",
    signingIn: "جاري الدخول...",
    forgotPassword: "نسيت كلمة المرور؟",
    noAccount: "ليس لديك حساب؟",
    signUp: "إنشاء حساب",
    demoAccounts: "حسابات تجريبية",
    clickToFill: "اضغط للملء التلقائي",

    // Reports
    reports: "البلاغات",
    pending: "معلق",
    resolved: "محلول",
    rejected: "مرفوض",
    reporter: "المُبلِّغ",
    target: "الهدف",
    reason: "السبب",
    date: "التاريخ",
    review: "مراجعة",
    resolveReport: "حل البلاغ",
    action: "الإجراء",
    adminNote: "ملاحظة الإدارة",
    submit: "إرسال",
    cancel: "إلغاء",
  },
};

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

  const isRTL = lang === "ar";

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);
  }, [lang, isRTL]);

  const t = (key) => translations[lang]?.[key] ?? translations.en[key] ?? key;

  const toggleDark = () => setDark(d => !d);
  const toggleLang = () => setLang(l => l === "en" ? "ar" : "en");

  return (
    <ThemeContext.Provider value={{ dark, toggleDark, lang, toggleLang, isRTL, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
