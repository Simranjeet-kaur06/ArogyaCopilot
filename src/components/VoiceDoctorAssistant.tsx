import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  HeartPulse,
  Sparkles,
  AlertTriangle,
  PhoneCall,
  User,
  Bot,
  RefreshCw,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { LanguageCode } from '../types/health';
import { t } from '../utils/translations';

interface VoiceDoctorAssistantProps {
  currentLang: LanguageCode;
  onOpenEmergencyModal: (reason?: 'ill' | 'low' | 'sos') => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  triageLevel?: 'mild' | 'moderate' | 'urgent' | 'emergency';
  recommendedAction?: string;
  followUpQuestions?: string[];
  timestamp: string;
}

export const VoiceDoctorAssistant: React.FC<VoiceDoctorAssistantProps> = ({
  currentLang,
  onOpenEmergencyModal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-0',
      role: 'assistant',
      text:
        currentLang === 'hi'
          ? 'नमस्ते! मैं डॉ. आरोग्य हूँ, आपका व्यक्तिगत स्वास्थ्य साथी। आप आज कैसा महसूस कर रहे हैं? क्या आपको कोई दर्द, बेचैनी या स्वास्थ्य संबंधी समस्या है? आप बोलकर या लिखकर मुझे बता सकते हैं।'
          : 'Hello! I am Dr. Arogya, your Personal Health Copilot. How are you feeling today? Are you experiencing any discomfort, symptoms, or worries? You can speak or type to share your problems with me.',
      triageLevel: 'mild',
      followUpQuestions: [
        'I am feeling dizzy and tired',
        'Can you explain my high blood sugar?',
        'Suggest Ayurvedic herbs for immunity & stress',
        'I am feeling low and anxious today',
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSpeechEnabled, setVoiceSpeechEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize SpeechRecognition if available in browser
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [currentLang]);

  // Voice Speech synthesis helper
  const speakText = (text: string) => {
    if (!voiceSpeechEnabled) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported on this browser. You can type your symptoms below.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const msg = (textToSend || inputText).trim();
    if (!msg || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/health/voice-doctor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          history: historyPayload,
          language: currentLang,
          ageGroup: 'adult',
        }),
      });

      const data = await res.json();
      const replyText = data.reply || "I'm here with you. Please rest, drink water, and consult a doctor if you feel unwell.";

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        triageLevel: data.triageLevel || 'mild',
        recommendedAction: data.recommendedAction,
        followUpQuestions: data.followUpQuestions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
      speakText(replyText);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: 'I understand you are experiencing discomfort. Please stay seated safely, hydrate with water, and let your family know.',
        triageLevel: 'moderate',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-linear-to-r from-violet-950 via-teal-900 to-cyan-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30 mb-3">
            <Mic className="w-3.5 h-3.5" />
            Speaking & Listening AI Doctor • Conversational Symptom Companion
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Talk to Dr. Arogya
          </h1>
          <p className="text-sm text-cyan-100 mt-2 leading-relaxed">
            Speak directly with your AI health companion in your regional language. Dr. Arogya asks about your symptoms, provides triage guidance, and calms you when feeling ill.
          </p>
        </div>

        {/* Audio Output Mute / Unmute Toggle */}
        <button
          onClick={() => {
            if (isSpeaking) window.speechSynthesis?.cancel();
            setVoiceSpeechEnabled(!voiceSpeechEnabled);
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
            voiceSpeechEnabled
              ? 'bg-teal-500 text-slate-950 border-teal-400'
              : 'bg-white/10 text-white border-white/20'
          }`}
        >
          {voiceSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{voiceSpeechEnabled ? 'Voice Speech: ON' : 'Voice Speech: Muted'}</span>
        </button>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md flex flex-col h-[580px] overflow-hidden">
        {/* Chat Messages Log */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            const isUrgent = m.triageLevel === 'urgent' || m.triageLevel === 'emergency';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-slate-800 text-white'
                      : 'bg-linear-to-br from-teal-500 to-emerald-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-2">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-slate-900 text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>

                    {/* Triage Badge if Urgent */}
                    {isUrgent && (
                      <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-950">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block">Triage Level: {m.triageLevel?.toUpperCase()}</span>
                          <span className="text-xs text-rose-800">{m.recommendedAction}</span>
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => onOpenEmergencyModal('ill')}
                              className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold px-3 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                            >
                              <PhoneCall className="w-3 h-3" />
                              Call Family Member Now
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-1.5 flex justify-end text-[10px] text-slate-400">
                      <span>{m.timestamp}</span>
                    </div>
                  </div>

                  {/* Follow-up question chips */}
                  {m.followUpQuestions && m.followUpQuestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.followUpQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="text-[11px] font-semibold bg-white hover:bg-teal-50 text-teal-800 border border-teal-200 hover:border-teal-400 px-3 py-1 rounded-full transition-colors cursor-pointer text-left shadow-2xs"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-slate-500 p-2">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
              <span>Dr. Arogya is formulating clinical guidance...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Mic & Send */}
        <div className="p-4 bg-white border-t border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            {/* Mic Toggle Button */}
            <button
              onClick={toggleMic}
              className={`p-3 rounded-2xl transition-all flex items-center justify-center cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title={isListening ? 'Listening... Tap to stop' : 'Tap to speak your problem'}
            >
              {isListening ? <Mic className="w-5 h-5 animate-bounce" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              placeholder={isListening ? 'Listening to your voice...' : 'Type your symptoms or health questions here...'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 text-xs sm:text-sm p-3 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              className="p-3 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white shadow-md shadow-teal-600/30 transition-all cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Voice recognition supports Hindi & English.</span>
            <button
              onClick={() => onOpenEmergencyModal('ill')}
              className="text-rose-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3" />
              Feeling Very Sick? Call Family Immediately
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
