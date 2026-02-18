
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Global state for PWA install prompt
declare global {
  interface Window {
    deferredPrompt: any;
  }
}

// Capture the browser's native "install" event
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  window.deferredPrompt = e;
  // Trigger a custom event to notify components that install is available
  window.dispatchEvent(new Event('pwa-installable'));
  console.log('PlusZone: PWA Install prompt captured and ready');
});

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try {
      // Use relative path for registration to handle various hosting environments
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
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
