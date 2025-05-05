
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { Toaster } from 'sonner';

// Make sure we have a valid DOM element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

// Create root with explicit React import
const root = createRoot(rootElement);

// Render with React.StrictMode
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
      <Toaster position="top-center" />
    </HashRouter>
  </React.StrictMode>
);
