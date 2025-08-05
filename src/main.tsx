import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeBrowserCompatibility } from './utils/browserCompatibility'
import { initializeSmallScreenOptimization } from './utils/smallScreenOptimization'
import { initializeCertificateMonitoring } from './config/certificates'

// Initialize browser compatibility before rendering
initializeBrowserCompatibility();

// Initialize small screen optimization
initializeSmallScreenOptimization();

// Initialize certificate monitoring
initializeCertificateMonitoring();

createRoot(document.getElementById("root")!).render(<App />);
