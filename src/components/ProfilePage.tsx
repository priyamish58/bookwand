import { useState, useRef } from "react";
import { User, Mail, BookOpen, Settings, Camera, Edit2 } from "lucide-react";
import { MagicalCard } from "./MagicalCard";
import { MagicalButton } from "./MagicalButton";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { useToast } from "@/hooks/use-toast";

interface ProfilePageProps {
  onNavigate?: (page: string) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { documentCount } = useDocumentUpload();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState({
    username: "WizardReader",
    email: "wizard@bookwand.magic",
    profilePicture: "/placeholder.svg",
    joinDate: "2024-01-22"
  });

  const handleCameraClick = () => {
    // Direct file selection instead of camera access
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUser(prev => ({ ...prev, profilePicture: e.target!.result as string }));
          toast({
            title: "Profile picture updated!",
            description: "Your new profile picture has been saved.",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pt-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <User className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-magical text-magical mb-4">
            Magical Profile
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your BookWand account and preferences
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Picture & Basic Info */}
          <MagicalCard variant="magical" className="md:col-span-2 p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                  {user.profilePicture === "/placeholder.svg" ? (
                    <User className="w-12 h-12 text-primary" />
                  ) : (
                    <img 
                      src={user.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <button 
                  onClick={handleCameraClick}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors magical-glow-hover"
                >
                  <Camera className="w-4 h-4 text-primary-foreground" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h2 className="text-2xl font-magical text-foreground">{user.username}</h2>
                  <button className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                    <Edit2 className="w-4 h-4" />
                    <span className="text-sm">Edit</span>
                  </button>
                </div>
                
                <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground mb-4">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Member since {new Date(user.joinDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </MagicalCard>

          {/* Quick Stats */}
          <MagicalCard variant="parchment" className="p-6">
            <div className="text-center">
              <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-magical text-foreground mb-1">
                {documentCount}
              </div>
              <div className="text-sm text-muted-foreground">
                Documents Uploaded
              </div>
            </div>
          </MagicalCard>
        </div>

        {/* Account Management */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <MagicalCard variant="magical" className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Customize your reading experience and accessibility options
                </p>
              </div>
              <MagicalButton 
                variant="outline" 
                size="sm"
                onClick={() => onNavigate?.('settings')}
              >
                Open
              </MagicalButton>
            </div>
          </MagicalCard>

          <MagicalCard variant="magical" className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Library</h3>
                <p className="text-sm text-muted-foreground">
                  Access your uploaded documents and reading history
                </p>
              </div>
              <MagicalButton 
                variant="outline" 
                size="sm"
                onClick={() => onNavigate?.('dashboard')}
              >
                View
              </MagicalButton>
            </div>
          </MagicalCard>
        </div>

        {/* Account Actions */}
        <MagicalCard variant="scroll" className="mt-8 p-6">
          <h3 className="font-magical text-foreground mb-4">Account Actions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-foreground">Change Password</span>
              <MagicalButton variant="outline" size="sm">
                Update
              </MagicalButton>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-foreground">Download My Data</span>
              <MagicalButton variant="outline" size="sm">
                Export
              </MagicalButton>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-foreground">Delete Account</span>
              <MagicalButton variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                Delete
              </MagicalButton>
            </div>
          </div>
        </MagicalCard>
      </div>
    </div>
  );
}