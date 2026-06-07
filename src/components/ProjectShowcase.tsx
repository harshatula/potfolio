import { PROJECTS } from "../data";
import { LOCALIZATION } from "../localization";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Smartphone, Check, HelpCircle, Activity, Layout, Sparkles, Sliders, AlertTriangle, FileText, ChevronLeft, ChevronRight, Train, MapPin, Search, Lock, RefreshCw } from "lucide-react";

interface ProjectShowcaseProps {
  currentLang: "en" | "te";
  activeProjectIndex: number;
  setActiveProjectIndex: (index: number) => void;
}

interface TechDetail {
  role: string;
  metric: string;
  substack: string[];
}

const TECH_DETAILS: Record<string, TechDetail> = {
  "React": {
    role: "Core dynamic client framework managing state tree orchestrations and interactive viewports.",
    metric: "Fiber reconciler",
    substack: ["State Memoization", "Incremental Reflows", "Context Providers"]
  },
  "FastAPI Core": {
    role: "ASGI backend powering rapid path computations, endpoint queries, and route requests.",
    metric: "Fast ASGI Engine",
    substack: ["Pydantic Schemas", "Uvicorn Handlers", "JWT Verification"]
  },
  "PostgreSQL": {
    role: "Relational database server storing station nodes, metadata, and transaction tables.",
    metric: "ACID Compliant",
    substack: ["B-Tree Indexing", "Prepared Statements", "Connection Pools"]
  },
  "Redis Locks": {
    role: "Distributed key-value store handling mutex keys to block parallel ticket purchase conflicts.",
    metric: "< 1.2ms Locks",
    substack: ["Redlock Protocol", "Key Expiration TTL", "Transaction Pipeline"]
  },
  "D3.js Topology": {
    role: "Procedural graphics computations generating optimal rail vectors and schematic paths cleanly.",
    metric: "Procedural D3 API",
    substack: ["Force-Directed Grids", "SVG Canvas Paths", "Dynamic Zoom / Pan"]
  },
  "WebSockets": {
    role: "Full-duplex channels synchronizing diagnostic log streams and lock flags in real-time.",
    metric: "Live Bidirectional",
    substack: ["Heartbeat Ping", "Broadcast Pipes", "Reconnection Guard"]
  },
  "React Native": {
    role: "Cross-platform mobile layer compiled for peak frame-rates and responsive layout inputs.",
    metric: "60 FPS Output",
    substack: ["Native Bridge Cores", "Fast Refresh Sync", "Hardware SafeAreas"]
  },
  "Expo Router": {
    role: "File-based navigation framework optimizing screens loading sequence and route parameters.",
    metric: "Declarative Router",
    substack: ["Dynamic Slugs", "Deep-Link Resolvers", "State Serialization"]
  },
  "Firebase Auth": {
    role: "Authentication controller providing secure student session tokens and login validation.",
    metric: "Encrypted Sessions",
    substack: ["Access Token Claims", "OAuth Federated Sign-In", "Identity Safeguards"]
  },
  "Firestore DB": {
    role: "NoSQL document store managing user profiles, permissions metadata, and live variables.",
    metric: "Real-time DB Sync",
    substack: ["Compound Filters", "Continuous Listeners", "Indexed Databases"]
  },
  "SQLite": {
    role: "Local embedded schema persistent engine storing attendance files during offline outages.",
    metric: "Zero-Latency Client DB",
    substack: ["Write-Ahead logging", "Relational Local Tables", "Conflict Rollbacks"]
  },
  "TypeScript": {
    role: "Strong type compile-time guards preventing invalid structural outputs and variable collisions.",
    metric: "Typesafe Pipeline",
    substack: ["Discriminated Unions", "Strict Interface Guards", "Static Lints"]
  },
  "Runtime i18n": {
    role: "Contextual language translations rendering English and Telugu phrases on user-toggle.",
    metric: "Dynamic Locales",
    substack: ["Telugu UX Setup", "Resource Dictionary Hooks", "Dynamic Dimension Shifts"]
  }
};

const cardEntranceVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] // easeOutExpo
    }
  }
};

function InteractiveTechCard({ tech, color }: { tech: string; color: string; key?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const details = TECH_DETAILS[tech] || {
    role: "Architectural component enabling specific project workflow enhancements.",
    metric: "Core Module",
    substack: ["Standard Integration"]
  };

  return (
    <motion.div
      variants={cardEntranceVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layout
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative p-2.5 sm:p-3 rounded-xl bg-white/[0.02] border backdrop-blur-md overflow-hidden flex flex-col justify-between items-start min-h-[64px] sm:min-h-[70px] cursor-pointer transition-all duration-300"
      style={{
        borderColor: isHovered ? color : "rgba(255, 255, 255, 0.08)",
        boxShadow: isHovered ? `0 8px 24px -6px ${color}` : "none",
        background: isHovered ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.02)"
      }}
    >
      {/* Top Header */}
      <div className="w-full flex items-center justify-between pointer-events-none mb-1">
        <span className="text-[10px] sm:text-[11px] font-mono font-medium text-neutral-200 tracking-wider">
          {tech}
        </span>
        <div 
          className="w-1.5 h-1.5 rounded-full transition-all duration-300"
          style={{
            backgroundColor: isHovered ? color : "rgba(255, 255, 255, 0.2)",
            boxShadow: isHovered ? `0 0 6px ${color}` : "none"
          }}
        />
      </div>

      {/* Description & Details - Animated Reveal */}
      <motion.div layout className="text-left w-full">
        {!isHovered ? (
          <span className="text-[7.5px] sm:text-[8px] font-mono text-neutral-500 uppercase tracking-widest block mt-1 transition-opacity duration-300">
            [ hover to inspect ]
          </span>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2 mt-1 w-full"
          >
            <p className="text-[9.5px] sm:text-[10px] text-neutral-400 font-sans leading-relaxed font-light">
              {details.role}
            </p>
            
            {/* KPI Metric */}
            <div className="flex items-center gap-1.5">
              <span className="text-[7.5px] font-mono uppercase text-neutral-500">Metric:</span>
              <span 
                className="text-[7.5px] font-mono px-1 py-0.5 rounded text-white bg-white/5 border border-white/10"
                style={{ color: color, borderColor: `${color}40` }}
              >
                {details.metric}
              </span>
            </div>

            {/* Substack Tags */}
            <div className="space-y-1">
              <span className="text-[7.5px] font-mono uppercase text-neutral-500 block">Sub-components:</span>
              <div className="flex flex-wrap gap-1">
                {details.substack.map((sub, idx) => (
                  <span 
                    key={idx} 
                    className="text-[7.5px] font-mono px-1 py-0.5 rounded bg-white/5 border border-white/5 text-neutral-400"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function ProjectShowcase({ currentLang, activeProjectIndex, setActiveProjectIndex }: ProjectShowcaseProps) {
  const t = LOCALIZATION[currentLang];
  const currentProject = PROJECTS[activeProjectIndex];

  // Hover and Access States
  const [hoveredChallengeIdx, setHoveredChallengeIdx] = useState<number | null>(null);

  // ActivityApp2 State
  const [attendancePercent, setAttendancePercent] = useState(82);
  const [simLanguage, setSimLanguage] = useState<"en" | "te">("en");
  const [compilingPdf, setCompilingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  // Rail Routing and Ticketing platform states
  const [startStation, setStartStation] = useState("Secunderabad (SC)");
  const [endStation, setEndStation] = useState("Vijayawada (BZA)");
  const [isRouting, setIsRouting] = useState(false);
  const [computedRoute, setComputedRoute] = useState<string[] | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [reservedSeats, setReservedSeats] = useState<string[]>(["A1", "B2", "C3"]);
  const [isProcessingReservation, setIsProcessingReservation] = useState(false);
  const [concurrencyLogs, setConcurrencyLogs] = useState<string[]>([
    "[SYSTEM] Ready for thread locks simulation."
  ]);
  const [generatingTicket, setGeneratingTicket] = useState(false);
  const [ticketData, setTicketData] = useState<{ txnId: string; timestamp: string; qrHash: string } | null>(null);

  const prevProject = () => {
    const container = document.querySelector(".scroll-container");
    if (container) {
      const vh = container.clientHeight || window.innerHeight || 800;
      if (activeProjectIndex === 1) {
        container.scrollTo({ top: 4 * vh, behavior: "smooth" });
      } else {
        container.scrollTo({ top: 3 * vh, behavior: "smooth" });
      }
    }
  };

  const nextProject = () => {
    const container = document.querySelector(".scroll-container");
    if (container) {
      const vh = container.clientHeight || window.innerHeight || 800;
      if (activeProjectIndex === 0) {
        container.scrollTo({ top: 5 * vh, behavior: "smooth" });
      } else {
        container.scrollTo({ top: 6 * vh, behavior: "smooth" });
      }
    }
  };

  // Master entry variants for a premium fluid slide transition
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const infoItemVariants = {
    hidden: { opacity: 0, x: -16, y: 10 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      },
    },
  };

  const deviceVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30, rotateX: 6 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.95,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
        delay: 0.2
      }
    }
  };

  return (
    <section id="projects" className="relative py-8 sm:py-12 px-6 max-w-7xl mx-auto select-none overflow-hidden">
      
      {/* Background Accent glow - transitioning colors dynamically based on active slide */}
      <div 
        className="absolute right-0 top-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10 transition-all duration-1000"
        style={{ 
          backgroundColor: activeProjectIndex === 1 ? "rgba(220, 38, 38, 0.04)" : "rgba(37, 99, 235, 0.04)" 
        }}
      ></div>

      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase">04 . WORK SAMPLER</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">{t.projectsTitle}</h2>
          <p className="text-xs text-neutral-400 max-w-xl font-light">
            {t.projectsSubtitle}
          </p>
        </div>

        {PROJECTS.length > 1 && (
          <div className="flex items-center gap-3">
            <button 
              onClick={prevProject} 
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/[0.04] hover:border-white/25 cursor-pointer transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <span className="text-blue-400 font-bold">0{activeProjectIndex + 1}</span>
              <span className="text-neutral-600">/</span>
              <span className="text-neutral-400">0{PROJECTS.length}</span>
            </div>

            <button 
              onClick={nextProject} 
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/[0.04] hover:border-white/25 cursor-pointer transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Project content split row */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
      >
        
        {/* Left column: Comprehensive Project Info with slide fade transitions */}
        <div className="lg:col-span-7 space-y-5">
          <div className="space-y-4">
            <motion.div variants={infoItemVariants} className="space-y-1.5 text-left">
              <span className="font-mono text-[8.5px] text-blue-400 tracking-[0.3em] uppercase block">CASE STUDY {currentProject.number}</span>
              <h3 className="font-display font-light text-xl sm:text-2xl lg:text-3xl text-[#E0E0E0] tracking-[0.05em] uppercase leading-none">
                {currentProject.title}
              </h3>
              <span className="text-[9px] font-mono text-neutral-400 tracking-[0.12em] uppercase block mt-1">
                {currentProject.subtitle}
              </span>
              <p className="text-[11px] sm:text-xs text-neutral-300 font-sans font-light leading-relaxed pt-1">
                {currentProject.description}
              </p>
            </motion.div>

            {/* Technologies Badges */}
            <motion.div variants={infoItemVariants} className="space-y-2 text-left">
              <span className="text-[8.5px] font-mono uppercase text-neutral-500 tracking-widest block">
                {t.technologiesLabel} (HOVER TO REVEAL SPECIFICATIONS):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-2">
                {currentProject.technologies.map(tech => (
                  <InteractiveTechCard 
                    key={tech} 
                    tech={tech} 
                    color={currentProject.accentColor} 
                  />
                ))}
              </div>
            </motion.div>

            {/* Highlights */}
            <motion.div variants={infoItemVariants} className="space-y-1.5 text-left">
              <span className="text-[8px] font-mono uppercase text-neutral-500 tracking-widest block">{t.highlightsLabel}:</span>
              <div className="space-y-1.5 max-w-xl">
                {currentProject.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <div className="p-0.5 bg-white/5 border border-white/10 text-blue-400 mt-0.5 shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-neutral-400 font-sans leading-normal">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Challenges solved info */}
            <motion.div variants={infoItemVariants} className="space-y-2 pt-2 text-left">
              <span className="text-[9px] font-mono uppercase text-neutral-400 tracking-widest block">{t.challengesLabel}:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentProject.challenges.map((challenge, idx) => {
                  const isHovered = hoveredChallengeIdx === idx;
                  return (
                    <motion.div 
                      key={idx} 
                      variants={cardEntranceVariants}
                      onMouseEnter={() => setHoveredChallengeIdx(idx)}
                      onMouseLeave={() => setHoveredChallengeIdx(null)}
                      className="p-3.5 bg-white/5 border rounded-xl flex flex-col justify-between space-y-2 cursor-pointer transition-all duration-300 group hover:bg-white/[0.08]"
                      style={{
                        borderColor: isHovered ? currentProject.accentColor : "rgba(255, 255, 255, 0.1)",
                        boxShadow: isHovered ? `0 4px 20px -5px ${currentProject.accentColor}` : "none"
                      }}
                    >
                      <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.06]">
                        <span className="text-[8.5px] font-mono text-neutral-500 tracking-widest uppercase block">
                          CHALLENGE 0{idx + 1}
                        </span>
                        <div 
                          className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: currentProject.accentColor || '#3b82f6',
                            transform: isHovered ? "scale(1.25)" : "scale(1)"
                          }}
                        />
                      </div>
                      <p className="text-[11px] text-neutral-300 leading-relaxed font-sans font-light">
                        {challenge}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right column: Interactive dynamic device mockups */}
        <motion.div 
          variants={deviceVariants}
          className="lg:col-span-5 flex justify-center w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="p-[1px] bg-gradient-to-br from-white/25 via-transparent to-transparent rounded-[44px]">
            <div className="w-full max-w-[340px] aspect-[9/18.5] relative rounded-[42px] border border-neutral-850 bg-[#070708] shadow-2xl p-4 flex flex-col justify-between overflow-hidden">
              
              {/* Top camera/sensor bar */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 flex items-center justify-between px-4 text-[9px] font-mono text-neutral-400 z-30 bg-black/80 rounded-full border border-white/5">
                <span>9:41</span>
                <div className="w-3.5 h-3.5 rounded-full bg-neutral-900 border border-white/10"></div>
                <span>100%</span>
              </div>

              {/* Simulated app screen content */}
              <div className="flex-1 w-full flex flex-col justify-between pt-10 pb-6 relative z-10">
                
                {currentProject.id === "activityapp2" ? (
                  // INTERACTIVE PROJECT 01: ACTIVITYAPP2 TIMETABLE SCREEN
                  <div className="flex-1 flex flex-col justify-between h-full space-y-3.5 mt-3">
                    
                    {/* App Header (English and Telugu localized switch) */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                        {simLanguage === "en" ? "Daily Tracker" : "దినచర్య"}
                      </span>
                      <button 
                        onClick={() => setSimLanguage(simLanguage === "en" ? "te" : "en")}
                        className="px-2 py-0.5 rounded bg-blue-600/10 border border-blue-500/20 text-blue-400 font-mono text-[8.5px] hover:bg-blue-600/30 cursor-pointer"
                      >
                        {simLanguage === "en" ? "Switch TE" : "Switch EN"}
                      </button>
                    </div>

                    {/* Dynamic schedule elements */}
                    <div className="space-y-2 text-left">
                      <span className="text-[8px] font-mono uppercase text-neutral-500 tracking-wider font-bold">{simLanguage === "en" ? "TIMETABLE BLOCK" : "సమయ నిశ్చయ పట్టిక"}</span>
                      <div className="p-2.5 rounded border border-white/10 bg-[#040404]/95 space-y-2">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-mono text-white">09:30 AM - Mobile UX Lab</span>
                          <span className="text-[8px] font-mono text-green-400 bg-green-950/40 px-1.5 py-0.5 border border-green-905 uppercase rounded">ACTIVE</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-neutral-400">
                          <span>11:15 AM - Firestore Rules Sync</span>
                          <span className="text-[8px] font-mono text-neutral-500">PENDING</span>
                        </div>
                        <button 
                          onClick={() => {
                            if (compilingPdf) return;
                            setCompilingPdf(true);
                            setPdfSuccess(false);
                            setTimeout(() => {
                              setCompilingPdf(false);
                              setPdfSuccess(true);
                              setTimeout(() => {
                                setPdfSuccess(false);
                              }, 3500);
                            }, 1200);
                          }}
                          disabled={compilingPdf}
                          className="w-full py-1.5 border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 text-[8.5px] font-mono text-neutral-300 flex items-center justify-center gap-1.5 cursor-pointer uppercase transition-all rounded disabled:opacity-60"
                        >
                          {compilingPdf ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                              <span>{simLanguage === "en" ? "COMPILING LEDGER..." : "కంపైలింగ్ నివేదిక..."}</span>
                            </>
                          ) : pdfSuccess ? (
                            <>
                              <Check className="w-3 h-3 text-green-400 animate-pulse" />
                              <span className="text-green-400 font-bold">{simLanguage === "en" ? "PDF COMPILED & SAVED" : "PDF సేవ్ చేయబడింది"}</span>
                            </>
                          ) : (
                            <>
                              <FileText className="w-3.5 h-3.5 text-blue-400" />
                              <span>{simLanguage === "en" ? "GENERATE PDF REPORT" : "PDF నివేదికను డౌన్‌లోడ్ చేయండి"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Percentage Threshold slider control */}
                    <div className="space-y-2 bg-[#040404]/95 border border-white/10 p-3 text-left rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono uppercase text-neutral-400">
                          {simLanguage === "en" ? "Attendance Monitor" : "హాజరు శాతం"}
                        </span>
                        <span className={`text-[11px] font-bold font-mono ${attendancePercent < 75 ? "text-red-500" : "text-green-500"}`}>
                          {attendancePercent}%
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Sliders className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <input 
                          type="range" 
                          min="50" 
                          max="100" 
                          value={attendancePercent} 
                          onChange={(e) => setAttendancePercent(Number(e.target.value))}
                          className="w-full accent-blue-500 h-1 bg-neutral-800 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* High visibility conditional alarm popup block */}
                    <div className="flex-1 flex flex-col justify-end text-left min-h-[90px]">
                      <AnimatePresence mode="wait">
                        {attendancePercent < 75 ? (
                          <motion.div
                             key="alert"
                             initial={{ opacity: 0, scale: 0.95 }}
                             animate={{ opacity: 1, scale: 1 }}
                             exit={{ opacity: 0, scale: 0.95 }}
                             className="p-3 border border-red-500/30 bg-red-950/20 space-y-1.5 rounded-xl"
                          >
                            <div className="flex items-center gap-1.5 text-red-500 font-bold text-[9px] uppercase font-mono">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-pulse shrink-0" />
                              <span>{simLanguage === "en" ? "CRITICAL ALERT!" : "తీవ్ర హెచ్చరిక!"}</span>
                            </div>
                            <p className="text-[9px] text-neutral-300 leading-normal font-sans font-light">
                              {simLanguage === "en" 
                                ? "Attendance dropped below critical 75% threshold! Immediate warnings triggered." 
                                : "హాజరు శాతం కనీస 75% కన్నా తక్కువ ఉన్నది! హెచ్చరిక యాక్టివ్ చేయబడింది."}
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="safe"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-3 border border-green-500/25 bg-green-950/10 flex items-center justify-center gap-1.5 rounded-xl"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0"></span>
                            <span className="text-[9px] font-mono text-neutral-400">
                              {simLanguage === "en" ? "Secure status threshold (>75%)" : "హాజరు స్థితి సురక్షితం"}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>
                ) : (
                  // INTERACTIVE PROJECT 02: RAIL ROUTING AND TICKETING SYSTEM SCREEN
                  <div className="flex-1 flex flex-col justify-between h-full space-y-3 mt-3">
                    
                    {/* Compact Screen Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5 align-middle">
                      <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1">
                        <Train className="w-3.5 h-3.5 text-blue-400" />
                        <span>TRANSIT CORES</span>
                      </span>
                      <span className="text-[8.5px] font-mono px-1.5 py-0.5 bg-blue-900/40 border border-blue-500/30 text-blue-300 rounded">
                        DIJKSTRA V3
                      </span>
                    </div>

                    {/* Dijkstra Routing Block */}
                    <div className="bg-[#040404]/95 border border-white/10 p-2 text-left space-y-1.5 rounded-xl">
                      <div className="flex items-center justify-between text-[8px] font-mono text-neutral-500 uppercase tracking-widest leading-none mb-1">
                        <span>Router parameters</span>
                        {isRouting && <span className="text-blue-400 animate-pulse">computing...</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono text-white">
                        <div className="bg-white/5 border border-white/10 p-1 flex flex-col rounded">
                          <span className="text-[7.5px] text-neutral-500">START STATION</span>
                          <span className="truncate">{startStation}</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-1 flex flex-col rounded">
                          <span className="text-[7.5px] text-neutral-500 font-sans">DESTINATION</span>
                          <span className="truncate">{endStation}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIsRouting(true);
                          setComputedRoute(null);
                          setTimeout(() => {
                            setIsRouting(false);
                            setComputedRoute([startStation.substring(0,3).toUpperCase(), "WGL", endStation.substring(0,3).toUpperCase()]);
                          }, 1000);
                        }}
                        disabled={isRouting}
                        className="w-full py-1 text-[8.5px] font-mono font-semibold uppercase bg-blue-600/20 border border-blue-500/40 hover:bg-blue-600/30 text-blue-300 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 transition-all text-center rounded"
                      >
                        <Search className="w-3 h-3 text-blue-400" />
                        <span>{isRouting ? "CALCULATING DJIKSTRA..." : "RUN OPTIMAL ROUTING"}</span>
                      </button>

                      {computedRoute && (
                        <div className="text-[9px] font-mono text-white pt-1 pb-1 flex flex-col items-center justify-center border-t border-white/5 mt-1 bg-blue-500/5 rounded">
                          <span className="text-[7.5px] text-blue-400 font-bold tracking-wider">OPTIMIZED SCHEMATIC BRIDGE PATH</span>
                          <div className="flex items-center gap-1 mt-1 font-bold">
                            <span>{computedRoute[0]}</span>
                            <span className="text-blue-500 animate-pulse">➔</span>
                            <span className="text-neutral-300 font-light">{computedRoute[1]}</span>
                            <span className="text-blue-500 animate-pulse">➔</span>
                            <span>{computedRoute[2]}</span>
                          </div>
                          <span className="text-[7.5px] text-neutral-500 mt-0.5 font-sans uppercase">LATENCY: 0.42ms | HOP COUNT: 3 | WEIGHT: 294</span>
                        </div>
                      )}
                    </div>

                    {/* Concurrency and Seat selector with Database lock simulation */}
                    <div className="bg-[#040404]/95 border border-white/10 p-2 text-left space-y-1 rounded-xl">
                      <div className="flex items-center justify-between text-[8px] font-mono text-neutral-500 uppercase tracking-widest leading-none">
                        <span>Seat grid (concurrency lock)</span>
                        <span className="text-[7.5px] text-neutral-400 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5 text-yellow-500" />
                          <span>MUTEX LOCKS ACTIVE</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-1 pt-1.5 pb-1">
                        {["A1", "A2", "B1", "B2", "B3", "C1", "C2", "C3"].map(seat => {
                          const isReserved = reservedSeats.includes(seat);
                          const isSelected = selectedSeat === seat;
                          return (
                            <button
                              key={seat}
                              onClick={() => {
                                if (isReserved) {
                                  setConcurrencyLogs(prev => [
                                    ...prev.slice(-3),
                                    `[MUTEX EXCLUSION SHIELD] FAILED lock:seat:${seat} already occupied!`
                                  ]);
                                  return;
                                }
                                setSelectedSeat(seat);
                                setIsProcessingReservation(true);
                                setConcurrencyLogs(prev => [
                                  ...prev.slice(-2),
                                  `[REDIS LOCK] Acquired lock key: 'lock:seat:${seat}'`,
                                  `[DB CORRELATION] Executing SELECT FOR UPDATE to block race hazards`,
                                ]);
                                
                                setTimeout(() => {
                                  setIsProcessingReservation(false);
                                  setReservedSeats(prev => [...prev, seat]);
                                  setSelectedSeat(null);
                                  setConcurrencyLogs(prev => [
                                    ...prev.slice(-3),
                                    `[TXN COMMIT] Successfully booked seat ${seat}. Lock key released.`
                                  ]);
                                }, 900);
                              }}
                              disabled={isProcessingReservation}
                              className={`py-1 text-[8.5px] font-mono text-center cursor-pointer transition-all border rounded ${
                                isReserved 
                                  ? "bg-neutral-900 border-neutral-800 text-neutral-600 cursor-not-allowed" 
                                  : isSelected 
                                    ? "bg-yellow-500/20 border-yellow-400 text-yellow-300 hover:bg-yellow-500/30 animate-pulse" 
                                    : "bg-white/5 border-white/10 hover:border-blue-400 hover:bg-blue-500/10 text-neutral-300"
                              }`}
                            >
                              {seat}
                            </button>
                          );
                        })}
                      </div>

                      {/* Micro log stream */}
                      <div className="bg-black/90 rounded border border-white/5 p-1 text-[7.5px] font-mono text-neutral-400 space-y-0.5 max-h-[38px] overflow-hidden leading-snug">
                        {concurrencyLogs.map((log, index) => (
                          <div key={index} className="truncate select-text">
                            <span className="text-blue-500 font-bold">&gt;</span> {log}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mobile Dynamic Encrypted QR Generation */}
                    <div className="flex-1 flex flex-col justify-end">
                      <AnimatePresence mode="wait">
                        {ticketData ? (
                          <motion.div
                            key="ticket"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-1.5 border border-blue-500/30 bg-blue-950/20 text-left space-y-1 flex rounded-xl"
                          >
                            <div className="flex-1 space-y-0.5 pr-2">
                              <span className="text-[7.5px] font-mono text-blue-400 tracking-wider block uppercase font-bold">ENCRYPTED TRANSIT SLIP</span>
                              <div className="text-[7.5px] font-mono text-neutral-300 space-y-0.5">
                                <div className="truncate"><span className="text-neutral-500">TXN:</span> {ticketData.txnId}</div>
                                <div className="truncate"><span className="text-neutral-500">SIGN:</span> HMAC-SHA256</div>
                                <div className="truncate text-green-400 font-bold">STATUS: SIGNED & SECURE</div>
                              </div>
                              <button 
                                onClick={() => setTicketData(null)} 
                                className="text-[7px] font-mono hover:text-white text-blue-400 uppercase pt-1 px-1 py-0.5 bg-white/5 border border-white/5 rounded"
                              >
                                [ Reset ]
                              </button>
                            </div>

                            {/* Stylized QR Code in CSS pixels */}
                            <div className="w-10 h-10 border border-blue-500/40 p-1 bg-white/10 shrink-0 flex flex-col justify-between items-center relative rounded">
                              <div className="grid grid-cols-4 gap-0.5 w-full h-full opacity-90">
                                {[1,0,1,1, 0,1,0,1, 1,1,0,0, 0,1,1,1, 1,0,1,0].map((val, idx) => (
                                  <div key={idx} className={`w-full h-full ${val === 1 ? "bg-white" : "bg-transparent"}`}></div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <button
                            onClick={() => {
                              setGeneratingTicket(true);
                              setTimeout(() => {
                                setGeneratingTicket(false);
                                setTicketData({
                                  txnId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
                                  timestamp: new Date().toLocaleTimeString(),
                                  qrHash: "7a92cfb37c89f2deb248942b"
                                });
                              }, 1100);
                            }}
                            disabled={generatingTicket}
                            className="w-full py-1.5 border border-white/10 hover:border-yellow-500/40 hover:bg-yellow-500/10 text-neutral-300 font-mono text-[8.5px] tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all leading-none rounded-xl"
                          >
                            {generatingTicket ? (
                              <>
                                <RefreshCw className="w-3 h-3 text-yellow-400 animate-spin" />
                                <span>GENERATING CRYPTO SLIP...</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3 text-yellow-400" />
                                <span>AUTHORIZE & GENERATE QR TICKET</span>
                              </>
                            )}
                          </button>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>
                )}

              </div>

              {/* Simulated home button bezel */}
              <div className="w-24 h-1 rounded-full bg-neutral-700 mx-auto mt-2" />

            </div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
