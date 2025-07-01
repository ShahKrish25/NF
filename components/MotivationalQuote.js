import React from "react";

const quotes = [
  "Every day is a new chance to be stronger!",
  "Stay focused, stay clean, stay proud.",
  "Your future self will thank you.",
  "Progress, not perfection.",
  "You are building a better you!",
  "Discipline is a key to success",
  "Small steps every day lead to big results.",
  "Keep going, you're doing great!",
  "Believe in your journey.",
  "Consistency is the key to success!",
];

export default function MotivationalQuote({ className = "font-fancy" }) {
  const quote = React.useMemo(() => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, []);
  return (
    <div className={`mt-6 mb-4 text-center ${className}`}>
      <p className="text-xl text-[var(--text-secondary)] italic">
         {quote} 
      </p>
    </div>
  );
}