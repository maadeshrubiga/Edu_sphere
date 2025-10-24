import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Mic, MicOff, Volume2 } from 'lucide-react';
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

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Chatbot = ({ isOpen, onToggle }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. How can I help you with your learning journey today?',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call Gemini API (you'll need to implement this)
      const response = await callGeminiAPI(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const callGeminiAPI = async (message: string): Promise<string> => {
    try {
      // Try to use Gemini API
      const context = "You are an AI assistant for EduLearn, an educational platform. Help users with their learning journey, course recommendations, and platform navigation.";
      const response = await geminiClient.generateChatResponse(message, context);
      console.log('Gemini API response:', response);
      return response;
    } catch (error) {
      console.error('Gemini API error:', error);
      // Fallback to mock responses if API fails
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

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

  useEffect(() => {
    console.log('Initializing speech recognition...');
    console.log('webkitSpeechRecognition available:', 'webkitSpeechRecognition' in window);
    console.log('SpeechRecognition available:', 'SpeechRecognition' in window);

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      console.log('Speech recognition is supported');
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak your question now.",
        });
      };

      recognitionRef.current.onresult = (event) => {
        console.log('Speech recognition result:', event.results[0][0].transcript);
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
        console.log('Speech recognition ended');
        setIsListening(false);
      };
    } else {
      console.log('Speech recognition not supported in this browser');
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      console.log('Speech synthesis is supported');
      synthRef.current = window.speechSynthesis;
    } else {
      console.log('Speech synthesis not supported');
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

    // Add to chat messages
    const userMessage: Message = {
      id: Date.now().toString(),
      text: command,
      isBot: false,
      timestamp: new Date(),
    };

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      isBot: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, botMessage]);

    // Clear transcript after processing
    setTranscript('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-20 right-4 flex flex-col items-end space-y-2">
        <Button
          onClick={onToggle}
          className="rounded-full w-12 h-12 p-0 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-20 right-4 w-80 h-96 shadow-xl z-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
        <Button variant="ghost" size="icon" onClick={onToggle}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-72 px-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.isBot
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              size="icon"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button
              onClick={isListening ? stopListening : startListening}
              size="icon"
              variant="outline"
              className={isListening ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
