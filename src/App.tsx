import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, Suspense, lazy } from 'react';
import * as reminderService from "./services/reminderService";
import { AuthProvider } from "./hooks/useAuth.tsx";
import ScheduledReminder from "./components/ScheduledReminder";
import ResponsiveViewport from "./components/ResponsiveViewport";

// Lazy load components to improve performance
const Index = lazy(() => import("./pages/Index"));
const SplashScreen = lazy(() => import("./pages/SplashScreen"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SignUp = lazy(() => import("./pages/SignUp"));
const SignIn = lazy(() => import("./pages/SignIn"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Quiz = lazy(() => import("./pages/Quiz"));
const PersonalizationQuiz = lazy(() => import("./pages/PersonalizationQuiz"));
const Home = lazy(() => import("./pages/Home"));
const SleepStories = lazy(() => import("./pages/SleepStories"));
const Profile = lazy(() => import("./pages/Profile"));
const Community = lazy(() => import("./pages/Community"));
const Work = lazy(() => import("./pages/Work"));
const Notifications = lazy(() => import("./pages/Notifications"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Meditation101 = lazy(() => import("./pages/Meditation101"));
const CategoryMeditation = lazy(() => import("./pages/CategoryMeditation"));
const CategoryMeditationScreen = lazy(() => import("./pages/CategoryMeditationScreen"));
const SubscriptionScreen = lazy(() => import("./pages/SubscriptionScreen"));
const SubscriptionManagement = lazy(() => import("./pages/SubscriptionManagement"));
const Subscription = lazy(() => import("./pages/Subscription"));
const AdminPromoCodesPage = lazy(() => import("./pages/AdminPromoCodesPage"));
const TransactionHistory = lazy(() => import("./pages/TransactionHistory"));
const AIMeditation = lazy(() => import("./pages/AIMeditation"));
const AIMeditationChat = lazy(() => import("./pages/AIMeditationChat"));
const Stories = lazy(() => import("./pages/Stories"));
const StoryDetail = lazy(() => import("./pages/StoryDetail"));
const MeditationDashboardPage = lazy(() => import("./pages/MeditationDashboardPage"));

const queryClient = new QueryClient();

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100%',
    backgroundColor: '#f9fafb'
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '5px solid #e5e7eb',
        borderTopColor: '#8b5cf6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{
        marginTop: '20px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        color: '#6b7280'
      }}>Loading Hushhly...</p>
    </div>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '5px',
          margin: '20px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Show Error Details</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            <br />
            <strong>Stack Trace:</strong>
            <br />
            {this.state.error && this.state.error.stack}
          </details>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              marginTop: '20px',
              padding: '10px 15px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Go to Home Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  useEffect(() => {
    // Initialize the reminder service when the app starts
    try {
      reminderService.initializeReminderService();
      console.log("Reminder service initialized successfully");
    } catch (error) {
      console.error("Failed to initialize reminder service:", error);
    }

    // Log that the app has mounted
    console.log("App component mounted");
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ResponsiveViewport />
          <TooltipProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<SplashScreen />} />
                <Route path="/splash" element={<SplashScreen />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/subscription-screen" element={<SubscriptionScreen />} />
                <Route path="/subscription-management" element={<SubscriptionManagement />} />
                <Route path="/meditation" element={<Index />} />
                <Route path="/meditation-101" element={<Meditation101 />} />
                <Route path="/category-meditation" element={<CategoryMeditation />} />
                <Route path="/category-meditation-screen" element={<CategoryMeditationScreen />} />
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
                <Route path="/ai-meditation-chat" element={<AIMeditationChat />} />
                <Route path="/meditation-dashboard" element={<MeditationDashboardPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Toaster />
            <Sonner />
            <ScheduledReminder />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
