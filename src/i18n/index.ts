import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Define the resources for translation
const resources = {
  en: {
    translation: {
      // Navigation / Sidebar
      dashboard: 'Dashboard',
      shipments: 'Shipments',
      courierRates: 'Courier Rates',
      walletBilling: 'Wallet & Billing',
      users: 'Users',
      settings: 'Settings',
      logout: 'Logout',
      welcome: 'Welcome',
      admin: 'Admin',

      // Header / Common
      searchPlaceholder: 'Track shipment (AWB) or search orders...',
      newShipment: 'New Shipment',
      refreshList: 'Refresh List',
      search: 'Search',
      retry: 'Retry',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      actions: 'Actions',
      loading: 'Loading...',

      // Login Page
      welcomeBack: 'Welcome Back',
      signInDesc: 'Sign in to manage your shipments',
      emailAddress: 'Email Address',
      password: 'Password',
      forgotPassword: 'Forgot?',
      signIn: 'Sign In',
      poweredBy: 'Powered by',
      loginFailed: 'Login failed. Please check your credentials.',

      // Dashboard Page / Feature
      overview: 'Overview',
      dashboardDesc: 'Overview of your logistics and wallet balance.',
      statsOverview: 'Real-time performance and analytics.',
      totalShipments: 'Total Shipments',
      inTransit: 'In Transit',
      deliveredShipments: 'Delivered',
      pendingShipments: 'Pending',
      failedShipments: 'Failed',
      recentShipments: 'Recent Shipments',
      recentShipmentsDesc: 'Overview of latest shipping activities.',
      viewAll: 'View All',
      noShipments: 'No shipments found.',
      quickRateCalc: 'Quick Rate Calc',
      originCity: 'Origin City',
      destinationCity: 'Destination City',
      weightKg: 'Weight (kg)',
      compareRates: 'Compare Rates',

      // User Page
      userManagement: 'User Management',
      userManagementDesc: 'Manage admin access and operator permissions.',
      addNewUser: 'Add New User',
      editUser: 'Edit User',
      searchUsersPlaceholder: 'Search users by name or email...',
      fullName: 'Full Name',
      role: 'Role',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      suspended: 'Suspended',
      phone: 'Phone Number',
      deactivate: 'Deactivate',
      activate: 'Activate',
      confirmDeleteUser: 'Are you sure you want to delete this user?',

      // Settings Page
      settingsDesc: 'Manage your account preferences and integrations.',
      subTabGeneral: 'General Settings',
      subTabLocations: 'Locations',
      subTabWebhooks: 'Webhooks',
      languagePreference: 'Language Preference',
      selectLanguage: 'Select Application Language',
      english: 'English',
      arabic: 'Arabic (العربية)',
      underDevelopment: 'This module is under development.',

      // Wallet Page
      walletBalance: 'Wallet Balance',
      currentBalance: 'Current Balance',
      availableBalance: 'Available for shipping orders',
      topUpWallet: 'Top Up Wallet',
      transactionHistory: 'Transaction History',
      amount: 'Amount',
      date: 'Date',
      type: 'Type',

      // Courier Rates Page
      courierRatesTitle: 'Courier Rates & Delivery Coverage',
      courierRatesDesc: 'Compare pricing and delivery times across major shipping providers.',
    }
  },
  ar: {
    translation: {
      // Navigation / Sidebar
      dashboard: 'لوحة التحكم',
      shipments: 'الشحنات',
      courierRates: 'أسعار الشحن',
      walletBilling: 'المحفظة والفواتير',
      users: 'المستخدمين',
      settings: 'الإعدادات',
      logout: 'تسجيل الخروج',
      welcome: 'مرحباً',
      admin: 'المشرف',

      // Header / Common
      searchPlaceholder: 'تتبع الشحنة (AWB) أو ابحث عن الطلبات...',
      newShipment: 'شحنة جديدة',
      refreshList: 'تحديث القائمة',
      search: 'بحث',
      retry: 'إعادة المحاولة',
      save: 'حفظ',
      cancel: 'إلغاء',
      edit: 'تعديل',
      delete: 'حذف',
      actions: 'الإجراءات',
      loading: 'جاري التحميل...',

      // Login Page
      welcomeBack: 'مرحباً بعودتك',
      signInDesc: 'قم بتسجيل الدخول لإدارة شحناتك',
      emailAddress: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',
      signIn: 'تسجيل الدخول',
      poweredBy: 'مشغل بواسطة',
      loginFailed: 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.',

      // Dashboard Page / Feature
      overview: 'نظرة عامة',
      dashboardDesc: 'نظرة عامة على الخدمات اللوجستية ورصيد المحفظة.',
      statsOverview: 'الأداء والتحليلات الفورية.',
      totalShipments: 'إجمالي الشحنات',
      inTransit: 'قيد النقل',
      deliveredShipments: 'تم التوصيل',
      pendingShipments: 'قيد الانتظار',
      failedShipments: 'فشلت الشحنة',
      recentShipments: 'الشحنات الأخيرة',
      recentShipmentsDesc: 'نظرة عامة على أحدث أنشطة الشحن.',
      viewAll: 'عرض الكل',
      noShipments: 'لم يتم العثور على شحنات.',
      quickRateCalc: 'حاسبة الأسعار السريعة',
      originCity: 'مدينة المصدر',
      destinationCity: 'مدينة الوجهة',
      weightKg: 'الوزن (كجم)',
      compareRates: 'مقارنة الأسعار',

      // User Page
      userManagement: 'إدارة المستخدمين',
      userManagementDesc: 'إدارة وصول المسؤولين وصلاحيات المشغلين.',
      addNewUser: 'إضافة مستخدم جديد',
      editUser: 'تعديل مستخدم',
      searchUsersPlaceholder: 'البحث عن المستخدمين بالاسم أو البريد الإلكتروني...',
      fullName: 'الاسم الكامل',
      role: 'الدور',
      status: 'الحالة',
      active: 'نشط',
      inactive: 'غير نشط',
      suspended: 'موقوف',
      phone: 'رقم الهاتف',
      deactivate: 'تعطيل',
      activate: 'تفعيل',
      confirmDeleteUser: 'هل أنت متأكد من رغبتك في حذف هذا المستخدم؟',

      // Settings Page
      settingsDesc: 'إدارة تفضيلات حسابك وتكاملات الخدمات.',
      subTabGeneral: 'الإعدادات العامة',
      subTabLocations: 'المواقع والفروع',
      subTabWebhooks: 'روابط الويب (Webhooks)',
      languagePreference: 'تفضيل اللغة',
      selectLanguage: 'اختر لغة التطبيق',
      english: 'English',
      arabic: 'العربية (Arabic)',
      underDevelopment: 'هذه الوحدة قيد التطوير حالياً.',

      // Wallet Page
      walletBalance: 'رصيد المحفظة',
      currentBalance: 'الرصيد الحالي',
      availableBalance: 'متاح لطلبات الشحن',
      topUpWallet: 'شحن رصيد المحفظة',
      transactionHistory: 'سجل المعاملات',
      amount: 'المبلغ',
      date: 'التاريخ',
      type: 'النوع',

      // Courier Rates Page
      courierRatesTitle: 'أسعار شركات الشحن وتغطية التوصيل',
      courierRatesDesc: 'قارن الأسعار وأوقات التوصيل بين مزودي خدمات الشحن الرئيسيين.',
    }
  }
};

export type TranslationKey = keyof typeof resources.en.translation;

const savedLang = localStorage.getItem('waslship_lang');
const initialLanguage = (savedLang === 'ar' || savedLang === 'en') ? savedLang : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safe from XSS
    }
  });

export default i18n;
