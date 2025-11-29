import React, { useState } from 'react';
import { analyzeCrisis } from '../logic/LogicEngine';
import { useStealthStore } from '../context/StealthContext';
import { motion } from 'framer-motion';
import { Shield, Lock, Activity, Users } from 'lucide-react';

const Dashboard = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);
    const { toggleStealthMode, isStealthMode } = useStealthStore();

    const handleAnalyze = () => {
        if (!input.trim()) return;
        const analysis = analyzeCrisis(input);
        setResult(analysis);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Shield className="text-kinga-orange w-8 h-8" />
                    <h1 className="text-2xl font-bold text-kinga-dark">Kinga</h1>
                </div>
                <button
                    onClick={toggleStealthMode}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition"
                >
                    <Lock className="w-4 h-4" />
                    {isStealthMode ? 'Disable Stealth' : 'Enable Stealth'}
                </button>
            </header>

            <main className="max-w-2xl mx-auto p-6 mt-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-8"
                >
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">How are you feeling?</h2>
                    <textarea
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kinga-blue focus:border-transparent outline-none resize-none h-32"
                        placeholder="Tell us what happened..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleAnalyze}
                            className="bg-kinga-blue text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition flex items-center gap-2"
                        >
                            <Activity className="w-5 h-5" />
                            Analyze Safety
                        </button>
                    </div>
                </motion.div>

                {result && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 grid gap-4"
                    >
                        <div className={`p-6 rounded-xl border-l-4 shadow-sm ${result.urgency_level === 'Critical' ? 'bg-red-50 border-red-500' :
                                result.urgency_level === 'Moderate' ? 'bg-orange-50 border-orange-500' :
                                    'bg-green-50 border-green-500'
                            }`}>
                            <h3 className="font-bold text-lg mb-2">Analysis Result</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500 block">Urgency</span>
                                    <span className="font-semibold">{result.urgency_level}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Category</span>
                                    <span className="font-semibold">{result.primary_category}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Sentiment Score</span>
                                    <span className="font-semibold">{result.sentiment_score}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Platform</span>
                                    <span className="font-semibold">{result.platform_context}</span>
                                </div>
                            </div>
                        </div>

                        {/* Recommendation Stub */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-4 text-kinga-dark">
                                <Users className="w-5 h-5" />
                                <h3 className="font-bold">Recommended Actions</h3>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {result.primary_category === 'NCII' && (
                                    <li className="flex items-start gap-2">
                                        <span className="text-kinga-orange">•</span>
                                        Document evidence immediately (screenshots, URLs).
                                    </li>
                                )}
                                {result.platform_context === 'Telegram' && (
                                    <li className="flex items-start gap-2">
                                        <span className="text-kinga-blue">•</span>
                                        Review Telegram Privacy Settings: Hide phone number and last seen.
                                    </li>
                                )}
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500">•</span>
                                    Connect with a peer who overcame {result.primary_category}.
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
