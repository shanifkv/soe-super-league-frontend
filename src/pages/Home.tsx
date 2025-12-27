import Countdown from "../components/Countdown";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Background placeholder (stadium-style glow) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,_rgba(0,0,0,0.9)_70%)]" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl text-center">
          <p className="uppercase tracking-widest text-xs md:text-sm text-zinc-400 mb-4">
            Sahara Community Presents
          </p>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            SoE Super League
          </h1>

          <p className="text-zinc-300 text-base md:text-lg max-w-xl mx-auto mb-10">
            The official inter-department football league of the School of Engineering.
            Where rivalry meets passion.
          </p>

          {/* Live Countdown */}
          <Countdown />
        </div>
      </section>
    </main>
  );
}
