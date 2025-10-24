import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GraduationCap, BookOpen, LayoutDashboard, LogOut, User, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { NotificationIcon } from "@/components/NotificationIcon";

export const Navigation = () => {
  const navigate = useNavigate();
  const { user, profile, isInstructor, signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out successfully",
    });
    navigate("/auth");
  };

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <GraduationCap className="h-7 w-7 text-primary" />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            EduLearn
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/courses">
              <BookOpen className="mr-2 h-4 w-4" />
              Courses
            </Link>
          </Button>

          <Button variant="ghost" asChild>
            <Link to={isInstructor ? "/dashboard" : "/student-dashboard"}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>

          {!isInstructor && (
            <Button variant="ghost" asChild>
              <Link to="/wishlist">
                <Heart className="mr-2 h-4 w-4" />
                Wishlist
              </Link>
            </Button>
          )}

          <NotificationIcon />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src={profile?.avatarUrl} />
                  <AvatarFallback>
                    {profile?.fullName?.charAt(0) || user?.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{profile?.fullName || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  {isInstructor && (
                    <span className="text-xs text-primary font-semibold">Instructor</span>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
