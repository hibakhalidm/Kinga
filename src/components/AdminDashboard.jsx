import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Shield, BookOpen, Activity, Plus, Trash, AlertTriangle, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [trends, setTrends] = useState([]);
    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Form State for New Module
    const [newModule, setNewModule] = useState({ title: '', description: '', tags: '', content_url: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        // 1. Fetch Trends
        const { data: trendsData } = await supabase.from('community_trends').select('*').eq('is_active', true);
        if (trendsData) setTrends(trendsData);

        // 2. Fetch Modules
        const { data: modulesData } = await supabase.from('lms_modules').select('*').order('created_at', { ascending: false });
        if (modulesData) setModules(modulesData);
        setIsLoading(false);
    };

    const handleAddModule = async (e) => {
        e.preventDefault();
        if (!newModule.title || !newModule.description) return;

        const { error } = await supabase.from('lms_modules').insert([{
            title: newModule.title,
            description: newModule.description,
            tags: newModule.tags.split(',').map(t => t.trim()),
            content_url: newModule.content_url,
            is_trending: false
        }]);

        if (!error) {
            setNewModule({ title: '', description: '', tags: '', content_url: '' });
            fetchData();
        } else {
            alert('Error adding module: ' + error.message);
        }
    };

    const handleDeleteModule = async (id) => {
        if (!window.confirm('Delete this module?')) return;
        const { error } = await supabase.from('lms_modules').delete().eq('id', id);
        if (!error) fetchData();
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* SIDEBAR */}
            <aside className="w-64 bg-indigo-900 text-white p-6 flex flex-col">
                <div className="mb-10 flex items-center gap-2">
                    <Shield className="text-rose-500" size={28} />
                    <h1 className="text-xl font-bold">Kinga Admin</h1>
                </div>

                <nav className="space-y-4 flex-1">
                    <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${activeTab === 'overview' ? 'bg-indigo-800 text-white' : 'text-indigo-300 hover:text-white'}`}>
                        <Activity size={20} /> Overview
                    </button>
                    <button onClick={() => setActiveTab('lms')} className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${activeTab === 'lms' ? 'bg-indigo-800 text-white' : 'text-indigo-300 hover:text-white'}`}>
                        <BookOpen size={20} /> Learning Modules
                    </button>
                </nav>

                <div className="text-xs text-indigo-400 mt-auto">
                    v1.0.0 (Hackathon Build)
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-10 overflow-y-auto">
                <h2 className="text-3xl font-bold mb-8 capitalize">{activeTab} Dashboard</h2>

                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* STATS ROW */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="p-3 bg-rose-100 text-rose-600 rounded-full"><AlertTriangle size={24} /></div>
                                <div><p className="text-gray-500 text-sm">Active Threats</p><p className="text-2xl font-bold">{trends.length}</p></div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><BookOpen size={24} /></div>
                                <div><p className="text-gray-500 text-sm">Total Modules</p><p className="text-2xl font-bold">{modules.length}</p></div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="p-3 bg-green-100 text-green-600 rounded-full"><Activity size={24} /></div>
                                <div><p className="text-gray-500 text-sm">System Status</p><p className="text-2xl font-bold text-green-600">Healthy</p></div>
                            </div>
                        </div>

                        {/* HEATMAP VISUALIZATION */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><BarChart2 className="text-indigo-600" /> Community Threat Heatmap</h3>

                            {trends.length === 0 ? (
                                <p className="text-gray-400">No active threats detected. The community is stable.</p>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {trends.map(trend => {
                                        let color = "bg-gray-100";
                                        if (trend.severity === 'High') color = "bg-red-500 text-white";
                                        if (trend.severity === 'Medium') color = "bg-orange-400 text-white";
                                        if (trend.severity === 'Low') color = "bg-yellow-100 text-yellow-800";

                                        return (
                                            <div key={trend.id} className={`${color} p-6 rounded-2xl flex flex-col justify-between h-40 transition hover:scale-[1.02]`}>
                                                <div className="text-xs font-bold uppercase tracking-wider opacity-80">{trend.category}</div>
                                                <div className="font-bold text-lg leading-tight">{trend.alert_text}</div>
                                                <div className="text-xs mt-2 opacity-75">{new Date(trend.created_at).toLocaleDateString()}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'lms' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold">Manage Safety Guides</h3>
                        </div>

                        {/* ADD MODULE FORM */}
                        <div className="p-8 bg-gray-50 border-b border-gray-100">
                            <h4 className="text-sm font-bold text-gray-600 mb-4">Add New Module</h4>
                            <form onSubmit={handleAddModule} className="grid gap-4 md:grid-cols-2">
                                <input className="p-3 rounded-lg border border-gray-200" placeholder="Title (e.g., 'Secure your WhatsApp')" value={newModule.title} onChange={e => setNewModule({ ...newModule, title: e.target.value })} />
                                <input className="p-3 rounded-lg border border-gray-200" placeholder="Tags (comma separated)" value={newModule.tags} onChange={e => setNewModule({ ...newModule, tags: e.target.value })} />
                                <textarea className="p-3 rounded-lg border border-gray-200 md:col-span-2" placeholder="Description / Summary" rows="2" value={newModule.description} onChange={e => setNewModule({ ...newModule, description: e.target.value })} />
                                <button type="submit" className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-indigo-700 transition md:col-span-2 flex justify-center items-center gap-2">
                                    <Plus size={18} /> Upload Module
                                </button>
                            </form>
                        </div>

                        {/* MODULE LIST */}
                        <div className="p-4">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs text-gray-400 border-b border-gray-100">
                                        <th className="p-4 font-medium">Title</th>
                                        <th className="p-4 font-medium">Tags</th>
                                        <th className="p-4 font-medium">Date</th>
                                        <th className="p-4 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modules.map(mod => (
                                        <tr key={mod.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                            <td className="p-4 font-semibold text-gray-700">{mod.title}</td>
                                            <td className="p-4">
                                                <div className="flex gap-1 flex-wrap">
                                                    {mod.tags?.map(tag => <span key={tag} className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600">{tag}</span>)}
                                                </div>
                                            </td>
                                            <td className="p-4 text-xs text-gray-400">{new Date(mod.created_at).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <button onClick={() => handleDeleteModule(mod.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition">
                                                    <Trash size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
