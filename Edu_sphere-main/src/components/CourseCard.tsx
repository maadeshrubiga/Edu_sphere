import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, DollarSign, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Course } from "@/types/course";
import { useState } from "react";

interface CourseCardProps {
  course: Course;
  enrollmentCount?: number;
}

export const CourseCard = ({ course, enrollmentCount = 0 }: CourseCardProps) => {
  const navigate = useNavigate();
  const { enrollInCourse, enrolledCourses } = useAuth();
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return wishlist.includes(course.id);
  });

  const isEnrolled = enrolledCourses.some(enrolledCourse => enrolledCourse.id === course.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    let updatedWishlist;

    if (isWishlisted) {
      updatedWishlist = wishlist.filter((id: string) => id !== course.id);
    } else {
      updatedWishlist = [...wishlist, course.id];
    }

    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setIsWishlisted(!isWishlisted);

    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted ? `Removed "${course.title}" from your wishlist.` : `Added "${course.title}" to your wishlist.`,
    });
  };

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (course.is_paid) {
      navigate(`/payment/${course.id}`);
    } else {
      // Mock enrollment for free courses
      enrollInCourse(course);
      toast({
        title: "Successfully enrolled!",
        description: `You are now enrolled in "${course.title}".`,
      });
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => navigate(`/courses/${course.id}`)}>
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-primary/40" />
          </div>
        )}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 left-2 p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors z-10"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
        {course.is_paid && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
            PAID
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
            {course.title}
          </CardTitle>
          {course.level && (
            <Badge variant="secondary" className="shrink-0">
              {course.level}
            </Badge>
          )}
        </div>
        {course.category && (
          <Badge variant="outline" className="w-fit">
            {course.category}
          </Badge>
        )}
        <CardDescription className="line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{enrollmentCount} students enrolled</span>
          </div>
          {course.is_paid && course.price && (
            <div className="flex items-center gap-1 text-lg font-semibold text-primary">
              <DollarSign className="h-4 w-4" />
              {course.discount && course.discount > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="line-through text-muted-foreground text-sm">${course.price.toFixed(2)}</span>
                  <span>${(course.price * (1 - course.discount / 100)).toFixed(2)}</span>
                </div>
              ) : (
                <span>${course.price.toFixed(2)}</span>
              )}
            </div>
          )}
        </div>
        {(course.instructor || course.profiles) && (
          <p className="text-sm text-muted-foreground mt-2">
            By {course.instructor?.full_name || course.profiles?.full_name}
          </p>
        )}
      </CardContent>
      <CardFooter onClick={(e) => e.stopPropagation()}>
        {isEnrolled ? (
          <Button asChild className="w-full" variant="secondary">
            <Link to={`/courses/${course.id}`}>Continue Learning</Link>
          </Button>
        ) : (
          <Button
            asChild={!course.is_paid}
            onClick={course.is_paid ? handleEnrollClick : undefined}
            className="w-full"
          >
            {course.is_paid ? (
              <span>Enroll Now - ${course.price}</span>
            ) : (
              <span onClick={handleEnrollClick}>Enroll Free</span>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
