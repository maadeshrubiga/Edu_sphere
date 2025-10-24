import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { geminiClient } from '@/integrations/gemini/client';
import { useToast } from '@/hooks/use-toast';

// Extend window interface for speech recognition
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
      prototype: SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
      prototype: SpeechRecognition;
    };
  }
}

interface VoiceAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const VoiceAssistant = ({ isOpen, onToggle }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak your question now.",
        });
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        handleVoiceCommand(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Error",
          description: "Speech recognition failed. Please try again.",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [toast]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speakResponse = (text: string) => {
    if (synthRef.current) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }
  };

  const callGeminiAPI = async (message: string): Promise<string> => {
    try {
      const context = "You are a voice assistant for EduLearn, an educational platform. Help users with their learning journey, course recommendations, and platform navigation. Keep responses concise and natural for voice interaction.";
      const response = await geminiClient.generateChatResponse(message, context);
      console.log('Gemini API response:', response);
      return response;
    } catch (error) {
      console.error('Gemini API error:', error);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const responses = [
        "That's a great question! Let me help you with that.",
        "I understand you're asking about course content. Here's what I can tell you...",
        "Based on your learning goals, I recommend checking out our advanced courses.",
        "Feel free to ask me anything about the platform, courses, or learning tips!",
        "I'm here to help you succeed in your learning journey. What specific topic interests you?",
      ];

      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const handleVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();

    let aiResponse = '';

    // Basic command handling
    if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
      aiResponse = 'Hello! How can I help you with your learning today?';
    } else if (lowerCommand.includes('courses') || lowerCommand.includes('course')) {
      aiResponse = 'I can help you browse courses, enroll in courses, or get information about specific topics. What would you like to know?';
    } else if (lowerCommand.includes('enroll') || lowerCommand.includes('enrollment')) {
      aiResponse = 'To enroll in a course, you can browse our course catalog and click the enroll button. Free courses enroll instantly, while paid courses will take you to payment.';
    } else if (lowerCommand.includes('dashboard') || lowerCommand.includes('my learning')) {
      aiResponse = 'Your dashboard shows your enrolled courses and progress. You can access it from the navigation menu.';
    } else if (lowerCommand.includes('help') || lowerCommand.includes('support')) {
      aiResponse = 'I\'m here to help! You can ask me about courses, enrollment, navigation, or any other questions about the platform.';
    } else {
      // Call Gemini API for more complex queries
      try {
        aiResponse = await callGeminiAPI(command);
      } catch (error) {
        aiResponse = 'I\'m sorry, I didn\'t understand that. Could you please rephrase your question?';
      }
    }

    setResponse(aiResponse);
    speakResponse(aiResponse);

    toast({
      title: "Voice Assistant",
      description: aiResponse,
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-48 shadow-xl z-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Voice Assistant</CardTitle>
        <Button variant="ghost" size="icon" onClick={onToggle}>
          <Volume2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
              isListening ? 'bg-red-100 border-2 border-red-500' : 'bg-blue-100 border-2 border-blue-500'
            }`}>
              {isListening ? (
                <Mic className="h-8 w-8 text-red-500 animate-pulse" />
              ) : (
                <MicOff className="h-8 w-8 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {isListening ? 'Listening...' : 'Tap to speak'}
            </p>
          </div>

          <Button
            onClick={isListening ? stopListening : startListening}
            className={`w-full ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isListening ? 'Stop Listening' : 'Start Voice Command'}
          </Button>

          {transcript && (
            <div className="w-full p-2 bg-muted rounded text-sm">
              <p className="font-medium">You said:</p>
              <p>{transcript}</p>
            </div>
          )}

          {response && (
            <div className="w-full p-2 bg-primary/10 rounded text-sm">
              <p className="font-medium">Assistant:</p>
              <p>{response}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
