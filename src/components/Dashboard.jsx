import React, { useState, useEffect } from 'react';
import usePanic from '../hooks/usePanic';
import { analyzeCrisis } from '../logic/LogicEngine';
import { useStealthStore } from '../context/StealthContext';
import { supabase } from '../services/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, MessageCircle, AlertTriangle, Image as ImageIcon, Heart, X, BookOpen, Home, ChevronLeft, Send, Activity, Users, WifiOff } from 'lucide-react';

// MOCK DATA: Pulse Engine
const COMMUNITY_TRENDS = [
    { category: 'NCII', alert: '⚠️ High reports of sextortion. Don’t delete chats.' },
    { category: 'Blackmail', alert: '⚠️ Campus Alert: "Sponsor" blackmail wave detected.' }
];

// SAFETY GUIDES DICTIONARY
const GUIDES = {
    NCII: {
        title: "My Images Were Shared",
        steps: [
            "1. Do NOT delete the chat. You need evidence.",
            "2. Screenshot the URL and profile of the sender.",
            "3. Report to the platform (Telegram/FB) immediately.",
            "4. Contact the Digital Safety Hotline: 999-HELP."
        ],
        color: "bg-pink-50 text-pink-700"
    },
    Blackmail: {
        title: "I Am Being Blackmailed",
        steps: [
            "1. Stop all communication. Do not pay.",
            "2. Screenshot the threats.",
            "3. Lock your social media privacy settings.",
            "4. Tell a trusted adult or mentor."
        ],
        color: "bg-orange-50 text-orange-700"
    },
    Harassment: {
        title: "Harassment & Stalking",
        steps: [
            "1. Mute notifications from the harasser.",
            "2. Document every interaction (Time/Date).",
            "3. Change your passwords immediately.",
            "4. Share your live location with a trusted friend."
        ],
        color: "bg-purple-50 text-purple-700"
    },
    General: {
        title: "I Just Need to Talk",
        steps: [
            "1. You are not alone.",
            "2. Call the free counseling line: 888-TALK.",
            "3. Join the anonymous community chat below.",
            "4. Practice 4-7-8 breathing."
        ],
        color: "bg-teal-50 text-teal-700"
    }
};

// OFFLINE FALLBACK MODULES
const OFFLINE_MODULES = [
    { id: 991, title: 'Emergency: Secure Your Telegram', description: 'Hide your number and block unknown calls immediately.', tags: ['Offline', 'Urgent'] },
    { id: 992, title: 'How to Document Abuse', description: 'A safe guide to taking screenshots without alerting the abuser.', tags: ['Offline', 'Legal'] },
    { id: 993, title: 'Self-Care During Crisis', description: 'Grounding techniques when you feel overwhelmed.', tags: ['Offline', 'Health'] }
];

const Dashboard = () => {
    usePanic(); // Universal Panic Switch (Shake/Double ESC)
    const { toggleStealthMode, isStealthMode } = useStealthStore();
    const [activeTab, setActiveTab] = useState('home');

    // Logic/Pulse State
    const [userInput, setUserInput] = useState('');
    const [recommendation, setRecommendation] = useState(null);
    const [selectedGuide, setSelectedGuide] = useState(null);

    // LMS State
    const [learningModules, setLearningModules] = useState([]);
    const [isLoadingModules, setIsLoadingModules] = useState(false);
    const [isOffline, setIsOffline] = useState(false);

    // MOCK DATA: Community Feed
    const chats = [
        { id: 1, name: "Brave Lioness", msg: "I finally blocked him on everything...", time: "15:43", unread: 0 },
        { id: 2, name: "Hopeful Heart", msg: "Does anyone know how to report...", time: "15:29", unread: 0 },
        { id: 3, name: "Warrior_01", msg: "Thanks for the advice yesterday!", time: "14:53", unread: 2 },
    ];

    // Effect: Fetch LMS Modules when entering Learn tab
    useEffect(() => {
        if (activeTab === 'learn') {
            fetchModules();
        }
    }, [activeTab]);

    const fetchModules = async () => {
        setIsLoadingModules(true);
        setIsOffline(false);
        try {
            const { data, error } = await supabase
                .from('lms_modules')
                .select('*')
                .eq('is_trending', true);

            if (error) throw error;

            if (data && data.length > 0) {
                setLearningModules(data);
            } else {
                setLearningModules(OFFLINE_MODULES); // Fallback if DB empty
            }
        } catch (err) {
            console.error("LMS Fetch Error (or Offline):", err);
            setLearningModules(OFFLINE_MODULES);
            setIsOffline(true);
        } finally {
            setIsLoadingModules(false);
        }
    };

    const handlePulseCheck = () => {
        if (!userInput.trim()) return;

        const analysis = analyzeCrisis(userInput);

        // Check against Community Trends
        const trendMatch = COMMUNITY_TRENDS.find(t => t.category === analysis.primary_category);

        if (trendMatch) {
            setRecommendation({ type: 'alert', msg: trendMatch.alert, category: analysis.primary_category });
        } else {
            setRecommendation({ type: 'info', msg: `We hear you. Here is a guide for ${analysis.primary_category}.`, category: analysis.primary_category });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 relative overflow-hidden font-sans">

            {/* 1. HEADER */}
            <header className="bg-white px-6 pt-12 pb-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hello, Survivor</h1>
                    <p className="text-sm text-gray-500">You are safe here.</p>
                </div>
                <button onClick={toggleStealthMode} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition">
                    <Lock size={20} />
                </button>
            </header>

            {/* 2. MAIN CONTENT AREA */}
            <main className="px-6 mt-6">
                <AnimatePresence mode="wait">

                    {/* --- HOME TAB --- */}
                    {activeTab === 'home' && (
                        <motion.div key="home" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                            {!selectedGuide ? (
                                <>
                                    {/* PULSE ENGINE */}
                                    <div className="mb-6">
                                        <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                            <Activity size={18} className="text-rose-500" /> How are you feeling?
                                        </h2>
                                        <div className="relative">
                                            <textarea
                                                className="w-full p-4 pr-12 rounded-2xl border-none shadow-sm bg-white text-gray-700 resize-none focus:ring-2 focus:ring-rose-100 outline-none"
                                                rows="3" placeholder="Type safely here..." value={userInput} onChange={(e) => setUserInput(e.target.value)}
                                            />
                                            <button onClick={handlePulseCheck} className="absolute bottom-3 right-3 p-2 bg-rose-500 rounded-full text-white shadow-md hover:bg-rose-600 transition">
                                                <Send size={16} />
                                            </button>
                                        </div>
                                        {recommendation && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                                className={`mt-4 p-4 rounded-xl border-l-4 shadow-sm flex items-start gap-3 ${recommendation.type === 'alert' ? 'bg-orange-50 border-orange-500 text-orange-800' : 'bg-teal-50 border-teal-500 text-teal-800'}`}
                                            >
                                                <AlertTriangle size={20} className="shrink-0 mt-1" />
                                                <div className="text-sm">
                                                    <p className="font-bold">{recommendation.type === 'alert' ? 'Community Alert' : 'Guidance'}</p>
                                                    <p>{recommendation.msg}</p>
                                                    {recommendation.category && GUIDES[recommendation.category] && (
                                                        <button onClick={() => setSelectedGuide(GUIDES[recommendation.category])} className="text-xs font-bold underline mt-2">View Safety Steps</button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* CRISIS GRID */}
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Safety Guides</h2>
                                    <div className="grid grid-cols-2 gap-4 pb-20">
                                        {Object.keys(GUIDES).map((key) => {
                                            const guide = GUIDES[key];
                                            let icon = <Shield size={24} />;
                                            if (key === 'NCII') icon = <ImageIcon size={24} />;
                                            if (key === 'Harassment') icon = <AlertTriangle size={24} />;
                                            if (key === 'General') icon = <Heart size={24} />;

                                            // Mapping colors for buttons dynamically or hardcoding them for safety
                                            let btnColor = "text-gray-600 bg-gray-50";
                                            if (key === 'NCII') btnColor = "text-brand-pink bg-pink-50";
                                            if (key === 'Blackmail') btnColor = "text-orange-500 bg-orange-50";
                                            if (key === 'Harassment') btnColor = "text-purple-500 bg-purple-50";
                                            if (key === 'General') btnColor = "text-safety-teal bg-teal-50";

                                            return (
                                                <button key={key} onClick={() => setSelectedGuide(guide)} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:shadow-md transition active:scale-95 text-center">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${btnColor}`}>
                                                        {icon}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700 leading-tight">{guide.title}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </>
                            ) : (
                                /* SAFETY GUIDE VIEW */
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 min-h-[50vh]">
                                    <button onClick={() => setSelectedGuide(null)} className="flex items-center text-gray-400 text-sm mb-4 hover:text-gray-600">
                                        <ChevronLeft size={16} /> Back to Grid
                                    </button>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{selectedGuide.title}</h2>
                                    <div className="space-y-4">
                                        {selectedGuide.steps.map((step, idx) => (
                                            <div key={idx} className="flex gap-4 items-start">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold ${selectedGuide.color.split(' ')[0]} ${selectedGuide.color.split(' ')[1]}`}>{idx + 1}</div>
                                                <p className="text-gray-600 leading-relaxed pt-1">{step.substring(3)}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition">I have done these steps</button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* --- COMMUNITY TAB --- */}
                    {activeTab === 'community' && (
                        <motion.div key="community" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl mb-6 flex gap-3 text-rose-800">
                                <Users size={20} className="shrink-0" />
                                <p className="text-xs font-medium">This space is anonymous. Your identity is hidden.</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg mb-4 flex gap-2 border border-gray-200">
                                <input type="text" placeholder="Search Topics..." className="bg-transparent w-full text-sm outline-none px-2 text-gray-600" />
                            </div>
                            <div className="space-y-3 pb-20">
                                {chats.map(chat => (
                                    <div key={chat.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 border border-gray-50 active:scale-[0.99] transition">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-100 to-rose-100 flex items-center justify-center text-rose-400 font-bold text-lg">{chat.name[0]}</div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1"><h3 className="font-bold text-gray-800 text-sm">{chat.name}</h3><span className="text-xs text-gray-400">{chat.time}</span></div>
                                            <p className="text-xs text-gray-500 truncate w-48">{chat.msg}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* --- LEARN TAB (DYNAMIC LMS) --- */}
                    {activeTab === 'learn' && (
                        <motion.div key="learn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Safety Center</h2>
                                <p className="text-sm text-gray-500">Guides to protect your digital life.</p>
                            </div>

                            {/* OFFLINE INDICATOR */}
                            {isOffline && (
                                <div className="bg-orange-100 border border-orange-200 text-orange-800 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
                                    <WifiOff size={20} />
                                    <span className="text-xs font-bold">Offline Mode: Showing Emergency Guides</span>
                                </div>
                            )}

                            {isLoadingModules ? (
                                <div className="text-center py-20 text-gray-400">Loading...</div>
                            ) : (
                                <div className="space-y-4 pb-20">
                                    {learningModules.map((module) => (
                                        <div key={module.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-gray-800">{module.title}</h3>
                                                {module.is_trending && <span className="text-[10px] bg-rose-100 text-rose-600 px-2 py-1 rounded-full font-bold">TRENDING</span>}
                                            </div>
                                            <p className="text-sm text-gray-500 mb-3 leading-relaxed">{module.description}</p>
                                            <div className="flex gap-2">
                                                {module.tags && module.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md">#{tag}</span>
                                                ))}
                                            </div>
                                            <button className="w-full mt-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition">
                                                Read Guide
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* --- SETTINGS TAB --- */}
                    {activeTab === 'settings' && (
                        <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                                <p className="text-sm text-gray-500">Control your safety & privacy.</p>
                            </div>

                            {/* STEALTH CONTROL */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gray-100 p-2 rounded-full text-gray-600">
                                            <Lock size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-sm">Calculator Disguise</h3>
                                            <p className="text-xs text-gray-500">Open app as a calculator.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={toggleStealthMode}
                                        className={`w-12 h-7 rounded-full transition-colors relative ${isStealthMode ? 'bg-rose-500' : 'bg-gray-200'}`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${isStealthMode ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 border border-gray-100">
                                    <strong>Tip:</strong> When enabled, type <span className="font-mono bg-white px-1 rounded border">1616=</span> to unlock the app.
                                </div>
                            </div>

                            {/* ADMIN VIEW (HACKATHON DEMO) */}
                            <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl">
                                <h3 className="font-bold text-indigo-900 text-sm mb-3 flex items-center gap-2">
                                    <Shield size={16} /> Admin Insight (Hackathon View)
                                </h3>
                                <p className="text-xs text-indigo-700 mb-4 leading-relaxed">
                                    Admins can see real-time community safety trends based on the "Pulse" engine data.
                                </p>

                                <div className="space-y-2">
                                    {COMMUNITY_TRENDS.map((trend, idx) => (
                                        <div key={idx} className="bg-white p-3 rounded-lg text-xs border border-indigo-100 shadow-sm flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 shrink-0 animate-pulse" />
                                            <div>
                                                <span className="font-bold text-gray-800">{trend.category}:</span> {trend.alert}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* 3. PANIC BUTTON */}
            <button onClick={() => window.location.href = 'https://google.com'} className="fixed bottom-24 right-6 w-14 h-14 bg-red-500 rounded-full shadow-lg shadow-red-200 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition z-50 border-4 border-white">
                <X size={28} strokeWidth={3} />
            </button>

            {/* 4. BOTTOM NAV */}
            <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-40 pb-6 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
                {[
                    { id: 'home', label: 'Home', icon: Home },
                    { id: 'community', label: 'Community', icon: MessageCircle },
                    { id: 'learn', label: 'Learn', icon: BookOpen },
                    { id: 'settings', label: 'Settings', icon: Lock }
                ].map(item => (
                    <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === item.id ? 'text-rose-500' : 'text-gray-300'}`}>
                        <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Dashboard;