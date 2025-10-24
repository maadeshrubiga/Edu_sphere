import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Percent } from "lucide-react";
import { Course } from "@/types/course";

export default function EditCourse() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isInstructor, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    isPaid: false,
    price: 0,
    discount: 0,
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
        return;
      }

      if (!isInstructor) {
        toast({
          title: "Access Denied",
          description: "You need to be an instructor to edit courses.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      // Load course data from location state or localStorage
      const course = location.state?.course;
      if (course) {
        setFormData({
          title: course.title || "",
          description: course.description || "",
          category: course.category || "",
          level: course.level || "beginner",
          isPaid: course.isPaid || course.is_paid || false,
          price: course.price || 0,
          discount: course.discount || 0,
        });
      } else {
        // Try to load from localStorage
        const demoCourses = JSON.parse(localStorage.getItem('demoCourses') || '[]');
        const foundCourse = demoCourses.find((c: Course) => c.id === id);
        if (foundCourse) {
          setFormData({
            title: foundCourse.title || "",
            description: foundCourse.description || "",
            category: foundCourse.category || "",
            level: foundCourse.level || "beginner",
            isPaid: foundCourse.isPaid || foundCourse.is_paid || false,
            price: foundCourse.price || 0,
            discount: foundCourse.discount || 0,
          });
        } else {
          toast({
            title: "Course not found",
            description: "The course you're trying to edit doesn't exist.",
            variant: "destructive",
          });
          navigate("/dashboard");
        }
      }
    }
  }, [user, isInstructor, authLoading, navigate, toast, id, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Load existing courses
      const demoCourses = JSON.parse(localStorage.getItem('demoCourses') || '[]');
      const courseIndex = demoCourses.findIndex((c: Course) => c.id === id);

      if (courseIndex === -1) {
        throw new Error("Course not found");
      }

      // Update course data
      const updatedCourse = {
        ...demoCourses[courseIndex],
        title: formData.title,
        description: formData.description,
        category: formData.category,
        level: formData.level,
        isPaid: formData.isPaid,
        is_paid: formData.isPaid,
        price: formData.isPaid ? formData.price : 0,
        discount: formData.discount,
        updatedAt: new Date().toISOString(),
      };

      demoCourses[courseIndex] = updatedCourse;
      localStorage.setItem('demoCourses', JSON.stringify(demoCourses));

      toast({
        title: "Course updated!",
        description: "Your course has been updated successfully.",
      });

      navigate("/dashboard");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Could not update course";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const discountedPrice = formData.isPaid && formData.discount > 0
    ? formData.price * (1 - formData.discount / 100)
    : formData.price;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold mb-2">Edit Course</h1>
          <p className="text-muted-foreground">
            Update your course details and pricing
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
            <CardDescription>
              Update the details for your course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  placeholder="Introduction to Web Development"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students will learn..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Programming, Design, Business"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value: "beginner" | "intermediate" | "advanced") => setFormData({ ...formData, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPaid"
                  checked={formData.isPaid}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPaid: checked as boolean })}
                />
                <Label htmlFor="isPaid">Make this a paid course</Label>
              </div>

              {formData.isPaid && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="49.99"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount (%)</Label>
                    <div className="relative">
                      <Input
                        id="discount"
                        type="number"
                        placeholder="20"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                        min="0"
                        max="100"
                        step="1"
                      />
                      <Percent className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                    {formData.discount > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Original: ${formData.price.toFixed(2)} | Discounted: ${discountedPrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Course"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
