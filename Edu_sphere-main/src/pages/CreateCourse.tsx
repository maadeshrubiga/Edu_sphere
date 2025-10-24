import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { ArrowLeft } from "lucide-react";
import { Course } from "@/types/course";

export default function CreateCourse() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    videoUrl: "",
    isPaid: false,
    price: 0,
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
        return;
      }

      if (user?.role !== 'instructor') {
        toast({
          title: "Access Denied",
          description: "You need to be an instructor to create courses.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }
    }
  }, [user, authLoading, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create course using mock data for now
      const courseData = {
        id: `course-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        level: formData.level,
        instructorId: user.id,
        instructorName: profile?.fullName || "Instructor",
        isPublished: true,
        isPaid: formData.isPaid,
        price: formData.price,
        videoUrl: formData.videoUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store in localStorage for demo purposes
      const existingCourses = JSON.parse(localStorage.getItem('demoCourses') || '[]');
      existingCourses.push(courseData);
      localStorage.setItem('demoCourses', JSON.stringify(existingCourses));

      toast({
        title: "Course created!",
        description: "Your course has been created successfully.",
      });

      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Could not create course";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role !== 'instructor') return null;

  return (
    <div className="min-h-screen bg-background">
        <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
            <CardDescription>
              Fill in the details to create your course
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

              <div className="space-y-2">
                <Label htmlFor="videoUrl">YouTube Video URL (Optional)</Label>
                <Input
                  id="videoUrl"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                />
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
                    required={formData.isPaid}
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Course"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
