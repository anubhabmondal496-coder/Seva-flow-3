import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2, Mic, ChevronDown, ExternalLink, CheckCircle, BookmarkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// ── Inline compact scheme card (no import needed, avoids clipping bugs) ──
const CompactSchemeCard = ({ scheme }) => {
  const [bookmarked, setBookmarked] = useState(false);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-2 gap-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 shrink-0">
          {scheme.category}
        </span>
        <button
          onClick={() => setBookmarked(b => !b)}
          className={`p-1.5 rounded-full transition-colors shrink-0 ${bookmarked ? 'bg-yellow-50 text-yellow-500' : 'text-gray-300 hover:text-gray-500'}`}
          title="Save for later"
        >
          <BookmarkIcon size={15} fill={bookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Scheme name */}
      <h3 className="px-4 text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug mb-2">
        {scheme.name}
      </h3>

      {/* Benefit */}
      <div className="px-4 mb-2">
        <p className="text-green-700 dark:text-green-400 text-xs flex items-start gap-1.5 leading-relaxed">
          <CheckCircle size={13} className="shrink-0 mt-0.5 text-green-500" />
          {scheme.benefit}
        </p>
      </div>

      {/* Portal link */}
      {scheme.link && (
        <div className="px-4 mb-3">
          <a
            href={scheme.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <ExternalLink size={11} className="shrink-0" />
            {scheme.link.replace(/^https?:\/\//, '')}
          </a>
        </div>
      )}

      {/* Action buttons */}
      <div className="px-4 pb-4 flex gap-2">
        <Link
          to={`/schemes/${scheme._id}`}
          className="flex-1 flex items-center justify-center py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-xs transition-colors"
        >
          View Details
        </Link>
        {scheme.link && (
          <a
            href={scheme.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-colors"
          >
            Apply <ExternalLink size={11} />
          </a>
        )}
      </div>
    </div>
  );
};

// ── Main Chat component ──
const Chat = () => {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState([
    { role: 'ai', text: t.aiGreeting }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recommendedSchemes, setRecommendedSchemes] = useState([]);
  const [showSchemes, setShowSchemes] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'ai') {
      setMessages([{ role: 'ai', text: t.aiGreeting }]);
    }
  }, [language, t.aiGreeting]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    let langCode = 'en-IN';
    if (language === 'Hindi') langCode = 'hi-IN';
    if (language === 'Bengali') langCode = 'bn-IN';
    if (language === 'Tamil') langCode = 'ta-IN';
    recognition.lang = langCode;
    recognition.onstart = () => setIsListening(true);
    const inputPrefix = input ? input + " " : "";
    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      setInput(inputPrefix + currentTranscript);
    };
    recognition.onerror = (event) => { console.error(event.error); setIsListening(false); };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);
    setRecommendedSchemes([]);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/chat`, {
        message: userMessage,
        language: language
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.data.reply }]);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response.data.reply);
        let langCode = 'en-IN';
        if (language === 'Hindi') langCode = 'hi-IN';
        if (language === 'Bengali') langCode = 'bn-IN';
        if (language === 'Tamil') langCode = 'ta-IN';
        utterance.lang = langCode;
        window.speechSynthesis.speak(utterance);
      }
      if (response.data.schemes && response.data.schemes.length > 0) {
        setRecommendedSchemes(response.data.schemes);
        setShowSchemes(true);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'ai', text: "Error connecting to the server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const CHAT_HEIGHT = 'clamp(420px, 62vh, 640px)';

  return (
    <div className="flex flex-col gap-4">

      {/* ── Desktop: side-by-side layout ── */}
      <div className="hidden md:flex gap-4 items-start">

        {/* Chat window — fixed height, left column */}
        <div
          className={`flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 ${recommendedSchemes.length > 0 ? 'w-1/2' : 'w-full max-w-3xl mx-auto'}`}
          style={{ height: CHAT_HEIGHT }}
        >
          {/* Header */}
          <div className="bg-green-700 text-white p-3 sm:p-4 flex items-center gap-3 shrink-0">
            <div className="bg-white/20 p-2 rounded-full shrink-0">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg">{t.aiGuide}</h2>
              <p className="text-green-100 text-xs">Online | Replies instantly</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-gray-50/50 dark:bg-gray-900/20">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[90%] sm:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mt-1 ${msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm whitespace-pre-line leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-gray-800 dark:text-gray-100 shadow-sm rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-1">
                    <Bot size={14} />
                  </div>
                  <div className="p-3 rounded-2xl bg-white dark:bg-gray-700 border border-gray-100 text-gray-500 shadow-sm rounded-tl-none flex items-center gap-2 text-sm">
                    <Loader2 size={15} className="animate-spin" /> Thinking...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2 items-center shrink-0">
            <button
              type="button"
              onClick={toggleListening}
              className={`shrink-0 p-2.5 rounded-full transition-all relative ${isListening ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-green-600 hover:bg-green-50'}`}
              title={isListening ? "Click to stop" : "Click to speak"}
            >
              <Mic size={18} className={isListening ? 'animate-pulse' : ''} />
              {isListening && (
                <span className="absolute -inset-2 rounded-full border border-red-400 animate-ping opacity-75"></span>
              )}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.typeMsg}
              className="flex-1 min-w-0 border-0 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 rounded-full py-2.5 px-4 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow"
              disabled={isLoading || isListening}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="shrink-0 p-2.5 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} className={input.trim() ? "translate-x-0.5" : ""} />
            </button>
          </form>
        </div>

        {/* Schemes panel — independent scroll, right column, auto height */}
        {recommendedSchemes.length > 0 && (
          <div
            className="w-1/2 flex flex-col bg-emerald-50 dark:bg-gray-900 rounded-2xl border border-emerald-200 dark:border-gray-700 animate-in slide-in-from-right duration-400"
            style={{ maxHeight: CHAT_HEIGHT, overflowY: 'auto' }}
          >
            {/* Sticky header inside scroll area */}
            <div className="sticky top-0 bg-emerald-50 dark:bg-gray-900 border-b border-emerald-100 dark:border-gray-700 px-5 pt-4 pb-3 z-10">
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                {t.matchesFound}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{t.matchesDesc}</p>
            </div>

            {/* Cards — naturally flow in height */}
            <div className="px-4 py-3 flex flex-col gap-3">
              {recommendedSchemes.map((scheme) => (
                <CompactSchemeCard key={scheme._id} scheme={scheme} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile: stacked layout ── */}
      <div className="md:hidden flex flex-col gap-4">

        {/* Chat window */}
        <div
          className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          style={{ height: CHAT_HEIGHT }}
        >
          <div className="bg-green-700 text-white p-3 flex items-center gap-3 shrink-0">
            <div className="bg-white/20 p-2 rounded-full shrink-0">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="font-bold text-base">{t.aiGuide}</h2>
              <p className="text-green-100 text-xs">Online | Replies instantly</p>
            </div>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50/50 dark:bg-gray-900/20">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-1 ${msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm whitespace-pre-line leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-gray-800 dark:text-gray-100 shadow-sm rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-1">
                    <Bot size={14} />
                  </div>
                  <div className="p-3 rounded-2xl bg-white dark:bg-gray-700 border border-gray-100 text-gray-500 shadow-sm rounded-tl-none flex items-center gap-2 text-sm">
                    <Loader2 size={15} className="animate-spin" /> Thinking...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-2.5 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2 items-center shrink-0">
            <button
              type="button"
              onClick={toggleListening}
              className={`shrink-0 p-2.5 rounded-full transition-all relative ${isListening ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-green-600'}`}
            >
              <Mic size={18} className={isListening ? 'animate-pulse' : ''} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.typeMsg}
              className="flex-1 min-w-0 border-0 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 rounded-full py-2.5 px-4 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              disabled={isLoading || isListening}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="shrink-0 p-2.5 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* Mobile collapsible schemes */}
        {recommendedSchemes.length > 0 && (
          <div>
            <button
              onClick={() => setShowSchemes(!showSchemes)}
              className="w-full flex items-center justify-between px-4 py-3 bg-green-600 text-white rounded-2xl font-semibold text-sm shadow"
            >
              <span>{t.matchesFound} ({recommendedSchemes.length} schemes)</span>
              <ChevronDown size={18} className={`transition-transform ${showSchemes ? 'rotate-180' : ''}`} />
            </button>
            {showSchemes && (
              <div className="mt-3 flex flex-col gap-3">
                {recommendedSchemes.map((scheme) => (
                  <CompactSchemeCard key={scheme._id} scheme={scheme} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default Chat;
