import { LOCALIZATION } from "../localization";
import { motion } from "motion/react";
import { Smartphone, Shield, Sparkles, Languages } from "lucide-react";

interface AboutSectionProps {
  currentLang: "en" | "te";
}

export default function AboutSection({ currentLang }: AboutSectionProps) {
  const t = LOCALIZATION[currentLang];

  const highlights = [
    {
      icon: Smartphone,
      title: currentLang === "en" ? "Native Craftsmanship" : "స్థానిక ఆండ్రాయిడ్ క్రాఫ్ట్",
      desc: currentLang === "en" ? "Precision control over hardware cutouts, sensor integrations, and mobile render cycles." : "హార్డ్‌వేర్ కటౌట్‌లు, సెన్సార్ ఇంటిగ్రేషన్‌లు మరియు మొబైల్ రెండర్ సైకిల్స్‌పై ఖచ్చితమైన నియంత్రణ."
    },
    {
      icon: Shield,
      title: currentLang === "en" ? "Architectural Rigor" : "బలమైన నిర్మాణం",
      desc: currentLang === "en" ? "Scaling application architectures on robust SQLite databases and secure Firestore logic." : "SQLite డేటాబేస్ మరియు సురక్షితమైన ఫైర్‌స్టోర్ లాజిక్‌తో అప్లికేషన్ ఆర్కిటెక్చర్‌లను స్కేలింగ్ చేయడం."
    },
    {
      icon: Languages,
      title: currentLang === "en" ? "Regional Adaptation" : "స్థానిక అనుకూలత (i18n)",
      desc: currentLang === "en" ? "Deep experience with RTL layouts, language switches, and Telugu localization." : "ఆండ్రాయిడ్/ఐఓఎస్‌లో తెలుగు సబ్-లేఅవుట్‌లు మరియు అనువాదాల ఆప్టిమైజేషన్."
    },
    {
      icon: Sparkles,
      title: currentLang === "en" ? "Motion Design" : "ద్రవ చలనం మరియు యానిమేషన్స్",
      desc: currentLang === "en" ? "Engineering fluid, organic spring-physics based layouts that make apps feel alive." : "యాప్‌లను ఎంతో ఆహ్లాదకరంగా మార్చే భౌతిక స్ప్రింగ్-ఫిజిక్స్ ఆధారిత యానిమేషన్స్."
    }
  ];

  return (
    <section id="about" className="relative py-24 px-6 max-w-7xl mx-auto select-none">
      
      {/* Absolute glow balls for visual rhythm */}
      <div className="absolute -left-40 top-1/4 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl pointer-events-none -z-10"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left column: Section Title & Profile Info */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-widest text-blue-400 uppercase">
              01 . {currentLang === "en" ? "INTRODUCTION" : "పరిచయం"}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-white leading-tight">
              {t.aboutTitle}
            </h2>
          </div>
          
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden glow-card">
            <div className="space-y-5">
              <div className="border-b border-white/[0.06] pb-4">
                <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                  {currentLang === "en" ? "Developer Identity" : "గుర్తింపు"}
                </span>
                <span className="text-xl font-display font-medium text-white block">Harsha Pranay</span>
                <span className="text-xs text-blue-400 font-mono tracking-wider">{t.role}</span>
              </div>
              
              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                  {t.specializationLabel}
                </span>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans font-light">
                  {t.specialValueText}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                  {currentLang === "en" ? "Email Host" : "ఈమెయిల్"}
                </span>
                <span className="text-xs sm:text-sm text-neutral-400 font-mono">harshapranaytula@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Story Narrative & Philosophical Cards */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Paragraph Bio */}
          <div className="space-y-6 bg-white/5 border-l border-white/10 p-6 backdrop-blur-md text-left">
            <p className="text-[13px] sm:text-[14px] text-white/90 leading-relaxed font-serif italic">
              "{t.narrativeText}"
            </p>
          </div>

          {/* Philosophy Core Block */}
          <div className="bg-white/5 border border-white/10 p-8 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex gap-4 items-start">
              <div className="p-2.5 bg-white/5 border border-white/10 text-blue-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-3">
                <h3 className="text-[10px] uppercase font-mono tracking-[0.3em] text-blue-400 font-bold">
                  {t.philosophyLabel}
                </h3>
                <p className="text-neutral-300 text-xs sm:text-sm font-light leading-relaxed font-sans">
                  {t.philosophyText}
                </p>
              </div>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {highlights.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white/5 border border-white/10 p-6 space-y-4 relative group hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="p-2 w-fit bg-white/5 border border-white/10 text-neutral-400 group-hover:text-blue-400 group-hover:bg-blue-500/5 group-hover:border-blue-500/30 transition-all duration-300">
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-display font-medium text-xs tracking-wider uppercase text-white mb-2">{item.title}</h4>
                  <p className="text-[11px] text-neutral-400 leading-normal font-sans font-light">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
