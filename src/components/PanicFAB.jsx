import React from 'react';
import { X } from 'lucide-react';

const PanicFAB = () => {
    const handlePanic = () => {
        // Immediate exit to Google
        window.location.href = "https://www.google.com";
    };

    return (
        <button
            onClick={handlePanic}
            className="fixed bottom-24 right-6 bg-kinga-orange text-white p-4 rounded-full shadow-lg z-50 hover:bg-orange-700 transition-colors"
            aria-label="Exit immediately"
        >
            <X size={24} />
        </button>
    );
};

export default PanicFAB;
