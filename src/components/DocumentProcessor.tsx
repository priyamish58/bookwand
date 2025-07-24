import { useState, useEffect } from "react";
import { FileText, Sparkles, Volume2, Brain, ArrowLeft, Scroll, Play, Square } from "lucide-react";
import { MagicalCard } from "./MagicalCard";
import { MagicalButton } from "./MagicalButton";
import { MagicalProgress } from "./MagicalProgress";
import { parseFile, getFilePreview } from "@/utils/fileParser";
import { useSettings } from "@/hooks/useSettings";
import { createOpenAIService } from "@/utils/openai";
import { useToast } from "@/hooks/use-toast";

interface DocumentProcessorProps {
  file: File;
  onBack: () => void;
}

export function DocumentProcessor({ file, onBack }: DocumentProcessorProps) {
  const [documentName, setDocumentName] = useState(file.name.replace(/\.[^/.]+$/, ""));
  const [documentText, setDocumentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState("");
  const [currentStep, setCurrentStep] = useState<"loading" | "display" | "processing" | "results">("loading");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const { settings } = useSettings();
  const { toast } = useToast();

  // Auto-parse file content on component mount
  useEffect(() => {
    const loadFileContent = async () => {
      try {
        setIsLoading(true);
        const content = await parseFile(file);
        setDocumentText(content);
        setCurrentStep("display");
      } catch (error) {
        console.error("Error parsing file:", error);
        setDocumentText("Error loading file content. Please try a different file.");
        setCurrentStep("display");
      } finally {
        setIsLoading(false);
      }
    };

    loadFileContent();
  }, [file]);

  const handleSummarize = async () => {
    if (!settings.openaiApiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your OpenAI API key in Settings to use AI features.",
        variant: "destructive"
      });
      return;
    }

    setCurrentStep("processing");
    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const openaiService = createOpenAIService(settings.openaiApiKey);
      const aiSummary = await openaiService.summarizeDocument(documentText, documentName);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setSummary(aiSummary);
      setIsProcessing(false);
      setCurrentStep("results");
      
      toast({
        title: "Summary Complete!",
        description: "Your document has been magically summarized.",
      });
    } catch (error) {
      setIsProcessing(false);
      setCurrentStep("display");
      toast({
        title: "Summarization Failed",
        description: error instanceof Error ? error.message : "Failed to summarize document",
        variant: "destructive"
      });
    }
  };

  const handleTextToSpeech = async (text: string) => {
    if (!settings.openaiApiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your OpenAI API key in Settings to use voice features.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isPlaying && currentAudio) {
        currentAudio.pause();
        setIsPlaying(false);
        setCurrentAudio(null);
        return;
      }

      const openaiService = createOpenAIService(settings.openaiApiKey);
      const audioData = await openaiService.textToSpeech(text, settings.selectedVoice);
      
      const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      setCurrentAudio(audio);
      setIsPlaying(true);
      await audio.play();
      
      toast({
        title: "Now Playing",
        description: `${settings.selectedVoice} is reading your text.`,
      });
    } catch (error) {
      toast({
        title: "Speech Failed",
        description: error instanceof Error ? error.message : "Failed to generate speech",
        variant: "destructive"
      });
    }
  };

  const handleWordWizard = async (word: string) => {
    if (!settings.openaiApiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your OpenAI API key in Settings to use Word Wizard.",
        variant: "destructive"
      });
      return;
    }

    try {
      const openaiService = createOpenAIService(settings.openaiApiKey);
      const explanation = await openaiService.explainWord(word, documentText);
      
      toast({
        title: `Word Wizard: ${word}`,
        description: explanation.slice(0, 100) + "...",
      });
    } catch (error) {
      toast({
        title: "Word Wizard Failed",
        description: error instanceof Error ? error.message : "Failed to explain word",
        variant: "destructive"
      });
    }
  };

  if (currentStep === "loading") {
    return (
      <div className="max-w-4xl mx-auto">
        <MagicalCard variant="parchment" className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <Scroll className="w-16 h-16 text-primary mx-auto animate-spin" />
            <h3 className="text-2xl font-magical text-magical">
              Deciphering Your Magical Document
            </h3>
            <p className="text-muted-foreground">
              Extracting content from: {file.name}
            </p>
            
            <MagicalProgress 
              value={75}
              label="Reading the ancient texts..."
              className="max-w-md mx-auto"
            />
          </div>
        </MagicalCard>
      </div>
    );
  }

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
            <MagicalButton 
              className="w-full"
              onClick={() => handleTextToSpeech(summary)}
            >
              {isPlaying ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Stop Reading' : 'Read Summary Aloud'}
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
                onClick={() => handleTextToSpeech(documentText.slice(0, 2000))}
              >
                {isPlaying ? <Square className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                {isPlaying ? 'Stop Reading' : 'Read Document Aloud'}
              </MagicalButton>
              
              <MagicalButton 
                variant="outline" 
                className="w-full"
                onClick={() => handleTextToSpeech(summary)}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Listen to Summary
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-magical text-magical">{documentName}</h2>
          <p className="text-muted-foreground">File: {file.name}</p>
        </div>
        <MagicalButton variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Upload
        </MagicalButton>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Document Content */}
        <div className="lg:col-span-2">
          <MagicalCard variant="parchment" className="p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Scroll className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-magical text-foreground">Document Content</h3>
            </div>
            <div 
              className={`
                bg-background/50 p-4 rounded-lg max-h-96 overflow-y-auto
                ${settings.isDyslexiaMode ? 'font-dyslexic' : 'font-body'}
                ${settings.isADHDFocus ? 'text-highlight' : ''}
              `}
            >
              <pre className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                {documentText}
              </pre>
            </div>
            <div className="text-xs text-muted-foreground">
              {documentText.length} characters • Scroll to read more
            </div>
          </MagicalCard>
        </div>

        {/* Actions Panel */}
        <div className="space-y-4">
          <MagicalCard variant="magical" className="p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-magical text-foreground">AI Magic</h3>
            </div>
            
            <div className="space-y-3">
              <MagicalButton 
                variant="magical" 
                className="w-full"
                onClick={handleSummarize}
              >
                <Brain className="w-4 h-4 mr-2" />
                Summarize with AI
              </MagicalButton>
              
              <MagicalButton 
                variant="outline" 
                className="w-full"
                onClick={() => handleTextToSpeech(documentText.slice(0, 2000))}
              >
                {isPlaying ? <Square className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                {isPlaying ? 'Stop' : 'Listen'} ({settings.selectedVoice})
              </MagicalButton>
              
              <MagicalButton 
                variant="scroll" 
                className="w-full"
                onClick={() => {
                  const selectedText = window.getSelection()?.toString().trim();
                  if (selectedText) {
                    handleWordWizard(selectedText);
                  } else {
                    toast({
                      title: "Word Wizard",
                      description: "Please select a word or phrase to explain.",
                    });
                  }
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Word Wizard
              </MagicalButton>
            </div>
          </MagicalCard>

          <MagicalCard variant="scroll" className="p-4">
            <h4 className="font-semibold text-foreground mb-2">Quick Actions</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Voice Commands: "Lumos" for dark mode</p>
              <p>• Click any word for AI definitions</p>
              <p>• Generate quizzes after summarizing</p>
            </div>
          </MagicalCard>
        </div>
      </div>
    </div>
  );
}