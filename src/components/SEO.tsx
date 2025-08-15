import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = 'FoodVrse - Rescue Meals',
  description = 'Good food deserves a second chance - Save food, save money, save the planet. Join FoodVrse to reduce food waste and enjoy delicious meals at great prices.',
  canonical,
  ogImage = 'https://www.foodvrse.com/logo.png',
  ogType = 'website',
  structuredData,
  noindex = false
}) => {
  const fullTitle = title === 'FoodVrse - Rescue Meals' ? title : `${title} | FoodVrse`;
  const canonicalUrl = canonical || window.location.href;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="FoodVrse" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@foodvrse" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="FoodVrse" />
      <meta name="keywords" content="food waste, rescue meals, sustainable food, mystery bags, food app, save money, reduce waste, food sustainability" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Default Structured Data for FoodVrse */}
      {!structuredData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "FoodVrse",
            "url": "https://www.foodvrse.com",
            "logo": "https://www.foodvrse.com/logo.png",
            "description": "Good food deserves a second chance - Save food, save money, save the planet",
            "sameAs": [
              "https://www.facebook.com/profile.php?id=61554934846539",
              "https://twitter.com/foodvrse",
              "https://www.instagram.com/foodvrse/",
              "https://www.linkedin.com/company/foodvrse/",
              "https://www.tiktok.com/@foodvrse"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": "support@foodvrse.com"
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "KE",
              "addressLocality": "Nairobi"
            }
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO; 