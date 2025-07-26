import { useState } from "react";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { MagicalButton } from "./MagicalButton";
import { MagicalCard } from "./MagicalCard";
import { createOpenAIService } from "@/utils/openai";
import { textToSpeech } from "@/utils/elevenlabs";
import { checkNetworkConnectivity } from "@/utils/networkUtils";

/**
 * API Connectivity Test Component
 * 
 * This component provides a simple interface to test connectivity to the OpenAI and ElevenLabs APIs.
 * It can be used to diagnose network connectivity issues and API key problems.
 */
export function ApiConnectivityTest() {
  const [isTestingNetwork, setIsTestingNetwork] = useState(false);
  const [isTestingOpenAI, setIsTestingOpenAI] = useState(false);
  const [isTestingElevenLabs, setIsTestingElevenLabs] = useState(false);
  
  const [networkStatus, setNetworkStatus] = useState<"untested" | "success" | "error">("untested");
  const [openaiStatus, setOpenaiStatus] = useState<"untested" | "success" | "error">("untested");
  const [elevenLabsStatus, setElevenLabsStatus] = useState<"untested" | "success" | "error">("untested");
  
  const [networkError, setNetworkError] = useState<string>("");
  const [openaiError, setOpenaiError] = useState<string>("");
  const [elevenLabsError, setElevenLabsError] = useState<string>("");

  const testNetworkConnectivity = async () => {
    setIsTestingNetwork(true);
    setNetworkStatus("untested");
    setNetworkError("");
    
    try {
      const isConnected = await checkNetworkConnectivity();
      if (isConnected) {
        setNetworkStatus("success");
      } else {
        setNetworkStatus("error");
        setNetworkError("Failed to connect to the internet. Please check your network connection.");
      }
    } catch (error) {
      setNetworkStatus("error");
      setNetworkError(error instanceof Error ? error.message : "Unknown network error");
    } finally {
      setIsTestingNetwork(false);
    }
  };

  const testOpenAIConnectivity = async () => {
    setIsTestingOpenAI(true);
    setOpenaiStatus("untested");
    setOpenaiError("");
    
    try {
      const openaiService = createOpenAIService();
      // Use a simple request to test connectivity
      await openaiService.explainWord("test", "This is a test of the OpenAI API connectivity.");
      setOpenaiStatus("success");
    } catch (error) {
      setOpenaiStatus("error");
      setOpenaiError(error instanceof Error ? error.message : "Unknown OpenAI API error");
    } finally {
      setIsTestingOpenAI(false);
    }
  };

  const testElevenLabsConnectivity = async () => {
    setIsTestingElevenLabs(true);
    setElevenLabsStatus("untested");
    setElevenLabsError("");
    
    try {
      // Use a minimal request to test connectivity
      await textToSpeech({
        text: "Testing ElevenLabs API connectivity.",
        character: "narrator",
      });
      setElevenLabsStatus("success");
    } catch (error) {
      setElevenLabsStatus("error");
      setElevenLabsError(error instanceof Error ? error.message : "Unknown ElevenLabs API error");
    } finally {
      setIsTestingElevenLabs(false);
    }
  };

  const testAllConnections = async () => {
    await testNetworkConnectivity();
    await testOpenAIConnectivity();
    await testElevenLabsConnectivity();
  };

  const renderStatusIcon = (status: "untested" | "success" | "error", isLoading: boolean) => {
    if (isLoading) {
      return <RefreshCw className="w-5 h-5 animate-spin text-primary" />;
    }
    
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <div className="w-5 h-5 rounded-full border border-muted-foreground" />;
    }
  };

  return (
    <MagicalCard variant="magical" className="p-6 space-y-6">
      <h2 className="text-xl font-magical text-foreground">API Connectivity Test</h2>
      <p className="text-sm text-muted-foreground">
        Use this tool to test connectivity to the APIs used by BookWand.
        This can help diagnose network issues or API key problems.
      </p>

      <div className="space-y-4">
        {/* Network Connectivity */}
        <div className="bg-background/50 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {renderStatusIcon(networkStatus, isTestingNetwork)}
              <span className="font-semibold">Internet Connectivity</span>
            </div>
            <MagicalButton 
              variant="outline" 
              size="sm" 
              onClick={testNetworkConnectivity}
              disabled={isTestingNetwork}
            >
              {isTestingNetwork ? "Testing..." : "Test"}
            </MagicalButton>
          </div>
          {networkError && (
            <p className="text-xs text-destructive mt-1">{networkError}</p>
          )}
        </div>

        {/* OpenAI API */}
        <div className="bg-background/50 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {renderStatusIcon(openaiStatus, isTestingOpenAI)}
              <span className="font-semibold">OpenAI API</span>
            </div>
            <MagicalButton 
              variant="outline" 
              size="sm" 
              onClick={testOpenAIConnectivity}
              disabled={isTestingOpenAI}
            >
              {isTestingOpenAI ? "Testing..." : "Test"}
            </MagicalButton>
          </div>
          {openaiError && (
            <p className="text-xs text-destructive mt-1">{openaiError}</p>
          )}
        </div>

        {/* ElevenLabs API */}
        <div className="bg-background/50 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {renderStatusIcon(elevenLabsStatus, isTestingElevenLabs)}
              <span className="font-semibold">ElevenLabs API</span>
            </div>
            <MagicalButton 
              variant="outline" 
              size="sm" 
              onClick={testElevenLabsConnectivity}
              disabled={isTestingElevenLabs}
            >
              {isTestingElevenLabs ? "Testing..." : "Test"}
            </MagicalButton>
          </div>
          {elevenLabsError && (
            <p className="text-xs text-destructive mt-1">{elevenLabsError}</p>
          )}
        </div>
      </div>

      <MagicalButton 
        className="w-full" 
        onClick={testAllConnections}
        disabled={isTestingNetwork || isTestingOpenAI || isTestingElevenLabs}
      >
        Test All Connections
      </MagicalButton>
    </MagicalCard>
  );
}