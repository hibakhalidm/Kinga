import { supabase } from './supabaseClient';

/**
 * Finds peers based on shared struggle and sentiment proximity.
 * Uses the 'match_peers' RPC function in Supabase.
 * @param {string} category - The user's primary category (e.g., 'NCII').
 * @param {number} sentimentScore - The user's current sentiment score.
 * @returns {Promise<object[]>} - List of matching profiles.
 */
export const findPeers = async (category, sentimentScore) => {
    try {
        const { data, error } = await supabase
            .rpc('match_peers', {
                target_category: category,
                target_sentiment: sentimentScore,
                match_limit: 5
            });

        if (error) {
            console.error('Error finding peers:', error);
            return [];
        }

        return data;
    } catch (err) {
        console.error('Unexpected error in matching service:', err);
        return [];
    }
};

/**
 * Fetches success stories relevant to the user's category.
 * @param {string} category 
 * @returns {Promise<object[]>}
 */
export const getRelevantStories = async (category) => {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('category', category)
        .gt('sentiment_score', 0) // Only positive stories
        .limit(3);

    if (error) {
        console.error('Error fetching stories:', error);
        return [];
    }
    return data;
};
