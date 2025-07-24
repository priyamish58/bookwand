import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface Settings {
  isDyslexiaMode: boolean;
  isADHDFocus: boolean;
  isDarkMode: boolean;
  selectedVoice: string;
  openaiApiKey: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  isDyslexiaMode: false,
  isADHDFocus: false,
  isDarkMode: true,
  selectedVoice: 'hermione',
  openaiApiKey: ''
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('bookwand-settings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('bookwand-settings', JSON.stringify(settings));
    
    // Apply theme class to document
    if (settings.isDarkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }

    // Apply dyslexia font
    if (settings.isDyslexiaMode) {
      document.body.classList.add('font-dyslexic');
    } else {
      document.body.classList.remove('font-dyslexic');
    }

    // Apply ADHD focus mode
    if (settings.isADHDFocus) {
      document.body.classList.add('adhd-focus');
    } else {
      document.body.classList.remove('adhd-focus');
    }
  }, [settings]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}