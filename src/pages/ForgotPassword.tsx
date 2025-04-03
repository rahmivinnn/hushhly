import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, X } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate request delay
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "OTP sent",
        description: "Check your email for the verification code",
      });
      
      // Show OTP popup
      setShowOTP(true);
    }, 1000);
  };
  
  const handleOtpChange = (index: number, value: string) => {
    // Only allow one digit
    if (value.length > 1) return;
    
    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };
  
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.join('').length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter all 4 digits",
        variant: "destructive",
      });
      return;
    }
    
    if (!newPassword) {
      toast({
        title: "Password required",
        description: "Please enter your new password",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate request delay
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Password reset successful",
        description: "Your password has been reset",
      });
      
      // Navigate to sign in page
      setTimeout(() => {
        navigate('/sign-in');
    }, 1500);
    }, 1000);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-4 py-6">
        <button 
          onClick={() => navigate('/sign-in')} 
          className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-8">
        {/* Logo */}
        <div className="mb-6">
          <img 
            src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png" 
            alt="Hushhly Logo" 
            className="w-40 h-auto" 
          />
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-center">Forgot Password</h1>
        <p className="text-gray-500 mb-8 text-center text-sm px-6">
          Enter your email address and we'll send you a verification code
        </p>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={loading || showOTP}
            className="w-full h-12 bg-gradient-to-r from-meditation-lightBlue to-meditation-mediumBlue hover:bg-meditation-mediumBlue text-white font-medium rounded-xl"
          >
            {loading ? "Sending..." : "Send OTP Code"}
          </Button>
          
          <p className="text-center text-sm">
            Remember your password?{" "}
            <span 
              onClick={() => navigate('/sign-in')} 
              className="text-meditation-lightBlue cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>
        </form>
        
        {/* OTP Modal */}
        {showOTP && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md relative animate-fade-in-up">
              <button 
                onClick={() => setShowOTP(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-xl font-bold mb-2 text-center">Verify OTP</h2>
              <p className="text-gray-500 mb-6 text-center text-sm">
                Enter the 4-digit code sent to {email}
              </p>
              
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="flex justify-center space-x-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="h-14 w-14 text-center text-xl font-bold rounded-xl"
                      maxLength={1}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-meditation-lightBlue to-meditation-mediumBlue hover:bg-meditation-mediumBlue text-white font-medium rounded-xl"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
                
                <p className="text-center text-sm text-gray-500">
                  Didn't receive the code?{" "}
                  <span 
                    onClick={handleSubmit} 
                    className="text-meditation-lightBlue cursor-pointer hover:underline"
                  >
                    Resend
                  </span>
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
      
      {/* Wave bottom decoration */}
      <div className="relative h-24 mt-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 320" 
          className="absolute bottom-0 left-0 w-full"
          preserveAspectRatio="none"
        >
          <path 
            fill="#33C3F0" 
            fillOpacity="0.2" 
            d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default ForgotPassword;
