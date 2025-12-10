const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Note: This script is intended to run on a backend server or cron job.
// It requires SUPABASE_SERVICE_ROLE_KEY to write to the trends table if RLS is strict.
// For the hackathon, we can use the anon key if we adjust policies or just assume env is set.

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const THREAT_SCENARIOS = [
    { category: 'NCII', alert_text: '⚠️ Urgent: New "Deepfake Generator" bot circulating on Telegram. Do not click unknown links.', severity: 'High' },
    { category: 'Blackmail', alert_text: '⚠️ Alert: Predators posing as "Modeling Agents". Verify all offers.', severity: 'High' },
    { category: 'Phishing', alert_text: '🛡️ Safety Tip: Kinga will never ask for your PIN. Report impersonators.', severity: 'Medium' },
    { category: 'General', alert_text: '💜 Reminder: Free counseling available this weekend. Check Learn tab.', severity: 'Low' },
    { category: 'Harassment', alert_text: '⚠️ Report: Coordinated harassment attacks on feminist hashtags detected.', severity: 'Medium' }
];

async function updatePulse() {
    console.log("💗 Pulse Engine: Scanning for threats...");

    // 1. Simulate scraping/analysis (Random selection for demo)
    // Pick 2 random trends
    const shuffled = THREAT_SCENARIOS.sort(() => 0.5 - Math.random());
    const newTrends = shuffled.slice(0, 2);

    console.log("Analyze Complete. Detected Trends:", newTrends.map(t => t.category));

    // 2. Clear old active trends (Soft delete or update)
    const { error: deactivateError } = await supabase
        .from('community_trends')
        .update({ is_active: false })
        .eq('is_active', true);

    if (deactivateError) console.error("Error clearing old trends:", deactivateError);

    // 3. Insert new trends
    const { data, error } = await supabase
        .from('community_trends')
        .insert(newTrends)
        .select();

    if (error) {
        console.error("Error updating Pulse:", error);
    } else {
        console.log("✅ Pulse Updated Successfully:", data.length, "alerts live.");
    }
}

updatePulse();
