import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Plane, MapPin } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { allFlights, allHotels, allTours, cityToCode, airportCodes } from '../data/travelData';

// ─── Smart Local Intelligence Engine ────────────────────────────────────────

const extractCityCode = (text) => {
  const lower = text.toLowerCase();
  // Check direct 3-letter code first (e.g., "HYD", "DEL")
  const codeMatch = text.match(/\b([A-Z]{3})\b/);
  if (codeMatch && airportCodes[codeMatch[1]]) return codeMatch[1];
  // Check city name mapping
  for (const [city, code] of Object.entries(cityToCode)) {
    if (lower.includes(city)) return code;
  }
  return null;
};

const parseFlightQuery = (msg) => {
  const lower = msg.toLowerCase();
  
  // Pattern: "from X to Y" / "X to Y" / "flights to Y from X"
  const fromToPatterns = [
    /from\s+([a-z\s]+?)\s+to\s+([a-z\s]+)/i,
    /([a-z\s]+?)\s+to\s+([a-z\s]+)/i,
    /flights?\s+to\s+([a-z\s]+)/i,
  ];
  
  let from = null, to = null;
  
  for (const pattern of fromToPatterns) {
    const match = lower.match(pattern);
    if (match) {
      if (match[2]) {
        from = extractCityCode(match[1]);
        to = extractCityCode(match[2]);
      } else {
        to = extractCityCode(match[1]);
      }
      if (to) break;
    }
  }
  
  // Fallback: extract any two city codes found in the message
  if (!from || !to) {
    const allCodes = [];
    for (const [city, code] of Object.entries(cityToCode)) {
      if (lower.includes(city) && !allCodes.includes(code)) allCodes.push(code);
    }
    if (allCodes.length >= 2) { from = allCodes[0]; to = allCodes[1]; }
    else if (allCodes.length === 1) { to = allCodes[0]; }
  }
  
  return { from, to };
};

const getLocalSmartResponse = (msg) => {
  const lower = msg.toLowerCase();
  const isFlightQuery = /flight|fly|travel|trip|route|ticket|price|cost|fare|going|book|departure|arrival/i.test(msg);
  const isTourQuery = /tour|package|holiday|vacation|trip to|visit|explore|sightseeing/i.test(msg);
  const isHotelQuery = /hotel|stay|resort|accommodation|room|place to stay/i.test(msg);
  const isGreeting = /^(hi|hello|hey|good|howdy|sup|yo|what'?s? up)/i.test(msg.trim());
  
  if (isGreeting) return "Hello! 👋 I'm your TravelX AI Assistant. I can help you with flights, hotels, and holiday packages. Try: **\"Morning flights to Mumbai\"** or **\"Luxury hotels in Singapore\"**!";

  if (isFlightQuery) {
    const { from, to } = parseFlightQuery(msg);
    if (to) {
      const results = allFlights.filter(f => 
        f.to === to && (from ? f.from === from : true)
      );
      
      if (results.length === 0) return `I couldn't find a direct flight matching that route in my current inventory. Check our [Flights page](/flights) for live partner availability! ✈️`;

      let response = `✈️ I found **${results.length} flights** to **${airportCodes[to] || to}**:\n\n`;
      results.slice(0, 3).forEach((f, i) => {
        response += `**${i + 1}. ${f.airline}** | 🕐 ${f.departure}\n   💰 ₹${f.price.toLocaleString('en-IN')}\n\n`;
      });
      return response + `👉 View all on our [Flights page](/flights)!`;
    }
  }

  if (isHotelQuery) {
    const topHotels = allHotels.slice(0, 3);
    let response = `🏨 Here are some premium stays for your trip:\n\n`;
    topHotels.forEach(h => {
      response += `• **${h.name}** (${h.location}) — ₹${h.price.toLocaleString('en-IN')}/night ⭐ ${h.rating}\n`;
    });
    return response + `\nTry asking for a specific city like **"Hotels in Mumbai"**!`;
  }

  return "I'm here to help! 🌟 Try asking about morning flights, luxury hotels, or Bali holiday packages.";
};

// ─── Chatbot Component ────────────────────────────────────────────────────────

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi! I'm your **TravelX AI Assistant** ✈️\n\nI can help you find flights, luxury hotels, and tours. Try:\n• *\"Morning flights from Delhi to Mumbai\"*\n• *\"Show me hotels in Singapore\"*\n• *\"Best holiday packages to Bali\"*" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // Format bot message text (support basic markdown-like bold)
  const formatMessage = (text) => {
    if (!text) return text;
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
      if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
      return part.split('\n').map((line, j) => (
        <span key={`${i}-${j}`}>{line}{j < part.split('\n').length - 1 ? <br /> : null}</span>
      ));
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputText('');
    setIsTyping(true);

    const systemInstruction = `You are TravelX Assistant, a premium AI travel consultant.
    
    INVENTORY DATA:
    - Flights: ${JSON.stringify(allFlights)}
    - Hotels: ${JSON.stringify(allHotels)}
    - Tours: ${JSON.stringify(allTours)}
    - Airport Codes: ${JSON.stringify(airportCodes)}

    TIME FILTERING RULES:
    - "Morning": Flights departing between 05:00 and 11:59.
    - "Afternoon": Flights departing between 12:00 and 17:59.
    - "Evening/Night": Flights departing between 18:00 and 04:59.

    GUIDELINES:
    1. If a user asks for "Morning", "Evening", etc., only suggest flights fitting that time.
    2. If a specific flight is found, list its airline, time, and price (₹).
    3. If asked about hotels, suggest from the inventory based on location.
    4. If no exact flight exists in the data, clearly state "We couldn't find a direct match" and suggest checking the live Flights page.
    5. Keep responses premium, concise, and helpful. Use markdown bold for names and prices.`;

    let responded = false;
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction });
      const result = await model.generateContent(userMsg);
      const responseText = result.response.text();

      if (responseText) {
        setMessages(prev => [...prev, { sender: 'bot', text: responseText }]);
        responded = true;
      }
    } catch (err) {
      console.warn("Gemini unavailable — using local engine.");
    }

    if (!responded) {
      const localReply = getLocalSmartResponse(userMsg);
      setMessages(prev => [...prev, { sender: 'bot', text: localReply }]);
    }

    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl transition-all duration-300 z-50 transform hover:scale-110 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <div className="relative">
          <MessageSquare className="w-8 h-8" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-300 rounded-full border-2 border-emerald-600 animate-pulse"></div>
        </div>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] flex flex-col z-50 transition-all duration-300 transform origin-bottom-right border border-emerald-100/50 overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-600 p-4 flex items-center justify-between text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md border border-white/10">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">TravelX Assistant</h3>
              <p className="text-emerald-200 text-[9px] font-black flex items-center gap-1.5 uppercase tracking-widest mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
                </span>
                Online · Powered by AI
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 flex flex-col gap-4 min-h-0">
          {messages.map((msg, index) => (
            <div key={index} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                  <Bot className="w-3.5 h-3.5 text-emerald-700" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl p-3.5 text-[13px] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-tr-none shadow-lg font-medium'
                  : 'bg-white text-slate-700 border border-slate-200/70 rounded-tl-none shadow-md'
              }`}>
                {msg.sender === 'bot' ? formatMessage(msg.text) : msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex w-full justify-start">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0 mr-2">
                <Bot className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <div className="bg-white border border-slate-200/70 rounded-2xl rounded-tl-none px-4 py-3 shadow-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        <div className="px-3 pb-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto pt-2 flex-shrink-0">
          {['DEL → BOM', 'Flights to HYD', 'Bali tour', 'Cheapest flight'].map(s => (
            <button
              key={s}
              onClick={() => { setInputText(s); }}
              className="flex-shrink-0 text-[10px] font-bold px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full transition-colors whitespace-nowrap"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 flex-shrink-0">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. Flights from Delhi to Mumbai..."
              className="w-full bg-slate-100/60 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all pr-8"
            />
            <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-400" />
          </div>
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 text-white p-2.5 rounded-2xl transition-all shadow-md active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );
};

export default Chatbot;
