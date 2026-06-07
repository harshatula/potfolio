import { LOCALIZATION } from "../localization";
import { motion } from "motion/react";
import { ArrowDown, Smartphone, Briefcase, FileDown, Mail } from "lucide-react";

interface LandingSectionProps {
  currentLang: "en" | "te";
}

export default function LandingSection({ currentLang }: LandingSectionProps) {
  const t = LOCALIZATION[currentLang];

  const handleScrollTo = (id: string) => {
    const stepIndices: Record<string, number> = {
      landing: 0,
      about: 1,
      skills: 2,
      interests: 3,
      projects: 4,
      workflow: 6,
      contact: 7
    };
    const container = document.querySelector(".scroll-container");
    if (container) {
      const vh = container.clientHeight || window.innerHeight || 800;
      const targetIndex = stepIndices[id] ?? 0;
      container.scrollTo({ top: targetIndex * vh, behavior: "smooth" });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Explode letters for premium text reveal
  const titleLetters = Array.from(t.name);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.05, delayChildren: 0.2 } 
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 35, rotateX: -30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { type: "spring", stiffness: 60, damping: 14, mass: 1.1 } 
    }
  };

  return (
    <section className="relative w-full h-screen flex flex-col justify-center items-center px-6 overflow-hidden select-none">
      
      {/* Decorative cybernetic overlay circle backing */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none -z-10 animate-glow-pulse"></div>

      {/* Cinematic Content Stack */}
      <div className="text-center max-w-4xl z-25 mt-10">
        
        {/* Animated Mobile Developer Tag badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-[0.4em] font-mono text-blue-400 uppercase mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          {t.role}
        </motion.div>

        {/* Floating Huge display title with 3D projection feel */}
        <motion.h1 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-display font-extrabold tracking-tight text-5xl sm:text-7xl md:text-[84px] leading-[1.1] mb-6 text-white transform-gpu"
        >
          {titleLetters.map((letter, idx) => (
            <motion.span 
              key={idx} 
              variants={letterVariants}
              className="inline-block"
              style={{ transformStyle: "preserve-3d" }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.h1>

        {/* Dynamic description/tagline */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          className="text-[11px] sm:text-xs text-white/50 font-mono tracking-[0.25em] max-w-xl mx-auto mb-12 uppercase leading-relaxed"
        >
          {t.tagline}
        </motion.p>

        {/* CTA Buttons Group */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-4 max-w-lg sm:max-w-none mx-auto"
        >
          {/* Explore Button */}
          <button 
            onClick={() => handleScrollTo("about")}
            className="group relative flex items-center gap-2.5 px-6 py-3.5 border border-white/10 bg-white/5 backdrop-blur-xl text-[10px] uppercase tracking-[0.2em] font-mono text-white hover:bg-blue-500/20 hover:border-blue-500/40 cursor-pointer transition-all duration-300"
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
            <span>{t.exploreBtn}</span>
          </button>

          {/* Projects Button */}
          <button 
            onClick={() => handleScrollTo("projects")}
            className="group flex items-center gap-2.5 px-6 py-3.5 border border-white/10 bg-white/5 backdrop-blur-xl text-[10px] uppercase tracking-[0.2em] font-mono text-neutral-300 hover:text-white hover:bg-white/10 cursor-pointer transition-all duration-300"
          >
            <Briefcase className="w-3.5 h-3.5 text-neutral-400 group-hover:scale-110 transition-transform duration-300" />
            <span>{t.projectsBtn}</span>
          </button>

          {/* Resume Button */}
          <a 
            href="https://harshapranaytula.github.io/portfolio/resume.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 px-6 py-3.5 border border-white/10 bg-white/5 backdrop-blur-xl text-[10px] uppercase tracking-[0.2em] font-mono text-neutral-300 hover:text-white hover:bg-white/10 cursor-pointer transition-all duration-300"
          >
            <FileDown className="w-3.5 h-3.5 text-neutral-400 group-hover:scale-110 transition-transform duration-300" />
            <span>{t.resumeBtn}</span>
          </a>

          {/* Contact Button */}
          <button 
            onClick={() => handleScrollTo("contact")}
            className="group flex items-center gap-2.5 px-6 py-3.5 border border-white/10 bg-white/5 backdrop-blur-xl text-[10px] uppercase tracking-[0.2em] font-mono text-neutral-300 hover:text-white hover:bg-white/10 cursor-pointer transition-all duration-300"
          >
            <Mail className="w-3.5 h-3.5 text-neutral-400 group-hover:scale-110 transition-transform duration-300" />
            <span>{t.contactBtn}</span>
          </button>
        </motion.div>

      </div>

      {/* Floating Animated Scroll Down Line Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={() => handleScrollTo("about")}
        className="absolute bottom-16 flex flex-col items-center gap-4 z-20 cursor-pointer"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent"></div>
        <span className="text-[8px] uppercase tracking-[0.5em] text-white/40">{t.scrollIndicator}</span>
      </motion.div>

    </section>
  );
}
