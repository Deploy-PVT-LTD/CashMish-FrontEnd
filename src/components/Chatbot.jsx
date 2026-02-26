import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

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
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

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
        if (!inputValue.trim()) return;

        const userMsg = inputValue;
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInputValue("");
        setIsTyping(true);

        try {
            // TODO: Replace with actual POST link provided later by the user
            // const response = await fetch('YOUR_POST_LINK_HERE', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ message: userMsg })
            // });

            setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [...prev, { text: "Thank you for your message! Our human agents will get back to you soon.", isBot: true }]);
            }, 1000);
        } catch (error) {
            setIsTyping(false);
            setMessages(prev => [...prev, { text: "Sorry, there was an error sending your message.", isBot: true }]);
        }
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
                            placeholder="Type your message..."
                            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
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
