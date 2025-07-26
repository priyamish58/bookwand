import { Settings, Moon, Sun, Brain, Eye, Volume2, Accessibility, Wifi } from "lucide-react";
import { MagicalCard } from "./MagicalCard";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useSettings } from "@/hooks/useSettings";
import { ApiConnectivityTest } from "./ApiConnectivityTest";

const voices = [
  { id: 'hermione', name: 'Hermione Granger', description: 'Bright and intelligent' },
  { id: 'snape', name: 'Severus Snape', description: 'Deep and mysterious' },
  { id: 'dumbledore', name: 'Albus Dumbledore', description: 'Wise and gentle' },
  { id: 'hagrid', name: 'Rubeus Hagrid', description: 'Warm and friendly' },
  { id: 'mcgonagall', name: 'Minerva McGonagall', description: 'Stern but caring' }
];

export function SettingsPage() {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="pt-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Settings className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-magical text-magical mb-4">
            Magical Settings
          </h1>
          <p className="text-lg text-muted-foreground">
            Customize your enchanted reading experience
          </p>
        </div>

        <div className="grid gap-8">
          {/* Accessibility Settings */}
          <MagicalCard variant="magical" className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Accessibility className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-magical text-foreground">Accessibility</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">Dyslexia Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Use OpenDyslexic font with increased spacing for better readability
                  </p>
                </div>
                <Switch
                  checked={settings.isDyslexiaMode}
                  onCheckedChange={(checked) => updateSetting('isDyslexiaMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">ADHD Focus Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable breathing animations and text highlighting for better focus
                  </p>
                </div>
                <Switch
                  checked={settings.isADHDFocus}
                  onCheckedChange={(checked) => updateSetting('isADHDFocus', checked)}
                />
              </div>
            </div>
          </MagicalCard>

          {/* Appearance Settings */}
          <MagicalCard variant="magical" className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Eye className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-magical text-foreground">Appearance</h2>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1">
                <h3 className="font-semibold text-foreground flex items-center space-x-2">
                  {settings.isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <span>{settings.isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Switch between dark and light magical themes
                </p>
              </div>
              <Switch
                checked={settings.isDarkMode}
                onCheckedChange={(checked) => updateSetting('isDarkMode', checked)}
              />
            </div>
          </MagicalCard>

          {/* Voice Settings */}
          <MagicalCard variant="magical" className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Volume2 className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-magical text-foreground">Character Voices</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Selected Voice Character</h3>
                <Select value={settings.selectedVoice} onValueChange={(value) => updateSetting('selectedVoice', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a magical voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{voice.name}</span>
                          <span className="text-xs text-muted-foreground">{voice.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Choose which magical character will narrate your documents with AI-powered voice synthesis
              </p>
            </div>
          </MagicalCard>

          {/* Advanced Settings */}
          <MagicalCard variant="magical" className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Brain className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-magical text-foreground">Reading Experience</h2>
            </div>
            
            <div className="text-center text-muted-foreground">
              <p>Additional reading preferences and AI settings will appear here</p>
              <p className="text-sm mt-2">Voice speed, summary styles, and more coming soon...</p>
            </div>
          </MagicalCard>

          {/* API Connectivity Test */}
          <MagicalCard variant="magical" className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Wifi className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-magical text-foreground">API Connectivity</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                If you're experiencing issues with AI features, use this tool to test your connection to our magical services.
              </p>
              
              <ApiConnectivityTest />
            </div>
          </MagicalCard>
        </div>
      </div>
    </div>
  );
}