
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Global state for PWA install prompt
declare global {
  interface Window {
    deferredPrompt: any;
    process: {
      env: {
        API_KEY?: string;
        [key: string]: any;
      };
    };
  }
}

// Ensure process is available
window.process = window.process || { env: {} };

// Capture the browser's native "install" event
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  window.dispatchEvent(new Event('pwa-installable'));
  console.log('PlusZone: PWA Install prompt captured and ready');
});

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try {
      const swUrl = './sw.js';
      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('PlusZone ServiceWorker registered with scope: ', registration.scope);
        })
        .catch(error => {
          console.info('Service Worker registration skipped or restricted:', error.message);
        });
    } catch (e) {
      console.info('Service Worker initialization failed:', e);
    }
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
