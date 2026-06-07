import { LOCALIZATION } from "../localization";
import { motion } from "motion/react";
import { Smartphone } from "lucide-react";

interface NavigationProps {
  currentLang: "en" | "te";
  activeSection: string;
}

export default function Navigation({ currentLang, activeSection }: NavigationProps) {
  const t = LOCALIZATION["en"];

  const scrollIntoView = (id: string) => {
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
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const navItems = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "interests", label: "Interests" },
    { id: "projects", label: "Projects" },
    { id: "workflow", label: "Workflow" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-white/[0.04] bg-neutral-900/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        
        {/* Logo / Branding */}
        <button 
          onClick={() => {
            const container = document.querySelector(".scroll-container");
            if (container) {
              container.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/10 overflow-hidden transition-all duration-300 group-hover:border-blue-500/50">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Smartphone className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-display font-medium text-xs sm:text-xs md:text-sm tracking-widest text-[#E0E0E0] group-hover:text-blue-400 transition-colors duration-300 whitespace-nowrap uppercase">
              HARSHA PRANAY
            </span>
            <span className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase whitespace-nowrap">{t.role}</span>
          </div>
        </button>

        {/* Section Navigation Items */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-full p-1 backdrop-blur-md">
          {navItems.map((item, idx) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollIntoView(item.id)}
                className={`relative px-4 py-1.5 text-[10px] font-mono tracking-widest uppercase transition-colors duration-300 cursor-pointer ${
                  isActive ? "text-blue-400 font-bold text-glow" : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-full z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <span className="opacity-40 text-[8px]">0{idx + 1}/</span>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Spacer to balance the layout centering */}
        <div className="w-12 h-1 md:w-20"></div>

      </div>
    </header>
  );
}
