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
  
  // Chinese (Simplified)
  zh: {
    translation: {
      nav: {
        home: '首页',
        discover: '发现',
        cart: '购物车',
        orders: '订单',
        impact: '影响',
        profile: '个人资料',
        favorites: '收藏',
        help: '帮助',
        logout: '退出',
      },
      header: {
        aboutFoodWaste: '关于食物浪费',
        dashboard: '仪表板',
        profile: '个人资料',
        cart: '购物车',
        signIn: '登录',
        becomePartner: '成为合作伙伴',
      },
      common: {
        loading: '加载中...',
        error: '错误',
        success: '成功',
        cancel: '取消',
        confirm: '确认',
        save: '保存',
        currency: 'KSh',
        language: '语言',
        selectLanguage: '选择语言',
      },
      hero: {
        title: '拯救食物，省钱，帮助地球',
        subtitle: '以惊人的价格发现当地餐厅和商店的剩余食物',
        start_saving_food: '开始拯救食物',
        for_businesses: '为企业',
      },
    },
  },
  
  // Spanish
  es: {
    translation: {
      nav: {
        home: 'Inicio',
        discover: 'Descubrir',
        cart: 'Carrito',
        orders: 'Pedidos',
        impact: 'Impacto',
        profile: 'Perfil',
        favorites: 'Favoritos',
        help: 'Ayuda',
        logout: 'Cerrar sesión',
      },
      header: {
        aboutFoodWaste: 'Sobre el Desperdicio de Alimentos',
        dashboard: 'Panel',
        profile: 'Perfil',
        cart: 'Carrito',
        signIn: 'Iniciar sesión',
        becomePartner: 'Convertirse en socio',
      },
      common: {
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        save: 'Guardar',
        currency: 'KSh',
        language: 'Idioma',
        selectLanguage: 'Seleccionar idioma',
      },
      hero: {
        title: 'Rescata comida, ahorra dinero, ayuda al planeta',
        subtitle: 'Descubre comida sobrante de restaurantes y tiendas locales a precios increíbles',
        start_saving_food: 'Empezar a ahorrar comida',
        for_businesses: 'Para empresas',
      },
    },
  },
  
  // Hindi
  hi: {
    translation: {
      nav: {
        home: 'घर',
        discover: 'खोजें',
        cart: 'कार्ट',
        orders: 'ऑर्डर',
        impact: 'प्रभाव',
        profile: 'प्रोफ़ाइल',
        favorites: 'पसंदीदा',
        help: 'सहायता',
        logout: 'लॉगआउट',
      },
      header: {
        aboutFoodWaste: 'खाद्य अपशिष्ट के बारे में',
        dashboard: 'डैशबोर्ड',
        profile: 'प्रोफ़ाइल',
        cart: 'कार्ट',
        signIn: 'साइन इन',
        becomePartner: 'साझेदार बनें',
      },
      common: {
        loading: 'लोड हो रहा है...',
        error: 'त्रुटि',
        success: 'सफलता',
        cancel: 'रद्द करें',
        confirm: 'पुष्टि करें',
        save: 'सहेजें',
        currency: 'KSh',
        language: 'भाषा',
        selectLanguage: 'भाषा चुनें',
      },
      hero: {
        title: 'भोजन बचाएं, पैसे बचाएं, ग्रह की मदद करें',
        subtitle: 'स्थानीय रेस्तरां और स्टोर से अतिरिक्त भोजन को अद्भुत कीमतों पर खोजें',
        start_saving_food: 'भोजन बचाना शुरू करें',
        for_businesses: 'व्यवसायों के लिए',
      },
    },
  },
  
  // Arabic
  ar: {
    translation: {
      nav: {
        home: 'الرئيسية',
        discover: 'اكتشف',
        cart: 'السلة',
        orders: 'الطلبات',
        impact: 'التأثير',
        profile: 'الملف الشخصي',
        favorites: 'المفضلة',
        help: 'مساعدة',
        logout: 'تسجيل الخروج',
      },
      header: {
        aboutFoodWaste: 'عن هدر الطعام',
        dashboard: 'لوحة التحكم',
        profile: 'الملف الشخصي',
        cart: 'السلة',
        signIn: 'تسجيل الدخول',
        becomePartner: 'كن شريكاً',
      },
      common: {
        loading: 'جاري التحميل...',
        error: 'خطأ',
        success: 'نجح',
        cancel: 'إلغاء',
        confirm: 'تأكيد',
        save: 'حفظ',
        currency: 'KSh',
        language: 'اللغة',
        selectLanguage: 'اختر اللغة',
      },
      hero: {
        title: 'أنقذ الطعام، وفر المال، ساعد الكوكب',
        subtitle: 'اكتشف الطعام الفائض من المطاعم والمتاجر المحلية بأسعار مذهلة',
        start_saving_food: 'ابدأ في توفير الطعام',
        for_businesses: 'للشركات',
      },
    },
  },
  
  // French
  fr: {
    translation: {
      nav: {
        home: 'Accueil',
        discover: 'Découvrir',
        cart: 'Panier',
        orders: 'Commandes',
        impact: 'Impact',
        profile: 'Profil',
        favorites: 'Favoris',
        help: 'Aide',
        logout: 'Déconnexion',
      },
      header: {
        aboutFoodWaste: 'À propos du gaspillage alimentaire',
        dashboard: 'Tableau de bord',
        profile: 'Profil',
        cart: 'Panier',
        signIn: 'Se connecter',
        becomePartner: 'Devenir partenaire',
      },
      common: {
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        cancel: 'Annuler',
        confirm: 'Confirmer',
        save: 'Sauvegarder',
        currency: 'KSh',
        language: 'Langue',
        selectLanguage: 'Sélectionner la langue',
      },
      hero: {
        title: 'Sauvez la nourriture, économisez de l\'argent, aidez la planète',
        subtitle: 'Découvrez les surplus alimentaires des restaurants et magasins locaux à des prix incroyables',
        start_saving_food: 'Commencer à sauver la nourriture',
        for_businesses: 'Pour les entreprises',
      },
    },
  },
  
  // Russian
  ru: {
    translation: {
      nav: {
        home: 'Главная',
        discover: 'Обнаружить',
        cart: 'Корзина',
        orders: 'Заказы',
        impact: 'Влияние',
        profile: 'Профиль',
        favorites: 'Избранное',
        help: 'Помощь',
        logout: 'Выйти',
      },
      header: {
        aboutFoodWaste: 'О пищевых отходах',
        dashboard: 'Панель управления',
        profile: 'Профиль',
        cart: 'Корзина',
        signIn: 'Войти',
        becomePartner: 'Стать партнером',
      },
      common: {
        loading: 'Загрузка...',
        error: 'Ошибка',
        success: 'Успех',
        cancel: 'Отмена',
        confirm: 'Подтвердить',
        save: 'Сохранить',
        currency: 'KSh',
        language: 'Язык',
        selectLanguage: 'Выбрать язык',
      },
      hero: {
        title: 'Спасите еду, сэкономьте деньги, помогите планете',
        subtitle: 'Откройте для себя излишки еды из местных ресторанов и магазинов по невероятным ценам',
        start_saving_food: 'Начать экономить еду',
        for_businesses: 'Для бизнеса',
      },
    },
  },
  
  // Portuguese
  pt: {
    translation: {
      nav: {
        home: 'Início',
        discover: 'Descobrir',
        cart: 'Carrinho',
        orders: 'Pedidos',
        impact: 'Impacto',
        profile: 'Perfil',
        favorites: 'Favoritos',
        help: 'Ajuda',
        logout: 'Sair',
      },
      header: {
        aboutFoodWaste: 'Sobre o Desperdício de Alimentos',
        dashboard: 'Painel',
        profile: 'Perfil',
        cart: 'Carrinho',
        signIn: 'Entrar',
        becomePartner: 'Tornar-se parceiro',
      },
      common: {
        loading: 'Carregando...',
        error: 'Erro',
        success: 'Sucesso',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        save: 'Salvar',
        currency: 'KSh',
        language: 'Idioma',
        selectLanguage: 'Selecionar idioma',
      },
      hero: {
        title: 'Salve comida, economize dinheiro, ajude o planeta',
        subtitle: 'Descubra comida excedente de restaurantes e lojas locais a preços incríveis',
        start_saving_food: 'Começar a salvar comida',
        for_businesses: 'Para empresas',
      },
    },
  },
  
  // German
  de: {
    translation: {
      nav: {
        home: 'Startseite',
        discover: 'Entdecken',
        cart: 'Warenkorb',
        orders: 'Bestellungen',
        impact: 'Auswirkung',
        profile: 'Profil',
        favorites: 'Favoriten',
        help: 'Hilfe',
        logout: 'Abmelden',
      },
      header: {
        aboutFoodWaste: 'Über Lebensmittelverschwendung',
        dashboard: 'Dashboard',
        profile: 'Profil',
        cart: 'Warenkorb',
        signIn: 'Anmelden',
        becomePartner: 'Partner werden',
      },
      common: {
        loading: 'Laden...',
        error: 'Fehler',
        success: 'Erfolg',
        cancel: 'Abbrechen',
        confirm: 'Bestätigen',
        save: 'Speichern',
        currency: 'KSh',
        language: 'Sprache',
        selectLanguage: 'Sprache auswählen',
      },
      hero: {
        title: 'Rette Essen, spare Geld, hilf dem Planeten',
        subtitle: 'Entdecke überschüssige Lebensmittel von lokalen Restaurants und Geschäften zu erstaunlichen Preisen',
        start_saving_food: 'Beginne Essen zu retten',
        for_businesses: 'Für Unternehmen',
      },
    },
  },
  
  // Japanese
  ja: {
    translation: {
      nav: {
        home: 'ホーム',
        discover: '発見',
        cart: 'カート',
        orders: '注文',
        impact: '影響',
        profile: 'プロフィール',
        favorites: 'お気に入り',
        help: 'ヘルプ',
        logout: 'ログアウト',
      },
      header: {
        aboutFoodWaste: '食品廃棄について',
        dashboard: 'ダッシュボード',
        profile: 'プロフィール',
        cart: 'カート',
        signIn: 'サインイン',
        becomePartner: 'パートナーになる',
      },
      common: {
        loading: '読み込み中...',
        error: 'エラー',
        success: '成功',
        cancel: 'キャンセル',
        confirm: '確認',
        save: '保存',
        currency: 'KSh',
        language: '言語',
        selectLanguage: '言語を選択',
      },
      hero: {
        title: '食べ物を救い、お金を節約し、地球を助けよう',
        subtitle: '地元のレストランや店舗の余剰食品を驚くべき価格で発見',
        start_saving_food: '食べ物を救い始める',
        for_businesses: '企業向け',
      },
    },
  },
  
  // Korean
  ko: {
    translation: {
      nav: {
        home: '홈',
        discover: '발견',
        cart: '장바구니',
        orders: '주문',
        impact: '영향',
        profile: '프로필',
        favorites: '즐겨찾기',
        help: '도움말',
        logout: '로그아웃',
      },
      header: {
        aboutFoodWaste: '음식 낭비에 대해',
        dashboard: '대시보드',
        profile: '프로필',
        cart: '장바구니',
        signIn: '로그인',
        becomePartner: '파트너 되기',
      },
      common: {
        loading: '로딩 중...',
        error: '오류',
        success: '성공',
        cancel: '취소',
        confirm: '확인',
        save: '저장',
        currency: 'KSh',
        language: '언어',
        selectLanguage: '언어 선택',
      },
      hero: {
        title: '음식을 구하고, 돈을 절약하고, 지구를 도우세요',
        subtitle: '놀라운 가격으로 지역 레스토랑과 상점의 여분 음식을 발견하세요',
        start_saving_food: '음식 절약 시작하기',
        for_businesses: '기업용',
      },
    },
  },
  
  // Italian
  it: {
    translation: {
      nav: {
        home: 'Home',
        discover: 'Scopri',
        cart: 'Carrello',
        orders: 'Ordini',
        impact: 'Impatto',
        profile: 'Profilo',
        favorites: 'Preferiti',
        help: 'Aiuto',
        logout: 'Esci',
      },
      header: {
        aboutFoodWaste: 'Sui Rifiuti Alimentari',
        dashboard: 'Cruscotto',
        profile: 'Profilo',
        cart: 'Carrello',
        signIn: 'Accedi',
        becomePartner: 'Diventa partner',
      },
      common: {
        loading: 'Caricamento...',
        error: 'Errore',
        success: 'Successo',
        cancel: 'Annulla',
        confirm: 'Conferma',
        save: 'Salva',
        currency: 'KSh',
        language: 'Lingua',
        selectLanguage: 'Seleziona lingua',
      },
      hero: {
        title: 'Salva il cibo, risparmia denaro, aiuta il pianeta',
        subtitle: 'Scopri il cibo in eccesso dai ristoranti e negozi locali a prezzi incredibili',
        start_saving_food: 'Inizia a salvare il cibo',
        for_businesses: 'Per le aziende',
      },
    },
  },
  
  // Turkish
  tr: {
    translation: {
      nav: {
        home: 'Ana Sayfa',
        discover: 'Keşfet',
        cart: 'Sepet',
        orders: 'Siparişler',
        impact: 'Etki',
        profile: 'Profil',
        favorites: 'Favoriler',
        help: 'Yardım',
        logout: 'Çıkış',
      },
      header: {
        aboutFoodWaste: 'Gıda İsrafı Hakkında',
        dashboard: 'Pano',
        profile: 'Profil',
        cart: 'Sepet',
        signIn: 'Giriş Yap',
        becomePartner: 'Ortak Ol',
      },
      common: {
        loading: 'Yükleniyor...',
        error: 'Hata',
        success: 'Başarı',
        cancel: 'İptal',
        confirm: 'Onayla',
        save: 'Kaydet',
        currency: 'KSh',
        language: 'Dil',
        selectLanguage: 'Dil Seç',
      },
      hero: {
        title: 'Yemeği kurtar, para biriktir, gezegene yardım et',
        subtitle: 'Yerel restoranlardan ve mağazalardan şaşırtıcı fiyatlarla artık yiyecekleri keşfedin',
        start_saving_food: 'Yemek kaydetmeye başla',
        for_businesses: 'İşletmeler için',
      },
    },
  },
  
  // Dutch
  nl: {
    translation: {
      nav: {
        home: 'Thuis',
        discover: 'Ontdekken',
        cart: 'Winkelwagen',
        orders: 'Bestellingen',
        impact: 'Impact',
        profile: 'Profiel',
        favorites: 'Favorieten',
        help: 'Hulp',
        logout: 'Uitloggen',
      },
      header: {
        aboutFoodWaste: 'Over Voedselverspilling',
        dashboard: 'Dashboard',
        profile: 'Profiel',
        cart: 'Winkelwagen',
        signIn: 'Inloggen',
        becomePartner: 'Word partner',
      },
      common: {
        loading: 'Laden...',
        error: 'Fout',
        success: 'Succes',
        cancel: 'Annuleren',
        confirm: 'Bevestigen',
        save: 'Opslaan',
        currency: 'KSh',
        language: 'Taal',
        selectLanguage: 'Taal selecteren',
      },
      hero: {
        title: 'Red voedsel, bespaar geld, help de planeet',
        subtitle: 'Ontdek overtollig voedsel van lokale restaurants en winkels tegen geweldige prijzen',
        start_saving_food: 'Begin met voedsel redden',
        for_businesses: 'Voor bedrijven',
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