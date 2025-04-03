import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft, User, Mail, Calendar, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface UserProfile {
  fullName: string;
  email: string;
  avatar: string;
  joined: string;
  bio?: string;
  location?: string;
  interests?: string[];
}

const interestOptions = [
  "Meditation", "Mindfulness", "Sleep", "Anxiety Relief", 
  "Stress Management", "Focus", "Productivity", "Work-Life Balance",
  "Yoga", "Breathing Techniques", "Nature Sounds", "Music Therapy"
];

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "Guest User",
    email: "guest@example.com",
    avatar: "/images/default-avatar.svg",
    joined: "April 2023",
    bio: "",
    location: "",
    interests: []
  });
  
  useEffect(() => {
    // Try to get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setProfile(prev => ({
          ...prev,
          fullName: userData.fullName || userData.name || prev.fullName,
          email: userData.email || prev.email,
          avatar: userData.avatar || '/images/default-avatar.svg',
          bio: userData.bio || prev.bio,
          location: userData.location || prev.location,
          interests: userData.interests || prev.interests,
        }));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  
  const handleBack = () => {
    navigate('/profile');
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAvatar = event.target?.result as string;
        setProfile(prev => ({
          ...prev,
          avatar: newAvatar
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const toggleInterest = (interest: string) => {
    setProfile(prev => {
      const currentInterests = prev.interests || [];
      if (currentInterests.includes(interest)) {
        return {
          ...prev,
          interests: currentInterests.filter(i => i !== interest)
        };
      } else {
        return {
          ...prev,
          interests: [...currentInterests, interest]
        };
      }
    });
  };
  
  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(profile));
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
    
    setTimeout(() => {
      navigate('/profile');
    }, 1000);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 pt-4 pb-6">
        <div className="flex items-center justify-between px-4">
          <button onClick={handleBack} className="p-2 text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-white">Edit Profile</h1>
          <div className="w-8"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 px-4 py-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-2">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar || '/images/default-avatar.svg'} />
              <AvatarFallback className="bg-blue-500 text-white text-xl">
                {profile.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <button 
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white"
            >
              <Camera size={16} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <p className="text-sm text-blue-600 font-medium">Tap to change profile photo</p>
        </div>
        
        {/* Form Fields */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <User size={16} className="mr-2" /> Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Mail size={16} className="mr-2" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your email address"
            />
          </div>
          
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Calendar size={16} className="mr-2" /> Location
            </label>
            <input
              type="text"
              name="location"
              value={profile.location || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="City, Country"
            />
          </div>
          
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={profile.bio || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
              placeholder="Tell us about yourself..."
            />
          </div>
          
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    profile.interests?.includes(interest)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <Button 
          onClick={handleSave}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center"
        >
          <Save size={16} className="mr-2" /> Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditProfile;
