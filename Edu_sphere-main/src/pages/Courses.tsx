import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { CourseCard } from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Course } from "@/types/course";

export default function Courses() {
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
        return;
      }
      loadUserData();
      loadCourses();
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    filterCourses();
  }, [searchQuery, categoryFilter, levelFilter, courses]);

  const loadUserData = async () => {
    // User data is already loaded by AuthContext
  };

  const loadCourses = async () => {
    try {
      // Load demo courses from localStorage first
      const demoCourses = JSON.parse(localStorage.getItem('demoCourses') || '[]');

      // Use mock data for now - MongoDB connection will be handled later
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
          price: 0
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
          price: 0
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

      // Combine demo courses with mock courses, but prioritize demo courses (instructor-created)
      const mockCourseIds = new Set(mockCourses.map(c => c.id));
      const uniqueDemoCourses = demoCourses.filter(c => !mockCourseIds.has(c.id));
      const allCourses = [...uniqueDemoCourses, ...mockCourses];
      setCourses(allCourses);
      setFilteredCourses(allCourses);
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(course => course.category === categoryFilter);
    }

    if (levelFilter !== "all") {
      filtered = filtered.filter(course => course.level === levelFilter);
    }

    setFilteredCourses(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-16 w-full mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
        <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Explore Courses</h1>
          <p className="text-muted-foreground">
            Discover new skills and advance your career
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Programming">Programming</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses found</p>
          </div>
        )}
      </main>
    </div>
  );
}
