import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { biometricService } from '@/services/biometricService';
import { isAndroid, isIOS } from '@/utils/deviceUtils';

interface FingerprintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
  title?: string;
  description?: string;
}

export const FingerprintDialog: React.FC<FingerprintDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
  title = 'Authenticate Payment',
  description = 'Please verify your identity to complete this payment'
}) => {
  const [authenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [biometricType, setBiometricType] = useState<'fingerprint' | 'face' | 'none'>('none');

  useEffect(() => {
    if (isOpen) {
      // Reset state when dialog opens
      setError(null);
      setAuthenticating(false);
      
      // Get the biometric type
      biometricService.getBiometricType().then(type => {
        setBiometricType(type);
      });
      
      // Start authentication automatically
      handleAuthenticate();
    }
  }, [isOpen]);

  const handleAuthenticate = async () => {
    try {
      setAuthenticating(true);
      setError(null);
      
      const result = await biometricService.authenticate(
        'Please authenticate to complete your payment'
      );
      
      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Authentication failed');
        onError(result.error || 'Authentication failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setAuthenticating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-6">
          {/* Fingerprint Icon for Android */}
          {biometricType === 'fingerprint' && (
            <div className={`w-24 h-24 rounded-full ${authenticating ? 'bg-blue-100 animate-pulse' : error ? 'bg-red-100' : 'bg-gray-100'} flex items-center justify-center mb-4`}>
              <svg 
                className={`w-16 h-16 ${authenticating ? 'text-blue-500' : error ? 'text-red-500' : 'text-gray-500'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839-1.132c.06-.411.091-.83.091-1.255a4.99 4.99 0 00-1.383-3.453M4.921 10a5.008 5.008 0 01-1.423-3.883c0-3.316 3.01-6 6.724-6M5.9 20.21a5.001 5.001 0 01-2.38-3.233M13.5 4.206V4a2 2 0 10-4 0v.206a6 6 0 00-.5 10.975M16 11a4 4 0 00-4-4v0" 
                />
              </svg>
            </div>
          )}
          
          {/* Face ID Icon for iOS */}
          {biometricType === 'face' && (
            <div className={`w-24 h-24 rounded-full ${authenticating ? 'bg-blue-100 animate-pulse' : error ? 'bg-red-100' : 'bg-gray-100'} flex items-center justify-center mb-4`}>
              <svg 
                className={`w-16 h-16 ${authenticating ? 'text-blue-500' : error ? 'text-red-500' : 'text-gray-500'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 9h.01M9 9h.01" />
              </svg>
            </div>
          )}
          
          {authenticating ? (
            <p className="text-center text-sm text-gray-600">
              {biometricType === 'fingerprint' 
                ? 'Touch the fingerprint sensor' 
                : biometricType === 'face'
                ? 'Look at your device'
                : 'Authenticating...'}
            </p>
          ) : error ? (
            <>
              <p className="text-center text-sm text-red-600 mb-4">{error}</p>
              <Button onClick={handleAuthenticate}>Try Again</Button>
            </>
          ) : (
            <p className="text-center text-sm text-gray-600">
              {biometricType === 'fingerprint' 
                ? 'Ready to scan your fingerprint' 
                : biometricType === 'face'
                ? 'Ready to scan your face'
                : 'Ready to authenticate'}
            </p>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
