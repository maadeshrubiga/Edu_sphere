import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import { Course } from "@/types/course";

export default function Wishlist() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [wishlistCourses, setWishlistCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
        return;
      }
      loadWishlist();
    }
  }, [user, authLoading, navigate]);

  const loadWishlist = () => {
    // Load wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

    // Mock course data - in real app this would come from API
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
        price: 0,
        instructor: { full_name: "Sarah Johnson" }
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
      },
      {
        id: "3",
        title: "UI/UX Design Fundamentals",
        description: "Learn design principles, user research, and prototyping techniques.",
        category: "Design",
        level: "intermediate",
        isPublished: true,
        createdAt: new Date().toISOString(),
        instructorId: "mock-instructor-3",
        instructorName: "Emma Davis",
        isPaid: false,
        price: 0,
        instructor: { full_name: "Emma Davis" }
      },
      {
        id: "4",
        title: "Python for Data Science",
        description: "Learn Python programming with focus on data analysis, visualization, and machine learning.",
        category: "Data Science",
        level: "intermediate",
        isPublished: true,
        createdAt: new Date().toISOString(),
        instructorId: "mock-instructor-4",
        instructorName: "Alex Rodriguez",
        isPaid: true,
        price: 79.99,
        instructor: { full_name: "Alex Rodriguez" }
      },
      {
        id: "5",
        title: "Digital Marketing Mastery",
        description: "Complete guide to SEO, social media marketing, content strategy, and analytics.",
        category: "Marketing",
        level: "intermediate",
        isPublished: true,
        createdAt: new Date().toISOString(),
        instructorId: "mock-instructor-5",
        instructorName: "Lisa Wang",
        isPaid: true,
        price: 89.99,
        instructor: { full_name: "Lisa Wang" }
      },
      {
        id: "6",
        title: "Mobile App Development with Flutter",
        description: "Build cross-platform mobile apps using Flutter and Dart programming language.",
        category: "Programming",
        level: "intermediate",
        isPublished: true,
        createdAt: new Date().toISOString(),
        instructorId: "mock-instructor-6",
        instructorName: "David Kim",
        isPaid: true,
        price: 119.99,
        instructor: { full_name: "David Kim" }
      },
      {
        id: "7",
        title: "Cybersecurity Fundamentals",
        description: "Learn essential cybersecurity concepts, tools, and best practices for protection.",
        category: "Security",
        level: "beginner",
        isPublished: true,
        createdAt: new Date().toISOString(),
        instructorId: "mock-instructor-7",
        instructorName: "Rachel Green",
        isPaid: false,
        price: 0,
        instructor: { full_name: "Rachel Green" }
      },
      {
        id: "8",
        title: "Cloud Computing with AWS",
        description: "Master Amazon Web Services - EC2, S3, Lambda, and cloud architecture patterns.",
        category: "Cloud Computing",
        level: "advanced",
        isPublished: true,
        createdAt: new Date().toISOString(),
        instructorId: "mock-instructor-8",
        instructorName: "James Wilson",
        isPaid: true,
        price: 149.99,
        instructor: { full_name: "James Wilson" }
      },
      {
        id: "9",
        title: "Graphic Design with Adobe Creative Suite",
        description: "Learn professional graphic design using Photoshop, Illustrator, and InDesign.",
        category: "Design",
        level: "beginner",
        isPublished: true,
        createdAt: new Date().toISOString(),
        instructorId: "mock-instructor-9",
        instructorName: "Maria Garcia",
        isPaid: true,
        price: 69.99,
        instructor: { full_name: "Maria Garcia" }
      },
      {
        id: "10",
        title: "Machine Learning with TensorFlow",
        description: "Build and deploy machine learning models using TensorFlow and Python.",
        category: "Data Science",
        level: "advanced",
        isPublished: true,
        createdAt: new Date().toISOString(),
        instructorId: "mock-instructor-10",
        instructorName: "Dr. Robert Taylor",
        isPaid: true,
        price: 199.99,
        instructor: { full_name: "Dr. Robert Taylor" }
      }
    ];

    // Filter courses that are in the wishlist
    const wishlistCourses = mockCourses.filter(course => wishlist.includes(course.id)).map(course => ({
      ...course,
      updatedAt: course.createdAt
    }));
    setWishlistCourses(wishlistCourses);
  };

  const removeFromWishlist = (courseId: string) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const updatedWishlist = wishlist.filter((id: string) => id !== courseId);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setWishlistCourses(prev => prev.filter(course => course.id !== courseId));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/courses")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            <h1 className="text-4xl font-bold">My Wishlist</h1>
          </div>
          <p className="text-muted-foreground">
            Courses you've saved for later
          </p>
        </div>

        {wishlistCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistCourses.map(course => (
              <div key={course.id} className="relative">
                <CourseCard course={course} />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => removeFromWishlist(course.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">
              Start exploring courses and add them to your wishlist to save for later.
            </p>
            <Button onClick={() => navigate("/courses")}>
              Browse Courses
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
