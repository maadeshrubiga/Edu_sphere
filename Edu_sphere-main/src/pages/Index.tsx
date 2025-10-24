import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Users, Award, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();



  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <GraduationCap className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              EduLearn Platform
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Empower your learning journey with world-class courses and expert instructors
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth")} className="text-lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/courses")}>
                Browse Courses
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose EduLearn?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <BookOpen className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Content</h3>
              <p className="text-muted-foreground">
                Access curated courses created by industry experts and experienced instructors
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Users className="h-12 w-12 text-secondary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community Learning</h3>
              <p className="text-muted-foreground">
                Join a vibrant community of learners and collaborate on your educational journey
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Award className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your learning progress with detailed analytics and achievement tracking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-primary to-secondary p-12 rounded-2xl text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of students already learning on EduLearn
            </p>
            <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
              Sign Up Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
