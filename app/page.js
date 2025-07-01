"use client";
import React, { useState, useEffect } from "react";
import Counter from "@/components/Counter";
import MotivationalQuote from "@/components/MotivationalQuote";
import { Squares } from "@/components/squares-background";
import BlurText from "@/components/BlurText";
import TrueFocus from "@/components/TrueFucus";
import ShinyText from "@/components/ShinyText";
import { Trash2, Trophy, Crown, Calendar } from "lucide-react";


const LOCAL_KEY = "nofap-data";

const initialData = {
  currentStreak: 0,
  maxStreak: 0,
  streaks: [],
  lastStart: null,
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

export default function NoFapPage() {
  const [data, setData] = useState(initialData);
  const [motivational, setMotivational] = useState("");
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  
  // Hydrate from localStorage on client only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_KEY);
      if (saved) {
        setData(JSON.parse(saved));
      } else {
        setData({ ...initialData, lastStart: getToday() });
      }
      setHasHydrated(true);
    }
  }, []);

  // Save to localStorage only after hydration and when data changes
  useEffect(() => {
    if (hasHydrated) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
    }
  }, [data, hasHydrated]);

  const handleIncrement = () => {
    setData((prev) => ({
      ...prev,
      currentStreak: prev.currentStreak + 1,
    }));
  };

  const checkMobile = () => window.innerWidth < 768;

  useEffect(() => {
    setIsMobile(checkMobile());
    const handleResize = () => setIsMobile(checkMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleReset = () => {
    const resetBtn = document.querySelector('#resetBtn');
    if (data.currentStreak === 0) {
      resetBtn.classList.add('shake');
      setTimeout(() => resetBtn.classList.remove('shake'), 500);
      return;
    }
    const end = getToday();
    const streakObj = {
      start: data.lastStart,
      end,
      duration: data.currentStreak,
    };
    const newMax = Math.max(data.maxStreak, data.currentStreak);
    setData((prev) => ({
      currentStreak: 0,
      maxStreak: newMax,
      streaks: [streakObj, ...prev.streaks],
      lastStart: getToday(),
    }));
    if (data.currentStreak > data.maxStreak) {
      setMotivational("🎉 New Max Streak! Keep going! 🎉");
      setTimeout(() => setMotivational(""), 3000);
    }
  };

  const avgStreak = calcAvg(data.streaks);
  const totalAttempts = data.streaks.length;

  if (!hasHydrated) {
    return null; // Prevent hydration error
  }

  return (
    <>
      <div className={`h-screen w-full font-poppins ${isMobile ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        <div className={`${isMobile ? 'flex-col min-h-screen' : 'flex h-full'} text-[var(--text-primary)]`}>
          {/* Main content */}
          <div className={`${isMobile ? 'flex-shrink-0 min-h-screen' : 'flex-1'} flex flex-col items-center justify-center ${isMobile ? 'p-4 pb-8' : 'p-4'} ${isMobile ? 'space-y-4' : 'space-y-8'} relative`}>
            <Squares
              direction="left"
              speed={0.7}
              squareSize={isMobile ? 30 : 40}
              borderColor="#333"
              hoverFillColor="#222"
            />
            <div className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-md'} shadoow`}>
              <div className={`rounded-lg bg-[var(--bg-secondary)] ${isMobile ? 'p-4' : 'p-8'} text-center`}>
                <div className="flex gap-2 justify-center items-center">
                  <BlurText
                    text="Your Current Streak"
                    delay={350}
                    animateBy="words"
                    direction="top"
                    className={`inline-block ${isMobile ? 'text-lg' : 'text-xl'} font-medium ${isMobile ? 'mb-4' : 'mb-8'} text-[var(--text-secondary)]`}
                  />

                  <TrueFocus
                    sentence="#NO FAP"
                    manualMode={false}
                    blurAmount={5}
                    borderColor="#5227FF"
                    animationDuration={1.5}
                    pauseBetweenAnimations={0.5}
                  />
                </div>
                <div className={`bg-[#d0ff00d2] flex items-center justify-center rounded-lg ${isMobile ? 'p-2' : 'p-4'}`}>
                  <Counter
                    value={data.currentStreak}
                    places={[100, 10, 1]}
                    fontSize={isMobile ? 60 : 80}
                    padding={isMobile ? 30 : 50}
                    gap={isMobile ? 5 : 10}
                    textColor="#18181b"
                    fontWeight={900}
                    containerClassName=""
                    counterClassName=""
                    digitClassName=""
                  />
                </div>
                <div className={`${isMobile ? 'mt-4' : 'mt-8'} flex justify-center gap-4`}>
                  <button
                    id="resetBtn"
                    onClick={handleReset}
                    className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-2'} rounded glass-effect text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300`}
                  >
                    <ShinyText text="RESET" disabled={false} speed={3} className='custom-class' />
                  </button>
                  <button
                    onClick={handleIncrement}
                    className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-2'} rounded glass-effect text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300`}
                  >
                    <ShinyText text="+1 DAY" disabled={false} speed={3} className='custom-class' />
                  </button>
                </div>
                <div className={`${isMobile ? 'mt-4 pt-4' : 'mt-8 pt-6'} border-t border-[var(--border)]`}>
                  <div className={`grid grid-cols-2 gap-4 ${isMobile ? 'mb-3' : 'mb-4'}`}>
                    <div className={`col-span-2 flex justify-between ${isMobile ? 'px-3 py-2' : 'px-4 py-3'} border border-[var(--border)] rounded-md text-sm bg-[var(--bg-primary)]/5`}>
                      <div className="flex flex-col items-center">
                        <span className="text-[var(--text-secondary)] text-xs">Max Streak</span>
                        <span className="text-[var(--text-primary)] font-medium">{data.maxStreak}d</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[var(--text-secondary)] text-xs">Average</span>
                        <span className="text-[var(--text-primary)] font-medium">{avgStreak}d</span>
                      </div>
                    </div>

                    <div className={`${isMobile ? 'px-3 py-2' : 'px-4 py-3'} border border-[var(--border)] rounded-md text-sm bg-[var(--bg-primary)]/5`}>
                      <span className="text-[var(--text-secondary)] text-xs block">Total Attempts</span>
                      <span className="text-[var(--text-primary)] font-medium">{totalAttempts}</span>
                    </div>
                    <div className={`${isMobile ? 'px-3 py-2' : 'px-4 py-3'} border border-[var(--border)] rounded-md text-sm bg-[var(--bg-primary)]/5`}>
                      <span className="text-[var(--text-secondary)] text-xs block">Success Rate</span>
                      <span className="text-[var(--text-primary)] font-medium">
                        {totalAttempts > 0 ? Math.round((data.maxStreak / (totalAttempts * avgStreak)) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-[var(--bg-secondary)] rounded-sm h-1">
                    <div
                      className="h-1 rounded-sm bg-[var(--text-primary)] transition-all duration-500 border-b-2 border-b-white"
                      style={{
                        width: `${Math.min(
                          100,
                          (data.currentStreak / (data.maxStreak || 1)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="w-full text-right text-xs text-[var(--text-secondary)] mt-2">
                    {data.currentStreak === data.maxStreak && data.maxStreak > 0
                      ? "New Record"
                      : `${Math.floor(
                          (data.currentStreak / (data.maxStreak || 1)) * 100
                        )}% to best`}
                  </div>
                </div>
              </div>
              <span className={`text-[var(--text-primary)] flex justify-center items-center gap-1.5 ${isMobile ? 'text-lg px-2' : 'text-2xl'}`}>"<MotivationalQuote />"</span>
            </div>
            {motivational && (
              <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 glass-effect ${isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} rounded text-center text-[var(--text-primary)] animate-fade-in-out z-50`}>
                {motivational}
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className={`${isMobile ? 'w-full flex-shrink-0' : 'w-full md:w-80'} bg-[var(--bg-secondary)] ${isMobile ? 'p-4' : 'p-6'} ${isMobile ? 'overflow-visible' : 'overflow-y-auto'} flex flex-col ${isMobile ? 'border-t' : 'border-l'} border-[var(--border)] ${isMobile ? 'min-h-[50vh]' : 'h-full'}`}>
            <div className={`flex justify-between items-center ${isMobile ? 'mb-4' : 'mb-6'}`}>
              <div className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-[var(--text-secondary)]`}>History</div>
              {data.streaks.length > 0 && (
                <button
                  onClick={() => setData(prev => ({ ...prev, streaks: [] , maxStreak : 0, lastStart: "", currentStreak: 0}))}
                  className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-500 hover:text-red-400 transition-colors duration-300 p-2 rounded-md`}
                >
                  Clear All
                </button>
              )}
            </div>
            {data.streaks.length === 0 && (
              <div className={`text-[var(--text-secondary)] text-center ${isMobile ? 'text-sm' : ''}`}>
                No streaks yet
              </div>
            )}
            <ul className={`${isMobile ? 'space-y-2' : 'space-y-3'}`}>
              {/* Pinned Max Streak */}
              {data.streaks.find(s => s.duration === data.maxStreak) && (
                <li className={`glass-effect rounded ${isMobile ? 'p-2.5' : 'p-3'} flex flex-col relative group border-2 border-yellow-500/30 animate-pulse-slow`}>
                  <div className={`absolute ${isMobile ? '-top-1.5 -right-1.5' : '-top-2 -right-2'} bg-yellow-500/20 ${isMobile ? 'p-1' : 'p-1.5'} rounded-full`}>
                    <Crown className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-yellow-500`} />
                  </div>
                  <div className={`flex items-center gap-2 ${isMobile ? 'mb-1.5' : 'mb-2'} text-yellow-500`}>
                    <Trophy className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Best Streak</span>
                  </div>
                  <div className={`flex justify-between ${isMobile ? 'mb-1.5' : 'mb-2'}`}>
                    <span className="text-xs text-[var(--text-secondary)]">
                      Start: <span className="text-[var(--text-primary)]">
                        {data.streaks.find(s => s.duration === data.maxStreak).start}
                      </span>
                    </span>
                  </div>
                  <div className={`flex justify-between ${isMobile ? 'mb-1.5' : 'mb-2'}`}>
                    <span className="text-xs text-[var(--text-secondary)]">
                      End: <span className="text-[var(--text-primary)]">
                        {data.streaks.find(s => s.duration === data.maxStreak).end}
                      </span>
                    </span>
                  </div>
                  <div className={`flex justify-between items-center ${isMobile ? 'pt-1.5' : 'pt-2'} border-t border-[var(--border)]`}>
                    <span className="text-xs text-[var(--text-secondary)]">Duration:</span>
                    <span className="text-[var(--text-primary)]">{data.maxStreak}d</span>
                  </div>
                </li>
              )}
              {/* Regular Streaks */}
              {data.streaks
                .filter(s => s.duration !== data.maxStreak)
                .map((s, i) => (
                <li key={i} className={`glass-effect rounded ${isMobile ? 'p-2.5' : 'p-3'} flex flex-col relative group`}>
                  <button
                    onClick={() => {
                      setData(prev => ({
                        ...prev,
                        streaks: prev.streaks.filter(streak => streak !== s)
                      }));
                    }}
                    className={`flex items-center gap-1 ${isMobile ? 'px-1.5 py-0.5' : 'px-2 py-1'} rounded-md opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 absolute ${isMobile ? 'top-1.5 right-1.5' : 'top-2 right-2'}`}
                  >
                    <Trash2 className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                  </button>
                  <div className={`flex items-center gap-2 ${isMobile ? 'mb-1.5' : 'mb-2'}`}>
                    <Calendar className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-[var(--text-secondary)]`} />
                  </div>
                  <div className={`flex justify-between ${isMobile ? 'mb-1.5' : 'mb-2'}`}>
                    <span className="text-xs text-[var(--text-secondary)]">
                      Start:{" "}
                      <span className="text-[var(--text-primary)]">
                        {s.start}
                      </span>
                    </span>
                    {s.duration === data.maxStreak && (
                      <span className="text-[var(--text-primary)] text-xs">
                        MAX
                      </span>
                    )}
                  </div>
                  <div className={`flex justify-between ${isMobile ? 'mb-1.5' : 'mb-2'}`}>
                    <span className="text-xs text-[var(--text-secondary)]">
                      End:
                    </span>
                    <span className="text-[var(--text-primary)]">{s.end}</span>
                  </div>
                  <div className={`flex justify-between items-center ${isMobile ? 'pt-1.5' : 'pt-2'} border-t border-[var(--border)]`}>
                    <span className="text-xs text-[var(--text-secondary)]">
                      Duration:
                    </span>
                    <span className="text-[var(--text-primary)]">
                      {s.duration}d
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}