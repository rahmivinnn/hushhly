
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SplashScreen from './pages/SplashScreen';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Notifications from './pages/Notifications';
import Index from './pages/Index';
import SleepStories from './pages/SleepStories';
import SleepStoryPreview from './pages/SleepStoryPreview';
import Community from './pages/Community';
import Work from './pages/Work';
import NotFound from './pages/NotFound';
import { Toaster } from "@/components/ui/toaster";
import Quiz from './pages/Quiz';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/meditation" element={<Index />} />
        <Route path="/sleep-stories" element={<SleepStories />} />
        <Route path="/sleep-story-preview" element={<SleepStoryPreview />} />
        <Route path="/community" element={<Community />} />
        <Route path="/work" element={<Work />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
