import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Lock, ArrowLeft, Save } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Course } from "@/types/course";

export default function Payment() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { toast } = useToast();
  const { user, enrollInCourse } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    saveCard: false,
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadCourse();
  }, [user, courseId, navigate]);

  const loadCourse = () => {
    // Mock course data - in real app this would come from API
    const mockCourses = [
      {
        id: "2",
        title: "Advanced React Development",
        description: "Master React hooks, context, and advanced patterns for professional development.",
        price: 99.99,
        instructor: "Mike Chen",
        is_published: true,
        created_at: new Date().toISOString(),
        instructor_id: "mock-instructor-2",
        profiles: { full_name: "Mike Chen" },
        is_paid: true,
        category: "Programming",
        level: "advanced"
      },
      {
        id: "4",
        title: "Data Science with Python",
        description: "Comprehensive course covering data analysis, visualization, and machine learning basics.",
        price: 149.99,
        instructor: "Alex Rodriguez",
        is_published: true,
        created_at: new Date().toISOString(),
        instructor_id: "mock-instructor-4",
        profiles: { full_name: "Alex Rodriguez" },
        is_paid: true,
        category: "Programming",
        level: "intermediate"
      },
      {
        id: "5",
        title: "Digital Marketing Mastery",
        description: "Complete guide to SEO, social media marketing, and content strategy.",
        price: 79.99,
        instructor: "Lisa Wang",
        is_published: true,
        created_at: new Date().toISOString(),
        instructor_id: "mock-instructor-5",
        profiles: { full_name: "Lisa Wang" },
        is_paid: true,
        category: "Marketing",
        level: "intermediate"
      },
      {
        id: "7",
        title: "Graphic Design with Adobe Creative Suite",
        description: "Master Photoshop, Illustrator, and InDesign for professional design work.",
        price: 129.99,
        instructor: "Rachel Green",
        is_published: true,
        created_at: new Date().toISOString(),
        instructor_id: "mock-instructor-7",
        profiles: { full_name: "Rachel Green" },
        is_paid: true,
        category: "Design",
        level: "beginner"
      },
      {
        id: "9",
        title: "Cybersecurity Fundamentals",
        description: "Understanding network security, encryption, and ethical hacking basics.",
        price: 89.99,
        instructor: "James Wilson",
        is_published: true,
        created_at: new Date().toISOString(),
        instructor_id: "mock-instructor-9",
        profiles: { full_name: "James Wilson" },
        is_paid: true,
        category: "Programming",
        level: "intermediate"
      },
      {
        id: "10",
        title: "Project Management Professional",
        description: "Complete PMP preparation course with real-world project management techniques.",
        price: 199.99,
        instructor: "Maria Garcia",
        is_published: true,
        created_at: new Date().toISOString(),
        instructor_id: "mock-instructor-10",
        profiles: { full_name: "Maria Garcia" },
        is_paid: true,
        category: "Business",
        level: "advanced"
      }
    ];

    const foundCourse = mockCourses.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse({
        ...foundCourse,
        instructorName: foundCourse.instructor,
        isPublished: foundCourse.is_published,
        instructorId: foundCourse.instructor_id,
        createdAt: foundCourse.created_at,
        updatedAt: foundCourse.created_at,
        instructor: foundCourse.profiles
      });
    } else {
      navigate("/courses");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful!",
        description: `You have successfully enrolled in "${course.title}".`,
      });
      // Enroll the user in the course after payment
      enrollInCourse(course);
      navigate(user.role === 'instructor' ? "/dashboard" : "/student-dashboard");
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" onClick={() => navigate("/courses")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Course Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Course Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{course.title}</h3>
                  <p className="text-muted-foreground text-sm">{course.description}</p>
                  <p className="text-sm text-muted-foreground mt-2">By {course.instructor?.full_name || course.instructorName}</p>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-primary">${course.price}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
              <CardDescription>
                Enter your payment information securely
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Cardholder Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                    maxLength={19}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryMonth">Month</Label>
                    <Select value={formData.expiryMonth} onValueChange={(value) => setFormData({ ...formData, expiryMonth: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => {
                          const month = (i + 1).toString().padStart(2, '0');
                          return <SelectItem key={month} value={month}>{month}</SelectItem>;
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiryYear">Year</Label>
                    <Select value={formData.expiryYear} onValueChange={(value) => setFormData({ ...formData, expiryYear: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="YY" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = (new Date().getFullYear() + i).toString().slice(-2);
                          return <SelectItem key={year} value={year}>{year}</SelectItem>;
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveCard"
                      checked={formData.saveCard}
                      onCheckedChange={(checked) => setFormData({ ...formData, saveCard: checked as boolean })}
                    />
                    <Label htmlFor="saveCard" className="text-sm flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save this card for future payments
                    </Label>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? "Processing..." : `Pay $${course.price}`}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
