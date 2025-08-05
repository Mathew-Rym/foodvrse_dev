import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeBrowserCompatibility } from './utils/browserCompatibility'
import { initializeSmallScreenOptimization } from './utils/smallScreenOptimization'

// Initialize browser compatibility before rendering
initializeBrowserCompatibility();

// Initialize small screen optimization
initializeSmallScreenOptimization();

createRoot(document.getElementById("root")!).render(<App />);
