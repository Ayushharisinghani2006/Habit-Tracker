Ayush Habit Tracker
A futuristic health tracking web application built with React, Vite, Tailwind CSS, and advanced technologies like Three.js, Framer Motion, and Recharts. Track habits such as sleep, water intake, and screen time with a 3D holographic dashboard, AI-driven optimizations, blockchain-inspired token rewards, gesture-like AR controls, and biometric simulations. The app is designed for massive accessibility (26px base text, 64px–160px headings, huge buttons) and complies with PDF export standards.
Features

3D Holographic Dashboard: Visualize habits with WebGL-powered spheres using Three.js and @react-three/fiber.
AI-Driven Optimization: Real-time suggestions with 65%–97% confidence scores for habit improvement.
Blockchain-Inspired Rewards: Earn tokens (+10/goal, +50/+100 for 7/30-day streaks) with confetti and particle animations.
Gesture-Like AR Controls: Swipe left/right to navigate, tap to open settings.
Advanced Biometrics: Simulated heart rate, sleep quality, hydration, and stress metrics.
Massive UI for Accessibility: 26px base text, 64px–160px headings, buttons with px-32 py-12 padding.
Dark Mode & Themes: Toggle between blue, green, purple themes with glassmorphic and neumorphic styles.
Voice Input: Log habits via voice (e.g., "8" for 8 hours of sleep).
PDF Compliance: Exportable JSON reports with consistent typography.
Responsive Design: Sidebar (512px wide) for desktop, navbar for mobile.
Animations: Framer Motion for smooth transitions, hover effects, and 3D rotations.

Prerequisites

Node.js: Version 18.x or 20.x (avoid 17.x due to OpenSSL issues).
npm: Version 8.x or higher.
Git: For cloning the repository (optional).

Setup Instructions

Clone the Repository (if applicable):
git clone <repository-url>
cd Ayush-habit-tracker/habit-tracker


Install Dependencies:Ensure package.json includes:
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^4.0.0-alpha.28",
    "@tailwindcss/postcss": "^4.0.0-alpha.28",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "framer-motion": "^11.11.9",
    "recharts": "^2.13.0",
    "react-confetti": "^6.1.0",
    "three": "^0.169.0",
    "@react-three/fiber": "^8.17.10",
    "@react-three/drei": "^9.115.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@vitejs/plugin-react": "^4.3.3",
    "typescript": "^5.6.3",
    "vite": "^5.4.9"
  }
}

Install:
npm install


Verify Project Structure:Ensure the following files exist:
habit-tracker/
├── src/
│   ├── assets/
│   │   ├── hero-bg.jpg
│   │   ├── sleep-icon.png
│   │   ├── water-icon.png
│   │   ├── screen-icon.png
│   │   ├── badge-7day.png
│   │   ├── badge-30day.png
│   ├── ayush-habit-tracker.jsx
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.cjs
├── index.html
├── README.md


Run the Development Server:
npm run dev -- --force

Open http://localhost:5173 in your browser.


Usage

Landing Page:

View a carousel of habits (Sleep, Water, Screen Time).
Click Launch Now (px-32 py-12, 56px text) to enter the Dashboard.


Dashboard:

Explore the 3D holographic dashboard with rotating spheres.
Track habits via sliders or voice input (🎙️).
Earn tokens for goals and streaks.
Use gesture buttons (👈, 👉, 👆) to navigate or open Settings.


Leaderboard:

View rankings with points and tokens.


Settings:

Change themes (Blue, Green, Purple).
Toggle Dark Mode.
Edit habit goals.
Export JSON reports.


Notifications:

AI optimizations and alerts appear every 10 seconds.
Dismiss notifications with massive buttons.



Troubleshooting
Buttons Not Working on localhost
If buttons (e.g., Launch Now, Navbar, Voice Input) are unresponsive:

Check Console Errors:

Open http://localhost:5173, press F12 → Console.
Look for errors like:
TypeError: Cannot read properties of undefined
Module not found
Invalid hook call


Verify logs (e.g., Clicked Launch Now) appear on click.


Verify Dependencies:
npm ls framer-motion react react-dom

Reinstall if issues:
del /q /s node_modules
del package-lock.json
npm install


Disable Strict Mode:Edit src/main.tsx:
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);


Clear Vite Cache:
npm run dev 


Test CSS:

Inspect buttons (Right-click → Inspect).
Ensure pointer-events: auto on .glassmorphic and .ar-overlay button.
Check for overlapping elements (z-index).


Browser Test:

Try Chrome/Firefox.
Disable extensions:chrome.exe --disable-extensions




Debug Framer Motion:

Replace motion.button with button temporarily to isolate animation issues.



Other Issues

Assets Not Loading: Ensure src/assets/ contains hero-bg.jpg, sleep-icon.png, etc. Use fallback images if missing.
Slow Performance: Reduce ParticleAnimation particles (e.g., from 150 to 50).
TypeScript Errors: Run npm run build to check for type issues.

Development Notes

Tech Stack: React 18, Vite 5, Tailwind CSS 4.0.0-alpha.28, TypeScript 5.6.3.
Accessibility: Massive typography (26px base, 56px buttons, 64px–160px headings) for PDF compliance.
Debugging: Console logs and alerts added for button clicks (e.g., Clicked Launch Now).
Dependencies: Ensure framer-motion@11.11.9 for animation compatibility.

License
© 2025 Ayush. All rights reserved.

For issues, contact the developer or submit a pull request.
