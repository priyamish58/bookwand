import { useState } from "react";
import { FileText, Sparkles, Volume2, Brain } from "lucide-react";
import { MagicalCard } from "./MagicalCard";
import { MagicalButton } from "./MagicalButton";
import { MagicalProgress } from "./MagicalProgress";

interface DocumentProcessorProps {
  file: File;
  onBack: () => void;
}

export function DocumentProcessor({ file, onBack }: DocumentProcessorProps) {
  const [documentName, setDocumentName] = useState(file.name.replace(/\.[^/.]+$/, ""));
  const [documentText, setDocumentText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState("");
  const [currentStep, setCurrentStep] = useState<"input" | "processing" | "results">("input");

  const handleSummarize = async () => {
    setCurrentStep("processing");
    setIsProcessing(true);
    setProgress(0);

    // Simulate AI processing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }

    // Mock summary
    setSummary(`✨ Magical Summary of "${documentName}":

This enchanted document contains valuable knowledge about ${documentName.toLowerCase()}. The content has been carefully analyzed by our AI wizards and transformed into digestible insights.

Key magical discoveries:
• Important concepts and themes have been identified
• Critical information has been highlighted
• The essence of the document has been captured

Ready for your next magical adventure in learning!`);

    setIsProcessing(false);
    setCurrentStep("results");
  };

  const handleReadDocument = () => {
    // TODO: Implement reading mode
    console.log("Reading document:", documentName);
  };

  if (currentStep === "processing") {
    return (
      <div className="max-w-4xl mx-auto">
        <MagicalCard variant="parchment" className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <Sparkles className="w-16 h-16 text-primary mx-auto animate-spin" />
            <h3 className="text-2xl font-magical text-magical">
              Casting Magical Spells on Your Document
            </h3>
            <p className="text-muted-foreground">
              Our AI wizards are analyzing: {documentName}
            </p>
            
            <MagicalProgress 
              value={progress}
              label="Enchanting your document..."
              className="max-w-md mx-auto"
            />
          </div>
        </MagicalCard>
      </div>
    );
  }

  if (currentStep === "results") {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-magical text-magical">Magical Analysis Complete</h2>
          <MagicalButton variant="outline" onClick={onBack}>
            Upload New Document
          </MagicalButton>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Summary */}
          <MagicalCard variant="magical" className="p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-magical text-foreground">AI Summary</h3>
            </div>
            <div className="bg-background/50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-body">
                {summary}
              </pre>
            </div>
            <MagicalButton className="w-full">
              Read the Summarization
            </MagicalButton>
          </MagicalCard>

          {/* Actions */}
          <MagicalCard variant="parchment" className="p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-magical text-foreground">Magical Actions</h3>
            </div>
            
            <div className="space-y-3">
              <MagicalButton 
                variant="magical" 
                className="w-full"
                onClick={handleReadDocument}
              >
                <FileText className="w-4 h-4 mr-2" />
                Read The Document
              </MagicalButton>
              
              <MagicalButton variant="outline" className="w-full">
                <Volume2 className="w-4 h-4 mr-2" />
                Listen with Character Voice
              </MagicalButton>
              
              <MagicalButton variant="scroll" className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Understand The Word With AI
              </MagicalButton>
            </div>
          </MagicalCard>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-magical text-magical">Begin Your Magical Journey</h2>
        <MagicalButton variant="outline" onClick={onBack}>
          Choose Different Document
        </MagicalButton>
      </div>

      <MagicalCard variant="magical" className="p-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Document Name
            </label>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
              placeholder="Enter a magical name for your document..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Document Text
            </label>
            <textarea
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors resize-none"
              placeholder="Paste your document text here, or we'll extract it from your uploaded file..."
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <MagicalButton 
              variant="magical" 
              size="lg" 
              className="flex-1"
              onClick={handleSummarize}
            >
              <Brain className="w-5 h-5 mr-2" />
              Summarize
            </MagicalButton>
            
            <MagicalButton 
              variant="outline" 
              size="lg" 
              className="flex-1"
              onClick={handleReadDocument}
            >
              <FileText className="w-5 h-5 mr-2" />
              Read The Document
            </MagicalButton>
          </div>
        </div>
      </MagicalCard>
    </div>
  );
}