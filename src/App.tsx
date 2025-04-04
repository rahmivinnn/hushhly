import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import Index from "./pages/Index";
import SplashScreen from "./pages/SplashScreen";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Quiz from "./pages/Quiz";
import PersonalizationQuiz from "./pages/PersonalizationQuiz";
import Home from "./pages/Home";
import SleepStories from "./pages/SleepStories";
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import Work from "./pages/Work";
import Notifications from "./pages/Notifications";
import EditProfile from "./pages/EditProfile";
import Meditation101 from "./pages/Meditation101";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/meditation" element={<Index />} />
            <Route path="/meditation-101" element={<Meditation101 />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/personalization-quiz" element={<PersonalizationQuiz />} />
            <Route path="/home" element={<Home />} />
            <Route path="/sleep-stories" element={<SleepStories />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/community" element={<Community />} />
            <Route path="/work" element={<Work />} />
            <Route path="/notifications" element={<Notifications />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
