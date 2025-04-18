import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { faceIdService, FaceFeatures } from '@/services/faceIdService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FaceIDDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (features?: FaceFeatures, confidence?: number) => void;
  onError: (error: string) => void;
  title?: string;
  description?: string;
}

export const FaceIDDialog: React.FC<FaceIDDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
  title = 'Authenticate Payment',
  description = 'Please verify your identity to complete this payment'
}) => {
  const [authenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [features, setFeatures] = useState<FaceFeatures | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  // Start authentication when dialog opens
  useEffect(() => {
    if (isOpen && !authenticating && !success && !error) {
      handleAuthenticate();
    }
  }, [isOpen]);

  const handleAuthenticate = async () => {
    try {
      setAuthenticating(true);
      setError(null);
      setSuccess(false);
      setFeatures(null);
      setConfidence(null);

      const result = await faceIdService.authenticate(
        'Please authenticate to complete your payment'
      );

      if (result.success) {
        // Set success state and feature data
        setSuccess(true);
        if (result.features) {
          setFeatures(result.features);
        }
        if (result.confidence) {
          setConfidence(result.confidence);
        }

        // Wait a moment to show the success state before closing
        setTimeout(() => {
          onSuccess(result.features, result.confidence);
        }, 1500);
      } else {
        setError(result.error || 'Authentication failed');
        if (result.features) {
          setFeatures(result.features);
        }
        if (result.confidence) {
          setConfidence(result.confidence);
        }
        onError(result.error || 'Authentication failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      if (!success) {
        setAuthenticating(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-4">
          {/* Face ID Animation */}
          <div
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center mb-4 relative",
              success ? "bg-green-50" : authenticating ? "bg-blue-50" : error ? "bg-red-50" : "bg-blue-50"
            )}
          >
            {/* Animated rings for Face ID effect */}
            {authenticating && (
              <>
                <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-25"></div>
                <div className="absolute inset-2 rounded-full bg-blue-200 animate-pulse opacity-20"></div>
              </>
            )}

            {/* Success animation */}
            {success && (
              <>
                <div className="absolute inset-0 rounded-full bg-green-100 animate-pulse opacity-30"></div>
                <div className="absolute inset-4 rounded-full bg-green-200 opacity-20"></div>
              </>
            )}

            {/* Error animation */}
            {error && (
              <div className="absolute inset-0 rounded-full bg-red-100 animate-pulse opacity-30"></div>
            )}

            {/* Face ID Icon */}
            <div className={cn(
              "relative",
              success ? "text-green-600" : error ? "text-red-600" : "text-blue-600"
            )}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  authenticating && "animate-pulse"
                )}
              >
                <path d="M9 9h.01" />
                <path d="M15 9h.01" />
                <path d="M8 13a4 4 0 0 0 8 0" />
                <rect width="20" height="20" x="2" y="2" rx="5" />
              </svg>

              {/* Success checkmark */}
              {success && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute -bottom-1 -right-1 bg-white rounded-full text-green-600"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}

              {/* Error X */}
              {error && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute -bottom-1 -right-1 bg-white rounded-full text-red-600"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              )}
            </div>
          </div>

          {/* Status Text */}
          {error ? (
            <div className="text-center">
              <p className="text-lg font-medium text-red-600 mb-4">{error}</p>
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
                {success
                  ? 'Authentication Successful'
                  : authenticating
                    ? 'Scanning Face...'
                    : 'Ready for Face ID'}
              </p>
              <p className="text-sm text-gray-500">
                {success
                  ? 'Proceeding with payment...'
                  : authenticating
                    ? 'Please look directly at your device'
                    : 'Look at your device camera'}
              </p>

              {/* Feature detection details (only show in success state) */}
              {/* Removed detailed Face ID features to make dialog more compact */}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
