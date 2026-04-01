import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, RefreshCw, X, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

const chatbotFlows = {
  start: {
    message: "Hi! I'm the Aparaitech Career Assistant. How can I help you today?",
    options: [
      "Find Jobs",
      "Career Paths",
      "Resume Tips",
      "Interview Preparation",
      "Company Culture",
    ],
  },
  "Find Jobs": {
    message: "Great! What type of role are you interested in?",
    options: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Remote Jobs", "Back to Menu"],
  },
  "Career Paths": {
    message: "Choose a track and I’ll suggest practical next steps.",
    options: ["Frontend Path", "Backend Path", "Full Stack Path", "Back to Menu"],
  },
  "Resume Tips": {
    message: "Quick resume tips: highlight impact, add project links, and tailor skills to the role.",
    options: ["Project Tips", "Freshers Resume", "Experienced Resume", "Back to Menu"],
  },
  "Interview Preparation": {
    message: "Interview prep works best with role-specific practice. Pick one:",
    options: ["Frontend Interview", "Backend Interview", "HR Interview", "Back to Menu"],
  },
  "Company Culture": {
    message: "Aparaitech focuses on ownership, collaboration, learning, and fast execution.",
    options: ["Hiring Process", "Work Style", "Back to Menu"],
  },
  "Frontend Developer": {
    message: "Frontend is a strong choice! Suggested role titles:",
    suggestions: ["Frontend Developer", "React Developer", "UI Engineer"],
    options: ["View Open Positions", "Back to Menu"],
  },
  "Backend Developer": {
    message: "Backend engineers build scalable APIs and systems. Suggested role titles:",
    suggestions: ["Backend Developer", "Node.js Engineer", "API Developer"],
    options: ["View Open Positions", "Back to Menu"],
  },
  "Full Stack Developer": {
    message: "Great fit for end-to-end product building. Suggested role titles:",
    suggestions: ["Full Stack Developer", "MERN Stack Engineer", "Software Engineer"],
    options: ["View Open Positions", "Back to Menu"],
  },
  "Remote Jobs": {
    message: "You can filter remote/hybrid roles on the Open Positions page.",
    options: ["View Open Positions", "Back to Menu"],
  },
  "Frontend Path": {
    message: "Path: HTML/CSS → JavaScript → React → performance/accessibility → portfolio projects.",
    options: ["View Open Positions", "Back to Menu"],
  },
  "Backend Path": {
    message: "Path: Node.js fundamentals → APIs → databases → auth/security → system design basics.",
    options: ["View Open Positions", "Back to Menu"],
  },
  "Full Stack Path": {
    message: "Path: frontend + backend fundamentals, then build end-to-end projects and deploy them.",
    options: ["View Open Positions", "Back to Menu"],
  },
  "Project Tips": {
    message: "Show 2–4 quality projects with clear problem, approach, and measurable outcomes.",
    options: ["View Open Positions", "Back to Menu"],
  },
  "Freshers Resume": {
    message: "Focus on projects, internships, coursework, and GitHub profile quality.",
    options: ["View Open Positions", "Back to Menu"],
  },
  "Experienced Resume": {
    message: "Emphasize impact metrics, ownership, and technologies used at production scale.",
    options: ["View Open Positions", "Back to Menu"],
  },
  "Frontend Interview": {
    message: "Prepare React lifecycle/hooks, state management, JS fundamentals, and UI performance.",
    options: ["View Open Positions", "Back to Menu"],
  },
  "Backend Interview": {
    message: "Prepare APIs, DB design, auth, caching basics, and debugging/system design questions.",
    options: ["View Open Positions", "Back to Menu"],
  },
  "HR Interview": {
    message: "Prepare concise stories on teamwork, ownership, challenges, and career goals.",
    options: ["View Open Positions", "Back to Menu"],
  },
  "Hiring Process": {
    message: "Typical flow: Apply → HR Screening → Technical Interview → Team Round → Offer.",
    options: ["View Open Positions", "Back to Menu"],
  },
  "Work Style": {
    message: "Work style is collaborative and outcome-driven with strong focus on learning and code quality.",
    options: ["View Open Positions", "Back to Menu"],
  },
  "Back to Menu": {
    redirectState: "start",
  },
};

const ChatbotWidget = () => {
  const navigate = useNavigate();
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [currentConversationState, setCurrentConversationState] = useState("start");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const initialBotMessage = useMemo(() => chatbotFlows.start.message, []);

  const restartConversation = () => {
    setCurrentConversationState("start");
    setChatMessages([{ from: "bot", text: initialBotMessage }]);
    setCurrentOptions(chatbotFlows.start.options || []);
  };

  useEffect(() => {
    restartConversation();
  }, [initialBotMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatbotOpen]);

  const handleOptionClick = (selectedOption) => {
    setChatMessages((prev) => [...prev, { from: "user", text: selectedOption }]);

    if (selectedOption === "View Open Positions") {
      setIsTyping(true);
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          { from: "bot", text: "Opening available roles now. You can use filters to narrow results." },
        ]);
        setIsTyping(false);
      }, 700);
      navigate("/positions");
      setCurrentConversationState("start");
      setCurrentOptions(chatbotFlows.start.options || []);
      return;
    }

    const flow = chatbotFlows[selectedOption] || chatbotFlows.start;

    if (flow.redirectState) {
      const redirected = chatbotFlows[flow.redirectState] || chatbotFlows.start;
      setCurrentConversationState(flow.redirectState);
      setIsTyping(true);
      setTimeout(() => {
        setChatMessages((prev) => [...prev, { from: "bot", text: redirected.message }]);
        setCurrentOptions(redirected.options || []);
        setIsTyping(false);
      }, 700);
      return;
    }

    setCurrentConversationState(selectedOption);

    const botPayload = [
      { from: "bot", text: flow.message || "Let’s continue." },
      ...(flow.suggestions?.length
        ? [{ from: "bot", text: `Suggestions: ${flow.suggestions.join(" • ")}` }]
        : []),
    ];

    setIsTyping(true);
    setTimeout(() => {
      setChatMessages((prev) => [...prev, ...botPayload]);
      setCurrentOptions(flow.options || chatbotFlows.start.options || []);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[70]">
      {chatbotOpen && (
        <div className="w-[92vw] max-w-md h-[560px] mb-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl shadow-purple-500/20 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-purple-600/30 to-cyan-500/20">
            <div className="flex items-center gap-2 text-slate-100 font-semibold">
              <Bot className="h-4 w-4" />
              Career Assistant
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={restartConversation}
                className="p-1.5 rounded-md text-slate-100 hover:bg-white/10"
                aria-label="Restart Chat"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setChatbotOpen(false)}
                className="p-1.5 rounded-md text-slate-100 hover:bg-white/10"
                aria-label="Close Chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, idx) => (
              <div
                key={`${msg.from}-${idx}`}
                className={`max-w-[88%] px-3 py-2 rounded-xl text-sm animate-[fadeIn_.2s_ease-in] ${
                  msg.from === "user"
                    ? "ml-auto bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
                    : "bg-white/5 border border-white/10 text-slate-100"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="max-w-[88%] px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/10 text-slate-100">
                AI is typing
                <span className="inline-flex ml-1 gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-bounce [animation-delay:120ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-bounce [animation-delay:240ms]" />
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-white/10 bg-white/5">
            <div className="text-xs text-slate-300/80 mb-2">Conversation state: {currentConversationState}</div>
            <div className="flex flex-wrap gap-2">
              {currentOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleOptionClick(option)}
                  className="px-3 py-2 rounded-lg text-xs sm:text-sm bg-white/10 border border-white/10 text-slate-100 hover:bg-purple-500/30 transition-all duration-200 hover:-translate-y-0.5"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setChatbotOpen((prev) => !prev)}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
        aria-label="Toggle Chat Assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ChatbotWidget;
