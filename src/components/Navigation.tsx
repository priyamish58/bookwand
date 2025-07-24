import { useState } from "react";
import { Menu, X, User, Settings, BookOpen, Upload } from "lucide-react";
import { MagicalButton } from "./MagicalButton";
import { cn } from "@/lib/utils";
import wandImage from "@/assets/magic-wand.png";

interface NavigationProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export function Navigation({ currentPage = "home", onNavigate }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: "upload", label: "Upload", icon: Upload },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "dashboard", label: "Dashboard", icon: BookOpen },
  ];

  const handleNavigate = (page: string) => {
    onNavigate?.(page);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={() => handleNavigate("home")}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <img src={wandImage} alt="BookWand" className="w-8 h-8" />
          <span className="text-xl font-magical text-magical">BookWand</span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors",
                currentPage === item.id 
                  ? "bg-primary/20 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-4 py-2 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left",
                  currentPage === item.id 
                    ? "bg-primary/20 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}