# Kinga (Living Safety Ecosystem)
### 🛡️ A Digital Safety Sanctuary for Ethiopian Women & Girls

**Tracks:** Safety by Design | Survivor Support | Digital Literacy
**Target:** Adolescent Girls (10-24) in Ethiopia

## 🚨 The Problem
In Ethiopia, digital violence is rising on Telegram and Facebook, yet 80% of adolescent girls lack the tools to report it safely. Existing platforms are not anonymous, leading to victim-blaming and re-traumatization.

## 💡 The Solution: Kinga
Kinga ("Protection" in Swahili) is a **PWA (Progressive Web App)** that acts as a disguised crisis responder. It has been upgraded into a "Living Safety Ecosystem" that adapts to real-time threats.

### 🔑 Key Features
1.  **Stealth Mode (Calculator Disguise)**
    *   Appears as a fully functional calculator.
    *   Unlocks via a custom PIN (e.g., `1616=`).
2.  **Universal Panic System**
    *   **Shake-to-Exit** or Double-ESC key instantly redirects to Google.
3.  **Living Dashboard ("Pulse" Engine)**
    *   Analyzes user sentiment ("How are you feeling?") to detect crises.
    *   Fetches **Real-Time Threat Data** (e.g., "New Telegram Phishing Scam") to provide context-aware alerts.
4.  **Anonymous Community Chat**
    *   Secure, real-time group chat for survivors.
    *   Powered by Supabase Realtime with strict privacy (RLS).
5.  **Offline-First LMS**
    *   Safety guides available even without internet.
    *   Dynamic updates when online.
6.  **Admin Portal** (`/admin`)
    *   Heatmap visualization of community threats.
    *   CMS for managing safety guides.

## 🛠️ Tech Stack
*   **Frontend:** React.js, Vite, Tailwind CSS, Framer Motion
*   **Backend:** Supabase (Auth, Postgres, Realtime)
*   **Logic:** Custom Sentiment Analysis Engine (`LogicEngine.js`)
*   **Scripts:** Node.js Pulse Aggregator

## 🚀 Getting Started

### Prerequisites
*   Node.js & npm
*   Supabase Account

### Installation
1.  Clone the repo:
    ```bash
    git clone https://github.com/hibakhalidm/kinga.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up Environment Variables (`.env`):
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
4.  Run the Development Server:
    ```bash
    npm run dev
    ```

### Admin Features
*   To access the Admin Dashboard, navigate manually to: `http://localhost:5173/admin`
*   To update trends, run the Pulse script:
    ```bash
    node scripts/pulse_aggregator.js
    ```
