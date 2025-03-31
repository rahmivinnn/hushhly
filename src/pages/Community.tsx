
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Moon, ArrowRight, Users, MessageSquare, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import BottomNavigation from '@/components/BottomNavigation';
import SideMenu from '@/components/SideMenu';

interface CommunityGroup {
  id: number;
  name: string;
  members: string;
  description: string;
  image: string;
}

const Community: React.FC = () => {
  const navigate = useNavigate();
  const [isSideMenuOpen, setIsSideMenuOpen] = React.useState(false);
  const [userName, setUserName] = React.useState("Guest");
  
  React.useEffect(() => {
    // Try to get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.fullName) {
          setUserName(userData.fullName);
        } else if (userData.name) {
          setUserName(userData.name);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };
  
  const communityGroups: CommunityGroup[] = [
    {
      id: 1,
      name: "Mindful Parenting",
      members: "1,243 members",
      description: "Gentle parenting, emotional regulation, and fostering deep connections with your child.",
      image: "/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png"
    },
    {
      id: 2,
      name: "Stress Management",
      members: "2,718 members",
      description: "Share techniques and support for managing daily stress and anxiety.",
      image: "/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png"
    },
    {
      id: 3,
      name: "Sleep Better Together",
      members: "987 members",
      description: "Tips and discussions about improving sleep quality and bedtime routines.",
      image: "/lovable-uploads/6d887bf7-e535-4b05-b046-f96e0b31de2d.png"
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-4 pt-4 pb-2">
        <div className="flex justify-between items-center">
          <button 
            className="p-2 text-gray-800"
            onClick={toggleSideMenu}
          >
            <div className="w-6 h-0.5 bg-gray-800 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-gray-800 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-gray-800"></div>
          </button>
          
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png"
              alt="Hushhly Logo"
              className="h-10"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="text-gray-800"
              onClick={() => navigate('/notifications')}
            >
              <Bell size={20} />
            </button>
            <button className="text-yellow-500">
              <Moon size={20} fill="currentColor" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Welcome Section */}
      <section className="px-4 pt-2 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Community</h1>
        <p className="text-gray-600 mt-1">Connect and grow together</p>
        
        <div className="relative mt-4">
          <input
            type="text"
            placeholder="Search groups and discussions..."
            className="w-full bg-white border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </section>
      
      {/* Featured Group */}
      <section className="px-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl p-4 text-white flex justify-between items-center">
          <div>
            <h2 className="font-medium">Join our featured group</h2>
            <div className="flex items-center mt-1">
              <p>Morning Meditation Circle</p>
              <ArrowRight size={16} className="ml-1" />
            </div>
          </div>
          <div className="text-4xl">
            <Users size={32} className="text-white" />
          </div>
        </div>
      </section>
      
      {/* Community Groups */}
      <section className="px-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Groups for You</h2>
          <button className="text-blue-500 flex items-center text-sm">
            View All <ArrowRight size={14} className="ml-1" />
          </button>
        </div>
        
        {communityGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <div className="flex items-center mb-3">
              <img 
                src={group.image} 
                alt={group.name} 
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
              <div>
                <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                <p className="text-sm text-gray-500">{group.members}</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{group.description}</p>
            
            <div className="flex space-x-3">
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 text-sm flex items-center"
              >
                Join Group <Users size={14} className="ml-2" />
              </Button>
              <Button 
                className="bg-white hover:bg-gray-100 text-blue-500 border border-blue-500 rounded-full px-4 py-2 text-sm"
              >
                View Discussions
              </Button>
            </div>
          </div>
        ))}
      </section>
      
      {/* Recent Discussions */}
      <section className="px-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Discussions</h2>
          <button className="text-blue-500 flex items-center text-sm">
            View All <ArrowRight size={14} className="ml-1" />
          </button>
        </div>
        
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <img 
                src="/lovable-uploads/6906fa52-fa6b-4a6a-b897-1ef2906b0def.png" 
                alt="User Avatar" 
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Sarah J.</h3>
                <p className="text-sm text-gray-500">Mindful Parenting • 2h ago</p>
              </div>
            </div>
            <button className="text-gray-400">
              <ArrowRight size={16} />
            </button>
          </div>
          
          <p className="text-gray-600 my-3">
            Has anyone tried meditation with their toddlers? Mine seems too energetic to sit still but I'd love to introduce mindfulness early.
          </p>
          
          <div className="flex items-center text-gray-500 text-sm">
            <button className="flex items-center mr-4">
              <MessageSquare size={16} className="mr-1" />
              <span>24 replies</span>
            </button>
            <button className="flex items-center">
              <Heart size={16} className="mr-1" />
              <span>18 likes</span>
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <img 
                src="/lovable-uploads/388a3354-4dc9-4356-9c45-77f628ee1f3e.png" 
                alt="User Avatar" 
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Michael T.</h3>
                <p className="text-sm text-gray-500">Sleep Better Together • 1d ago</p>
              </div>
            </div>
            <button className="text-gray-400">
              <ArrowRight size={16} />
            </button>
          </div>
          
          <p className="text-gray-600 my-3">
            The Forest Whispers sleep story has completely transformed my bedtime routine. Anyone else finding it helpful?
          </p>
          
          <div className="flex items-center text-gray-500 text-sm">
            <button className="flex items-center mr-4">
              <MessageSquare size={16} className="mr-1" />
              <span>12 replies</span>
            </button>
            <button className="flex items-center">
              <Heart size={16} className="mr-1" />
              <span>32 likes</span>
            </button>
          </div>
        </div>
      </section>
      
      {/* Side Menu */}
      <SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setIsSideMenuOpen(false)} 
        userName={userName}
      />
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Community;
