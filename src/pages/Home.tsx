import { useState, useRef } from "react";
import soeLogo from "../assets/soe-super-league-logo.png";
import Countdown from "../components/Countdown";




export default function Home() {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      // Unmuting: Start playback
      audio.volume = 1.0;
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
    <main className="min-h-screen bg-black text-white overflow-hidden relative flex flex-col">
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
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center pt-20 px-4 text-center">
        {/* Header Block: Logo -> Season -> Title */}
        <div className="flex flex-col items-center animate-fade-in-up mb-4 md:mb-6">

          {/* 1. Presenter - Top Kicker */}
          <p className="uppercase tracking-[0.4em] text-[8px] md:text-[10px] text-zinc-500 font-medium opacity-60 mb-4 scale-90">
            Sahara Community Presents
          </p>

          {/* 2. League Logo - The Crown Jewel */}
          <div className="relative mb-4 group">
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-75 animate-pulse group-hover:bg-white/30 transition-all duration-500" />
            <img
              src={soeLogo}
              alt="SOE Super League Logo"
              className="relative w-16 h-16 md:w-20 md:h-20 object-contain brightness-0 invert drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* 3. Text Stack */}
          <div className="flex flex-col items-center gap-1">
            {/* Season Divider */}
            <div className="flex items-center gap-3 opacity-90 mb-1">
              <div className="h-[1px] w-8 md:w-16 bg-gradient-to-r from-transparent to-yellow-500/50" />
              <p className="text-sm md:text-base font-bold tracking-[0.5em] text-yellow-500 uppercase whitespace-nowrap pl-1 shadow-black drop-shadow-sm">
                Season VII
              </p>
              <div className="h-[1px] w-8 md:w-16 bg-gradient-to-l from-transparent to-yellow-500/50" />
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-7xl font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-400 drop-shadow-sm scale-y-110">
              SOE SUPER LEAGUE
            </h1>
          </div>
        </div>

        {/* 4. Slogan */}
        <p className="text-base md:text-2xl font-medium tracking-widest text-white mb-2 md:mb-4 opacity-100 drop-shadow-md">
          New rivalries. Same passion.
        </p>

        {/* 5. Description - Compacted */}
        <p className="block text-xs md:text-sm text-zinc-300 max-w-4xl mx-auto mb-4 leading-relaxed font-normal line-clamp-2 drop-shadow px-4">
          The premier inter-department football league of the School of Engineering, Cochin University of Science and Technology (CUSAT).
        </p>

        {/* 6. CTA & Countdown Group */}
        <div className="flex flex-col items-center gap-4 w-full">


          <a
            href="/fixtures"
            className="text-xs md:text-sm uppercase tracking-widest text-yellow-500 hover:text-white transition-colors border-b-2 border-yellow-500/50 pb-1 hover:border-white font-bold"
          >
            View Full Fixtures →
          </a>

          <div className="scale-75 origin-top">
            <Countdown />
          </div>

          <div className="mt-8 text-[10px] md:text-xs text-zinc-500 font-medium tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity">
            Built by <span className="text-zinc-300">Shanif KV</span>
          </div>
        </div>
      </div>



      {/* Audio Control */}
      <button
        onClick={toggleAudio}
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all text-white border border-white/10 hover:border-white/30"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.75-4.75a.75.75 0 0 1 1.286.53v15.88a.75.75 0 0 1-1.286.53L4.5 13.5H2.25a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 .75-.75h2.25Z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 animate-pulse">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
          </svg>
        )}
      </button>

      <audio ref={audioRef} loop src="/stadium-atmosphere.mp3" />
    </main>
  );
}
