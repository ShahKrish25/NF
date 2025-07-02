import React from "react";
import { useEffect } from "react";

// const quotes = [
//   "Every day is a new chance to be stronger!",
//   "Stay focused, stay clean, stay proud.",
//   "Your future self will thank you.",
//   "Progress, not perfection.",
//   "You are building a better you!",
//   "Discipline is a key to success",
//   "Small steps every day lead to big results.",
//   "Keep going, you're doing great!",
//   "Believe in your journey.",
//   "Consistency is the key to success!",
// ];

// export default function MotivationalQuote({ className = "font-fancy" }) {
//   const quote = React.useMemo(() => {
//     return quotes[Math.floor(Math.random() * quotes.length)];
//   }, []);
//   return (
//     <div className={`mt-6 mb-4 text-center ${className}`}>
//       <p className="text-xl text-[var(--text-secondary)] italic">
//          {quote} 
//       </p>
//     </div>
//   );
// }




export default function MotivationalQuote({ streak, maxStreak, history }) {
  const [quote, setQuote] = React.useState("");

  useEffect(() => {
    async function fetchQuote() {
      try {
        const res = await fetch("/api/motivation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ streak, maxStreak, history }),
        });
        const data = await res.json();
        setQuote(data.message || "Keep going!");
      } catch (err) {
        console.error("AI quote fetch failed:", err);
        setQuote("Stay strong. You're doing great!");
      }
    }
  
    fetchQuote();
  }, [streak, maxStreak, history]);
  

  return (
    <div className="text-center mt-6 text-lg italic text-[var(--text-secondary)]">
      {quote}
    </div>
  );
}
