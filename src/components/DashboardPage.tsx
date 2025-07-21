import { useState } from "react";
import { Calendar, BookOpen, Bookmark, Search, Clock, FileText, Volume2, Brain } from "lucide-react";
import { MagicalCard } from "./MagicalCard";
import { MagicalButton } from "./MagicalButton";

interface Document {
  id: string;
  title: string;
  uploadDate: string;
  size: string;
  type: 'pdf' | 'txt' | 'epub';
  isBookmarked: boolean;
}

interface DictionaryEntry {
  id: string;
  word: string;
  definition: string;
  searchDate: string;
  documentSource: string;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Introduction to Magical Theory',
    uploadDate: '2024-01-15',
    size: '2.4 MB',
    type: 'pdf',
    isBookmarked: true
  },
  {
    id: '2',
    title: 'Advanced Spellcrafting Techniques',
    uploadDate: '2024-01-12',
    size: '1.8 MB',
    type: 'epub',
    isBookmarked: false
  },
  {
    id: '3',
    title: 'Herbology Field Notes',
    uploadDate: '2024-01-10',
    size: '645 KB',
    type: 'txt',
    isBookmarked: true
  }
];

const mockDictionary: DictionaryEntry[] = [
  {
    id: '1',
    word: 'Transfiguration',
    definition: 'The magical art of changing the form or appearance of objects and beings.',
    searchDate: '2024-01-15',
    documentSource: 'Introduction to Magical Theory'
  },
  {
    id: '2',
    word: 'Lumos',
    definition: 'A charm that creates light from the tip of a wand, useful for illumination in dark places.',
    searchDate: '2024-01-12',
    documentSource: 'Advanced Spellcrafting Techniques'
  },
  {
    id: '3',
    word: 'Mandrake',
    definition: 'A plant with magical restorative properties, known for its humanoid root and deadly cry.',
    searchDate: '2024-01-10',
    documentSource: 'Herbology Field Notes'
  }
];

export function DashboardPage() {
  const [documents] = useState<Document[]>(mockDocuments);
  const [dictionary] = useState<DictionaryEntry[]>(mockDictionary);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'documents' | 'dictionary'>('documents');

  const filteredDictionary = dictionary.filter(entry =>
    entry.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'epub': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'txt': return <FileText className="w-5 h-5 text-green-500" />;
      default: return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="pt-20 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <BookOpen className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-magical text-magical mb-4">
            Your Magical Library
          </h1>
          <p className="text-lg text-muted-foreground">
            Access your reading history, summaries, and personal dictionary
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <MagicalButton
            variant={activeTab === 'documents' ? 'magical' : 'outline'}
            onClick={() => setActiveTab('documents')}
            className="flex-1"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Document Library
          </MagicalButton>
          <MagicalButton
            variant={activeTab === 'dictionary' ? 'magical' : 'outline'}
            onClick={() => setActiveTab('dictionary')}
            className="flex-1"
          >
            <Brain className="w-4 h-4 mr-2" />
            Word Dictionary
          </MagicalButton>
        </div>

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-magical text-foreground">Recently Uploaded Documents</h2>
              <div className="text-sm text-muted-foreground">
                {documents.length} documents in your library
              </div>
            </div>

            <div className="grid gap-4">
              {documents.map((doc) => (
                <MagicalCard key={doc.id} variant="magical" className="p-6 hover:scale-[1.02] transition-transform duration-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {getFileIcon(doc.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">{doc.title}</h3>
                          {doc.isBookmarked && (
                            <Bookmark className="w-4 h-4 text-primary fill-current" />
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="w-3 h-3" />
                            <span>{doc.size}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{doc.type.toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <MagicalButton variant="outline" size="sm">
                        <Brain className="w-3 h-3 mr-1" />
                        Summary
                      </MagicalButton>
                      <MagicalButton variant="outline" size="sm">
                        <Volume2 className="w-3 h-3 mr-1" />
                        Listen
                      </MagicalButton>
                      <MagicalButton variant="scroll" size="sm">
                        Read
                      </MagicalButton>
                    </div>
                  </div>
                </MagicalCard>
              ))}
            </div>
          </div>
        )}

        {/* Dictionary Tab */}
        {activeTab === 'dictionary' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-magical text-foreground">Your Magical Dictionary</h2>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search words and definitions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {filteredDictionary.map((entry) => (
                <MagicalCard key={entry.id} variant="parchment" className="p-6">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="text-xl font-magical text-primary">{entry.word}</h3>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(entry.searchDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <p className="text-foreground leading-relaxed">{entry.definition}</p>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="text-sm text-muted-foreground">
                        From: <span className="font-medium">{entry.documentSource}</span>
                      </div>
                      <MagicalButton variant="outline" size="sm">
                        <Volume2 className="w-3 h-3 mr-1" />
                        Pronounce
                      </MagicalButton>
                    </div>
                  </div>
                </MagicalCard>
              ))}
              
              {filteredDictionary.length === 0 && searchTerm && (
                <MagicalCard variant="magical" className="p-8 text-center">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No words found matching "{searchTerm}"
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try searching for a different term or add new words by reading documents
                  </p>
                </MagicalCard>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}