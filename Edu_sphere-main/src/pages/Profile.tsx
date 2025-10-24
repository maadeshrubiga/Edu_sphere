import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AvatarSelector } from "@/components/AvatarSelector";

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || "",
    bio: profile?.bio || "",
    avatarUrl: profile?.avatarUrl || "",
  });

  const handleSave = async () => {
    try {
      // Mock save - in real app this would update the database
      toast({
        title: "Profile updated successfully!",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error updating profile",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out successfully",
    });
    navigate("/auth");
  };

  if (!user || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" onClick={() => navigate(user.role === 'instructor' ? "/dashboard" : "/student-dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Manage your account information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatarUrl} />
                <AvatarFallback className="text-lg">
                  {profile.fullName?.charAt(0) || user.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{profile.fullName}</h3>
                <p className="text-muted-foreground">{user.email}</p>
                <Badge variant="secondary" className="mt-1">
                  {user.role === 'instructor' ? 'Instructor' : 'Student'}
                </Badge>
                <div className="mt-2">
                  <AvatarSelector
                    currentAvatar={profile.avatarUrl}
                    onAvatarSelect={(avatarUrl) => {
                      // Update profile with new avatar
                      const updatedProfile = { ...profile, avatarUrl };
                      localStorage.setItem('demoUser', JSON.stringify(updatedProfile));
                      window.location.reload(); // Simple way to refresh and show changes
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              {isEditing && (
                <div className="space-y-2">
                  <Label>Choose Avatar</Label>
                  <AvatarSelector
                    currentAvatar={formData.avatarUrl}
                    onAvatarSelect={(avatarUrl) => setFormData({ ...formData, avatarUrl })}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {isEditing ? (
                <>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>

            {/* Logout Section */}
            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Account Actions</h4>
              <Button variant="destructive" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
