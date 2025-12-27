import soeLogo from "../assets/soe-super-league-logo.png";
import Countdown from "../components/Countdown";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center px-6 overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0">
          <video
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
        <div className="relative z-20 max-w-4xl text-center animate-fade-in flex flex-col items-center justify-center h-full pb-8 md:pb-0">
          {/* 1. Presenter */}
          <p className="uppercase tracking-[0.3em] text-[10px] md:text-xs text-zinc-500 mb-3 md:mb-4 font-medium opacity-80">
            Sahara Community Presents
          </p>

          {/* 2. Logo */}
          <img
            src={soeLogo}
            alt="SOE Super League Logo"
            className="w-16 md:w-24 mb-4 md:mb-6 object-contain drop-shadow-xl"
          />

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
      </section>
    </main>
  );
}
