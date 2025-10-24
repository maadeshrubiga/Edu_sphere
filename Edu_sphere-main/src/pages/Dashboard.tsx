import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen, Award, TrendingUp, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Course } from "@/types/course";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading, enrolledCourses } = useAuth();
  const { toast } = useToast();
  const [instructorCourses, setInstructorCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Use user.role directly for consistency
  const userIsInstructor = user?.role === 'instructor' || user?.role === 'admin';

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
        return;
      }
      loadUserData();
    }
  }, [user, authLoading, navigate]);

  const loadUserData = async () => {
    try {
      if (userIsInstructor) {
        // Load instructor courses
        const demoCourses = JSON.parse(localStorage.getItem('demoCourses') || '[]');
        const instructorCourses = demoCourses.filter((course: Course) => course.instructorId === user.id);
        setInstructorCourses(instructorCourses);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      // Clear corrupted data and fallback to empty array
      localStorage.removeItem('demoCourses');
      setInstructorCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course: Course) => {
    // Navigate to edit page with course data
    navigate(`/courses/edit/${course.id}`, { state: { course } });
  };

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
          <h1 className="text-4xl font-bold mb-2">Welcome back, {profile?.fullName || (userIsInstructor ? "Instructor" : "Student")}! 👋</h1>
          <p className="text-muted-foreground">
            {userIsInstructor ? "Manage your courses and track student progress" : "Continue your learning journey and discover new skills"}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Role: <span className="font-semibold">{userIsInstructor ? "Instructor" : "Student"}</span> | User Role: <span className="font-semibold">{user?.role}</span>
          </p>
        </div>

        {/* Stats Cards */}
        {userIsInstructor ? (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{instructorCourses.length}</div>
                <p className="text-xs text-muted-foreground">Courses created</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Across all courses</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8</div>
                <p className="text-xs text-muted-foreground">Out of 5 stars</p>
              </CardContent>
            </Card>
          </div>
        ) : (
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
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
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
        )}

        {/* Instructor Section */}
        {userIsInstructor && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Your Courses</h2>
              <Button onClick={() => navigate("/courses/create")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </div>
            {instructorCourses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {instructorCourses.map(course => (
                  <div key={course.id} className="relative">
                    <CourseCard course={course} />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-12 z-10"
                      onClick={() => handleEditCourse(course)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No courses yet</CardTitle>
                  <CardDescription>
                    Start creating your first course to share your knowledge!
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        )}

        {/* Student Section */}
        {!userIsInstructor && (
          <>
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
                      <div key={course.id} className="relative">
                        <CourseCard course={course} />
                        {course.isPaid && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                            PAID
                          </div>
                        )}
                      </div>
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
          </>
        )}
      </main>
    </div>
  );
}
