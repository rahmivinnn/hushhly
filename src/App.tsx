import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import React, { useEffect } from 'react';
import reminderService from "./services/reminderService";
import { AuthProvider } from "./hooks/useAuth.tsx";
import ScheduledReminder from "./components/ScheduledReminder";
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
import CategoryMeditation from "./pages/CategoryMeditation";
import SubscriptionScreen from "./pages/SubscriptionScreen";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import AdminPromoCodesPage from "./pages/AdminPromoCodesPage";
import TransactionHistory from "./pages/TransactionHistory";
import AIMeditation from "./pages/AIMeditation";
import StoriesWorking from "./pages/StoriesWorking";
import Stories from "./pages/Stories";
import StoryDetail from "./pages/StoryDetail";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize the reminder service when the app starts
    reminderService.initializeReminderService();
  }, []);

  return (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
        <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/subscription" element={<SubscriptionScreen />} />
            <Route path="/subscription-management" element={<SubscriptionManagement />} />
            <Route path="/meditation" element={<Index />} />
            <Route path="/meditation-101" element={<Meditation101 />} />
            <Route path="/category-meditation" element={<CategoryMeditation />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/personalization-quiz" element={<PersonalizationQuiz />} />
            <Route path="/home" element={<Home />} />
            <Route path="/sleep-stories" element={<SleepStories />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/story-detail" element={<StoryDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/community" element={<Community />} />
            <Route path="/work" element={<Work />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/admin/promo-codes" element={<AdminPromoCodesPage />} />
            <Route path="/transaction-history" element={<TransactionHistory />} />
            <Route path="/ai-meditation" element={<AIMeditation />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
          <ScheduledReminder />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
  );
};

export default App;
