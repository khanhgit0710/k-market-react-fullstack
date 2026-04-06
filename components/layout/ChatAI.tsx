'use client'; // Bắt buộc vì có state và event

import { useState, useRef, useEffect } from 'react';
import { BotMessageSquare, X, SendHorizontal, CornerDownLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SafeClientVisual from '@/components/ui/SafeClientVisual';

type Message = {
    role: 'user' | 'bot';
    text: string;
};

const ChatAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', text: 'Chào Khánh! Trợ lý K-Market nghe đây. Bạn cần tìm gì?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isNearFooter, setIsNearFooter] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Tự động cuộn xuống khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const footer = document.getElementById("site-footer");
        if (!footer) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsNearFooter(entry.isIntersecting);
            },
            {
                root: null,
                threshold: 0.15,
            }
        );

        observer.observe(footer);
        return () => observer.disconnect();
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', text: input.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Gọi tới API Route mà mình đã bàn ở trên
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();

            if (data.text) {
                setMessages((prev) => [...prev, { role: 'bot', text: data.text }]);
            } else {
                throw new Error('No response');
            }
        } catch (error) {
            setMessages((prev) => [...prev, { role: 'bot', text: 'Lỗi rồi fen, thử lại sau nhé!' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const activeHeaderColor = isNearFooter ? "bg-violet-600" : "bg-[#ff6647]";
    const activeBubbleColor = isNearFooter ? "bg-violet-600" : "bg-[#ff6647]";
    const activeButtonColor = isNearFooter
        ? "bg-violet-600 hover:bg-violet-500"
        : "bg-[#ee4d2d] hover:bg-[#ff6647]";

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Khung Chat */}
            {isOpen && (
                <div className="w-[380px] h-[550px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-5 transition-all duration-300 ease-in-out transform scale-100 origin-bottom-right">
                    {/* Header */}
                    <div className={`${activeHeaderColor} p-5 text-white flex justify-between items-center transition-colors duration-300`}>
                        <div className="flex items-center gap-3">
                            <div className={`${activeHeaderColor} p-2 rounded-xl transition-colors duration-300`}>
                                <BotMessageSquare size={26} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">K-Market AI</h3>
                                <p className="text-sm text-gray-800">Trợ lý ảo thông minh</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Danh sách tin nhắn */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-3xl ${msg.role === 'user'
                                    ? `${activeBubbleColor} text-white rounded-br-none transition-colors duration-300`
                                    : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
                                    }`}>
                                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                        {msg.role === 'bot' ? (
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        ) : (
                                            msg.text
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Loading */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="p-4 rounded-3xl bg-white shadow-sm border border-gray-100 rounded-bl-none">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-300"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Ô nhập liệu */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Hỏi K-Market về sản phẩm..."
                                className="w-full p-4 pr-16 text-sm bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-blue-200 transition"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading}
                                className={`absolute right-2 p-3 text-white rounded-full transition disabled:bg-gray-300 ${activeButtonColor}`}
                            >
                                <SafeClientVisual fallbackClassName="inline-flex h-5 w-5 items-center justify-center">
                                    {isLoading ? <CornerDownLeft size={20} className='animate-pulse' /> : <SendHorizontal size={20} />}
                                </SafeClientVisual>
                            </button>
                        </div>
                        <p className='text-center text-xs text-gray-400 mt-3'>AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.</p>
                    </div>
                </div>
            )}

            {/* Nút Tròn Mở Chat */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-110 text-white ${isOpen ? `rotate-180 ${activeButtonColor}` : activeButtonColor}`}
            >
                <SafeClientVisual fallbackClassName="inline-flex h-7 w-7 items-center justify-center">
                    {isOpen ? <X size={28} /> : <BotMessageSquare size={28} />}
                </SafeClientVisual>
            </button>
        </div>
    );
};

export default ChatAI;