import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStealthStore = create(
    persist(
        (set) => ({
            isStealthMode: false, // Default to false (Logo Mode), user can enable it
            isLocked: true, // Always start locked if in stealth mode

            toggleStealthMode: () => set((state) => ({ isStealthMode: !state.isStealthMode })),

            unlockApp: () => set({ isLocked: false }),
            lockApp: () => set({ isLocked: true }),

            // Reset lock state on reload if in stealth mode
            resetLock: () => set((state) => ({ isLocked: state.isStealthMode })),
        }),
        {
            name: 'kinga-stealth-storage', // unique name
            partialize: (state) => ({ isStealthMode: state.isStealthMode }), // Only persist preference, not lock state (always re-lock)
        }
    )
);
