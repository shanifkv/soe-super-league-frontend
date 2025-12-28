import { useState, useRef } from "react";
import soeLogo from "../assets/soe-super-league-logo.png";
import Countdown from "../components/Countdown";

import FixturesSection from "../components/FixturesSection";

export default function Home() {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleAudio = () => {
    const audio = audioRef.current;
    const video = videoRef.current;
    if (!audio) return;

    if (isMuted) {
      // Unmuting: Start playback explicitly & sync
      if (video) video.currentTime = 0; // Restart video to sync with audio start
      audio.volume = 0.5; // Cap volume at 50%
      audio.muted = false;
      audio.play().then(() => {
        setIsMuted(false);
      }).catch((error) => {
        console.error("Audio playback failed:", error);
      });
    } else {
      // Muting: Pause playback
      audio.pause();
      setIsMuted(true);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center px-6 overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover filter grayscale opacity-40"
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/80 z-10" />
          {/* Optional bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent z-10" />
        </div>

        {/* Content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col items-center justify-center h-full pb-8 md:pb-0 pt-20">
          {/* 1. Presenter */}
          <p className="uppercase tracking-[0.3em] text-[10px] md:text-xs text-zinc-500 mb-4 font-medium opacity-80 animate-fade-in-up">
            Sahara Community Presents
          </p>

          {/* 3. Season */}
          <div className="flex items-center justify-center gap-4 mb-3 md:mb-4 opacity-90">
            <div className="h-[1px] w-8 md:w-16 bg-white/20" />
            <p className="text-xs md:text-sm font-bold tracking-[0.4em] text-yellow-500 uppercase whitespace-nowrap">
              Season VII
            </p>
            <div className="h-[1px] w-8 md:w-16 bg-white/20" />
          </div>

          {/* 4. Main Title */}
          <h1 className="text-4xl md:text-7xl font-black leading-tight mb-3 md:mb-5 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 drop-shadow-2xl">
            SOE Super League
          </h1>

          {/* 5. Slogan */}
          <p className="text-sm md:text-lg font-medium tracking-widest text-white mb-4 md:mb-6">
            New rivalries. Same passion.
          </p>

          {/* 6. Description */}
          <p className="text-[10px] md:text-sm text-zinc-400 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed font-light px-4 md:px-0">
            The premier inter-department football league of the School of Engineering.
            Where rivalry meets passion in a battle for glory.
          </p>

          {/* 7. CTA Button */}
          <a
            href="/fixtures"
            className="inline-block px-8 py-2 md:py-3 mb-8 md:mb-12 border border-yellow-500/50 text-yellow-500 text-[10px] md:text-xs tracking-[0.2em] font-bold uppercase hover:bg-yellow-500 hover:text-black hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all duration-500 ease-out backdrop-blur-sm"
          >
            View Fixtures
          </a>

          {/* 8. Live Countdown */}
          <div className="scale-90 md:scale-100 origin-top">
            <Countdown />
          </div>
        </div>

        {/* Audio Control */}
        <button
          onClick={toggleAudio}
          className="absolute bottom-8 right-8 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 text-white group cursor-pointer"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.75-4.75a.75.75 0 0 1 1.286.53v15.88a.75.75 0 0 1-1.286.53L4.5 13.5H2.25a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 .75-.75h2.25Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
            </svg>
          )}
        </button>

        <audio ref={audioRef} loop src="/stadium-atmosphere.mp3" />
      </section>

      {/* Upcoming Fixtures Section */}
      <FixturesSection />
    </main>
  );
}
