import React, { useState } from 'react';
import { analyzeCrisis } from '../logic/LogicEngine';
import { useStealthStore } from '../context/StealthContext';
import { motion } from 'framer-motion';
// Ensure you have installed these icons: npm install lucide-react
import { Shield, Lock, MessageCircle, AlertTriangle, Image as ImageIcon, Heart, X, BookOpen, Home, Users } from 'lucide-react';

const Dashboard = () => {
    const { toggleStealthMode } = useStealthStore();
    const [activeTab, setActiveTab] = useState('home');

    // MOCK DATA for Community Feed (Matches your Chat Design)
    const chats = [
        { id: 1, name: "Brave Lioness", msg: "I finally blocked him on everything...", time: "15:43", unread: 0 },
        { id: 2, name: "Hopeful Heart", msg: "Does anyone know how to report...", time: "15:29", unread: 0 },
        { id: 3, name: "Warrior_01", msg: "Thanks for the advice yesterday!", time: "14:53", unread: 2 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20 relative overflow-hidden">
            
            {/* 1. HEADER (Matches Design: Clean & Safe) */}
            <header className="bg-white px-6 pt-12 pb-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hello, Survivor</h1>
                    <p className="text-sm text-gray-500">You are safe here.</p>
                </div>
                <button 
                    onClick={toggleStealthMode}
                    className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition"
                    title="Lock App"
                >
                    <Lock size={20} />
                </button>
            </header>

            {/* 2. MAIN CONTENT AREA */}
            <main className="px-6 mt-6">
                
                {/* --- HOME TAB: CRISIS GRID --- */}
                {activeTab === 'home' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">How can we help today?</h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {/* Card 1: NCII */}
                            <button className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:shadow-md transition active:scale-95 text-center">
                                <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-brand-pink">
                                    <ImageIcon size={24} />
                                </div>
                                <span className="text-sm font-medium text-gray-700 leading-tight">My images were shared</span>
                            </button>

                            {/* Card 2: Blackmail */}
                            <button className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:shadow-md transition active:scale-95 text-center">
                                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                                    <Shield size={24} />
                                </div>
                                <span className="text-sm font-medium text-gray-700 leading-tight">I am being blackmailed</span>
                            </button>

                            {/* Card 3: Harassment */}
                            <button className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:shadow-md transition active:scale-95 text-center">
                                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
                                    <AlertTriangle size={24} />
                                </div>
                                <span className="text-sm font-medium text-gray-700 leading-tight">Harassment & Stalking</span>
                            </button>

                            {/* Card 4: Just Talk */}
                            <button className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:shadow-md transition active:scale-95 text-center">
                                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-safety-teal">
                                    <Heart size={24} />
                                </div>
                                <span className="text-sm font-medium text-gray-700 leading-tight">I just want to talk</span>
                            </button>
                        </div>

                        {/* Quick Tip Banner */}
                        <div className="mt-6 bg-brand-light rounded-xl p-4 flex items-start gap-3">
                            <div className="bg-white p-2 rounded-full text-brand-pink mt-1">
                                <Shield size={16} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-brand-dark">Quick Safety Tip</h3>
                                <p className="text-xs text-brand-dark opacity-80 mt-1">
                                    Turn off "Last Seen" on Telegram to prevent stalkers from tracking your activity.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- COMMUNITY TAB: CHAT LIST (From Design) --- */}
                {activeTab === 'community' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                         <div className="bg-gray-100 p-2 rounded-lg mb-4 flex gap-2">
                             <input type="text" placeholder="Search Chat" className="bg-transparent w-full text-sm outline-none px-2 text-gray-600" />
                         </div>
                         
                         <div className="space-y-2">
                             {chats.map(chat => (
                                 <div key={chat.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 border border-gray-50">
                                     <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-200 to-purple-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                                        {chat.name[0]}
                                     </div>
                                     <div className="flex-1">
                                         <div className="flex justify-between items-center mb-1">
                                             <h3 className="font-bold text-gray-800 text-sm">{chat.name}</h3>
                                             <span className="text-xs text-gray-400">{chat.time}</span>
                                         </div>
                                         <p className="text-xs text-gray-500 truncate">{chat.msg}</p>
                                     </div>
                                     {chat.unread > 0 && (
                                         <div className="w-5 h-5 bg-brand-pink rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                             {chat.unread}
                                         </div>
                                     )}
                                 </div>
                             ))}
                         </div>
                    </motion.div>
                )}

            </main>

            {/* 3. PANIC BUTTON (Floating) */}
            <button 
                onClick={() => window.location.href = 'https://google.com'}
                className="fixed bottom-24 right-6 w-14 h-14 bg-alert rounded-full shadow-xl flex items-center justify-center text-white hover:scale-105 active:scale-95 transition z-50 border-4 border-white"
            >
                <X size={28} strokeWidth={3} />
            </button>

            {/* 4. BOTTOM NAVIGATION (Matches Design) */}
            <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-40 pb-6">
                <button 
                    onClick={() => setActiveTab('home')}
                    className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-brand-pink' : 'text-gray-400'}`}
                >
                    <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Home</span>
                </button>
                
                <button 
                    onClick={() => setActiveTab('community')}
                    className={`flex flex-col items-center gap-1 ${activeTab === 'community' ? 'text-brand-pink' : 'text-gray-400'}`}
                >
                    <MessageCircle size={24} strokeWidth={activeTab === 'community' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Community</span>
                </button>

                <button 
                    onClick={() => setActiveTab('learn')}
                    className={`flex flex-col items-center gap-1 ${activeTab === 'learn' ? 'text-brand-pink' : 'text-gray-400'}`}
                >
                    <BookOpen size={24} strokeWidth={activeTab === 'learn' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Learn</span>
                </button>
            </nav>
        </div>
    );
};

export default Dashboard;