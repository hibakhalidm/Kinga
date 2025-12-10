import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        };

        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') { // Ignore "Row not found" (PGRST116) as it means new user
                console.error('Error fetching profile:', error);
            }
            setProfile(data);
        } catch (err) {
            console.error('Profile fetch unexpected error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Anonymous Sign Up & Profile Creation
    const signUpAnonymously = async (pin) => {
        setLoading(true);
        try {
            // 1. Sign in anonymously
            const { data: { user }, error: authError } = await supabase.auth.signInAnonymously();

            if (authError) throw authError;
            if (!user) throw new Error("No user returned from anonymous sign in");

            // 2. Create Profile with PIN
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    { id: user.id, pin_code: pin }
                ]);

            if (profileError) throw profileError;

            // 3. Update State
            fetchProfile(user.id);
            return { user };
        } catch (error) {
            console.error("Signup Error:", error);
            return { error };
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const value = {
        user,
        profile,
        signUpAnonymously,
        signOut,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
