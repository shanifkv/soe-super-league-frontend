import { useEffect, useState } from "react";
import { subscribeToMatches, submitPrediction } from "../lib/adminService";
import { MATCHES as STATIC_MATCHES } from "../data/fixtures";


interface Team {
    id: string;
    name: string;
    logo: string;
    shortName: string;
}

interface Match {
    id: string;
    homeTeam: Team;
    awayTeam: Team;
    status: "SCHEDULED" | "LIVE" | "FINISHED";
    score: { home: number; away: number };
    date: string;
    round: string;
}

export default function Knockout() {
    const [liveMatches, setLiveMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPredictionModal, setShowPredictionModal] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToMatches((data) => {
            setLiveMatches(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Merge logic: Use live match if available, otherwise static match
    // We prioritize live matches for status/score updates
    const getMatch = (roundName: string, fallbackHome?: string, fallbackAway?: string): Match | undefined => {
        // First try to find in live matches by round name
        let match = liveMatches.find(m => m.round === roundName);

        // If not found, try finding in static matches
        if (!match) {
            const staticMatch = STATIC_MATCHES.find(m => m.round === roundName);
            if (staticMatch) {
                // Return static match with default status
                match = {
                    ...staticMatch,
                    status: "SCHEDULED", // Force type safety on status
                    score: { home: 0, away: 0 }
                } as unknown as Match;
            }
        }

        // Fallback checks (e.g. by team names if rounds aren't named perfectly in legacy data)
        if (!match && fallbackHome && fallbackAway) {
            match = liveMatches.find(m => m.homeTeam.name.includes(fallbackHome) && m.awayTeam.name.includes(fallbackAway));
        }

        return match;
    };

    const semiFinal1 = getMatch("Semi Final 1", "Aetoz", "Gunners");
    const semiFinal2 = getMatch("Semi Final 2", "Palliyangadi", "Bavaria");
    const finalMatch = getMatch("Grand Final") || getMatch("Final");

    const semiFinal1Winner = semiFinal1?.status === 'FINISHED'
        ? (semiFinal1.score.home > semiFinal1.score.away ? semiFinal1.homeTeam : semiFinal1.awayTeam)
        : null;

    const semiFinal2Winner = semiFinal2?.status === 'FINISHED'
        ? (semiFinal2.score.home > semiFinal2.score.away ? semiFinal2.homeTeam : semiFinal2.awayTeam)
        : null;

    const finalist1 = finalMatch?.homeTeam || semiFinal1Winner;
    const finalist2 = finalMatch?.awayTeam || semiFinal2Winner;

    if (loading && liveMatches.length === 0 && STATIC_MATCHES.length === 0) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-zinc-500 animate-pulse">Loading Road to Final...</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white pt-24 pb-16 px-4 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 md:mb-20 animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 mb-4">
                        Road to Final
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base mb-8">
                        The journey to the championship trophy.
                    </p>

                    {new Date() < new Date('2026-01-13T17:00:00') ? (
                        <button
                            onClick={() => setShowPredictionModal(true)}
                            className="bg-yellow-500 text-black font-black uppercase tracking-wider py-3 px-8 rounded-full hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transform hover:scale-105"
                        >
                            Predict & Win
                        </button>
                    ) : (
                        <button
                            disabled
                            className="bg-zinc-800 text-zinc-500 font-black uppercase tracking-wider py-3 px-8 rounded-full cursor-not-allowed"
                        >
                            Prediction Closed
                        </button>
                    )}
                </div>

                {/* Bracket Container */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 max-w-6xl mx-auto relative">

                    {/* Background Connection Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-40 right-40 h-[1px] bg-zinc-800 -z-10" />

                    {/* --- Left Side: Semi Final 1 --- */}
                    <div className="flex flex-col justify-center gap-6 md:gap-8 w-full md:w-80 relative order-1">
                        <div className="text-center md:text-left mb-2 md:mb-4">
                            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Semi Final 1</span>
                            {semiFinal1?.date && (
                                <div className="text-[10px] text-zinc-600 font-mono mt-1">
                                    {new Date(semiFinal1.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }).toUpperCase()} • {new Date(semiFinal1.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    <span className="block text-zinc-700">SOE Stadium</span>
                                </div>
                            )}
                        </div>
                        {/* Bracket Connector (Desktop) */}
                        <div className="hidden md:block absolute top-[3.5rem] bottom-[3.5rem] -right-8 w-8 border-r border-t border-b border-zinc-800 rounded-r-2xl pointer-events-none" />

                        <TeamBracketCard
                            team={semiFinal1?.homeTeam}
                            score={semiFinal1?.score.home}
                            isWinner={semiFinal1 && semiFinal1.status === 'FINISHED' && semiFinal1.score.home > semiFinal1.score.away}
                            align="left"
                            status={semiFinal1?.status}
                        />

                        <TeamBracketCard
                            team={semiFinal1?.awayTeam}
                            score={semiFinal1?.score.away}
                            isWinner={semiFinal1 && semiFinal1.status === 'FINISHED' && semiFinal1.score.away > semiFinal1.score.home}
                            align="left"
                            status={semiFinal1?.status}
                        />
                    </div>

                    {/* --- Right Side: Semi Final 2 (Mobile Order: 2) --- */}
                    <div className="flex flex-col justify-center gap-6 md:gap-8 w-full md:w-80 relative order-2 md:order-3">
                        <div className="text-center md:text-right mb-2 md:mb-4">
                            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Semi Final 2</span>
                            {semiFinal2?.date && (
                                <div className="text-[10px] text-zinc-600 font-mono mt-1">
                                    {new Date(semiFinal2.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }).toUpperCase()} • {new Date(semiFinal2.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    <span className="block text-zinc-700">SOE Stadium</span>
                                </div>
                            )}
                        </div>
                        {/* Bracket Connector (Desktop) */}
                        <div className="hidden md:block absolute top-[3.5rem] bottom-[3.5rem] -left-8 w-8 border-l border-t border-b border-zinc-800 rounded-l-2xl pointer-events-none" />

                        <TeamBracketCard
                            team={semiFinal2?.homeTeam}
                            score={semiFinal2?.score.home}
                            isWinner={semiFinal2 && semiFinal2.status === 'FINISHED' && semiFinal2.score.home > semiFinal2.score.away}
                            align="right"
                            status={semiFinal2?.status}
                        />

                        <TeamBracketCard
                            team={semiFinal2?.awayTeam}
                            score={semiFinal2?.score.away}
                            isWinner={semiFinal2 && semiFinal2.status === 'FINISHED' && semiFinal2.score.away > semiFinal2.score.home}
                            align="right"
                            status={semiFinal2?.status}
                        />
                    </div>

                    {/* --- Center: Final (Mobile Order: 3) --- */}
                    <div className="flex flex-col items-center gap-8 order-3 md:order-2 w-full md:w-96 z-10 mt-8 md:mt-0">
                        {/* Trophy */}
                        <div className="relative group">
                            <div className="hidden md:block absolute inset-0 bg-yellow-500/10 blur-2xl rounded-full" />
                            <svg className="w-24 h-24 md:w-32 md:h-32 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)] transform group-hover:scale-105 transition-transform duration-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M5 2c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v2c0 2.2-1.79 4-4 4h-1v2.5c0 .35-.04.69-.12 1.02l.62 1.98h3.35c.63-1.6 2.65-2.29 4.15-1.55S23.29 13.65 22.55 15.15 19.9 17.44 18.4 16.7L18.4 16.7l-4.2-1.2A5.39 5.39 0 0112 18h0a5.39 5.39 0 01-2.2-.5l-4.2 1.2c-1.5.74-3.5-.05-4.15-1.55S2.85 13.5 3.6 12s3.52-.05 4.15 1.55h3.35L7.12 11.52A5.55 5.55 0 017 10.5V8H6c-2.21 0-4-1.79-4-4V2zm2 2v2c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V4H7z" />
                            </svg>
                        </div>

                        {/* Final Box */}
                        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
                            {/* Glow behind final box */}
                            <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none" />

                            <span className="text-yellow-500 text-xs font-black uppercase tracking-widest mb-6 relative z-10">Grand Final</span>

                            <div className="flex items-center justify-between w-full gap-4 relative z-10">
                                {/* Finalist 1 */}
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-black border-2 flex items-center justify-center p-3 transition-all ${finalist1 ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'border-zinc-800'}`}>
                                        {finalist1 ? (
                                            <img src={finalist1.logo} className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="text-zinc-700 text-2xl md:text-3xl font-black">?</span>
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${finalist1 ? 'text-white' : 'text-zinc-600'}`}>
                                        {finalist1?.name || "Winner SF1"}
                                    </span>
                                </div>

                                <div className="flex flex-col items-center gap-1">
                                    <div className="text-2xl md:text-3xl font-black text-white">VS</div>
                                    <div className="text-[10px] text-zinc-500 font-mono">13 JAN</div>
                                </div>

                                {/* Finalist 2 */}
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-black border-2 flex items-center justify-center p-3 transition-all ${finalist2 ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'border-zinc-800'}`}>
                                        {finalist2 ? (
                                            <img src={finalist2.logo} className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="text-zinc-700 text-2xl md:text-3xl font-black">?</span>
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${finalist2 ? 'text-white' : 'text-zinc-600'}`}>
                                        {finalist2?.name || "Winner SF2"}
                                    </span>
                                </div>
                            </div>

                            {!finalMatch && !finalist1 && !finalist2 && <div className="mt-6 text-zinc-500 text-xs">Awaiting Results</div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Prediction Modal */}
            {showPredictionModal && <PredictionModal onClose={() => setShowPredictionModal(false)} semiFinal1={semiFinal1} semiFinal2={semiFinal2} />}
        </main>
    );
}

function TeamBracketCard({ team, score, isWinner, align, status }: { team?: Team, score?: number, isWinner?: boolean, align: 'left' | 'right', status?: string }) {
    if (!team) return <div className="h-20 bg-zinc-900 rounded-xl animate-pulse" />;

    return (
        <div className={`
            relative flex items-center gap-4 bg-zinc-900 border rounded-xl p-4 transition-all duration-300 z-20 w-full
            ${isWinner ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'border-zinc-800 hover:border-zinc-700'}
        `}>
            {/* Logo */}
            <div className={`w-12 h-12 shrink-0 ${align === 'right' ? 'md:order-last' : ''}`}>
                <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
            </div>

            {/* Name & Score */}
            <div className={`flex-1 flex flex-col ${align === 'right' ? 'md:items-end md:text-right items-start text-left' : 'items-start text-left'}`}>
                <span className={`font-bold text-sm md:text-base uppercase leading-tight ${isWinner ? 'text-white' : 'text-zinc-300'}`}>
                    {team.name}
                </span>

                {status !== 'SCHEDULED' ? (
                    <span className={`text-xl md:text-2xl font-black ${isWinner ? 'text-yellow-500' : 'text-zinc-600'}`}>
                        {score}
                    </span>
                ) : (
                    <span className="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded mt-1 uppercase tracking-wide">
                        Upcoming
                    </span>
                )}
            </div>

            {/* Winner Indicator */}
            {isWinner && (
                <div className={`absolute -top-2 ${align === 'right' ? '-right-2' : '-left-2'} bg-yellow-500 text-black text-[10px] font-black px-1.5 rounded shadow-lg`}>
                    WINNER
                </div>
            )}
        </div>
    );
}

function PredictionModal({ onClose, semiFinal1, semiFinal2 }: { onClose: () => void, semiFinal1?: Match, semiFinal2?: Match }) {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        student_name: "",
        phone_number: "",
        department: "",
        year: "",
        sf1_score_home: "",
        sf1_score_away: "",
        sf2_score_home: "",
        sf2_score_away: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await submitPrediction({
                student_name: formData.student_name,
                phone_number: formData.phone_number,
                department: formData.department,
                year: formData.year,
                sf1_score_home: Number(formData.sf1_score_home),
                sf1_score_away: Number(formData.sf1_score_away),
                sf2_score_home: Number(formData.sf2_score_home),
                sf2_score_away: Number(formData.sf2_score_away)
            });
            setSubmitted(true);
            setTimeout(onClose, 2000);
        } catch (error: any) {
            console.error("Prediction Error:", error);
            if (error.code === '23505') {
                alert("Submission Failed: You have already submitted a prediction with this Phone Number.");
            } else {
                alert(`Failed to submit prediction: ${error.message || "Unknown error"}`);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-zinc-900 border border-yellow-500/30 rounded-2xl p-8 max-w-sm w-full text-center animate-fade-in shadow-[0_0_50px_rgba(234,179,8,0.2)]">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-500">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Prediction Submitted!</h3>
                    <p className="text-zinc-400">Good luck! Winners will be announced after the matches.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl relative my-8">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="p-6 md:p-8">
                    <h3 className="text-2xl font-black text-white mb-1">Predict & Win</h3>
                    <p className="text-zinc-400 text-sm mb-6">Predict the scores correctly to win exciting prizes!</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Student Name</label>
                                <input required type="text" className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-yellow-500 outline-none"
                                    value={formData.student_name} onChange={e => setFormData({ ...formData, student_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Phone Number</label>
                                <input required type="tel" className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-yellow-500 outline-none"
                                    value={formData.phone_number} onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Department</label>
                                <select required className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-yellow-500 outline-none appearance-none"
                                    value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                                    <option value="">Select Dept</option>
                                    <option value="CSE">CSE</option>
                                    <option value="CE">CE</option>
                                    <option value="ME">ME</option>
                                    <option value="EC">EC</option>
                                    <option value="EEE">EEE</option>
                                    <option value="IT">IT</option>
                                    <option value="SF">SF</option>
                                    <option value="CS">CS</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Year</label>
                                <select required className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-yellow-500 outline-none appearance-none"
                                    value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })}>
                                    <option value="">Select Year</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                </select>
                            </div>
                        </div>

                        <div className="h-px bg-zinc-800 my-6" />

                        {/* SF1 Prediction */}
                        <div className="bg-black/50 p-4 rounded-xl border border-zinc-800/50">
                            <div className="text-xs font-bold text-zinc-500 uppercase mb-3 text-center">Semi Final 1</div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="text-right flex-1">
                                    <span className="block text-sm font-bold text-white mb-1 truncate">{semiFinal1?.homeTeam.name || 'Team A'}</span>
                                    <input required type="number" min="0" placeholder="0" className="w-16 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-2 text-center text-white font-mono focus:border-yellow-500 outline-none"
                                        value={formData.sf1_score_home} onChange={e => setFormData({ ...formData, sf1_score_home: e.target.value })}
                                    />
                                </div>
                                <span className="text-zinc-600 font-black text-xl">:</span>
                                <div className="text-left flex-1">
                                    <span className="block text-sm font-bold text-white mb-1 truncate">{semiFinal1?.awayTeam.name || 'Team B'}</span>
                                    <input required type="number" min="0" placeholder="0" className="w-16 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-2 text-center text-white font-mono focus:border-yellow-500 outline-none"
                                        value={formData.sf1_score_away} onChange={e => setFormData({ ...formData, sf1_score_away: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SF2 Prediction */}
                        <div className="bg-black/50 p-4 rounded-xl border border-zinc-800/50">
                            <div className="text-xs font-bold text-zinc-500 uppercase mb-3 text-center">Semi Final 2</div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="text-right flex-1">
                                    <span className="block text-sm font-bold text-white mb-1 truncate">{semiFinal2?.homeTeam.name || 'Team C'}</span>
                                    <input required type="number" min="0" placeholder="0" className="w-16 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-2 text-center text-white font-mono focus:border-yellow-500 outline-none"
                                        value={formData.sf2_score_home} onChange={e => setFormData({ ...formData, sf2_score_home: e.target.value })}
                                    />
                                </div>
                                <span className="text-zinc-600 font-black text-xl">:</span>
                                <div className="text-left flex-1">
                                    <span className="block text-sm font-bold text-white mb-1 truncate">{semiFinal2?.awayTeam.name || 'Team D'}</span>
                                    <input required type="number" min="0" placeholder="0" className="w-16 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-2 text-center text-white font-mono focus:border-yellow-500 outline-none"
                                        value={formData.sf2_score_away} onChange={e => setFormData({ ...formData, sf2_score_away: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-yellow-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-black uppercase tracking-wider py-4 rounded-xl hover:bg-yellow-400 transition-colors"
                        >
                            {submitting ? 'Submitting...' : 'Submit Prediction'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
