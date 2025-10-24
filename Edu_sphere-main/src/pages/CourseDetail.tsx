import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Play, FileText, Users, Clock, Star, BookOpen } from "lucide-react";
import { Course } from "@/types/course";

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, enrollInCourse, unenrollFromCourse, enrolledCourses } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  useEffect(() => {
    if (course && user) {
      setIsEnrolled(enrolledCourses.some(c => c.id === course.id));
    }
  }, [course, enrolledCourses, user]);

  const loadCourse = async () => {
    try {
      // First check for demo courses created by instructors
      const demoCourses = JSON.parse(localStorage.getItem('demoCourses') || '[]');
      const demoCourse = demoCourses.find((c: any) => c.id === courseId);

      if (demoCourse) {
        setCourse({
          ...demoCourse,
          youtubeUrl: demoCourse.youtubeUrl || "https://www.youtube.com/results?search_query=" + encodeURIComponent(demoCourse.title),
          videoUrl: demoCourse.videoUrl || "",
          modules: demoCourse.modules || [],
          duration: demoCourse.duration || "8 weeks",
          students: demoCourse.students || 0,
          rating: demoCourse.rating || 4.5,
          instructorBio: demoCourse.instructorBio || "Experienced instructor",
          instructorName: demoCourse.instructorName || demoCourse.instructor?.full_name || "Instructor"
        });
        return;
      }

      // Mock course data - in real app this would come from API
      const mockCourses = [
        {
          id: "1",
          title: "Introduction to Web Development",
          description: "Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites. This comprehensive course covers everything from basic HTML structure to advanced JavaScript concepts and responsive design principles.",
          category: "Programming",
          level: "beginner",
          instructorName: "Sarah Johnson",
          instructorBio: "Senior Web Developer with 8+ years of experience",
          duration: "8 weeks",
          students: 1250,
          rating: 4.8,
          price: 0,
          isPaid: false,
          youtubeUrl: "https://www.youtube.com/playlist?list=PLillGF-RfqbYeckUaD1z6nviTp31GLTH8",
          videoUrl: "",
          modules: [
            { id: "m1", title: "HTML Fundamentals", duration: "2h 30m", lessons: 5 },
            { id: "m2", title: "CSS Styling", duration: "3h 15m", lessons: 8 },
            { id: "m3", title: "JavaScript Basics", duration: "4h 45m", lessons: 12 },
            { id: "m4", title: "Responsive Design", duration: "2h 15m", lessons: 6 }
          ]
        },
        {
          id: "2",
          title: "Advanced React Development",
          description: "Master React hooks, context, and advanced patterns for professional development. Learn to build scalable, maintainable React applications.",
          category: "Programming",
          level: "advanced",
          instructorName: "Mike Chen",
          instructorBio: "React Core Team Member, Tech Lead at FAANG company",
          duration: "12 weeks",
          students: 890,
          rating: 4.9,
          price: 99.99,
          isPaid: true,
          youtubeUrl: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9",
          modules: [
            { id: "m1", title: "Advanced Hooks", duration: "3h 20m", lessons: 8 },
            { id: "m2", title: "Context & State Management", duration: "4h 30m", lessons: 10 },
            { id: "m3", title: "Performance Optimization", duration: "5h 15m", lessons: 15 },
            { id: "m4", title: "Testing React Apps", duration: "3h 45m", lessons: 9 }
          ]
        },
        {
          id: "3",
          title: "UI/UX Design Fundamentals",
          description: "Learn design principles, user research, and prototyping techniques.",
          category: "Design",
          level: "intermediate",
          instructorName: "Emma Davis",
          instructorBio: "UX Designer at Google, 10+ years experience",
          duration: "10 weeks",
          students: 756,
          rating: 4.7,
          price: 0,
          isPaid: false,
          youtubeUrl: "https://www.youtube.com/playlist?list=PLXDU_eVOJTx7QHLdQw4g3kbqk8AnSec9P",
          modules: [
            { id: "m1", title: "Design Principles", duration: "2h 15m", lessons: 6 },
            { id: "m2", title: "User Research", duration: "3h 30m", lessons: 9 },
            { id: "m3", title: "Wireframing", duration: "2h 45m", lessons: 7 },
            { id: "m4", title: "Prototyping", duration: "3h 20m", lessons: 8 }
          ]
        },
        {
          id: "4",
          title: "Python for Data Science",
          description: "Learn Python programming with focus on data analysis, visualization, and machine learning.",
          category: "Data Science",
          level: "intermediate",
          instructorName: "Alex Rodriguez",
          instructorBio: "Data Scientist at Netflix, PhD in Statistics",
          duration: "14 weeks",
          students: 1234,
          rating: 4.9,
          price: 79.99,
          isPaid: true,
          youtubeUrl: "https://www.youtube.com/playlist?list=PLWKjhJtqVAbnqBxcdjVGgT3uVR10bzTEB",
          modules: [
            { id: "m1", title: "Python Basics", duration: "3h 20m", lessons: 10 },
            { id: "m2", title: "Data Analysis with Pandas", duration: "4h 30m", lessons: 12 },
            { id: "m3", title: "Data Visualization", duration: "3h 15m", lessons: 8 },
            { id: "m4", title: "Machine Learning Intro", duration: "5h 45m", lessons: 15 }
          ]
        },
        {
          id: "5",
          title: "Digital Marketing Mastery",
          description: "Complete guide to SEO, social media marketing, content strategy, and analytics.",
          category: "Marketing",
          level: "intermediate",
          instructorName: "Lisa Wang",
          instructorBio: "Digital Marketing Director, 12+ years experience",
          duration: "10 weeks",
          students: 987,
          rating: 4.6,
          price: 89.99,
          isPaid: true,
          youtubeUrl: "https://www.youtube.com/playlist?list=PL6n9fhu94yhXQS_p1i-HLIftB9Y7Vnxlo",
          modules: [
            { id: "m1", title: "SEO Fundamentals", duration: "2h 30m", lessons: 7 },
            { id: "m2", title: "Social Media Marketing", duration: "3h 20m", lessons: 9 },
            { id: "m3", title: "Content Strategy", duration: "2h 45m", lessons: 6 },
            { id: "m4", title: "Analytics & Reporting", duration: "3h 15m", lessons: 8 }
          ]
        },
        {
          id: "6",
          title: "Mobile App Development with Flutter",
          description: "Build cross-platform mobile apps using Flutter and Dart programming language.",
          category: "Programming",
          level: "intermediate",
          instructorName: "David Kim",
          instructorBio: "Mobile Developer, Google Developer Expert",
          duration: "16 weeks",
          students: 1456,
          rating: 4.8,
          price: 119.99,
          isPaid: true,
          youtubeUrl: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9jLYyp2Aoh6hcWuxFDX6PBJ",
          modules: [
            { id: "m1", title: "Dart Programming", duration: "3h 30m", lessons: 12 },
            { id: "m2", title: "Flutter Widgets", duration: "4h 20m", lessons: 15 },
            { id: "m3", title: "State Management", duration: "3h 45m", lessons: 10 },
            { id: "m4", title: "App Deployment", duration: "2h 15m", lessons: 6 }
          ]
        },
        {
          id: "7",
          title: "Cybersecurity Fundamentals",
          description: "Learn essential cybersecurity concepts, tools, and best practices for protection.",
          category: "Security",
          level: "beginner",
          instructorName: "Rachel Green",
          instructorBio: "Cybersecurity Consultant, CISSP Certified",
          duration: "12 weeks",
          students: 892,
          rating: 4.7,
          price: 0,
          isPaid: false,
          youtubeUrl: "https://www.youtube.com/playlist?list=PLG49S3nxzAnmpdmX7RoTOyuNJQAb-rEKd",
          modules: [
            { id: "m1", title: "Security Basics", duration: "2h 45m", lessons: 8 },
            { id: "m2", title: "Network Security", duration: "3h 30m", lessons: 10 },
            { id: "m3", title: "Cryptography", duration: "3h 15m", lessons: 9 },
            { id: "m4", title: "Ethical Hacking", duration: "4h 20m", lessons: 12 }
          ]
        },
        {
          id: "8",
          title: "Cloud Computing with AWS",
          description: "Master Amazon Web Services - EC2, S3, Lambda, and cloud architecture patterns.",
          category: "Cloud Computing",
          level: "advanced",
          instructorName: "James Wilson",
          instructorBio: "AWS Solutions Architect, 15+ years experience",
          duration: "18 weeks",
          students: 756,
          rating: 4.9,
          price: 149.99,
          isPaid: true,
          youtubeUrl: "https://www.youtube.com/playlist?list=PL6XT0grm_TfgtwtwUit305qS-HhDe97KJ",
          modules: [
            { id: "m1", title: "AWS Fundamentals", duration: "4h 30m", lessons: 14 },
            { id: "m2", title: "EC2 & Compute Services", duration: "5h 20m", lessons: 16 },
            { id: "m3", title: "Storage Solutions", duration: "3h 45m", lessons: 11 },
            { id: "m4", title: "Serverless Architecture", duration: "4h 15m", lessons: 13 }
          ]
        },
        {
          id: "9",
          title: "Graphic Design with Adobe Creative Suite",
          description: "Learn professional graphic design using Photoshop, Illustrator, and InDesign.",
          category: "Design",
          level: "beginner",
          instructorName: "Maria Garcia",
          instructorBio: "Graphic Designer, Adobe Certified Expert",
          duration: "14 weeks",
          students: 1234,
          rating: 4.6,
          price: 69.99,
          isPaid: true,
          youtubeUrl: "https://www.youtube.com/playlist?list=PLW-zSkCnZ-gCfcUkH1QoP3B4rrmKNHNqF",
          modules: [
            { id: "m1", title: "Photoshop Basics", duration: "3h 45m", lessons: 12 },
            { id: "m2", title: "Illustrator Essentials", duration: "4h 20m", lessons: 15 },
            { id: "m3", title: "InDesign Layout", duration: "3h 30m", lessons: 10 },
            { id: "m4", title: "Design Projects", duration: "4h 15m", lessons: 8 }
          ]
        },
        {
          id: "10",
          title: "Machine Learning with TensorFlow",
          description: "Build and deploy machine learning models using TensorFlow and Python.",
          category: "Data Science",
          level: "advanced",
          instructorName: "Dr. Robert Taylor",
          instructorBio: "ML Researcher, PhD in Computer Science",
          duration: "20 weeks",
          students: 678,
          rating: 4.9,
          price: 199.99,
          isPaid: true,
          youtubeUrl: "https://www.youtube.com/playlist?list=PLZbbT5o_s2xrwRnXk_yCPtnqqo4_u2Yys",
          modules: [
            { id: "m1", title: "ML Fundamentals", duration: "4h 30m", lessons: 14 },
            { id: "m2", title: "Neural Networks", duration: "5h 45m", lessons: 18 },
            { id: "m3", title: "TensorFlow Basics", duration: "4h 20m", lessons: 16 },
            { id: "m4", title: "Model Deployment", duration: "3h 15m", lessons: 10 }
          ]
        }
      ];

      const foundCourse = mockCourses.find(c => c.id === courseId);
      if (foundCourse) {
        setCourse({
          ...foundCourse,
          isPublished: true,
          instructorId: "demo-instructor",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } else {
        toast({
          title: "Course not found",
          description: "The requested course could not be found.",
          variant: "destructive",
        });
        navigate("/courses");
      }
    } catch (error) {
      console.error("Error loading course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // For paid courses, redirect to payment page
    if (course.isPaid && course.price > 0) {
      navigate(`/payment/${course.id}`);
      return;
    }

    try {
      await enrollInCourse(course);
      setIsEnrolled(true);
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };

  const handleUnenroll = async () => {
    try {
      await unenrollFromCourse(course.id);
      setIsEnrolled(false);
    } catch (error) {
      console.error("Error unenrolling:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-300 rounded mb-8"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/courses")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>

        {/* Course Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant={course.level === 'beginner' ? 'default' : course.level === 'intermediate' ? 'secondary' : 'destructive'}>
                  {course.level}
                </Badge>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{course.description}</p>

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div>
                  <p className="font-semibold">{course.instructorName}</p>
                  <p className="text-sm text-muted-foreground">{course.instructorBio}</p>
                </div>
              </div>

              {user && (
                <div className="flex gap-4">
                  {isEnrolled ? (
                    <>
                      {course.videoUrl && (
                        <Button onClick={() => window.open(course.videoUrl, '_blank')} variant="outline">
                          <Play className="mr-2 h-4 w-4" />
                          Watch Video
                        </Button>
                      )}
                      <Button onClick={() => window.open(course.youtubeUrl, '_blank')}>
                        <Play className="mr-2 h-4 w-4" />
                        Watch on YouTube
                      </Button>
                      <Button variant="outline" onClick={handleUnenroll}>
                        Unenroll
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleEnroll} size="lg">
                      {course.isPaid ? `Enroll for $${course.price}` : 'Enroll for Free'}
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="lg:w-80">
              <Card>
                <CardContent className="p-6">
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold mb-2">
                      {course.isPaid ? `$${course.price}` : 'Free'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Lifetime access
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Course Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {course.modules.length} modules • {course.modules.reduce((acc: number, m: any) => acc + m.lessons, 0)} lessons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.modules.map((module: any, index: number) => (
                    <div key={module.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Module {index + 1}: {module.title}</h3>
                        <span className="text-sm text-muted-foreground">{module.duration}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {module.lessons} lessons
                      </p>
                      {isEnrolled && (
                        <div className="mt-3">
                          <Button variant="outline" size="sm">
                            <Play className="mr-2 h-3 w-3" />
                            Start Module
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold">
                      {course.instructorName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{course.instructorName}</p>
                    <p className="text-sm text-muted-foreground">{course.instructorBio}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Expert instructor with years of experience in {course.category.toLowerCase()}.
                  Passionate about teaching and helping students succeed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
