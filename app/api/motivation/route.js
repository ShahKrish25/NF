// app/api/motivation/route.js (for App Router only)
import { Groq } from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
    try {
        const body = await req.json();
        const { streak, maxStreak, history } = body;

        const prompt = `
You're a motivational coach who responds with 1–2 short lines based on a user's habit-tracking streak data. Tailor your response based on the streak level.

RULES:
- If currentStreak is 0 → motivate to start.
- If currentStreak == maxStreak → celebrate the personal best.
- If currentStreak is near maxStreak (within 3 days) → encourage pushing through to break it.
- If user has done better in the past → gently challenge them to go further this time.
- If current streak is higher than their last → highlight the improvement.

DATA:
- Current streak: ${streak}
- Max streak: ${maxStreak}
- Last streak: ${Array.isArray(history) && history[0] ? history[0].duration : 0}
- Total attempts: ${Array.isArray(history) ? history.length : 0}

Now, generate a motivational message following the rules above.
Keep it inspiring and real. Respond with only the message.
`;


        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "mistral-saba-24b",
        });

        const message = completion.choices?.[0]?.message?.content || "Keep going!";

        return new Response(JSON.stringify({ message }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Groq API Error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
