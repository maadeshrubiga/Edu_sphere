import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  category?: string;
  level?: string;
  instructor?: {
    full_name: string;
  };
  profiles?: {
    full_name: string;
  };
  isPaid?: boolean;
  price?: number;
  instructorId: string;
  instructorName: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  role: 'student' | 'instructor' | 'admin';
  enrolledCourses: string[];
}

interface AuthContextType {
  user: User | null;
  profile: User | null;
  isInstructor: boolean;
  isLoading: boolean;
  enrolledCourses: Course[];
  enrollInCourse: (course: Course) => Promise<void>;
  unenrollFromCourse: (courseId: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [isInstructor, setIsInstructor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();

    // Listen for custom auth update events
    const handleAuthUpdate = () => {
      checkAuth();
    };
    window.addEventListener('authUpdate', handleAuthUpdate);

    return () => {
      window.removeEventListener('authUpdate', handleAuthUpdate);
    };
  }, []);

  const checkAuth = async () => {
    try {
      // Check for demo user first
      const demoUser = localStorage.getItem('demoUser');
      if (demoUser) {
        const user = JSON.parse(demoUser);
        console.log('Loaded user from localStorage:', user);
        console.log('User role:', user.role);
        setUser(user);
        setProfile(user);
        setIsInstructor(user.role === 'instructor' || user.role === 'admin');
        console.log('Is instructor:', user.role === 'instructor' || user.role === 'admin');
        await loadEnrolledCourses(user.id);
        setIsLoading(false);
        return;
      }

      // Use demo mode only - no auto-login
      console.warn('Using demo mode - no user logged in');
      setIsLoading(false);
    } catch (error) {
      console.error('Auth check error:', error);
      // Clear corrupted data
      localStorage.removeItem('demoUser');
      localStorage.removeItem('demoUsers');
      setIsLoading(false);
    }
  };



  const loadEnrolledCourses = async (userId: string) => {
    try {
      // For demo mode, start with empty enrolled courses
      setEnrolledCourses([]);
    } catch (error) {
      console.error('Error loading enrolled courses:', error);
      setEnrolledCourses([]);
    }
  };

  const enrollInCourse = async (course: Course) => {
    if (!user) return;

    try {
      // Store enrollment in localStorage for demo
      const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      if (!enrolledCourses.includes(course.id)) {
        enrolledCourses.push(course.id);
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
      }

      // Update local state
      setEnrolledCourses(prev => [...prev, course]);
      setUser(prev => prev ? { ...prev, enrolledCourses: [...prev.enrolledCourses, course.id] } : null);
      toast({
        title: "Enrolled successfully",
        description: `You have enrolled in ${course.title}`,
      });
    } catch (error) {
      console.error('Error enrolling in course:', error);
      // Fallback to local state only
      setEnrolledCourses(prev => [...prev, course]);
      setUser(prev => prev ? { ...prev, enrolledCourses: [...prev.enrolledCourses, course.id] } : null);
      toast({
        title: "Enrolled successfully",
        description: `You have enrolled in ${course.title}`,
      });
    }
  };

  const unenrollFromCourse = async (courseId: string) => {
    if (!user) return;

    try {
      // For demo mode, just update local state
      setEnrolledCourses(prev => prev.filter(c => c.id !== courseId));
      setUser(prev => prev ? {
        ...prev,
        enrolledCourses: prev.enrolledCourses.filter(id => id !== courseId)
      } : null);
      toast({
        title: "Unenrolled successfully",
        description: "You have been unenrolled from the course",
      });
    } catch (error) {
      console.error('Error unenrolling from course:', error);
      throw error;
    }
  };

  const signOut = async () => {
    // Clear demo user
    localStorage.removeItem('demoUser');
    setUser(null);
    setProfile(null);
    setIsInstructor(false);
    setEnrolledCourses([]);
  };



  const value: AuthContextType = {
    user,
    profile,
    isInstructor,
    isLoading,
    enrolledCourses,
    enrollInCourse,
    unenrollFromCourse,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
