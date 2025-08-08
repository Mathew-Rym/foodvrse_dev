
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.foodvrse.app',
  appName: 'FoodVrse',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://www.foodvrse.com',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#3D6C56",
      showSpinner: false
    }
  }
};

export default config;
