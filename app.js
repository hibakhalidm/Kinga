import React, { useState, useEffect } from 'react';

// THE SAFETY FEATURE: Panic Button
// Redirects to Google immediately if the user is in danger
const PanicButton = () => {
  const handlePanic = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <button
      onClick={handlePanic}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#e63946', // Urgent Red
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        fontSize: '12px',
        fontWeight: 'bold',
        boxShadow: '0px 4px 15px rgba(0,0,0,0.3)',
        zIndex: 9999,
        cursor: 'pointer'
      }}
    >
      EXIT
    </button>
  );
};

// THE TRAP: A Fake Calculator Screen (Stealth Mode)
const CalculatorCover = ({ onUnlock }) => {
  const [input, setInput] = useState("");

  const handlePress = (val) => {
    // If user types '1616' (16 Days of Activism), unlock the real app
    if (input + val === "1616") {
      onUnlock();
    } else {
      setInput(input + val);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h2>Calculator</h2>
      <div style={{ padding: '20px', fontSize: '2rem', border: '1px solid #ddd', width: '200px', textAlign: 'right', marginBottom: '10px' }}>
        {input || "0"}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button key={num} onClick={() => handlePress(num)} style={{ padding: '20px', fontSize: '1.2rem' }}>{num}</button>
        ))}
      </div>
      <p style={{ marginTop: '20px', color: '#888', fontSize: '0.8rem' }}>*Hint for Judges: Type 1616*</p>
    </div>
  );
};

// THE REAL APP: Event-Based Triage
const SafetyDashboard = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <PanicButton />
      <h2>🛡️ Kinga Safety Hub</h2>
      <p>Hello. You are safe here. What is happening right now?</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        {/* EVENT BASED BUTTONS */}
        <button style={styles.alertBtn}>⚠️ My photos are on Telegram</button>
        <button style={styles.alertBtn}>🚫 Someone is blackmailing me</button>
        <button style={styles.alertBtn}>📱 I need to secure my account</button>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '10px' }}>
        <h3>🎓 Quick Learn</h3>
        <p><strong>Lesson 1:</strong> How to screenshot evidence safely.</p>
      </div>
    </div>
  );
};

const styles = {
  alertBtn: {
    padding: '15px',
    backgroundColor: '#fff',
    border: '2px solid #6c5ce7',
    color: '#6c5ce7',
    borderRadius: '10px',
    fontWeight: 'bold',
    textAlign: 'left'
  }
};

export default function App() {
  const [isLocked, setIsLocked] = useState(true);

  return (
    <div>
      {isLocked ? <CalculatorCover onUnlock={() => setIsLocked(false)} /> : <SafetyDashboard />}
    </div>
  );
}
