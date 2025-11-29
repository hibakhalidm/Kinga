import React, { useState } from 'react';
import { useStealthStore } from '../context/StealthContext';
import { motion } from 'framer-motion';

const Calculator = () => {
    const [display, setDisplay] = useState('0');
    const unlockApp = useStealthStore((state) => state.unlockApp);

    const handlePress = (val) => {
        if (val === 'C') {
            setDisplay('0');
        } else if (val === '=') {
            // THE LOCK: Check for PIN '1616'
            if (display === '1616') {
                unlockApp();
            } else {
                try {
                    // Basic evaluation for realism
                    // eslint-disable-next-line no-eval
                    setDisplay(eval(display).toString());
                } catch {
                    setDisplay('Error');
                }
            }
        } else {
            setDisplay(display === '0' ? val : display + val);
        }
    };

    const buttons = [
        '7', '8', '9', '/',
        '4', '5', '6', '*',
        '1', '2', '3', '-',
        'C', '0', '=', '+'
    ];

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white font-mono">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-80 bg-gray-800 p-6 rounded-2xl shadow-2xl"
            >
                <div className="mb-6 p-4 bg-gray-700 rounded-lg text-right text-3xl overflow-hidden">
                    {display}
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {buttons.map((btn) => (
                        <button
                            key={btn}
                            onClick={() => handlePress(btn)}
                            className={`p-4 rounded-full text-xl font-bold transition-colors ${btn === '=' ? 'bg-orange-500 hover:bg-orange-600' :
                                    btn === 'C' ? 'bg-red-500 hover:bg-red-600' :
                                        ['/', '*', '-', '+'].includes(btn) ? 'bg-blue-500 hover:bg-blue-600' :
                                            'bg-gray-600 hover:bg-gray-500'
                                }`}
                        >
                            {btn}
                        </button>
                    ))}
                </div>
            </motion.div>
            <p className="mt-8 text-gray-600 text-xs">Scientific Calculator v1.0</p>
        </div>
    );
};

export default Calculator;
