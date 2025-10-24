import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [signupRole, setSignupRole] = useState<"student" | "instructor">("student");



  const handleLogin = async (e: React.FormEvent<HTMLFormElement>, forcedRole?: 'student' | 'instructor') => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Check if user exists in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
      const existingUser = existingUsers.find((u: any) => u.email === email);

      if (existingUser) {
        console.log('Found existing user:', existingUser);
        // Update role based on forced role or email for existing user
        const shouldBeInstructor = forcedRole === 'instructor' || (forcedRole !== 'student' && email.toLowerCase().includes('instructor'));
        const correctRole = shouldBeInstructor ? 'instructor' : 'student';
        console.log('Should be instructor:', shouldBeInstructor, 'Correct role:', correctRole);
        if (existingUser.role !== correctRole) {
          console.log('Updating role from', existingUser.role, 'to', correctRole);
          existingUser.role = correctRole;
          // Update in demoUsers array
          const userIndex = existingUsers.findIndex((u: any) => u.id === existingUser.id);
          if (userIndex !== -1) {
            existingUsers[userIndex] = existingUser;
            localStorage.setItem('demoUsers', JSON.stringify(existingUsers));
          }
        }
        // Login existing user
        localStorage.setItem('demoUser', JSON.stringify(existingUser));
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      } else {
        // Create new demo user for login - use forced role or detect from email
        const isInstructorEmail = forcedRole === 'instructor' || (forcedRole !== 'student' && email.toLowerCase().includes('instructor'));
        const demoUser = {
          id: `demo-${Date.now()}`,
          email,
          fullName: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          role: isInstructorEmail ? 'instructor' : 'student',
          enrolledCourses: [],
          avatarUrl: undefined,
          bio: undefined
        };

        console.log('Creating new user:', demoUser);

        // Store in users array and set current user
        existingUsers.push(demoUser);
        localStorage.setItem('demoUsers', JSON.stringify(existingUsers));
        localStorage.setItem('demoUser', JSON.stringify(demoUser));

        toast({
          title: "Account created!",
          description: `Demo ${demoUser.role} account created and logged in successfully.`,
        });
      }

      // Use setTimeout to avoid navigation issues
      setTimeout(() => {
        console.log('Navigating to dashboard for user:', existingUser);
        const dashboardPath = existingUser.role === 'instructor' ? "/dashboard" : "/student-dashboard";
        console.log('Dashboard path:', dashboardPath);
        navigate(dashboardPath, { replace: true });

        // Dispatch custom event to update auth context
        window.dispatchEvent(new CustomEvent('authUpdate'));
      }, 100);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
      const existingUser = existingUsers.find((u: any) => u.email === email);

      if (existingUser) {
        toast({
          title: "Account already exists",
          description: "Please use the login form instead.",
          variant: "destructive",
        });
        setActiveTab("login");
        setIsLoading(false);
        return;
      }

      // Demo signup - create demo user with selected role
      const demoUser = {
        id: `demo-${Date.now()}`,
        email,
        fullName,
        role: signupRole,
        enrolledCourses: [],
        avatarUrl: undefined,
        bio: undefined
      };

      // Store in users array and set current user
      existingUsers.push(demoUser);
      localStorage.setItem('demoUsers', JSON.stringify(existingUsers));
      localStorage.setItem('demoUser', JSON.stringify(demoUser));

      toast({
        title: "Account created!",
        description: `Demo ${signupRole} account created successfully.`,
      });
      // Use setTimeout to avoid navigation issues
      setTimeout(() => {
        console.log('Navigating to dashboard after signup for user:', demoUser);
        const dashboardPath = demoUser.role === 'instructor' ? "/dashboard" : "/student-dashboard";
        console.log('Dashboard path:', dashboardPath);
        navigate(dashboardPath, { replace: true });

        // Dispatch custom event to update auth context
        window.dispatchEvent(new CustomEvent('authUpdate'));
      }, 100);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create account";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <GraduationCap className="h-12 w-12 text-primary mr-3" />
          <h1 className="text-3xl font-bold text-primary">EduLearn</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Student Login</TabsTrigger>
              <TabsTrigger value="instructor-login">Instructor Login</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={(e) => handleLogin(e, 'student')}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="student@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log in as Student"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="instructor-login">
              <form onSubmit={(e) => handleLogin(e, 'instructor')}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="instructor-email">Email</Label>
                    <Input
                      id="instructor-email"
                      name="email"
                      type="email"
                      placeholder="instructor@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructor-password">Password</Label>
                    <Input
                      id="instructor-password"
                      name="password"
                      type="password"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log in as Instructor"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="student@example.com or instructor@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-role">Role</Label>
                    <Select value={signupRole} onValueChange={(value: "student" | "instructor") => setSignupRole(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="instructor">Instructor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="At least 6 characters"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : `Sign up as ${signupRole}`}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
