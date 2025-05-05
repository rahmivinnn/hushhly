
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { Toaster } from 'sonner';

// Error boundary for debugging
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '5px',
          margin: '20px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Show Error Details</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            <br />
            <strong>Stack Trace:</strong>
            <br />
            {this.state.error && this.state.error.stack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Make sure we have a valid DOM element
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Failed to find the root element");
  document.body.innerHTML = '<div style="color: red; padding: 20px;">Failed to find the root element</div>';
} else {
  try {
    // Create root with explicit React import
    const root = createRoot(rootElement);

    // Render with React.StrictMode and ErrorBoundary
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <BrowserRouter>
            <App />
            <Toaster position="top-center" />
          </BrowserRouter>
        </ErrorBoundary>
      </React.StrictMode>
    );

    console.log("React app successfully rendered");
  } catch (error) {
    console.error("Error rendering React app:", error);
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="color: red; padding: 20px;">
          <h2>Error rendering React app</h2>
          <pre>${error instanceof Error ? error.message : String(error)}</pre>
        </div>
      `;
    }
  }
}
