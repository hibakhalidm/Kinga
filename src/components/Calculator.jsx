import React, { useState } from 'react';
import { useStealthStore } from '../context/StealthContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Calculator = () => {
    const [display, setDisplay] = useState('0');
    const { unlockApp } = useStealthStore();
    const { user, profile, signUpAnonymously, loading } = useAuth();
    const [setupState, setSetupState] = useState('init'); // 'init', 'confirm'
    const [tempPin, setTempPin] = useState(null);

    const handlePress = async (val) => {
        if (loading) return;

        if (val === 'AC') {
            setDisplay('0');
        } else if (val === '=') {
            // === SCENARIO 1: NEW USER (SETUP MODE) ===
            if (!profile && !user) {
                if (display.length < 4) {
                    setDisplay('Err: Len < 4');
                    setTimeout(() => setDisplay('0'), 1000);
                    return;
                }

                if (setupState === 'init') {
                    // First entry of new PIN
                    setTempPin(display);
                    setSetupState('confirm');
                    setDisplay('Confirm');
                    setTimeout(() => setDisplay('0'), 1000);
                } else if (setupState === 'confirm') {
                    // Confirmation
                    if (display === tempPin) {
                        setDisplay('Creating...');
                        await signUpAnonymously(display);
                        setDisplay('Welcome');
                        setTimeout(() => unlockApp(), 1000); // Unlock after successful sign up
                    } else {
                        setDisplay('Err: Match');
                        setSetupState('init');
                        setTempPin(null);
                        setTimeout(() => setDisplay('0'), 1000);
                    }
                }
                return;
            }

            // === SCENARIO 2: EXISTING USER (LOCK MODE) ===
            const storedPin = profile?.pin_code || '1616'; // Fallback only if strictly necessary

            if (display === storedPin || display === '1616') { // Keeping master unlock for demo
                unlockApp();
            } else {
                try {
                    // Real calculator logic
                    // eslint-disable-next-line no-eval
                    setDisplay(eval(display).toString());
                } catch {
                    setDisplay('Error');
                }
            }
        } else {
            // Append numbers
            if (display === '0' || display === 'Confirm' || display === 'Err: Match' || display === 'Err: Len < 4') {
                setDisplay(val);
            } else {
                setDisplay(display + val);
            }
        }
    };

    const buttons = [
        { label: 'AC', type: 'gray' }, { label: '+/-', type: 'gray' }, { label: '%', type: 'gray' }, { label: '/', type: 'orange' },
        { label: '7', type: 'dark' }, { label: '8', type: 'dark' }, { label: '9', type: 'dark' }, { label: '*', type: 'orange' },
        { label: '4', type: 'dark' }, { label: '5', type: 'dark' }, { label: '6', type: 'dark' }, { label: '-', type: 'orange' },
        { label: '1', type: 'dark' }, { label: '2', type: 'dark' }, { label: '3', type: 'dark' }, { label: '+', type: 'orange' },
        { label: '0', type: 'dark-wide' }, { label: '.', type: 'dark' }, { label: '=', type: 'orange' }
    ];

    return (
        <div className="flex flex-col items-center justify-end h-screen bg-black text-white pb-12 relative">
            {/* Status Indicator for Setup Mode */}
            {!profile && !user && !loading && (
                <div className="absolute top-12 bg-gray-900 px-4 py-2 rounded-full text-xs text-gray-400 font-mono tracking-wider border border-gray-800">
                    {setupState === 'init' ? 'SET NEW PIN' : 'CONFIRM PIN'}
                </div>
            )}

            {/* Display */}
            <div className="w-full max-w-xs px-4 mb-4 text-right">
                <span className="text-6xl font-light">{display}</span>
            </div>

            {/* Buttons Grid */}
            <div className="grid grid-cols-4 gap-3 max-w-xs">
                {buttons.map((btn) => (
                    <button
                        key={btn.label}
                        onClick={() => handlePress(btn.label)}
                        className={`
              flex items-center justify-center text-2xl font-medium rounded-full transition-opacity active:opacity-70
              ${btn.type === 'gray' ? 'bg-gray-400 text-black w-16 h-16' : ''}
              ${btn.type === 'orange' ? 'bg-orange-500 text-white w-16 h-16' : ''}
              ${btn.type === 'dark' ? 'bg-gray-800 text-white w-16 h-16' : ''}
              ${btn.type === 'dark-wide' ? 'bg-gray-800 text-white w-36 h-16 col-span-2 pl-6 justify-start' : ''}
            `}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Calculator;
