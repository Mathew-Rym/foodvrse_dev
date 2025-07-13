import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        discover: 'Discover',
        cart: 'Cart',
        orders: 'Orders',
        impact: 'Impact',
        profile: 'Profile',
        favorites: 'Favorites',
        help: 'Help',
        logout: 'Logout',
      },

      // Header
      header: {
        aboutFoodWaste: 'About Food Waste',
        dashboard: 'Dashboard',
        profile: 'Profile',
        cart: 'Cart',
        signIn: 'Sign In',
        becomePartner: 'Become a Partner',
      },
      
      // Common
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        remove: 'Remove',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        next: 'Next',
        previous: 'Previous',
        close: 'Close',
        open: 'Open',
        submit: 'Submit',
        reset: 'Reset',
        currency: 'KSh',
        language: 'Language',
        selectLanguage: 'Select Language',
      },
      
      // Hero section
      hero: {
        title: 'Rescue Food, Save Money, Help the Planet',
        subtitle: 'Discover surplus food from local restaurants and stores at amazing prices',
        cta: 'Start Saving Food',
        howItWorks: 'How It Works',
        save_food: 'Save Food',
        save_money: 'Save Money',
        discover_surplus_food: 'Discover surplus food',
        help_reduce_food_waste: 'Help reduce food waste',
        meals_saved: 'Meals Saved',
        co2_saved: 'CO₂ Saved',
        money_saved: 'Money Saved',
        start_saving_food: 'Start Saving Food',
        for_businesses: 'For Businesses',
      },

      // How It Works
      howItWorks: {
        title: 'How FoodVrse Works',
        subtitle: 'Save money, reduce waste, and enjoy great food in 4 simple steps',
        downloadSignUp: 'Download & Sign Up',
        downloadSignUpDesc: 'Get the FoodVrse app and create your account to start saving food and money.',
        browseMysteryBags: 'Browse Mystery Bags',
        browseMysteryBagsDesc: 'Discover surplus food from local restaurants and stores at up to 70% off.',
        orderCollect: 'Order & Collect',
        orderCollectDesc: 'Choose your mystery bag, pay through the app, and collect during pickup hours.',
        enjoyImpact: 'Enjoy & Impact',
        enjoyImpactDesc: 'Enjoy delicious meals while reducing food waste and tracking your positive impact.',
      },
      
      // Auth
      auth: {
        signIn: 'Sign In',
        signUp: 'Sign Up',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        forgotPassword: 'Forgot Password?',
        createAccount: 'Create Account',
        alreadyHaveAccount: 'Already have an account?',
        dontHaveAccount: 'Don\'t have an account?',
        signInWithGoogle: 'Sign in with Google',
        signUpWithGoogle: 'Sign up with Google',
      },
      
      // Food items
      food: {
        mysteryBox: 'Mystery Box',
        pickup: 'Pickup',
        delivery: 'Delivery',
        expires: 'Expires',
        available: 'Available',
        sold: 'Sold',
        rating: 'Rating',
        reviews: 'Reviews',
        addToCart: 'Add to Cart',
        outOfStock: 'Out of Stock',
        pickupTime: 'Pickup Time',
        description: 'Description',
        ingredients: 'Ingredients',
        allergens: 'Allergens',
      },
      
      // Impact
      impact: {
        title: 'Your Impact',
        mealsRescued: 'Meals Rescued',
        moneySaved: 'Money Saved',
        co2Reduced: 'CO₂ Reduced',
        wasteReduced: 'Waste Reduced',
        totalImpact: 'Total Impact',
        thisMonth: 'This Month',
        allTime: 'All Time',
        kg: 'kg',
        tons: 'tons',
      },
      
      // Cart
      cart: {
        title: 'Your Cart',
        empty: 'Your cart is empty',
        total: 'Total',
        subtotal: 'Subtotal',
        tax: 'Tax',
        delivery: 'Delivery',
        checkout: 'Checkout',
        quantity: 'Quantity',
        item: 'Item',
        items: 'Items',
      },
      
      // Orders
      orders: {
        title: 'Your Orders',
        recent: 'Recent Orders',
        pending: 'Pending',
        confirmed: 'Confirmed',
        ready: 'Ready for Pickup',
        completed: 'Completed',
        cancelled: 'Cancelled',
        orderNumber: 'Order #',
        orderDate: 'Order Date',
        pickupTime: 'Pickup Time',
        total: 'Total',
        status: 'Status',
        details: 'Details',
        reorder: 'Reorder',
        trackOrder: 'Track Order',
      },
      
      // Profile
      profile: {
        title: 'Profile',
        personalInfo: 'Personal Information',
        firstName: 'First Name',
        lastName: 'Last Name',
        phone: 'Phone',
        address: 'Address',
        notifications: 'Notifications',
        preferences: 'Preferences',
        paymentMethods: 'Payment Methods',
        orderHistory: 'Order History',
        settings: 'Settings',
        editProfile: 'Edit Profile',
        changePassword: 'Change Password',
        deleteAccount: 'Delete Account',
      },
      
      // Footer
      footer: {
        about: 'About',
        ourStory: 'Our Story',
        ourImpact: 'Our Impact',
        careers: 'Careers',
        press: 'Press',
        support: 'Support',
        helpCenter: 'Help Center',
        contactUs: 'Contact Us',
        safety: 'Safety',
        community: 'Community',
        legal: 'Legal',
        termsOfService: 'Terms of Service',
        privacyPolicy: 'Privacy Policy',
        cookiePolicy: 'Cookie Policy',
        followUs: 'Follow Us',
        allRightsReserved: 'All rights reserved',
      },
      
      // Notifications
      notifications: {
        orderConfirmed: 'Order confirmed successfully',
        orderCancelled: 'Order cancelled',
        addedToCart: 'Added to cart',
        removedFromCart: 'Removed from cart',
        profileUpdated: 'Profile updated successfully',
        passwordChanged: 'Password changed successfully',
        error: 'Something went wrong',
        networkError: 'Network error. Please try again.',
        permissionDenied: 'Permission denied',
        locationRequired: 'Location access required',
      },
      
      // Placeholders
      placeholders: {
        searchRestaurants: 'Search restaurants or food items...',
        enterEmail: 'Enter your email',
        enterPassword: 'Enter your password',
        enterPhone: 'Enter your phone number',
        enterAddress: 'Enter your address',
        writeReview: 'Write a review...',
        additionalNotes: 'Additional notes...',
      },
      
      // Time & Date
      time: {
        now: 'Now',
        today: 'Today',
        tomorrow: 'Tomorrow',
        yesterday: 'Yesterday',
        thisWeek: 'This Week',
        lastWeek: 'Last Week',
        minutes: 'minutes',
        hours: 'hours',
        days: 'days',
        weeks: 'weeks',
        months: 'months',
        min: 'min',
        hr: 'hr',
        am: 'AM',
        pm: 'PM',
      },
    },
  },
  
  sw: {
    translation: {
      // Navigation
      nav: {
        home: 'Nyumbani',
        discover: 'Gundua',
        cart: 'Kikapu',
        orders: 'Maagizo',
        impact: 'Athari',
        profile: 'Wasifu',
        favorites: 'Vipendwa',
        help: 'Msaada',
        logout: 'Ondoka',
      },

      // Header
      header: {
        aboutFoodWaste: 'Kuhusu Upotevu wa Chakula',
        dashboard: 'Dashibodi',
        profile: 'Wasifu',
        cart: 'Kikapu',
        signIn: 'Ingia',
        becomePartner: 'Kuwa Mshirika',
      },
      
      // Common
      common: {
        loading: 'Inapakia...',
        error: 'Hitilafu',
        success: 'Imefanikiwa',
        cancel: 'Ghairi',
        confirm: 'Thibitisha',
        save: 'Hifadhi',
        delete: 'Futa',
        edit: 'Hariri',
        add: 'Ongeza',
        remove: 'Ondoa',
        search: 'Tafuta',
        filter: 'Chuja',
        sort: 'Panga',
        next: 'Ifuatayo',
        previous: 'Iliyotangulia',
        close: 'Funga',
        open: 'Fungua',
        submit: 'Wasilisha',
        reset: 'Weka upya',
        currency: 'KSh',
        language: 'Lugha',
        selectLanguage: 'Chagua Lugha',
      },
      
      // Hero section
      hero: {
        title: 'Okoa Chakula, Okoa Pesa, Saidia Mazingira',
        subtitle: 'Gundua chakula cha ziada kutoka kwa migahawa na maduka kwa bei nzuri',
        cta: 'Anza Kuokoa Chakula',
        howItWorks: 'Jinsi Inavyofanya Kazi',
        save_food: 'Okoa Chakula',
        save_money: 'Okoa Pesa',
        discover_surplus_food: 'Gundua chakula cha ziada',
        help_reduce_food_waste: 'Saidia kupunguza upotevu wa chakula',
        meals_saved: 'Milo Iliyookolewa',
        co2_saved: 'CO₂ Iliyookolewa',
        money_saved: 'Pesa Zilizookolewa',
        start_saving_food: 'Anza Kuokoa Chakula',
        for_businesses: 'Kwa Biashara',
      },

      // How It Works
      howItWorks: {
        title: 'Jinsi FoodVrse Inavyofanya Kazi',
        subtitle: 'Okoa pesa, punguza upotevu, na furahia chakula kizuri kwa hatua 4 rahisi',
        downloadSignUp: 'Pakua na Jiunge',
        downloadSignUpDesc: 'Pata programu ya FoodVrse na fungua akaunti yako ili kuanza kuokoa chakula na pesa.',
        browseMysteryBags: 'Angalia Mifuko ya Mafumbo',
        browseMysteryBagsDesc: 'Gundua chakula cha ziada kutoka kwa migahawa na maduka kwa punguzo la hadi 70%.',
        orderCollect: 'Agiza na Kuchukua',
        orderCollectDesc: 'Chagua mfuko wako wa mafumbo, lipa kupitia programu, na kuchukua wakati wa masaa ya kuchukua.',
        enjoyImpact: 'Furahia na Athari',
        enjoyImpactDesc: 'Furahia chakula kitamu huku ukipunguza upotevu wa chakula na kufuatilia athari yako nzuri.',
      },
      
      // Auth
      auth: {
        signIn: 'Ingia',
        signUp: 'Jiunge',
        email: 'Barua pepe',
        password: 'Nenosiri',
        confirmPassword: 'Thibitisha Nenosiri',
        forgotPassword: 'Umesahau Nenosiri?',
        createAccount: 'Fungua Akaunti',
        alreadyHaveAccount: 'Tayari una akaunti?',
        dontHaveAccount: 'Huna akaunti?',
        signInWithGoogle: 'Ingia kwa Google',
        signUpWithGoogle: 'Jiunge kwa Google',
      },
      
      // Food items
      food: {
        mysteryBox: 'Sanduku la Mafumbo',
        pickup: 'Kuchukua',
        delivery: 'Kutuma',
        expires: 'Inaisha',
        available: 'Inapatikana',
        sold: 'Imeuzwa',
        rating: 'Ukadiriaji',
        reviews: 'Maoni',
        addToCart: 'Ongeza kwenye Kikapu',
        outOfStock: 'Haipatikani',
        pickupTime: 'Wakati wa Kuchukua',
        description: 'Maelezo',
        ingredients: 'Viungo',
        allergens: 'Vielelezo',
      },
      
      // Impact
      impact: {
        title: 'Athari Zako',
        mealsRescued: 'Milo Iliyookolewa',
        moneySaved: 'Pesa Zilizookolewa',
        co2Reduced: 'CO₂ Iliyopunguzwa',
        wasteReduced: 'Taka Zilizopunguzwa',
        totalImpact: 'Jumla ya Athari',
        thisMonth: 'Mwezi Huu',
        allTime: 'Wakati Wote',
        kg: 'kg',
        tons: 'tani',
      },
      
      // Cart
      cart: {
        title: 'Kikapu Chako',
        empty: 'Kikapu chako ni tupu',
        total: 'Jumla',
        subtotal: 'Kiasi',
        tax: 'Kodi',
        delivery: 'Kutuma',
        checkout: 'Maliza Ununuzi',
        quantity: 'Kiasi',
        item: 'Kitu',
        items: 'Vitu',
      },
      
      // Orders
      orders: {
        title: 'Maagizo Yako',
        recent: 'Maagizo ya Karibuni',
        pending: 'Inasubiri',
        confirmed: 'Imethibitishwa',
        ready: 'Tayari kwa Kuchukua',
        completed: 'Imekamilika',
        cancelled: 'Imeghairiwa',
        orderNumber: 'Agizo #',
        orderDate: 'Tarehe ya Agizo',
        pickupTime: 'Wakati wa Kuchukua',
        total: 'Jumla',
        status: 'Hali',
        details: 'Maelezo',
        reorder: 'Agiza Tena',
        trackOrder: 'Fuatilia Agizo',
      },
      
      // Profile
      profile: {
        title: 'Wasifu',
        personalInfo: 'Maelezo ya Kibinafsi',
        firstName: 'Jina la Kwanza',
        lastName: 'Jina la Ukoo',
        phone: 'Simu',
        address: 'Anwani',
        notifications: 'Arifa',
        preferences: 'Mapendeleo',
        paymentMethods: 'Njia za Malipo',
        orderHistory: 'Historia ya Maagizo',
        settings: 'Mipangilio',
        editProfile: 'Hariri Wasifu',
        changePassword: 'Badili Nenosiri',
        deleteAccount: 'Futa Akaunti',
      },
      
      // Footer
      footer: {
        about: 'Kuhusu',
        ourStory: 'Hadithi Yetu',
        ourImpact: 'Athari Zetu',
        careers: 'Kazi',
        press: 'Vyombo vya Habari',
        support: 'Msaada',
        helpCenter: 'Kituo cha Msaada',
        contactUs: 'Wasiliana Nasi',
        safety: 'Usalama',
        community: 'Jamii',
        legal: 'Kisheria',
        termsOfService: 'Masharti ya Huduma',
        privacyPolicy: 'Sera ya Faragha',
        cookiePolicy: 'Sera ya Vidakuzi',
        followUs: 'Tufuate',
        allRightsReserved: 'Haki zote zimehifadhiwa',
      },
      
      // Notifications
      notifications: {
        orderConfirmed: 'Agizo limethibitishwa kwa mafanikio',
        orderCancelled: 'Agizo limeghairiwa',
        addedToCart: 'Imeongezwa kwenye kikapu',
        removedFromCart: 'Imeondolewa kwenye kikapu',
        profileUpdated: 'Wasifu umesasishwa kwa mafanikio',
        passwordChanged: 'Nenosiri limebadilishwa kwa mafanikio',
        error: 'Kuna tatizo lililotokea',
        networkError: 'Hitilafu ya mtandao. Tafadhali jaribu tena.',
        permissionDenied: 'Ruhusa imekatazwa',
        locationRequired: 'Ufikiaji wa eneo unahitajika',
      },
      
      // Placeholders
      placeholders: {
        searchRestaurants: 'Tafuta migahawa au vyakula...',
        enterEmail: 'Weka barua pepe yako',
        enterPassword: 'Weka nenosiri lako',
        enterPhone: 'Weka nambari ya simu yako',
        enterAddress: 'Weka anwani yako',
        writeReview: 'Andika maoni...',
        additionalNotes: 'Maelezo ya ziada...',
      },
      
      // Time & Date
      time: {
        now: 'Sasa',
        today: 'Leo',
        tomorrow: 'Kesho',
        yesterday: 'Jana',
        thisWeek: 'Wiki Hii',
        lastWeek: 'Wiki Iliyopita',
        minutes: 'dakika',
        hours: 'masaa',
        days: 'siku',
        weeks: 'wiki',
        months: 'miezi',
        min: 'dak',
        hr: 'saa',
        am: 'AM',
        pm: 'PM',
      },
    },
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;