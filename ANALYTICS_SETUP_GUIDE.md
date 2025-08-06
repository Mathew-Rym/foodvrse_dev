# Analytics Setup Guide for FoodVrse

## 📊 **ANALYTICS OVERVIEW**

This guide covers setting up comprehensive analytics tracking for FoodVrse, including Google Analytics, custom event tracking, and user behavior analysis.

---

## 🔧 **GOOGLE ANALYTICS SETUP**

### **Step 1: Create Google Analytics Account**

1. **Go to Google Analytics:**
   - Visit: https://analytics.google.com/
   - Sign in with your Google account

2. **Create Property:**
   - Click "Start measuring"
   - Account name: "FoodVrse"
   - Property name: "FoodVrse Web App"
   - Reporting time zone: "Africa/Nairobi"
   - Currency: "Kenyan Shilling (KES)"

3. **Get Measurement ID:**
   - Copy your GA4 Measurement ID (format: G-XXXXXXXXXX)
   - This will be used in the configuration

### **Step 2: Configure Google Analytics**

1. **Set up Data Streams:**
   - Web stream: `https://www.foodvrse.com`
   - Development stream: `http://localhost:8080`

2. **Configure Enhanced Measurement:**
   - Page views: ✅ Enabled
   - Scrolls: ✅ Enabled
   - Outbound clicks: ✅ Enabled
   - Site search: ✅ Enabled
   - Video engagement: ✅ Enabled
   - File downloads: ✅ Enabled

3. **Set up Goals/Conversions:**
   - User registration
   - Business signup
   - Order completion
   - Partner application submission

---

## 🚀 **IMPLEMENTATION**

### **Step 1: Update Environment Variables**

Add to your `.env.local`:
```env
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXXX
```

### **Step 2: Update Analytics Configuration**

Update `src/config/api.ts`:
```typescript
export const API_CONFIG = {
  // ... existing config
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '',
  GOOGLE_TAG_MANAGER_ID: import.meta.env.VITE_GOOGLE_TAG_MANAGER_ID || '',
} as const;
```

### **Step 3: Update useUserPreferences Hook**

Replace the placeholder GA4 ID in `src/hooks/useUserPreferences.ts`:
```typescript
// Replace G-XXXXXXXXXX with your actual GA4 ID
script.src = `https://www.googletagmanager.com/gtag/js?id=${API_CONFIG.GOOGLE_ANALYTICS_ID}`;
window.gtag('config', API_CONFIG.GOOGLE_ANALYTICS_ID);
```

---

## 📈 **CUSTOM EVENT TRACKING**

### **User Actions to Track:**

1. **Authentication Events:**
   ```typescript
   // User signup
   gtag('event', 'sign_up', {
     method: 'google_oauth',
     user_type: 'consumer'
   });

   // User login
   gtag('event', 'login', {
     method: 'google_oauth'
   });
   ```

2. **Business Events:**
   ```typescript
   // Business registration
   gtag('event', 'business_signup', {
     business_type: 'restaurant',
     location: 'nairobi'
   });

   // Partner application
   gtag('event', 'partner_application', {
     application_type: 'business_partnership'
   });
   ```

3. **Food Waste Reduction Events:**
   ```typescript
   // Order placed
   gtag('event', 'order_placed', {
     order_value: 1500,
     food_items: 3,
     waste_saved: '2.5kg'
   });

   // Impact milestone
   gtag('event', 'impact_milestone', {
     milestone_type: 'meals_saved',
     milestone_value: 1000
   });
   ```

4. **User Engagement Events:**
   ```typescript
   // Video watched
   gtag('event', 'video_watch', {
     video_title: 'FoodVrse Introduction',
     watch_time: 120
   });

   // Feature usage
   gtag('event', 'feature_used', {
     feature_name: 'location_search',
     user_type: 'business'
   });
   ```

---

## 🎯 **ANALYTICS COMPONENT**

Create `src/components/Analytics.tsx`:
```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { API_CONFIG } from '@/config/api';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const Analytics = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { hasConsent } = useUserPreferences();

  // Track page views
  useEffect(() => {
    if (hasConsent('analytics') && window.gtag) {
      window.gtag('config', API_CONFIG.GOOGLE_ANALYTICS_ID, {
        page_path: location.pathname + location.search,
        user_id: user?.id || 'anonymous'
      });
    }
  }, [location, user, hasConsent]);

  return null;
};
```

---

## 📊 **KEY METRICS TO TRACK**

### **User Acquisition:**
- New user registrations
- Sign-up conversion rate
- Traffic sources (organic, social, direct)
- Geographic distribution

### **User Engagement:**
- Daily/Monthly active users
- Session duration
- Pages per session
- Feature adoption rate

### **Business Metrics:**
- Orders placed
- Revenue generated
- Food waste saved
- Partner applications
- Business signups

### **Impact Metrics:**
- Meals saved
- CO2 emissions reduced
- Money saved by users
- Partner growth

---

## 🔍 **PRIVACY & COMPLIANCE**

### **GDPR Compliance:**
1. **Consent Management:**
   - Only track users who give consent
   - Allow users to withdraw consent
   - Clear privacy policy

2. **Data Minimization:**
   - Only collect necessary data
   - Anonymize user data where possible
   - Respect user preferences

3. **User Rights:**
   - Right to access data
   - Right to delete data
   - Right to export data

### **Cookie Policy:**
- Essential cookies: Always enabled
- Analytics cookies: User consent required
- Marketing cookies: User consent required

---

## 🛠️ **ADVANCED FEATURES**

### **Custom Dimensions:**
```typescript
// User type dimension
gtag('config', GA_ID, {
  custom_map: {
    'custom_dimension1': 'user_type'
  }
});

// Set user type
gtag('set', 'user_type', user?.user_metadata?.user_type || 'consumer');
```

### **E-commerce Tracking:**
```typescript
// Purchase event
gtag('event', 'purchase', {
  transaction_id: order.id,
  value: order.total,
  currency: 'KES',
  items: order.items.map(item => ({
    item_id: item.id,
    item_name: item.name,
    price: item.price,
    quantity: item.quantity
  }))
});
```

### **Conversion Funnels:**
- User registration → Profile completion → First order
- Business signup → Profile verification → First listing
- Partner application → Review → Approval

---

## 📋 **IMPLEMENTATION CHECKLIST**

- [ ] Create Google Analytics account
- [ ] Get GA4 Measurement ID
- [ ] Update environment variables
- [ ] Configure analytics consent
- [ ] Implement custom event tracking
- [ ] Set up conversion goals
- [ ] Test analytics in development
- [ ] Deploy to production
- [ ] Verify data collection
- [ ] Set up custom reports

---

## 🚀 **NEXT STEPS**

1. **Set up Google Analytics account**
2. **Get your GA4 Measurement ID**
3. **Update the configuration files**
4. **Test analytics tracking**
5. **Monitor data collection**
6. **Set up custom reports**

**Analytics will help you understand user behavior and improve the FoodVrse platform!** 📊 