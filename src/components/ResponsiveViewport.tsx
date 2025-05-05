import React, { useEffect } from 'react';

/**
 * ResponsiveViewport component ensures proper viewport settings for all devices
 * This helps prevent issues with popups and modals being cut off on various screen sizes
 */
const ResponsiveViewport: React.FC = () => {
  useEffect(() => {
    // Function to update viewport meta tag
    const updateViewportMeta = () => {
      // Find existing viewport meta tag or create a new one
      let viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        document.head.appendChild(viewportMeta);
      }

      // Set viewport content with proper settings for mobile devices
      viewportMeta.content = 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    };

    // Update viewport meta on mount
    updateViewportMeta();

    // Add event listener for orientation changes
    window.addEventListener('orientationchange', updateViewportMeta);

    // Cleanup
    return () => {
      window.removeEventListener('orientationchange', updateViewportMeta);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default ResponsiveViewport;
