import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";

interface AvatarSelectorProps {
  currentAvatar?: string;
  onAvatarSelect: (avatarUrl: string) => void;
}

const defaultAvatars = [
  // Anime avatars
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
];

export const AvatarSelector = ({ currentAvatar, onAvatarSelect }: AvatarSelectorProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
  };

  const handleConfirm = () => {
    if (selectedAvatar) {
      onAvatarSelect(selectedAvatar);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Choose Avatar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Your Avatar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {defaultAvatars.map((avatarUrl, index) => (
            <div
              key={index}
              className="relative cursor-pointer"
              onClick={() => handleSelect(avatarUrl)}
            >
              <Avatar className="h-20 w-20 mx-auto">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>Avatar</AvatarFallback>
              </Avatar>
              {selectedAvatar === avatarUrl && (
                <div className="absolute inset-0 bg-primary/20 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedAvatar}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
