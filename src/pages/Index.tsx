import { useState } from "react";
import { Sparkles, BookOpen, Wand2, Volume2, Brain, Accessibility } from "lucide-react";
import { MagicalCard } from "@/components/MagicalCard";
import { MagicalButton } from "@/components/MagicalButton";
import { UploadZone } from "@/components/UploadZone";
import { Navigation } from "@/components/Navigation";
import { DocumentProcessor } from "@/components/DocumentProcessor";
import { SettingsPage } from "@/components/SettingsPage";
import { DashboardPage } from "@/components/DashboardPage";
import { ProfilePage } from "@/components/ProfilePage";
import { SettingsProvider } from "@/hooks/useSettings";
import { DocumentProvider } from "@/hooks/useDocumentUpload";
import heroImage from "@/assets/hero-library.jpg";
import wandImage from "@/assets/magic-wand.png";
const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setCurrentPage("process");
  };
  const handleBackToUpload = () => {
    setUploadedFile(null);
    setCurrentPage("home");
  };
  const handleStartMagic = () => {
    setCurrentPage("upload");
  };
  const features = [{
    icon: Brain,
    title: "AI Summaries",
    description: "Transform any document into magical summaries with GPT-powered intelligence"
  }, {
    icon: Volume2,
    title: "Character Voices",
    description: "Listen to your documents narrated by Snape, Hermione, and other magical voices"
  }, {
    icon: Accessibility,
    title: "Accessibility First",
    description: "Dyslexia-friendly fonts, voice navigation, and visual impairment support"
  }, {
    icon: Wand2,
    title: "Spell Commands",
    description: "Navigate with voice commands like 'Lumos' for dark mode and 'Accio Chapter 3'"
  }];

  // Render current page content
  const renderPageContent = () => {
    if (currentPage === "upload" || currentPage === "home" && uploadedFile) {
      return <div className="pt-20 px-4 min-h-screen">
          <div className="max-w-4xl mx-auto py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-magical text-magical mb-4">
                Begin Your Magical Journey
              </h2>
              <p className="text-lg text-muted-foreground">
                Upload your document and watch as BookWand transforms it into an enchanted reading experience
              </p>
            </div>
            <UploadZone onFileUpload={handleFileUpload} />
          </div>
        </div>;
    }
    if (currentPage === "process" && uploadedFile) {
      return <div className="pt-20 px-4 min-h-screen">
          <div className="py-16">
            <DocumentProcessor file={uploadedFile} onBack={handleBackToUpload} />
          </div>
        </div>;
    }
    if (currentPage === "settings") {
      return <SettingsPage />;
    }
    if (currentPage === "dashboard") {
      return <DashboardPage />;
    }
    if (currentPage === "profile") {
      return <ProfilePage onNavigate={setCurrentPage} />;
    }

    // Default home page
    return <>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        
        <div className="relative max-w-6xl mx-auto text-center w-full">
          <div className="flex justify-center items-center gap-4 mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-harry-potter text-magical leading-tight">
              BookWand
            </h1>
            <img 
              src="/lovable-uploads/505fae52-9316-4da7-9fa0-d5cab1632833.png" 
              alt="Magic Wand" 
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 animate-gentle-bounce drop-shadow-glow" 
            />
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-body px-4 mb-16">
            Transform your reading experience with magical AI-powered summaries, 
            character voices, and accessibility features that make every document enchanting.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <MagicalButton size="lg" className="w-full sm:w-auto min-w-[200px]" onClick={handleStartMagic}>
              <BookOpen className="w-5 h-5 mr-2" />
              Start Reading Magic
            </MagicalButton>
            
          </div>
        </div>
        </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-magical text-magical mb-4">
              Magical Features
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover the enchantments that make BookWand truly magical
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => <MagicalCard key={index} variant="magical" className="p-6 text-center space-y-4 hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-primary/10">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-magical text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </MagicalCard>)}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <img src={wandImage} alt="BookWand" className="w-8 h-8" />
            <span className="text-xl font-magical text-magical">BookWand</span>
          </div>
          <p className="text-muted-foreground">
            Bringing magic to reading through AI, accessibility, and enchanting experiences.
          </p>
        </div>
      </footer>
      </>;
  };
  return <SettingsProvider>
      <DocumentProvider>
        <div className="min-h-screen w-full overflow-x-hidden">
          <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
          {renderPageContent()}
        </div>
      </DocumentProvider>
    </SettingsProvider>;
};
export default Index;