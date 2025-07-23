import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface Document {
  id: string;
  title: string;
  uploadDate: Date;
  size: number;
  type: string;
  isBookmarked: boolean;
}

interface DocumentContextType {
  documents: Document[];
  documentCount: number;
  addDocument: (document: Omit<Document, 'id' | 'uploadDate'>) => void;
  removeDocument: (id: string) => void;
  toggleBookmark: (id: string) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem('bookwand-documents');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((doc: any) => ({
          ...doc,
          uploadDate: new Date(doc.uploadDate)
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('bookwand-documents', JSON.stringify(documents));
  }, [documents]);

  const addDocument = (document: Omit<Document, 'id' | 'uploadDate'>) => {
    const newDocument: Document = {
      ...document,
      id: Date.now().toString(),
      uploadDate: new Date()
    };
    setDocuments(prev => [...prev, newDocument]);
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const toggleBookmark = (id: string) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id ? { ...doc, isBookmarked: !doc.isBookmarked } : doc
      )
    );
  };

  return (
    <DocumentContext.Provider value={{ 
      documents, 
      documentCount: documents.length,
      addDocument, 
      removeDocument, 
      toggleBookmark 
    }}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocumentUpload() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocumentUpload must be used within a DocumentProvider');
  }
  return context;
}