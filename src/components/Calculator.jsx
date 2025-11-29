import React, { useState } from 'react';
import { useStealthStore } from '../context/StealthContext';
import { motion } from 'framer-motion';

const Calculator = () => {
    const [display, setDisplay] = useState('0');
    const unlockApp = useStealthStore((state) => state.unlockApp);

    const handlePress = (val) => {
        if (val === 'AC') {
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
        { label: 'AC', type: 'gray' }, { label: '+/-', type: 'gray' }, { label: '%', type: 'gray' }, { label: '/', type: 'orange' },
        { label: '7', type: 'dark' }, { label: '8', type: 'dark' }, { label: '9', type: 'dark' }, { label: '*', type: 'orange' },
        { label: '4', type: 'dark' }, { label: '5', type: 'dark' }, { label: '6', type: 'dark' }, { label: '-', type: 'orange' },
        { label: '1', type: 'dark' }, { label: '2', type: 'dark' }, { label: '3', type: 'dark' }, { label: '+', type: 'orange' },
        { label: '0', type: 'dark-wide' }, { label: '.', type: 'dark' }, { label: '=', type: 'orange' }
    ];

    return (
        <div className="flex flex-col items-center justify-end h-screen bg-black text-white pb-12">
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
