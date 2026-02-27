import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { io } from 'socket.io-client';
import { BASE_URL } from '../lib/api';

const SOCKET_URL = BASE_URL || 'http://localhost:5000';

const predefinedQuestions = [
    { q: "What devices do you buy?", a: "We buy smartphones, tablets, laptops, and smartwatches from all major brands like Apple, Samsung, Google, and more." },
    { q: "How do I get paid?", a: "You get paid via Bank Transfer, PayPal, or Check once we receive and inspect your device." },
    { q: "How long does payment take?", a: "Payments are processed within 24 hours of device inspection." },
    { q: "Do I pay for shipping?", a: "No! We provide a completely free, trackable prepaid shipping label for your device." },
    { q: "What if my phone is broken?", a: "We accept broken, cracked, and damaged devices. Just make sure to select the correct condition during quotation." },
    { q: "Is my personal data safe?", a: "Absolutely. We securely wipe all data from your device as soon as it arrives at our facility." },
    { q: "Can I cancel my trade-in?", a: "Yes, you can cancel your order any time before you ship the device to us." },
    { q: "How long is my quote valid?", a: "Your price quote is locked in and guaranteed for 14 days." },
    { q: "Do you buy locked phones?", a: "We buy carrier-locked phones easily, but we do not accept iCloud locked, MDM locked, or blacklisted devices." },
    { q: "Where can I drop off my package?", a: "You can drop off your securely packed device at any authorized shipping carrier listed on your label (UPS/USPS/FedEx)." }
];

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi there! How can we help you today? Feel free to ask a question below.", isBot: true }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isChatClosed, setIsChatClosed] = useState(false);
    const [socket, setSocket] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Initialize socket connection and session
    useEffect(() => {
        let currentSessionId = localStorage.getItem('chat_session_id');

        // Priority: Logged in user's email > existing guest session > new guest session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.email) {
                    currentSessionId = parsedUser.email; // Lock session to their account
                }
            } catch (err) {
                console.error("Error parsing user data");
            }
        }

        if (!currentSessionId) {
            currentSessionId = Math.random().toString(36).substring(2, 15);
            localStorage.setItem('chat_session_id', currentSessionId);
        }

        setSessionId(currentSessionId);

        const newSocket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'], // Fix for Render deployment
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            newSocket.emit('join_chat', currentSessionId);
        });

        // Load chat history
        const loadHistory = async () => {
            try {
                const res = await fetch(`${SOCKET_URL}/api/chat/${currentSessionId}`);
                const data = await res.json();
                if (data.messages && data.messages.length > 0) {
                    const mappedMessages = data.messages.map(m => ({
                        text: m.text,
                        isBot: m.sender === 'admin'
                    }));
                    setMessages(prev => {
                        // Keep the initial greeting if there's history, but don't duplicate it
                        return [{ text: "Hi there! How can we help you today? Feel free to ask a question below.", isBot: true }, ...mappedMessages];
                    });

                    if (data.status === 'closed') {
                        setIsChatClosed(true);
                        setMessages(prev => [...prev, { text: "Your chat is done. This conversation has been marked as resolved by our support team.", isBot: true }]);
                    }
                }
            } catch (error) {
                console.error("Failed to load chat history:", error);
            }
        };

        loadHistory();

        // Listen for admin replies
        newSocket.on('receive_message', (msg) => {
            if (msg.sender === 'admin') {
                setIsTyping(false);
                setMessages(prev => [...prev, { text: msg.text, isBot: true }]);
            }
            // If sender is 'user', it's already in the UI from optimistic update, so we can ignore.
        });

        // Listen for admin closing/deleting chat
        newSocket.on('chat_ended', ({ action }) => {
            setIsTyping(false);
            setIsChatClosed(true);
            setMessages(prev => [
                ...prev,
                { text: `Your chat is done. This conversation has been ${action === 'deleted' ? 'deleted' : 'resolved'} by our support team.`, isBot: true }
            ]);

            if (action === 'deleted') {
                localStorage.removeItem('chat_session_id'); // Clear local session so next refresh gives a fresh one
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleQuestionClick = (qa) => {
        setMessages(prev => [...prev, { text: qa.q, isBot: false }]);
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { text: qa.a, isBot: true }]);
        }, 800);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !socket || !sessionId) return;

        const userMsg = inputValue;

        if (isChatClosed) {
            setMessages([
                { text: "Hi there! How can we help you today? Feel free to ask a question below.", isBot: true },
                { text: userMsg, isBot: false }
            ]);
            setIsChatClosed(false);
        } else {
            // Optimistic UI update
            setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        }

        setInputValue("");
        setIsTyping(true); // Show typing indicator since we expect a human reply now

        // Get user data if logged in
        let userName = null;
        let userEmail = null;
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                userName = parsedUser.name || parsedUser.firstName;
                userEmail = parsedUser.email;
            } catch (err) {
                console.error("Error parsing user data for chat:", err);
            }
        }

        socket.emit('send_message', { sessionId, text: userMsg, userName, userEmail });

        // Timeout to disable typing indicator if admin doesn't reply quickly
        setTimeout(() => {
            setIsTyping(false);
        }, 30000); // 30 seconds wait for admin
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 cursor-pointer right-6 z-50 p-4 bg-green-600 text-white rounded-full shadow-2xl hover:bg-green-700 hover:scale-105 active:scale-95 transition-all duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}
            >
                <MessageSquare size={28} />
            </button>

            <div className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-[90vw] max-w-[380px] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform origin-bottom-right flex flex-col ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`} style={{ height: '600px', maxHeight: '80vh' }}>

                <div className="bg-green-600 text-white p-4 flex justify-between items-center shadow-md z-10 relative">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <MessageSquare size={20} className="text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">CashMish Support</h3>
                            <p className="text-xs text-green-100">Usually replies instantly</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 transition-colors cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[85%] p-3 text-sm ${msg.isBot ? 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm shadow-sm' : 'bg-green-600 text-white rounded-2xl rounded-tr-sm shadow-md'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="max-w-[85%] p-4 bg-white border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-3 bg-white border-t border-gray-100 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                    <div className="flex gap-2">
                        {predefinedQuestions.map((qa, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleQuestionClick(qa)}
                                className="inline-block px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded-full hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all active:scale-95 cursor-pointer whitespace-normal text-left min-w-[150px] max-w-[200px]"
                            >
                                {qa.q}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-3 bg-white border-t border-gray-100">
                    <form onSubmit={handleSendMessage} className="flex relative items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={isChatClosed ? "Chat is closed. Type to start new..." : "Type your message..."}
                            className={`w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all ${isChatClosed ? 'bg-gray-100 text-gray-500' : ''}`}
                        />
                        <button
                            type="submit"
                            className="absolute right-2 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            disabled={!inputValue.trim()}
                        >
                            <Send size={16} className="-ml-0.5" />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
