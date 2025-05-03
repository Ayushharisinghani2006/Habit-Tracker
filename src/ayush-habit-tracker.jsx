import { useState, useEffect, memo, Suspense, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Confetti from 'react-confetti';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Image Imports
import HeroBg from './assets/hero-bg.jpg';
import SleepIcon from './assets/sleep-icon.png';
import WaterIcon from './assets/water-icon.png';
import ScreenIcon from './assets/screen-icon.png';
import Badge7Day from './assets/badge-7day.png';
import Badge30Day from './assets/badge-30day.png';

// Fallback base64 image
const FALLBACK_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQ==';

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-16 text-center text-6xl text-red-500">
          Something went wrong. Check Console for details.
        </div>
      );
    }
    return this.props.children;
  }
}

// Particle Animation Component
const ParticleAnimation = ({ color }) => {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {[...Array(150)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-8 h-8 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ x: Math.random() * 2400 - 1200, y: Math.random() * 2400 - 1200, scale: 0 }}
          animate={{
            x: Math.random() * 2400 - 1200,
            y: Math.random() * 2400 - 1200,
            scale: [0, 3, 0],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.015 }}
        />
      ))}
    </motion.div>
  );
};

// 3D Progress Sphere Component (WebGL-enhanced)
const ProgressSphere = ({ progress, color, size = 260, isDarkMode }) => {
  const radius = size / 2 - 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <motion.div
      className="relative ar-overlay"
      initial={{ rotateX: 0, rotateY: 0 }}
      animate={{ rotateX: 360, rotateY: 360 }}
      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDarkMode ? '#4B5563' : '#E5E7EB'}
          strokeWidth="16"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="16"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          className="text-5xl font-extrabold gradient-text"
        >
          {Math.round(progress)}%
        </text>
      </svg>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent to-white opacity-30" />
    </motion.div>
  );
};

// 3D Avatar Component (Interactive)
const UserAvatar = ({ progress }) => (
  <motion.div
    className="relative w-40 h-40"
    animate={{
      scale: progress > 85 ? [1, 1.3, 1] : 1,
      rotate: progress > 85 ? [0, 15, -15, 0] : 0,
    }}
    transition={{ duration: 0.8, repeat: progress > 85 ? Infinity : 0 }}
  >
    <img
      src={FALLBACK_IMAGE}
      alt="User avatar"
      className="w-full h-full rounded-full border-6 border-gradient-to-r from-blue-500 to-purple-700"
    />
    {progress > 85 && (
      <motion.div
        className="absolute -top-4 -right-4 w-10 h-10 bg-yellow-400 rounded-full"
        animate={{ scale: [1, 1.6, 1] }}
        transition={{ duration: 0.4, repeat: Infinity }}
      />
    )}
  </motion.div>
);

// 3D Holographic Dashboard (WebGL with Three.js)
const HolographicDashboard = ({ habits }) => {
  const HabitMesh = ({ habit }) => {
    const progress = (habit.data[habit.data.length - 1].value / habit.goal) * 100;
    return (
      <mesh position={[Math.random() * 4 - 2, Math.random() * 4 - 2, 0]}>
        <sphereGeometry args={[progress / 100, 32, 32]} />
        <meshStandardMaterial color={habit.color} emissive={habit.color} emissiveIntensity={0.5} />
      </mesh>
    );
  };

  return (
    <div className="holographic-canvas">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {habits.map((habit) => (
          <HabitMesh key={habit.id} habit={habit} />
        ))}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};

// Mock data with advanced biometrics
const initialHabits = [
  {
    id: 1,
    name: 'Sleep',
    goal: 8,
    unit: 'hours',
    color: '#3B82F6',
    data: [
      { day: 'Mon', value: 7.5 },
      { day: 'Tue', value: 8 },
      { day: 'Wed', value: 6.5 },
      { day: 'Thu', value: 8.5 },
      { day: 'Fri', value: 7 },
      { day: 'Sat', value: 8 },
      { day: 'Sun', value: 7.8 },
    ],
    streak: 5,
    badges: [],
    icon: SleepIcon,
    biometrics: { heartRate: 65, sleepQuality: 85, stress: 20, vo2Max: 45 },
    tokens: 100,
  },
  {
    id: 2,
    name: 'Water Intake',
    goal: 2,
    unit: 'liters',
    color: '#10B981',
    data: [
      { day: 'Mon', value: 1.8 },
      { day: 'Tue', value: 2.2 },
      { day: 'Wed', value: 1.9 },
      { day: 'Thu', value: 2.5 },
      { day: 'Fri', value: 2.0 },
      { day: 'Sat', value: 2.3 },
      { day: 'Sun', value: 2.1 },
    ],
    streak: 3,
    badges: [],
    icon: WaterIcon,
    biometrics: { hydrationLevel: 92, stress: 15, vo2Max: 42 },
    tokens: 80,
  },
  {
    id: 3,
    name: 'Screen Time',
    goal: 2,
    unit: 'hours',
    color: '#F59E0B',
    data: [
      { day: 'Mon', value: 2.5 },
      { day: 'Tue', value: 2.0 },
      { day: 'Wed', value: 2.8 },
      { day: 'Thu', value: 1.9 },
      { day: 'Fri', value: 2.2 },
      { day: 'Sat', value: 2.1 },
      { day: 'Sun', value: 2.0 },
    ],
    streak: 4,
    badges: [],
    icon: ScreenIcon,
    biometrics: { eyeStrain: 30, stress: 25, vo2Max: 40 },
    tokens: 90,
  },
];

// Mock leaderboard with tokens
const leaderboard = [
  { name: 'You', score: 2500, tokens: 300 },
  { name: 'Alex', score: 2200, tokens: 250 },
  { name: 'Sam', score: 2000, tokens: 200 },
];

// AI-Driven Optimization
const generateAIOptimization = (habit) => {
  const avg = habit.data.reduce((sum, d) => sum + d.value, 0) / habit.data.length;
  const trend = habit.data[habit.data.length - 1].value >= habit.data[habit.data.length - 2].value ? 'up' : 'down';
  const confidence = avg >= habit.goal * 0.9 ? 97 : avg >= habit.goal * 0.7 ? 85 : 65;
  if (avg >= habit.goal * 0.9) {
    return `AI Optimization: ${confidence}% confidence in sustained ${habit.name} success. Increase goal by 15% for optimal growth.`;
  } else if (avg >= habit.goal * 0.7) {
    return `AI Optimization: ${confidence}% chance to optimize ${habit.name}. Schedule a 20-min daily check-in to boost consistency.`;
  } else {
    return `AI Optimization: ${confidence}% confidence suggests a micro-habit for ${habit.name}. Start with 10-min daily logs.`;
  }
};

// Advanced Biometric Simulation
const simulateBiometricUpdate = (habit) => {
  switch (habit.name) {
    case 'Sleep':
      return {
        heartRate: Math.floor(Math.random() * 10 + 60),
        sleepQuality: Math.floor(Math.random() * 20 + 80),
        stress: Math.floor(Math.random() * 20 + 10),
        vo2Max: Math.floor(Math.random() * 10 + 40),
      };
    case 'Water Intake':
      return {
        hydrationLevel: Math.floor(Math.random() * 10 + 90),
        stress: Math.floor(Math.random() * 20 + 10),
        vo2Max: Math.floor(Math.random() * 10 + 40),
      };
    case 'Screen Time':
      return {
        eyeStrain: Math.floor(Math.random() * 20 + 20),
        stress: Math.floor(Math.random() * 20 + 10),
        vo2Max: Math.floor(Math.random() * 10 + 40),
      };
    default:
      return {};
  }
};

// Main Health Tracker Component
function HealthTracker() {
  const [habits, setHabits] = useState(initialHabits);
  const [currentView, setCurrentView] = useState('landing');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showParticles, setShowParticles] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [theme, setTheme] = useState('blue');
  const [voiceInput, setVoiceInput] = useState('');
  const [tokens, setTokens] = useState(300);

  // Simulate real-time optimizations, biometrics, and rewards
  useEffect(() => {
    const optimizeHabits = () => {
      setHabits((prev) =>
        prev.map((habit) => ({
          ...habit,
          biometrics: simulateBiometricUpdate(habit),
        }))
      );
      habits.forEach((habit) => {
        const todayData = habit.data[habit.data.length - 1];
        if (todayData.value < habit.goal * 0.8) {
          setNotifications((prev) => [
            ...prev,
            { message: `Priority: Log ${habit.name} to earn 10 tokens!`, type: 'warning' },
          ]);
        }
        const optimization = generateAIOptimization(habit);
        setNotifications((prev) => [
          ...prev,
          { message: optimization, type: 'info' },
        ].slice(-4));
      });
    };
    const timer = setInterval(optimizeHabits, 10000);
    return () => clearInterval(timer);
  }, [habits]);

  // Handle check-in with token rewards
  const handleCheckIn = (habitId, value) => {
    console.log(`Checking in for habit ${habitId} with value ${value}`);
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit;
        const newStreak = value >= habit.goal ? habit.streak + 1 : habit.streak;
        const newBadges = [...habit.badges];
        let newTokens = habit.tokens;
        if (newStreak >= 7 && !newBadges.includes('7-day')) {
          newBadges.push('7-day');
          newTokens += 50;
          setTokens((prev) => prev + 50);
          setShowParticles(true);
          setShowConfetti(true);
          setTimeout(() => {
            setShowParticles(false);
            setShowConfetti(false);
          }, 6000);
        }
        if (newStreak >= 30 && !newBadges.includes('30-day')) {
          newBadges.push('30-day');
          newTokens += 100;
          setTokens((prev) => prev + 100);
          setShowParticles(true);
          setShowConfetti(true);
          setTimeout(() => {
            setShowParticles(false);
            setShowConfetti(false);
          }, 6000);
        }
        return {
          ...habit,
          data: habit.data.map((d, i) =>
            i === habit.data.length - 1 ? { ...d, value } : d
          ),
          streak: newStreak,
          badges: newBadges,
          tokens: newTokens,
        };
      })
    );
    const habit = habits.find((h) => h.id === habitId);
    if (value >= habit.goal) {
      setTokens((prev) => prev + 10);
      setNotifications((prev) => [
        ...prev,
        { message: `+10 Tokens! Mastered ${habit.name}!`, type: 'success' },
      ].slice(-4));
    }
  };

  // Voice command check-in
  const handleVoiceCheckIn = (habitId) => {
    console.log(`Voice check-in for habit ${habitId} with input ${voiceInput}`);
    if (!voiceInput) return;
    const value = parseFloat(voiceInput);
    if (!isNaN(value)) {
      handleCheckIn(habitId, value);
      setNotifications((prev) => [
        ...prev,
        { message: `Voice: Logged ${value} ${habits.find((h) => h.id === habitId).unit} for ${habits.find((h) => h.id === habitId).name}`, type: 'success' },
      ].slice(-4));
      setVoiceInput('');
    } else {
      setNotifications((prev) => [
        ...prev,
        { message: 'Invalid input. Enter a number.', type: 'warning' },
      ].slice(-4));
    }
  };

  // Update goal
  const updateGoal = (habitId, newGoal) => {
    console.log(`Updating goal for habit ${habitId} to ${newGoal}`);
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId ? { ...habit, goal: newGoal } : habit
      )
    );
  };

  // Export report
  const exportReport = () => {
    console.log('Exporting health report');
    const dataStr = JSON.stringify({ habits, tokens }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'health-report.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    console.log('Toggling dark mode');
    alert('Dark Mode toggled!');
    setIsDarkMode(!isDarkMode);
  };

  // Change theme
  const changeTheme = (newTheme) => {
    console.log(`Changing theme to ${newTheme}`);
    setTheme(newTheme);
  };

  // Gesture-like AR interaction
  const handleGestureInteraction = (action) => {
    console.log(`Gesture interaction: ${action}`);
    alert(`Gesture: ${action}`);
    switch (action) {
      case 'swipe-left':
        setCurrentView((prev) => {
          const views = ['landing', 'dashboard', 'leaderboard', 'settings'];
          const index = views.indexOf(prev);
          return views[(index + 1) % views.length];
        });
        break;
      case 'swipe-right':
        setCurrentView((prev) => {
          const views = ['landing', 'dashboard', 'leaderboard', 'settings'];
          const index = views.indexOf(prev);
          return views[(index - 1 + views.length) % views.length];
        });
        break;
      case 'tap':
        setShowSettings(true);
        break;
      default:
        break;
    }
  };

  // Sidebar Component (Sci-fi Google-style)
  const Sidebar = () => (
    <motion.div
      initial={{ x: -480 }}
      animate={{ x: 0 }}
      className={`hidden lg:block fixed top-0 left-0 h-screen w-[32rem] ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-2xl p-20 rounded-r-4xl neumorphic ar-overlay`}
      role="navigation"
      aria-label="Main navigation"
    >
      <h2 className={`text-8xl font-extrabold mb-28 ${isDarkMode ? 'text-white' : 'text-gray-900'} gradient-text`}>
        HealthTrack
      </h2>
      <nav className="space-y-12">
        {[
          { name: 'landing', label: 'Home', icon: '🏠' },
          { name: 'dashboard', label: 'Dashboard', icon: '📊' },
          { name: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
          { name: 'settings', label: 'Settings', icon: '⚙️' },
        ].map((view) => (
          <motion.button
            type="button"
            key={view.name}
            whileHover={{ scale: 1.25, rotate: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              console.log(`Navigating to ${view.name}`);
              alert(`Navigating to ${view.label}`);
              setCurrentView(view.name);
            }}
            className={`z-10 w-full flex items-center text-left px-20 py-10 rounded-4xl text-6xl font-extrabold transition-all ${
              currentView === view.name
                ? `bg-gradient-to-r ${theme === 'blue' ? 'from-blue-500 to-blue-700' : theme === 'green' ? 'from-green-500 to-green-700' : 'from-purple-500 to-purple-700'} text-white border-b-10 border-opacity-50 shadow-2xl`
                : isDarkMode
                ? 'text-gray-200 hover:text-white'
                : 'text-gray-700 hover:text-gray-900'
            } glassmorphic`}
            aria-label={`Go to ${view.label}`}
          >
            <motion.span
              className="mr-10 text-5xl"
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {view.icon}
            </motion.span>
            {view.label}
          </motion.button>
        ))}
      </nav>
    </motion.div>
  );

  // Navbar Component (Sci-fi Google-style)
  const Navbar = () => (
    <motion.nav
      initial={{ y: -120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-50 p-16 ${isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-md shadow-2xl neumorphic ar-overlay`}
      role="navigation"
      aria-label="Top navigation"
    >
      <div className="container mx-auto flex justify-between items-center">
        <h1 className={`text-8xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'} gradient-text`}>
          HealthTrack
        </h1>
        <div className="flex space-x-10 items-center flex-wrap">
          {[
            { name: 'landing', label: 'Home', icon: '🏠' },
            { name: 'dashboard', label: 'Dashboard', icon: '📊' },
            { name: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
            { name: 'settings', label: 'Settings', icon: '⚙️' },
          ].map((view) => (
            <motion.button
              type="button"
              key={view.name}
              whileHover={{ scale: 1.25, rotate: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                console.log(`Navigating to ${view.name}`);
                alert(`Navigating to ${view.label}`);
                setCurrentView(view.name);
              }}
              className={`z-10 flex items-center px-20 py-10 rounded-4xl text-6xl font-extrabold transition-all ${
                currentView === view.name
                  ? `bg-gradient-to-r ${theme === 'blue' ? 'from-blue-500 to-blue-700' : theme === 'green' ? 'from-green-500 to-green-700' : 'from-purple-500 to-purple-700'} text-white border-b-10 border-opacity-50 shadow-2xl`
                  : isDarkMode
                  ? 'text-gray-200 hover:text-white'
                  : 'text-gray-700 hover:text-gray-900'
              } glassmorphic`}
              aria-label={`Go to ${view.label}`}
            >
              <motion.span
                className="mr-8 text-5xl"
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {view.icon}
              </motion.span>
              {view.label}
            </motion.button>
          ))}
          <motion.button
            type="button"
            whileHover={{ rotate: 180, scale: 1.25 }}
            onClick={toggleDarkMode}
            className={`z-10 p-8 rounded-full ${isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-700'} glassmorphic`}
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="text-5xl">{isDarkMode ? '☀️' : '🌙'}</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );

  // Landing Page Component
  const LandingPage = () => {
    const [carouselIndex, setCarouselIndex] = useState(0);
    const carouselItems = [
      { title: 'Track Sleep', desc: 'Optimize rest with AI-driven biometrics.', img: SleepIcon },
      { title: 'Stay Hydrated', desc: 'Real-time hydration with AR feedback.', img: WaterIcon },
      { title: 'Manage Screen Time', desc: 'Balance wellness with 3D insights.', img: ScreenIcon },
    ];

    useEffect(() => {
      const timer = setInterval(() => {
        setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
      }, 1800);
      return () => clearInterval(timer);
    }, []);

    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`min-h-screen flex flex-col items-center justify-center bg-cover bg-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
        style={{ backgroundImage: `url(${HeroBg})`, backgroundAttachment: 'fixed' }}
        role="main"
        aria-label="Landing page"
      >
        <div className="container mx-auto text-center px-16 py-40 backdrop-blur-lg bg-opacity-30 rounded-4xl glassmorphic ar-overlay">
          <motion.h1
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
            className={`text-[160px] font-extrabold mb-20 ${isDarkMode ? 'text-white' : 'text-gray-900'} gradient-text`}
          >
            Transcend Wellness
          </motion.h1>
          <motion.p
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}
            className={`text-6xl mb-24 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
          >
            Revolutionize health with AI, AR, and blockchain.
          </motion.p>
          <AnimatePresence mode="wait">
            <motion.div
              key={carouselIndex}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="mb-24 flex items-center justify-center"
            >
              <img
                src={carouselItems[carouselIndex].img || FALLBACK_IMAGE}
                alt={carouselItems[carouselIndex].title}
                className="w-40 h-40 mr-12"
                onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
              />
              <div>
                <h3 className={`text-7xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'} gradient-text`}>
                  {carouselItems[carouselIndex].title}
                </h3>
                <p className={`text-5xl ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                  {carouselItems[carouselIndex].desc}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
          <motion.button
            type="button"
            whileHover={{ scale: 1.3, boxShadow: '0 24px 48px rgba(0,0,0,0.6)' }}
            whileTap={{ scale: 0.85 }}
            onClick={() => {
              console.log('Clicked Launch Now');
              alert('Launch Now clicked!');
              setCurrentView('dashboard');
            }}
            className={`z-10 px-32 py-12 text-white rounded-3xl text-6xl font-extrabold bg-gradient-to-r ${theme === 'blue' ? 'from-blue-500 to-blue-700' : theme === 'green' ? 'from-green-500 to-green-700' : 'from-purple-500 to-purple-700'} glassmorphic shadow-2xl`}
            aria-label="Start tracking health"
          >
            Launch Now
          </motion.button>
        </div>
      </motion.section>
    );
  };

  // Summary Widget Component (AI-driven with biometrics)
  const SummaryWidget = () => {
    const summaries = habits.map((habit) => ({
      name: habit.name,
      avg: (habit.data.reduce((sum, d) => sum + d.value, 0) / habit.data.length).toFixed(1),
      trend: habit.data[habit.data.length - 1].value >= habit.data[habit.data.length - 2].value ? 'up' : 'down',
      optimization: generateAIOptimization(habit),
      biometrics: habit.biometrics,
      tokens: habit.tokens,
    }));

    return (
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-20 rounded-4xl shadow-inner mb-24 ${isDarkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90 text-gray-900'} backdrop-blur-lg glassmorphic ar-overlay`}
      >
        <h3 className="text-8xl font-extrabold mb-16 gradient-text">AI Optimization Hub</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {summaries.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.2, rotate: 3 }}
              className={`p-12 rounded-4xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} text-center neumorphic ar-overlay`}
            >
              <span className="font-extrabold text-6xl">{item.name}: {item.avg} {habits.find((h) => h.name === item.name).unit}</span>
              <svg
                className={`w-14 h-14 mt-8 mx-auto ${item.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="5"
                  d={item.trend === 'up' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                />
              </svg>
              <p className="text-5xl mt-8">{item.optimization}</p>
              <p className="text-4xl mt-6">
                Biometrics: {Object.entries(item.biometrics).map(([key, value]) => `${key}: ${value}`).join(', ')}
              </p>
              <p className="text-4xl mt-4">Tokens: {item.tokens}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  // Habit Card Component (Memoized with WebGL and AR)
  const HabitCard = memo(({ habit, handleCheckIn }) => {
    const progress = (habit.data[habit.data.length - 1].value / habit.goal) * 100;

    return (
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ rotateX: 8, rotateY: 8 }}
        className={`p-20 rounded-4xl shadow-inner ${isDarkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90 text-gray-900'} backdrop-blur-lg glassmorphic ar-overlay hover:shadow-2xl`}
        role="region"
        aria-label={`${habit.name} tracker`}
      >
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center">
            <img
              src={habit.icon || FALLBACK_IMAGE}
              alt={`${habit.name} icon`}
              className="w-48 h-48 mr-12"
              onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
            />
            <h3 className="text-8xl font-extrabold gradient-text">{habit.name}</h3>
          </div>
          <UserAvatar progress={progress} />
        </div>
        <p className="text-6xl mb-10">Goal: {habit.goal} {habit.unit}</p>
        <p className="text-6xl mb-12">Streak: {habit.streak} Consecutive Days 🔥</p>
        <p className="text-5xl mb-12">
          Biometrics: {Object.entries(habit.biometrics).map(([key, value]) => `${key}: ${value}`).join(', ')}
        </p>
        <p className="text-5xl mb-12">Tokens: {habit.tokens}</p>
        {habit.badges.length > 0 && (
          <div className="flex space-x-10 mb-12">
            {habit.badges.map((badge) => (
              <motion.img
                key={badge}
                src={badge === '7-day' ? Badge7Day : Badge30Day || FALLBACK_IMAGE}
                alt={`${badge} badge`}
                className="w-28 h-28"
                whileHover={{ scale: 1.6, rotate: 25 }}
                animate={{ scale: [1, 1.5, 1], transition: { duration: 0.4, repeat: 4 } }}
                onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
              />
            ))}
          </div>
        )}
        <div className="flex justify-center mb-16">
          <ProgressSphere progress={progress} color={habit.color} size={280} isDarkMode={isDarkMode} />
        </div>
        <div className="mb-16">
          <input
            type="range"
            min="0"
            max={habit.goal * 1.5}
            step="0.1"
            value={habit.data[habit.data.length - 1].value}
            onChange={(e) => handleCheckIn(habit.id, parseFloat(e.target.value))}
            className="w-full h-8 rounded-full"
            style={{ accentColor: habit.color }}
            aria-label={`Adjust ${habit.name} value`}
          />
        </div>
        <div className="mb-16 flex items-center">
          <input
            type="text"
            value={voiceInput}
            onChange={(e) => setVoiceInput(e.target.value)}
            placeholder={`Voice input for ${habit.name} (e.g., 8)`}
            className={`flex-1 p-8 rounded-xl text-5xl ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} glassmorphic`}
            aria-label={`Voice input for ${habit.name}`}
          />
          <motion.button
            type="button"
            whileHover={{ scale: 1.25 }}
            onClick={() => {
              console.log(`Voice check-in for habit ${habit.id}`);
              alert('Voice Input submitted!');
              handleVoiceCheckIn(habit.id);
            }}
            className={`z-10 ml-8 px-10 py-6 rounded-3xl text-5xl font-extrabold bg-gradient-to-r ${theme === 'blue' ? 'from-blue-500 to-blue-700' : theme === 'green' ? 'from-green-500 to-green-700' : 'from-purple-500 to-purple-700'} text-white glassmorphic`}
            aria-label={`Submit voice input for ${habit.name}`}
          >
            🎙️
          </motion.button>
        </div>
        <Suspense fallback={<div className="h-[450px] flex items-center justify-center text-6xl">Loading...</div>}>
          <div className="h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={habit.data}>
                <CartesianGrid strokeDasharray="5 5" stroke={isDarkMode ? '#4B5563' : '#E5E7EB'} />
                <XAxis dataKey="day" stroke={isDarkMode ? '#D1D5DB' : '#374151'} tick={{ fontSize: 22 }} />
                <YAxis stroke={isDarkMode ? '#D1D5DB' : '#374151'} tick={{ fontSize: 22 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '24px',
                    fontSize: '22px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '22px' }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={habit.color}
                  strokeWidth="6"
                  dot={{ r: 12 }}
                  activeDot={{ r: 14 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Suspense>
      </motion.div>
    );
  });

  // Leaderboard Component
  const Leaderboard = () => (
    <section className={`py-40 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} lg:ml-[32rem]`} role="main" aria-label="Leaderboard">
      <div className="container mx-auto px-16">
        <h2 className={`text-[120px] font-extrabold mb-24 gradient-text`}>Leaderboard</h2>
        <div className="grid gap-16">
          {leaderboard.map((user, index) => (
            <motion.div
              key={user.name}
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-16 rounded-4xl ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-lg glassmorphic ar-overlay flex items-center justify-between`}
            >
              <div className="flex items-center">
                <span className={`text-7xl font-extrabold mr-12 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-bronze-400'}`}>
                  {index + 1}
                </span>
                <span className="text-6xl font-extrabold">{user.name}</span>
              </div>
              <div className="text-right">
                <span className="text-6xl block">{user.score} Points</span>
                <span className="text-5xl">{user.tokens} Tokens</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  // Dashboard Component
  const Dashboard = () => (
    <section className={`py-40 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} lg:ml-[32rem]`} role="main" aria-label="Dashboard">
      <div className="container mx-auto px-16">
        <h2 className={`text-[120px] font-extrabold mb-24 gradient-text`}>Holographic Dashboard</h2>
        <HolographicDashboard habits={habits} />
        <SummaryWidget />
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
        >
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} handleCheckIn={handleCheckIn} />
          ))}
        </motion.div>
        <div className="mt-20 flex space-x-10 justify-center">
          {['swipe-left', 'swipe-right', 'tap'].map((action) => (
            <motion.button
              type="button"
              key={action}
              whileHover={{ scale: 1.25 }}
              onClick={() => handleGestureInteraction(action)}
              className={`z-10 px-16 py-8 rounded-3xl text-5xl font-extrabold bg-gradient-to-r ${theme === 'blue' ? 'from-blue-500 to-blue-700' : theme === 'green' ? 'from-green-500 to-green-700' : 'from-purple-500 to-purple-700'} text-white glassmorphic`}
              aria-label={`AR gesture: ${action}`}
            >
              {action === 'swipe-left' ? '👈' : action === 'swipe-right' ? '👉' : '👆'}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );

  // Settings Modal Component
  const SettingsModal = () => (
    <AnimatePresence>
      {showSettings && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          role="dialog"
          aria-label="Settings modal"
        >
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            className={`p-24 rounded-4xl shadow-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'} max-w-4xl w-full glassmorphic ar-overlay`}
          >
            <h2 className="text-8xl font-extrabold mb-20 gradient-text">Settings</h2>
            <div className="mb-16">
              <label className="block text-6xl font-extrabold mb-8">Theme</label>
              <div className="flex space-x-10">
                {['blue', 'green', 'purple'].map((t) => (
                  <motion.button
                    type="button"
                    key={t}
                    whileHover={{ scale: 1.3 }}
                    onClick={() => {
                      console.log(`Changing theme to ${t}`);
                      alert(`Theme changed to ${t}`);
                      changeTheme(t);
                    }}
                    className={`z-10 px-16 py-8 rounded-3xl text-5xl font-extrabold ${theme === t ? `bg-gradient-to-r ${t === 'blue' ? 'from-blue-500 to-blue-700' : t === 'green' ? 'from-green-500 to-green-700' : 'from-purple-500 to-purple-700'} text-white` : 'bg-gray-200 text-gray-900'} glassmorphic`}
                    aria-label={`Select ${t} Theme`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="mb-16">
              <label className="block text-6xl font-extrabold mb-8">Dark Mode</label>
              <motion.button
                type="button"
                whileHover={{ scale: 1.3 }}
                onClick={toggleDarkMode}
                className={`z-10 px-16 py-8 rounded-3xl text-5xl font-extrabold ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} glassmorphic`}
                aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </motion.button>
            </div>
            <div className="mb-16">
              <label className="block text-6xl font-extrabold mb-8">Edit Goals</label>
              {habits.map((habit) => (
                <div key={habit.id} className="flex items-center mb-10">
                  <span className="mr-10 font-extrabold text-5xl">{habit.name}</span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={habit.goal}
                    onChange={(e) => updateGoal(habit.id, parseFloat(e.target.value))}
                    className={`w-56 p-8 rounded-xl text-5xl ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} glassmorphic`}
                    aria-label={`Edit ${habit.name} goal`}
                  />
                </div>
              ))}
            </div>
            <div className="mb-16">
              <motion.button
                type="button"
                whileHover={{ scale: 1.3 }}
                onClick={() => {
                  console.log('Exporting health report');
                  alert('Exporting report!');
                  exportReport();
                }}
                className={`z-10 px-16 py-8 rounded-3xl text-5xl font-extrabold bg-gradient-to-r ${theme === 'blue' ? 'from-blue-500 to-blue-700' : theme === 'green' ? 'from-green-500 to-green-700' : 'from-purple-500 to-purple-700'} text-white glassmorphic`}
                aria-label="Export health report"
              >
                Export Report
              </motion.button>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.3 }}
              onClick={() => {
                console.log('Closing settings modal');
                alert('Closing Settings!');
                setShowSettings(false);
              }}
              className={`z-10 px-16 py-8 rounded-3xl w-full text-5xl font-extrabold bg-gradient-to-r ${theme === 'blue' ? 'from-blue-500 to-blue-700' : theme === 'green' ? 'from-green-500 to-green-700' : 'from-purple-500 to-purple-700'} text-white glassm Historic`}
              aria-label="Close settings"
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Notification Toast Component
  const NotificationToast = () => (
    <div className="fixed bottom-16 right-16 space-y-10 z-50" role="alert" aria-label="Notifications">
      <AnimatePresence>
        {notifications.map((note, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 250 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 250 }}
            className={`p-16 rounded-4xl shadow-lg ${note.type === 'success' ? (isDarkMode ? 'bg-green-800/90 text-white' : 'bg-green-100/90 text-green-900') : note.type === 'warning' ? (isDarkMode ? 'bg-yellow-800/90 text-white' : 'bg-yellow-100/90 text-yellow-900') : (isDarkMode ? 'bg-blue-800/90 text-white' : 'bg-blue-100/90 text-blue-900')} backdrop-blur-lg glassmorphic flex items-center text-6xl`}
          >
            <span>{note.message}</span>
            <motion.button
              type="button"
              whileHover={{ scale: 1.3 }}
              onClick={() => {
                console.log(`Dismissing notification ${index}`);
                alert('Dismissing notification!');
                setNotifications((prev) => prev.filter((_, i) => i !== index));
              }}
              className="z-10 ml-12 text-5xl underline glassmorphic"
              aria-label="Dismiss notification"
            >
              Dismiss
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  // Footer Component
  const Footer = () => (
    <footer className={`py-24 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-800'} text-white`} role="contentinfo">
      <div className="container mx-auto px-16 text-center">
        <p className="mb-16 text-6xl">© 2025 HealthTrack. All rights reserved.</p>
        <div className="flex justify-center space-x-16">
          <motion.a whileHover={{ scale: 1.3 }} href="#" className="hover:text-primary text-5xl" aria-label="Privacy Policy">
            Privacy
          </motion.a>
          <motion.a whileHover={{ scale: 1.3 }} href="#" className="hover:text-primary text-5xl" aria-label="Terms of Service">
            Terms
          </motion.a>
          <motion.a whileHover={{ scale: 1.3 }} href="#" className="hover:text-primary text-5xl" aria-label="Contact Us">
            Contact
          </motion.a>
        </div>
      </div>
    </footer>
  );

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        {showParticles && <ParticleAnimation color={theme === 'blue' ? '#3B82F6' : theme === 'green' ? '#10B981' : '#8B5CF6'} />}
        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
        <Sidebar />
        <Navbar />
        <AnimatePresence mode="wait">
          {currentView === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LandingPage />
            </motion.div>
          )}
          {currentView === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Dashboard />
            </motion.div>
          )}
          {currentView === 'leaderboard' && (
            <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Leaderboard />
            </motion.div>
          )}
        </AnimatePresence>
        <SettingsModal />
        <NotificationToast />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default HealthTracker;