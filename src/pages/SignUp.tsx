import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast({
        title: "Please agree to the terms",
        description: "You must agree to the terms of service to continue",
        variant: "destructive",
      });
      return;
    }
    
    if (!fullName || !email || !password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate signup delay
    setTimeout(() => {
      // Store info in localStorage for demo purposes
      localStorage.setItem('user', JSON.stringify({ fullName, email, password }));
      
      setLoading(false);
      toast({
        title: "Account created!",
        description: "Welcome to Hushhly, " + fullName + ". Please sign in to continue.",
      });
      
      // Navigate to sign-in page after successful signup
      navigate('/sign-in');
    }, 1500);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-4 py-6">
        <button 
          onClick={() => navigate('/')} 
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
        
        <h1 className="text-2xl font-bold mb-2 text-center">Sign up</h1>
        <p className="text-gray-500 mb-8 text-center text-sm">
          Create an account to continue
        </p>
        
        {/* Form */}
        <form onSubmit={handleSignUp} className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>
          
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
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked === true)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the <span className="text-meditation-lightBlue">Terms of Service</span> and <span className="text-meditation-lightBlue">Privacy Policy</span>
            </label>
          </div>
          
          <Button 
            type="submit" 
            disabled={loading}
            className={`w-full h-12 bg-gradient-to-r from-meditation-lightBlue to-meditation-mediumBlue hover:bg-meditation-mediumBlue text-white font-medium rounded-xl ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
          
          <p className="text-center text-sm">
            Already have an account?{" "}
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

export default SignUp;
