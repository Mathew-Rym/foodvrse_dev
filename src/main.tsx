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

// Fallback component in case the main app fails to load
const FallbackApp = () => (
  <div style={{
    padding: '20px',
    textAlign: 'center',
    fontFamily: 'system-ui, sans-serif',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa'
  }}>
    <h1 style={{ color: '#3D6C56', marginBottom: '20px' }}>FoodVrse</h1>
    <p style={{ marginBottom: '20px' }}>Loading your sustainable food experience...</p>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #E2F1E0',
      borderTop: '4px solid #3D6C56',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Get the root element
const rootElement = document.getElementById("root");

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    
    // Wrap the app in a try-catch to handle any initialization errors
    try {
      root.render(<App />);
    } catch (error) {
      console.error('Failed to render main app:', error);
      root.render(<FallbackApp />);
    }
  } catch (error) {
    console.error('Failed to create root:', error);
    // Fallback to basic rendering
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: system-ui, sans-serif;">
          <h1 style="color: #3D6C56;">FoodVrse</h1>
          <p>Please refresh the page or try again later.</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; background-color: #3D6C56; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      `;
    }
  }
} else {
  console.error('Root element not found');
}
