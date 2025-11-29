import React from 'react';
import { motion } from 'framer-motion';
import { Image, Shield, Eye, MessageCircle } from 'lucide-react';

const Dashboard = () => {
    const crisisOptions = [
        { id: 'ncii', label: 'My Images were Shared', icon: Image, color: 'bg-rose-100 text-rose-600' },
        { id: 'blackmail', label: 'I am being Blackmailed', icon: Shield, color: 'bg-orange-100 text-orange-600' },
        { id: 'stalking', label: 'Harassment / Stalking', icon: Eye, color: 'bg-purple-100 text-purple-600' },
        { id: 'chat', label: 'I just want to talk', icon: MessageCircle, color: 'bg-teal-100 text-teal-600' },
    ];

    return (
        <div className="p-6 pt-12">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-kinga-dark mb-2">Safe Space</h1>
                <p className="text-gray-500">You are safe here. How can we help?</p>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {crisisOptions.map((option, index) => (
                    <motion.button
                        key={option.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
                    >
                        <div className={`p-4 rounded-full ${option.color} mr-4`}>
                            <option.icon size={24} />
                        </div>
                        <span className="text-lg font-semibold text-gray-800">{option.label}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
