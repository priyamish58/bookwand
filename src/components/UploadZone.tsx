import { useState, useCallback } from "react";
import { Upload, FileText, Sparkles } from "lucide-react";
import { MagicalCard } from "./MagicalCard";
import { MagicalButton } from "./MagicalButton";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
  className?: string;
}

export function UploadZone({ onFileUpload, className }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.type === "application/pdf" || file.type === "text/plain" || file.name.endsWith('.epub'))) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  return (
    <MagicalCard
      variant="magical"
      glowing={isDragOver}
      className={cn(
        "relative p-8 text-center cursor-pointer transition-all duration-300",
        isDragOver && "scale-105 border-primary",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className={cn(
            "p-6 rounded-full border-2 border-dashed border-primary/30 transition-all duration-300",
            isDragOver && "border-primary scale-110"
          )}>
            {isDragOver ? (
              <Sparkles className="w-12 h-12 text-primary animate-spin" />
            ) : (
              <Upload className="w-12 h-12 text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-magical text-magical">
            Cast Your Document Spell
          </h3>
          <p className="text-muted-foreground">
            Drop your PDF, TXT, or EPUB here, or click to choose your magical tome
          </p>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <MagicalButton
            variant="magical"
            size="lg"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <FileText className="w-5 h-5 mr-2" />
            Choose Document
          </MagicalButton>
          
          <input
            id="file-input"
            type="file"
            accept=".pdf,.txt,.epub"
            onChange={handleFileInput}
            className="hidden"
          />
          
          <p className="text-xs text-muted-foreground">
            Supported: PDF, TXT, EPUB files
          </p>
        </div>
      </div>
    </MagicalCard>
  );
}