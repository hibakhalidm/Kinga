import React, { useEffect } from 'react';
import { useStealthStore } from './context/StealthContext';
import { AuthProvider } from './context/AuthContext';
import Calculator from './components/Calculator';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import { AnimatePresence, motion } from 'framer-motion';

import AdminDashboard from './components/AdminDashboard'; // Import Admin Component

function App() {
    const { isStealthMode, isLocked, resetLock } = useStealthStore();

    // Reset lock state on mount (if in stealth mode, ensure locked)
    useEffect(() => {
        resetLock();
    }, [resetLock]);

    // ROUTING CHECK (Simple Manual Router)
    const isAdminRoute = window.location.pathname === '/admin';

    if (isAdminRoute) {
        return <AdminDashboard />;
    }

    // Determine what to show
    // If Stealth Mode is OFF -> Show Dashboard directly (State A)
    // If Stealth Mode is ON -> Show Calculator (State B), unless unlocked

    const showCalculator = isStealthMode && isLocked;

    return (
        <AuthProvider>
            <AnimatePresence mode="wait">
                {showCalculator ? (
                    <motion.div
                        key="calculator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -50 }} // Curtain reveal effect
                        transition={{ duration: 0.5 }}
                    >
                        <Calculator />
                    </motion.div>
                ) : (
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthProvider>
    );
}

export default App;
