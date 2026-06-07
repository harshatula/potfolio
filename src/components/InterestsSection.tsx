import { CREATIVE_INTERESTS } from "../data";
import { LOCALIZATION } from "../localization";
import { motion } from "motion/react";
import * as Icons from "lucide-react";

interface InterestsSectionProps {
  currentLang: "en" | "te";
}

export default function InterestsSection({ currentLang }: InterestsSectionProps) {
  const t = LOCALIZATION[currentLang];

  // Helper to dynamically match icons from string values
  const getIconComponent = (iconName: string) => {
    const IconComp = (Icons as any)[iconName];
    return IconComp ? <IconComp className="w-5 h-5" /> : <Icons.HelpCircle className="w-5 h-5" />;
  };

  return (
    <section id="interests" className="relative py-24 px-6 max-w-7xl mx-auto select-none">
      
      {/* Absolute backdrops */}
      <div className="absolute left-1/3 top-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10 animate-glow-pulse"></div>

      {/* Chapter Headers */}
      <div className="space-y-3 mb-16 text-center max-w-3xl mx-auto">
        <span className="text-[11px] font-mono tracking-widest text-blue-400 uppercase">03 . DESIGN FUSION</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">{t.interestsTitle}</h2>
        <p className="text-sm sm:text-base text-neutral-400 font-sans font-light leading-relaxed">
          {t.interestsSubtitle}
        </p>
      </div>

      {/* Grid: Bento Style composition */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {CREATIVE_INTERESTS.map((interest, idx) => {
          const isFullWidthOnLarge = idx === 3 || idx === 4; // layout variation
          
          return (
            <div
              key={interest.title}
              className={`bg-white/5 border border-white/10 p-6 relative flex flex-col justify-between overflow-hidden group hover:border-blue-500/30 transition-all duration-500 ${
                isFullWidthOnLarge ? "lg:col-span-1" : "lg:col-span-1"
              }`}
            >
              <div className="space-y-4">
                {/* Heading with Icon box */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-white/10">
                  <div className="p-2.5 bg-white/5 border border-white/10 text-neutral-400 group-hover:text-blue-400 transition-all duration-300" style={{ 
                    color: interest.color 
                  }}>
                    {getIconComponent(interest.icon)}
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-neutral-500 tracking-widest block uppercase">
                      0{idx + 1} / {interest.subtitle}
                    </span>
                    <h3 className="font-display font-medium text-xs sm:text-sm text-white tracking-wider uppercase group-hover:text-blue-400 transition-colors duration-300">
                      {interest.title}
                    </h3>
                  </div>
                </div>

                {/* Subtext description */}
                <p className="text-[11px] sm:text-xs text-neutral-400 leading-normal font-sans font-light">
                  {interest.description}
                </p>
              </div>

              {/* Specific highlights listed as custom tag pills */}
              <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                <span className="text-[8px] font-mono uppercase text-neutral-500 tracking-widest block mb-2">SPECIAL SPECS:</span>
                <div className="flex flex-wrap gap-1.5">
                  {interest.details.map((detail, dIdx) => (
                    <span 
                      key={dIdx}
                      className="text-[9px] font-mono px-2 py-1 bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-blue-500/20 transition-all duration-300 uppercase"
                    >
                      {detail}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}
