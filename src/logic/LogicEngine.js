import Sentiment from 'sentiment';

const sentiment = new Sentiment();

// Keyword Dictionary for Categorization
const CATEGORY_KEYWORDS = {
    NCII: ['nudes', 'leaked', 'photos', 'video', 'private', 'telegram', 'scandal', 'viral'],
    Blackmail: ['money', 'pay', 'threat', 'expose', 'demand', 'ransom', 'cash'],
    Stalking: ['follow', 'watch', 'track', 'location', 'outside', 'scared'],
    Abuse: ['hit', 'beat', 'hurt', 'yell', 'slap', 'force', 'pain'],
    Harassment: ['message', 'call', 'text', 'bother', 'annoy', 'spam'],
};

/**
 * Analyzes the user's input to determine crisis level and category.
 * @param {string} text - The user's story or input text.
 * @param {string[]} tags - Selected tags (optional).
 * @returns {object} - Structured profile data.
 */
export const analyzeCrisis = (text, tags = []) => {
    const result = sentiment.analyze(text);
    const score = result.score;

    // Determine Urgency Level
    let urgency_level = 'Stable';
    if (score < -3) urgency_level = 'Critical';
    else if (score < 0) urgency_level = 'Moderate';

    // Determine Primary Category
    let primary_category = 'General';
    const tokens = [...result.tokens, ...tags.map(t => t.toLowerCase())];

    let maxMatches = 0;

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        const matches = keywords.filter(keyword => tokens.includes(keyword)).length;
        if (matches > maxMatches) {
            maxMatches = matches;
            primary_category = category;
        }
    }

    // Fallback if no keywords match but score is very low
    if (primary_category === 'General' && score < -3) {
        primary_category = 'Unspecified Crisis';
    }

    return {
        sentiment_score: score,
        urgency_level,
        primary_category,
        keywords_detected: result.words, // Words that contributed to sentiment
        platform_context: detectPlatform(text),
    };
};

const detectPlatform = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('telegram')) return 'Telegram';
    if (lower.includes('whatsapp')) return 'WhatsApp';
    if (lower.includes('facebook') || lower.includes('fb')) return 'Facebook';
    if (lower.includes('instagram') || lower.includes('ig')) return 'Instagram';
    if (lower.includes('tiktok')) return 'TikTok';
    return 'Unknown';
};
