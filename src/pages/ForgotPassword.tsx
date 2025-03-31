
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  
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
        title: "Reset link sent",
        description: "Check your email for password reset instructions",
      });
      
      // Navigate back to sign in after 2 seconds
      setTimeout(() => {
        navigate('/sign-in');
      }, 2000);
    }, 1500);
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
          Enter your email address and we'll send you a link to reset your password
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
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-meditation-lightBlue to-meditation-mediumBlue hover:bg-meditation-mediumBlue text-white font-medium rounded-xl"
          >
            {loading ? "Sending..." : "Send Reset Link"}
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
