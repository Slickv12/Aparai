import { useState } from "react";
import { MessageCircle, Send, X, Bot } from "lucide-react";

const QUICK_REPLIES = {
  jobs: "You can explore all open roles on the Open Roles page. Use filters for location, type, and skills.",
  apply: "To apply, go to the Apply page, fill your details, and upload your resume in PDF format.",
  culture: "Aparaitech focuses on growth, innovation, and collaborative engineering culture.",
  default: "Thanks for your message! Our team will assist you soon. Meanwhile, check Open Roles and Apply pages.",
};

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I’m your careers assistant. Ask me about roles, applying, or culture." },
  ]);

  const getReply = (text) => {
    const t = text.toLowerCase();
    if (t.includes("job") || t.includes("role") || t.includes("position")) return QUICK_REPLIES.jobs;
    if (t.includes("apply") || t.includes("application") || t.includes("resume")) return QUICK_REPLIES.apply;
    if (t.includes("culture") || t.includes("team") || t.includes("work")) return QUICK_REPLIES.culture;
    return QUICK_REPLIES.default;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input.trim() };
    const botMsg = { from: "bot", text: getReply(input) };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen && (
        <div className="w-[92vw] max-w-sm h-[500px] mb-4 rounded-2xl border border-emerald-500/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-emerald-500/20 bg-gradient-to-r from-emerald-700/40 to-green-600/30">
            <div className="flex items-center gap-2 text-emerald-100 font-semibold">
              <Bot className="h-4 w-4" />
              Careers Assistant
            </div>
            <button onClick={() => setIsOpen(false)} className="text-emerald-100 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                  msg.from === "user"
                    ? "ml-auto bg-emerald-600 text-white"
                    : "bg-slate-800 text-emerald-100 border border-emerald-500/20"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-emerald-500/20 bg-slate-900">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about roles, application, culture..."
                className="flex-1 rounded-lg border border-emerald-500/30 bg-slate-800 text-emerald-50 placeholder:text-emerald-200/50 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleSend}
                className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
        aria-label="Open chatbot"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ChatbotWidget;
