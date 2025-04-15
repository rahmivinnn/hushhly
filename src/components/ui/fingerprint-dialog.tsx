import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { biometricService } from '@/services/biometricService';
import { isAndroid, isIOS } from '@/utils/deviceUtils';
import { cn } from '@/lib/utils';

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
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Gojek-style header with brand color */}
        <div className="bg-blue-600 p-6 text-white">
          <h3 className="text-xl font-semibold mb-1">{title}</h3>
          <p className="text-sm text-white/80">{description}</p>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-6">
            {/* Fingerprint Icon for Android - Gojek style */}
            {biometricType === 'fingerprint' && (
              <div
                className={cn(
                  "w-28 h-28 rounded-full flex items-center justify-center mb-6 relative",
                  authenticating ? "bg-blue-50" : error ? "bg-red-50" : "bg-blue-50"
                )}
              >
                {/* Animated rings for Gojek-like effect */}
                {authenticating && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-25"></div>
                    <div className="absolute inset-2 rounded-full bg-blue-200 animate-pulse opacity-20"></div>
                  </>
                )}
                <svg
                  className={cn(
                    "w-16 h-16 z-10",
                    authenticating ? "text-blue-600" : error ? "text-red-500" : "text-blue-600"
                  )}
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

            {/* Face ID Icon for iOS - Gojek style */}
            {biometricType === 'face' && (
              <div
                className={cn(
                  "w-28 h-28 rounded-full flex items-center justify-center mb-6 relative",
                  authenticating ? "bg-blue-50" : error ? "bg-red-50" : "bg-blue-50"
                )}
              >
                {/* Animated rings for Gojek-like effect */}
                {authenticating && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-25"></div>
                    <div className="absolute inset-2 rounded-full bg-blue-200 animate-pulse opacity-20"></div>
                  </>
                )}
                <svg
                  className={cn(
                    "w-16 h-16 z-10",
                    authenticating ? "text-blue-600" : error ? "text-red-500" : "text-blue-600"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 9h.01M9 9h.01" />
                </svg>
              </div>
            )}

            {/* Status text - Gojek style */}
            {authenticating ? (
              <div className="text-center">
                <p className="text-lg font-medium text-gray-800 mb-1">
                  {biometricType === 'fingerprint'
                    ? 'Touch Fingerprint Sensor'
                    : 'Look at Your Device'}
                </p>
                <p className="text-sm text-gray-500">
                  {biometricType === 'fingerprint'
                    ? 'Use your fingerprint to verify payment'
                    : 'Use Face ID to verify payment'}
                </p>
              </div>
            ) : error ? (
              <div className="text-center">
                <p className="text-lg font-medium text-red-600 mb-3">{error}</p>
                <Button
                  onClick={handleAuthenticate}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg font-medium text-gray-800 mb-1">
                  {biometricType === 'fingerprint'
                    ? 'Ready for Authentication'
                    : 'Ready for Face ID'}
                </p>
                <p className="text-sm text-gray-500">
                  {biometricType === 'fingerprint'
                    ? 'Place your finger on the sensor'
                    : 'Look at your device camera'}
                </p>
              </div>
            )}
          </div>

          {/* Gojek-style footer */}
          <div className="mt-4 border-t pt-4 flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Secured by Hushhly Pay
            </p>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
