# FoodVrse - Rescue Meals

**Good food deserves a second chance - Save food, save money, save the planet**

## About FoodVrse

FoodVrse is a platform that connects consumers with local businesses to rescue surplus food, reducing waste and saving money. Our mission is to create a sustainable food ecosystem where good food gets a second chance.

## Features

- **Food Rescue**: Connect with local businesses to save surplus food
- **Location-Based Search**: Find food deals near you
- **Business Dashboard**: For restaurants and food businesses to list items
- **Impact Tracking**: Monitor your environmental and financial impact
- **Real-time Notifications**: Stay updated on new deals
- **Mobile Optimized**: Works perfectly on all devices

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Deployment**: Vercel
- **Maps**: Google Maps Platform
- **Authentication**: Google OAuth + Email
- **Notifications**: OneSignal

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Cloud Platform account (for Maps and OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mathew-Rym/foodvrse_dev.git
   cd foodvrse_dev
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_KEY=your_supabase_anon_key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
   VITE_GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id
   VITE_ONESIGNAL_APP_ID=your_onesignal_app_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Deployment

### Vercel Deployment

The app is automatically deployed to Vercel from the main branch. Any push to main will trigger a new deployment.

### Supabase Setup

1. Create a new Supabase project
2. Run the database migrations in `supabase/migrations/`
3. Configure Google OAuth in Supabase dashboard
4. Set up Row Level Security (RLS) policies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support, email: hello@foodvrse.com
