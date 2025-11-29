import React, { useState } from 'react';
import { Shield, MessageCircle, BookOpen } from 'lucide-react';
import PanicFAB from './PanicFAB';

const Layout = ({ children }) => {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className="min-h-screen bg-kinga-gray flex justify-center">
            <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto pb-20">
                    {children}
                </main>

                {/* Panic Button (Floating) */}
                <PanicFAB />

                {/* Bottom Navigation */}
                <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 flex justify-around items-center py-3 z-40">
                    <button
                        onClick={() => setActiveTab('home')}
                        className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-kinga-pink' : 'text-gray-400'}`}
                    >
                        <Shield size={24} />
                        <span className="text-xs font-medium">Safe Space</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('community')}
                        className={`flex flex-col items-center gap-1 ${activeTab === 'community' ? 'text-kinga-pink' : 'text-gray-400'}`}
                    >
                        <MessageCircle size={24} />
                        <span className="text-xs font-medium">Community</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('learn')}
                        className={`flex flex-col items-center gap-1 ${activeTab === 'learn' ? 'text-kinga-pink' : 'text-gray-400'}`}
                    >
                        <BookOpen size={24} />
                        <span className="text-xs font-medium">Learn</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default Layout;
