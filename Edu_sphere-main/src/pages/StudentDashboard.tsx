import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Award, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading, enrolledCourses } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
        return;
      }
      setLoading(false);
    }
  }, [user, authLoading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-16 w-full mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {profile?.fullName || "Student"}! 👋</h1>
          <p className="text-muted-foreground">
            Continue your learning journey and discover new skills
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
              <p className="text-xs text-muted-foreground">Active enrollments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Completed courses</p>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Courses Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">My Learning</h2>
          {enrolledCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Ready to start learning?</CardTitle>
                <CardDescription>
                  Browse our course catalog and enroll in your first course today!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/courses")}>Browse Courses</Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recommended Courses Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Show some recommended courses from the course list */}
            {(() => {
              const demoCourses = JSON.parse(localStorage.getItem('demoCourses') || '[]');
              const mockCourses = [
                {
                  id: "1",
                  title: "Introduction to Web Development",
                  description: "Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.",
                  category: "Programming",
                  level: "beginner",
                  isPublished: true,
                  createdAt: new Date().toISOString(),
                  instructorId: "mock-instructor-1",
                  instructorName: "Sarah Johnson",
                  isPaid: false,
                  price: 0
                },
                {
                  id: "2",
                  title: "Advanced React Development",
                  description: "Master React hooks, context, and advanced patterns for professional development.",
                  category: "Programming",
                  level: "advanced",
                  isPublished: true,
                  createdAt: new Date().toISOString(),
                  instructorId: "mock-instructor-2",
                  instructorName: "Mike Chen",
                  isPaid: true,
                  price: 99.99,
                  instructor: { full_name: "Mike Chen" }
                }
              ];

              const mockCourseIds = new Set(mockCourses.map(c => c.id));
              const uniqueDemoCourses = demoCourses.filter((c: any) => !mockCourseIds.has(c.id));
              const allCourses = [...uniqueDemoCourses, ...mockCourses];

              // Filter out enrolled courses and show first 3
              const recommendedCourses = allCourses
                .filter(course => !enrolledCourses.some(enrolled => enrolled.id === course.id))
                .slice(0, 3);

              return recommendedCourses.length > 0 ? (
                recommendedCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))
              ) : (
                <Card className="md:col-span-2 lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Explore New Topics</CardTitle>
                    <CardDescription>
                      Discover courses that match your interests and career goals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => navigate("/courses")}>Explore Courses</Button>
                  </CardContent>
                </Card>
              );
            })()}
          </div>
        </div>
      </main>
    </div>
  );
}
