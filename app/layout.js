import { Oxanium, Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium",
  weight: ["700", "800"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "600"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["700"],
  style: ["italic"],
  display: "swap",
});

export const metadata = {
  title: "Shhh! Quit this Stuff",
  description: "The project is a personal productivity tool aimed at helping users track and maintain their NoSmoking, NoDrinking, NoFap, NoTobacco streaks (days without a certain habit). It motivates users with visual feedback, progress tracking, and celebratory messages for new records. The design encourages daily engagement and provides a sense of achievement.",
};

const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no maximum-scale=1.0"  />
      </head>
      <body
        className={`antialiased ${poppins.variable} ${oxanium.variable} ${playfair.variable} font-poppins`}
      >
        {children}
      </body>
    </html>
  );
}
