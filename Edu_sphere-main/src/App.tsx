import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Chatbot } from "@/components/Chatbot";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { useState } from "react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";

import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CreateCourse from "./pages/CreateCourse";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import Wishlist from "./pages/Wishlist";
import EditCourse from "./pages/EditCourse";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId" element={<CourseDetail />} />
              <Route path="/courses/create" element={<CreateCourse />} />
              <Route path="/courses/edit/:id" element={<EditCourse />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/payment/:courseId" element={<Payment />} />
              <Route path="/wishlist" element={<Wishlist />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Chatbot isOpen={chatbotOpen} onToggle={() => setChatbotOpen(!chatbotOpen)} />
            <VoiceAssistant isOpen={voiceAssistantOpen} onToggle={() => setVoiceAssistantOpen(!voiceAssistantOpen)} />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
