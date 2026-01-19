import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import soeLogo from "../assets/soe-super-league-logo.png";

import { type Match } from "../components/MatchCenter";
import KnockoutBracket from "../components/KnockoutBracket";
import { subscribeToMatches } from "../lib/adminService";
import { MATCHES as STATIC_MATCHES } from "../data/fixtures";

export default function Home() {
  const [isMuted, setIsMuted] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Fetch matches to determine if we should show the Match Center
    const unsubscribe = subscribeToMatches((data) => {
      setMatches(data as Match[]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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

        {/* 6. CTA & Dynamic Content Group */}
        <div className="flex flex-col items-center gap-4 w-full">

          {loading ? (
            // Loading State
            <div className="h-32 w-full animate-pulse bg-zinc-900/50 rounded-xl"></div>
          ) : (
            <div className="flex flex-col w-full gap-8">

              {/* --- GRAND FINAL HERO CARD --- */}
              <FinalHeroCard matches={matches} />

              {/* ROAD TO FINAL BRACKET */}
              <div className="w-full flex flex-col items-center gap-6 mt-8 animate-fade-in-up opacity-80 hover:opacity-100 transition-opacity duration-500">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="relative">
                    <h2 className="text-xl md:text-2xl font-black text-zinc-500 uppercase tracking-tighter relative z-10">Road to Final</h2>
                  </div>
                </div>

                <div className="w-full overflow-x-auto pb-4 hide-scrollbar">
                  <div className="min-w-[300px] md:min-w-0 transform scale-90 md:scale-100 origin-top">
                    <KnockoutBracket liveMatches={matches} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 text-[8px] md:text-[10px] text-zinc-500 font-medium tracking-[0.2em] uppercase opacity-60 hover:opacity-100 transition-opacity">
            Built by <span className="text-zinc-300">Shanif KV</span>
          </div>
        </div>
      </div>

      {/* Audio Control */}
      <button
        onClick={toggleAudio}
        className="fixed top-24 md:top-32 right-6 z-[100] p-2.5 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all text-white border border-white/10 hover:border-white/30"
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

function FinalHeroCard({ matches }: { matches: Match[] }) {
  // Reuse logic to resolve finalists
  const getMatch = (roundName: string): Match | undefined => {
    let match = matches.find(m => m.round === roundName);
    if (!match) {
      const staticMatch = STATIC_MATCHES.find(m => m.round === roundName);
      if (staticMatch) {
        match = { ...staticMatch, status: "SCHEDULED", score: { home: 0, away: 0 } } as unknown as Match;
      }
    }
    return match;
  };

  const semiFinal1 = getMatch("Semi Final 1");
  const semiFinal2 = getMatch("Semi Final 2");
  const finalMatch = getMatch("Grand Final") || getMatch("Final");

  const semiFinal1Winner = semiFinal1?.status === 'FINISHED'
    ? (semiFinal1.score.home > semiFinal1.score.away ? semiFinal1.homeTeam : semiFinal1.awayTeam)
    : null;

  const semiFinal2Winner = semiFinal2?.status === 'FINISHED'
    ? (semiFinal2.score.home > semiFinal2.score.away ? semiFinal2.homeTeam : semiFinal2.awayTeam)
    : null;

  const finalist1 = finalMatch?.homeTeam || semiFinal1Winner;
  const finalist2 = finalMatch?.awayTeam || semiFinal2Winner;

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-4 mb-8 md:mt-6 md:mb-12 group">
      {/* Background Glow Pulse - Softer on mobile */}
      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 opacity-20 md:opacity-30 blur-2xl md:blur-3xl group-hover:opacity-40 transition-opacity duration-1000 animate-pulse" />

      <div className="relative bg-black border-2 border-yellow-500/50 rounded-3xl p-4 md:p-12 flex flex-col items-center gap-4 md:gap-10 shadow-[0_0_50px_rgba(234,179,8,0.15)] overflow-hidden">

        {/* Spotlight Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 via-transparent to-black pointer-events-none" />

        {/* Header Label */}
        <div className="flex items-center gap-3 relative z-10 animate-fade-in">
          <h3 className="text-yellow-500 font-bold tracking-[0.2em] uppercase text-xs md:text-lg border border-yellow-500/30 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-yellow-500/5 backdrop-blur-sm">
            GRAND FINAL
          </h3>
        </div>

        {/* Matchup Container - Stack on Mobile but tighter */}
        <div className="flex flex-col md:flex-row items-center justify-center w-full gap-4 md:gap-16 relative z-10">

          {/* Team 1 */}
          <div className="flex flex-col items-center gap-2 md:gap-4 order-1">
            <div className={`w-16 h-16 md:w-40 md:h-40 rounded-full border-2 md:border-4 border-yellow-500/30 p-2 md:p-4 bg-black/50 shadow-[0_0_30px_rgba(234,179,8,0.1)] transition-transform duration-500 group-hover:scale-110 flex items-center justify-center`}>
              {finalist1 ? (
                <img src={finalist1.logo} alt={finalist1.name} className="w-full h-full object-contain drop-shadow-xl" />
              ) : (
                <div className="w-full h-full bg-zinc-800 rounded-full animate-pulse" />
              )}
            </div>
            <span className="text-lg md:text-3xl font-black text-white uppercase text-center leading-tight tracking-tight drop-shadow-md">
              {finalist1?.name || "TBD"}
            </span>
          </div>

          {/* VS & Time */}
          <div className="flex flex-col items-center gap-1 order-2 md:order-2 my-1 md:my-0">
            <span className="text-3xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-yellow-600 italic tracking-tighter drop-shadow-sm transform -rotate-6">
              VS
            </span>
            <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-full px-3 py-1 text-yellow-500 font-mono text-[9px] md:text-xs tracking-widest uppercase backdrop-blur-md mb-1 md:mb-2">
              19 JAN • 05:00 PM
            </div>
            <FinalCountdown targetDate="2026-01-19T17:00:00" />
          </div>

          {/* Team 2 */}
          <div className="flex flex-col items-center gap-2 md:gap-4 order-3 md:order-3">
            <div className={`w-16 h-16 md:w-40 md:h-40 rounded-full border-2 md:border-4 border-yellow-500/30 p-2 md:p-4 bg-black/50 shadow-[0_0_30px_rgba(234,179,8,0.1)] transition-transform duration-500 group-hover:scale-110 flex items-center justify-center`}>
              {finalist2 ? (
                <img src={finalist2.logo} alt={finalist2.name} className="w-full h-full object-contain drop-shadow-xl" />
              ) : (
                <div className="w-full h-full bg-zinc-800 rounded-full animate-pulse" />
              )}
            </div>
            <span className="text-lg md:text-3xl font-black text-white uppercase text-center leading-tight tracking-tight drop-shadow-md">
              {finalist2?.name || "TBD"}
            </span>
          </div>

        </div>

        {/* CTA Button */}
        <div className="mt-4 relative z-20 flex flex-col items-center gap-2 w-full md:w-auto">
          <Link to="/knockout?predict=true" className="group/btn relative w-full md:w-auto inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 px-6 py-3 md:px-16 md:py-4 font-black uppercase tracking-widest text-black transition-all duration-300 hover:scale-105 shadow-[0_0_40px_rgba(234,179,8,0.4)] hover:shadow-[0_0_60px_rgba(255,255,255,0.6)]">
            <span className="relative z-10 flex items-center gap-2 text-xs md:text-base">
              PREDICT FINAL SCORE
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
          </Link>
          <p className="text-[9px] md:text-[10px] text-zinc-400 font-medium uppercase tracking-widest opacity-80">
            One prediction per user
          </p>
        </div>

      </div>
    </div>
  );
}


function FinalCountdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft as { d: number, h: number, m: number, s: number };
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const format = (num: number) => num < 10 ? `0${num}` : num;

  if (Object.keys(timeLeft).length === 0) {
    return <span className="text-yellow-500 font-black tracking-widest animate-pulse">LIVE NOW</span>;
  }

  return (
    <div className="flex items-center gap-2 text-white font-mono text-xs md:text-sm">
      <div className="flex flex-col items-center">
        <span className="bg-zinc-800 px-2 py-1 rounded text-yellow-500 font-bold">{format(timeLeft.d)}</span>
        <span className="text-[8px] text-zinc-500">DAYS</span>
      </div>
      <span className="text-zinc-600">:</span>
      <div className="flex flex-col items-center">
        <span className="bg-zinc-800 px-2 py-1 rounded text-yellow-500 font-bold">{format(timeLeft.h)}</span>
        <span className="text-[8px] text-zinc-500">HRS</span>
      </div>
      <span className="text-zinc-600">:</span>
      <div className="flex flex-col items-center">
        <span className="bg-zinc-800 px-2 py-1 rounded text-yellow-500 font-bold">{format(timeLeft.m)}</span>
        <span className="text-[8px] text-zinc-500">MIN</span>
      </div>
      <span className="text-zinc-600">:</span>
      <div className="flex flex-col items-center">
        <span className="bg-zinc-800 px-2 py-1 rounded text-yellow-500 font-bold opacity-80">{format(timeLeft.s)}</span>
        <span className="text-[8px] text-zinc-500">SEC</span>
      </div>
    </div>
  );
}
