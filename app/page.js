"use client";
import React, { useState, useEffect } from "react";
import Counter from "@/components/Counter";
import MotivationalQuote from "@/components/MotivationalQuote";
import { Squares } from "@/components/squares-background";
import BlurText from "@/components/BlurText";
import TrueFocus from "@/components/TrueFucus";
import ShinyText from "@/components/ShinyText";
import {
  Trash2,
  Trophy,
  Crown,
  Calendar,
  Star,
  Shield,
  Zap,
  Award,
  Target,
  TrendingUp,
  Quote,
  Trash2Icon,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";

const HABITS = [
  { key: "nofap-data", label: "Fap" },
  { key: "nosmoking-data", label: "Smoking" },
  { key: "notobacco-data", label: "Tobacco" },
  { key: "nodrinking-data", label: "Drinking" },
];

const ACHIEVEMENTS = [
  {
    id: "first_day",
    name: "First Step",
    desc: "Complete your first day",
    days: 1,
    icon: Star,
    color: "text-blue-400",
  },
  {
    id: "week_warrior",
    name: "Week Warrior",
    desc: "Reach 7 days streak",
    days: 7,
    icon: Shield,
    color: "text-green-400",
  },
  {
    id: "fortnight_fighter",
    name: "Fortnight Fighter",
    desc: "Reach 14 days streak",
    days: 14,
    icon: Zap,
    color: "text-purple-400",
  },
  {
    id: "month_master",
    name: "Month Master",
    desc: "Reach 30 days streak",
    days: 30,
    icon: Award,
    color: "text-yellow-400",
  },
  {
    id: "sixty_strong",
    name: "Sixty Strong",
    desc: "Reach 60 days streak",
    days: 60,
    icon: Target,
    color: "text-orange-400",
  },
  {
    id: "ninety_legend",
    name: "Ninety Legend",
    desc: "Reach 90 days streak",
    days: 90,
    icon: Crown,
    color: "text-pink-400",
  },
  {
    id: "century_champion",
    name: "Century Champion",
    desc: "Reach 100 days streak",
    days: 100,
    icon: Trophy,
    color: "text-red-400",
  },
  {
    id: "consistency_king",
    name: "Consistency King",
    desc: "Complete 5 streaks",
    days: 0,
    icon: TrendingUp,
    color: "text-cyan-400",
    special: "streaks",
    count: 5,
  },
  {
    id: "total_warrior",
    name: "Total Warrior",
    desc: "Accumulate 365 clean days",
    days: 365,
    icon: Calendar,
    color: "text-emerald-400",
    special: "total",
  },
];

function launchConfetti(){
    if(typeof window !== "undefined"){
      let end = Date.now() + (15 * 100);
      let colors = ["#fff",
      "#5227ff",
      "#d0ff00",
      "#2a2727",
      "#00ccff",
      "#ff00cc",
      "#ffb300"];
      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 85,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 85,
          origin: { x: 1 },
          colors: colors
        });
      
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
}

const initialData = {
  currentStreak: 0,
  maxStreak: 0,
  streaks: [],
  lastStart: null,
  lastIncrementDate: null,
};

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function calcAvg(streaks) {
  if (!streaks.length) return 0;
  return (
    streaks.reduce((sum, s) => sum + s.duration, 0) / streaks.length
  ).toFixed(1);
}

function ConfirmModal({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all">
      <div className="bg-[var(--bg-secondary)]/90 glass-effect rounded-xl shadow-2xl p-6 w-[90vw] max-w-xs flex flex-col items-center animate-fade-in-up border border-[var(--border)]">
        <div className="text-lg font-semibold text-white mb-2">
          Confirm Deletion
        </div>
        <div className="text-[var(--text-secondary)] mb-6 text-center">
          Are you sure you want to delete all records? This action cannot be
          undone.
        </div>
        <div className="flex gap-4 w-full justify-center">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-zinc-700/80 text-zinc-200 hover:bg-zinc-600 transition-all border border-zinc-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-[#be1c1ce3] text-white hover:bg-red-700 transition-all border border-red-900 shadow-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function StreakTracker({ localKey, label }) {
  const [data, setData] = useState(initialData);
  const [motivational, setMotivational] = useState("");
  const [hasHydrated, setHasHydrated] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isIncrementDisabled, setIsIncrementDisabled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(localKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData(parsed);

        // Check if last increment was today
        if (parsed.lastIncrementDate === getToday()) {
          setIsIncrementDisabled(true);
        } else {
          setIsIncrementDisabled(false);
        }
      } else {
        setData({ ...initialData, lastStart: getToday() });
        setIsIncrementDisabled(false);
      }

      const savedBadges = JSON.parse(
        localStorage.getItem(`${localKey}-achievements`) || "[]"
      );
      setAchievements(savedBadges);
      setHasHydrated(true);
    }
  }, [localKey]);

  useEffect(() => {
    if (hasHydrated) {
      localStorage.setItem(localKey, JSON.stringify(data));
      // If the day has changed, re-enable the button
      if (data.lastIncrementDate !== getToday()) {
        setIsIncrementDisabled(false);
      }
    }
  }, [data, hasHydrated, localKey]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleIncrement = () => {
    if (isIncrementDisabled) return;
    setData((prev) => ({
      ...prev,
      currentStreak: prev.currentStreak + 1,
      lastIncrementDate: getToday(),
    }));
    setIsIncrementDisabled(true);
  };

  const handleReset = () => {
    const resetBtn = document.querySelector("#resetBtn");
    if (data.currentStreak === 0) {
      resetBtn.classList.add("shake");
      setTimeout(() => resetBtn.classList.remove("shake"), 500);
      return;
    }
    const end = getToday();
    const streakObj = {
      start: data.lastStart,
      end,
      duration: data.currentStreak,
    };
    const updatedData = {
      currentStreak: 0,
      maxStreak: Math.max(data.maxStreak, data.currentStreak),
      streaks: [streakObj, ...data.streaks],
      lastStart: getToday(),
    };
    setData(updatedData);
    checkAchievements(updatedData);
    if (data.currentStreak > data.maxStreak) {
      setMotivational("🎉 New Max Streak! Keep going! 🎉");
      setTimeout(() => setMotivational(""), 5000);
    }
  };

  const checkAchievements = (currentData = data) => {
    const totalCleanDays =
      currentData.streaks.reduce((sum, s) => sum + s.duration, 0) +
      currentData.currentStreak;
    let newlyEarned = [];

    ACHIEVEMENTS.forEach((ach) => {
      const earned = achievements.includes(ach.id);
      if (earned) return;
      if (ach.special === "streaks" && currentData.streaks.length >= ach.count)
        newlyEarned.push(ach.id);
      else if (ach.special === "total" && totalCleanDays >= ach.days)
        newlyEarned.push(ach.id);
      else if (!ach.special && currentData.currentStreak >= ach.days)
        newlyEarned.push(ach.id);
    });

    if (newlyEarned.length > 0) {
      const updated = [...achievements, ...newlyEarned];
      setAchievements(updated);
      localStorage.setItem(`${localKey}-achievements`, JSON.stringify(updated));
      launchConfetti();
    }
  };

  useEffect(() => {
    if (hasHydrated) checkAchievements();
  }, [data.currentStreak]);

  const avgStreak = calcAvg(data.streaks);
  const totalAttempts = data.streaks.length;

  const bestStreak = data.streaks.find((s) => s.duration === data.maxStreak);

  if (!hasHydrated) return null;

  return (
    <div className={`flex flex-col md:flex-row w-full h-full`}>
      {/* Main Section */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-xl mx-auto space-y-6">
          {/* Streak Card */}
          <div className="rounded-lg bg-[var(--bg-secondary)] p-6 text-center shadow-lg">
            <div className="flex justify-center items-center gap-2 mb-4">
              <BlurText
                text="Your Current Streak"
                className="text-xl text-[var(--text-secondary)]"
              />
              <div>
                <TrueFocus sentence={`#NO ${label.toUpperCase()}`} />
              </div>
            </div>
            <div className="bg-[#d0ff00d2] flex justify-center items-center rounded-lg p-4 mb-4">
              <Counter
                value={data.currentStreak}
                places={[100, 10, 1]}
                fontSize={80}
                padding={50}
                textColor="#18181b"
                fontWeight={900}
              />
            </div>
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 glass-effect rounded text-[var(--text-secondary)] hover:text-white transition-all border border-[#2a2727]"
                id="resetBtn"
              >
                <ShinyText text="RESET" />
              </button>
              <button
                onClick={handleIncrement}
                disabled={isIncrementDisabled}
                className={`px-4 py-2 glass-effect rounded text-[var(--text-secondary)] hover:text-white transition-all ${isIncrementDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ShinyText text="+1 DAY" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
              <div className="p-3 border border-[#2a2727] rounded bg-[var(--bg-primary)]/10">
                <p className="text-[var(--text-secondary)] text-xs">
                  Max Streak
                </p>
                <p className="font-medium">{data.maxStreak}d</p>
              </div>
              <div className="p-3 border border-[#2a2727] rounded bg-[var(--bg-primary)]/10">
                <p className="text-[var(--text-secondary)] text-xs">Average</p>
                <p className="font-medium">{avgStreak}d</p>
              </div>
              <div className="p-3 border border-[#2a2727] rounded bg-[var(--bg-primary)]/10">
                <p className="text-[var(--text-secondary)] text-xs">
                  Total Attempts
                </p>
                <p className="font-medium">{totalAttempts}</p>
              </div>
              <div className="p-3 border border-[#2a2727] rounded bg-[var(--bg-primary)]/10">
                <p className="text-[var(--text-secondary)] text-xs">
                  Success Rate
                </p>
                <p className="font-medium">
                  {totalAttempts > 0
                    ? Math.round(
                        (data.maxStreak / (totalAttempts * avgStreak)) * 100
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="w-full h-1 bg-white/10 rounded overflow-hidden">
                <div
                  className="h-1 bg-[var(--text-primary)] transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (data.currentStreak / (data.maxStreak || 1)) * 100
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="text-right text-xs text-[var(--text-secondary)] mt-1">
                {data.currentStreak === data.maxStreak && data.maxStreak > 0
                  ? "New Record"
                  : `${Math.floor(
                      (data.currentStreak / (data.maxStreak || 1)) * 100
                    )}% to best`}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-lg font-semibold text-center text-[var(--text-secondary)] mb-2">
              Achievements
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ACHIEVEMENTS.map((ach) => {
                const Icon = ach.icon;
                const earned = achievements.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-lg border text-xs flex flex-col items-center justify-center glass-effect transition-all duration-300 ${
                      earned
                        ? `${ach.color} border-white shadow-md animate-pulse`
                        : "text-gray-500 border-[var(--border)] opacity-60"
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="font-medium text-center">{ach.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="text-center mt-6 text-lg gap-2 text-[var(--text-secondary)] flex justify-center items-center">
          <MotivationalQuote /> <Quote />
        </div>
      </div>

      {/* History Section */}
      <div className="w-full md:w-80 p-4 border-t md:border-t-0 md:border-l border-[var(--border)] bg-[var(--bg-secondary)] overflow-y-auto"
        style={{
          height: isMobile ? '40vh' : '132vh',
          maxHeight: isMobile ? '50vh' : 'none',
          minHeight: isMobile ? '200px' : '350px',
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-[var(--text-secondary)]">
            History
          </h2>
          {data.streaks.length > 0 && (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="text-sm text-zinc-200 hover:p-1 cursor-pointer py-1 pl-2 pr-4 relative right-[-15px] rounded-l-xl bg-[#be1c1ce3] flex gap-1 " style={{transition: "all 0.1s ease"}}
            >
              Clear All <Trash2Icon className="w-4 h-4 inline-block ml-1" />
            </button>
          )}
        </div>

        {data.streaks.length === 0 ? (
          <p className="text-[var(--text-secondary)] text-sm text-center">
            No streaks yet
          </p>
        ) : (
          <ul className="space-y-3">
            {/* Best Streak (highlighted) */}
            {motivational && (
              <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 glass-effect ${isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} rounded text-center text-[var(--text-primary)] animate-fade-in-out z-50`}>
                {motivational}
                { launchConfetti()}
              </div>
            )}
           
            {bestStreak && (
              <li className="relative p-3 border-2 border-yellow-500/30 rounded-lg glass-effect animate-pulse-slow">
                <div className="absolute -top-2 -right-2 bg-yellow-500/20 p-1.5 rounded-full">
                  <Crown className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="flex items-center gap-2 mb-2 text-yellow-500">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm">Best Streak</span>
                </div>
                <div className="text-xs text-[var(--text-secondary)] mb-1">
                  Start:{" "}
                  <span className="text-[var(--text-primary)]">
                    {bestStreak.start}
                  </span>
                </div>
                <div className="text-xs text-[var(--text-secondary)] mb-1">
                  End:{" "}
                  <span className="text-[var(--text-primary)]">
                    {bestStreak.end}
                  </span>
                </div>
                <div className="pt-2 border-t border-[var(--border)] text-right text-[var(--text-primary)] text-sm">
                  {bestStreak.duration}d
                </div>
              </li>
            )}
            {/* Other streaks */}
            {data.streaks
              .filter((s) => s !== bestStreak)
              .map((s, i) => (
                <li
                  key={i}
                  className="relative p-3 border border-[var(--border)] rounded-lg glass-effect group text-[var(--text-primary)] text-xs"
                >
                  <button
                    onClick={() =>
                      setData((prev) => ({
                        ...prev,
                        streaks: prev.streaks.filter((st) => st !== s),
                      }))
                    }
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4 cursor-pointer" />
                  </button>
                  <div className="mb-1">
                    Start:{" "}
                    <span className="text-[var(--text-secondary)]">
                      {s.start}
                    </span>
                  </div>
                  <div className="mb-1">
                    End:{" "}
                    <span className="text-[var(--text-secondary)]">
                      {s.end}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[var(--border)] text-right">
                    {s.duration}d
                  </div>
                </li>
              ))}
          </ul>
        )}
        <ConfirmModal
          open={showConfirmModal}
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={() => {
            setData({ ...initialData, lastStart: getToday() });
            setShowConfirmModal(false);
          }}
        />
      </div>
    </div>
  );
}

export default function NoFapPage() {
  const [selectedTab, setSelectedTab] = useState(HABITS[0].key);

  return (
    <div className="relative h-screen w-full font-poppins">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Squares
          direction="left"
          speed={0.7}
          squareSize={40}
          borderColor="#333"
          hoverFillColor="#222"
        />
      </div>
      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-56 bg-[var(--bg-secondary)] border-r border-[var(--border)] py-4 px-2 md:px-4 flex md:flex-col gap-2 overflow-x-auto no-scrollbar ">
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="flex md:flex-col gap-2 w-full ">
              {HABITS.map((habit) => (
                <TabsTrigger
                  key={habit.key}
                  value={habit.key}
                  className="capitalize px-4 py-2 text-sm md:text-base rounded-xl md:text-left transition-all duration-300 glass-effect border border-transparent data-[state=active]:bg-[var(--accent)] data-[state=active]:text-white data-[state=active]:shadow-md text-center"
                >
                  {habit.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Main Content */}
        <AnimatePresence initial={true}>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1"
          >
            {HABITS.map(
              (habit) =>
                selectedTab === habit.key && (
                  <StreakTracker
                    key={habit.key}
                    localKey={habit.key}
                    label={habit.label}
                  />
                )
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
