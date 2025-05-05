import React, { useEffect, useRef } from 'react';

interface ResponsiveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  children: React.ReactNode;
  type?: 'subscription' | 'payment' | 'default';
}

/**
 * ResponsiveDialog component ensures popups are properly sized and positioned
 * on all device sizes, especially for subscription and payment dialogs
 */
const ResponsiveDialog: React.FC<ResponsiveDialogProps> = ({
  isOpen,
  onClose,
  title,
  className = '',
  children,
  type = 'default'
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Handle Android keyboard issues
      const inputs = dialogRef.current?.querySelectorAll('input, textarea, select');
      inputs?.forEach(input => {
        input.addEventListener('focus', () => {
          // Scroll to the input when focused to ensure it's visible with keyboard open
          setTimeout(() => {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        });
      });
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Determine dialog class based on type
  const dialogClass = type === 'subscription' 
    ? 'subscription-dialog' 
    : type === 'payment' 
      ? 'payment-dialog' 
      : 'responsive-dialog';

  // Determine content class based on type
  const contentClass = type === 'subscription' 
    ? 'subscription-content' 
    : type === 'payment' 
      ? 'payment-content' 
      : 'responsive-content';

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${dialogClass}`}
      onClick={(e) => {
        // Close when clicking outside the dialog
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={dialogRef}
        className={`bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto overscroll-contain ${contentClass} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b flex justify-between items-center">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveDialog;
