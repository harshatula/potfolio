import { SKILL_NODES } from "../data";
import { LOCALIZATION } from "../localization";
import { motion, AnimatePresence } from "motion/react";
import { Smartphone, Cloud, CheckCircle2, Languages, HelpCircle } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface TechnicalSectionProps {
  currentLang: "en" | "te";
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

const RADAR_DATASETS: Record<string, { subject: string; value: number }[]> = {
  mobile: [
    { subject: "React Native", value: 95 },
    { subject: "Expo Ecosystem", value: 90 },
    { subject: "Expo Router", value: 85 },
    { subject: "EAS Pipelines", value: 80 },
    { subject: "Android SDK", value: 92 },
    { subject: "Performance", value: 88 }
  ],
  backend: [
    { subject: "Firebase Auth", value: 92 },
    { subject: "Firestore DB", value: 95 },
    { subject: "Realtime DB", value: 88 },
    { subject: "Security Rules", value: 90 },
    { subject: "API Proxy", value: 85 },
    { subject: "Offline Sync", value: 87 }
  ],
  workflow: [
    { subject: "TypeScript", value: 96 },
    { subject: "Git Versioning", value: 90 },
    { subject: "APK Compilation", value: 92 },
    { subject: "OTA Deploy", value: 88 },
    { subject: "JavaScript", value: 94 },
    { subject: "Build Speed", value: 85 }
  ],
  localization: [
    { subject: "Runtime i18n", value: 98 },
    { subject: "Telugu UX", value: 95 },
    { subject: "Regional Opt", value: 90 },
    { subject: "Font Scaling", value: 85 },
    { subject: "L10n Schema", value: 88 },
    { subject: "Layout Control", value: 92 }
  ]
};

export default function TechnicalSection({ currentLang, activeCategory, setActiveCategory }: TechnicalSectionProps) {
  const t = LOCALIZATION[currentLang];

  const categories = [
    { id: "mobile", label: currentLang === "en" ? "Mobile Development" : "మొబైల్ అభివృద్ధి", icon: Smartphone },
    { id: "backend", label: currentLang === "en" ? "Backend & Cloud" : "బ్యాకెండ్ & క్లౌడ్", icon: Cloud },
    { id: "workflow", label: currentLang === "en" ? "Dev Workflow" : "వర్క్‌ఫ్లో", icon: CheckCircle2 },
    { id: "localization", label: currentLang === "en" ? "Localization" : "స్థానికీకరణ (i18n)", icon: Languages }
  ];

  const filteredSkills = SKILL_NODES.filter(node => node.category === activeCategory);
  const chartData = RADAR_DATASETS[activeCategory] || RADAR_DATASETS.mobile;

  return (
    <section id="skills" className="relative py-24 px-6 max-w-7xl mx-auto select-none overflow-hidden">
      
      {/* Absolute background accent lights */}
      <div className="absolute right-0 top-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10 animate-glow-pulse"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Category Controllers */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-widest text-blue-400 uppercase">02 . {t.techSubtitle}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">{t.techTitle}</h2>
          </div>
          
          <p className="text-sm text-neutral-400 leading-relaxed font-sans max-w-md font-light">
            {t.techInstruction}
          </p>

          {/* Interactive Navigation Control Column */}
          <div className="flex flex-col gap-2.5">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`group relative flex items-center gap-4 w-full p-4 rounded-xl text-left border cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? "bg-blue-600/[0.08] border-blue-500/40" 
                      : "bg-neutral-900/40 border-white/[0.04] hover:border-white/10 hover:bg-neutral-900/80"
                  }`}
                >
                  <div className={`p-2.5 rounded-lg border transition-all duration-300 ${
                    isActive
                      ? "bg-blue-500/20 border-blue-400/30 text-blue-400"
                      : "bg-white/[0.02] border-white/10 text-neutral-400 group-hover:text-neutral-200"
                  }`}>
                    <cat.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className={`text-xs uppercase font-mono tracking-widest block ${
                      isActive ? "text-blue-400" : "text-neutral-500"
                    }`}>
                      {cat.id === "mobile" ? "Cross Platform" : cat.id === "backend" ? "Cloud Systems" : cat.id === "workflow" ? "Pipelining" : "Regional UX"}
                    </span>
                    <span className={`text-sm font-display font-medium ${
                      isActive ? "text-white" : "text-neutral-300 group-hover:text-white"
                    }`}>
                      {cat.label}
                    </span>
                  </div>

                  {isActive && (
                    <motion.div 
                      layoutId="activeCategoryBorder" 
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-md"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Staggered Dynamic Micro-List and Radar Chart representing filtered items */}
        <div className="lg:col-span-7 flex flex-col justify-center min-h-[320px]">
          <div className="bg-white/5 border border-white/10 p-6 sm:p-8 relative overflow-hidden backdrop-blur-md rounded-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <h3 className="font-display font-medium text-xs tracking-widest text-[#E0E0E0] uppercase mb-6 border-b border-white/10 pb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              <span>
                {categories.find(c => c.id === activeCategory)?.label}
              </span>
            </h3>

            {/* Split layout: List of tags and Radar Chart */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
              {/* Left Column: Stack/Tags list of skills */}
              <div className="md:col-span-7 flex flex-col gap-3">
                <span className="text-[10px] font-mono text-neutral-450 uppercase tracking-widest block opacity-70">
                  {currentLang === "en" ? "CORE MODULES & ENGINE TOOLS" : "ప్రధాన మాడ్యూల్స్ & సాధనాలు"}
                </span>
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence mode="popLayout">
                    {filteredSkills.map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-3.5 py-2 rounded-full hover:border-blue-500/30 hover:bg-white/[0.08] transition-all duration-300 cursor-default group"
                      >
                        <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:bg-blue-300 transition-colors duration-300 shrink-0"></div>
                        <span className="text-[10px] font-mono tracking-wider text-neutral-300 group-hover:text-white transition-colors duration-300 uppercase">
                          {skill.name}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Column: Skill distribution radar chart */}
              <div className="md:col-span-5 w-full h-[220px] flex items-center justify-center relative bg-white/[0.01] border border-white/[0.05] rounded-2xl p-2 select-none">
                <div className="absolute inset-0 bg-radial from-blue-500/5 to-transparent pointer-events-none opacity-40 animate-glow-pulse" />
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="rgba(255, 255, 255, 0.08)" gridType="polygon" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: "#a3a3a3", fontSize: 8, fontFamily: "JetBrains Mono, monospace" }}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]} 
                      tick={false} 
                      axisLine={false}
                    />
                    <Radar
                      name="Expertise"
                      dataKey="value"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.16}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2.5 text-[9px] text-neutral-500 font-mono tracking-wider uppercase">
              <HelpCircle className="w-3.5 h-3.5 text-blue-500/50" />
              <span>
                {currentLang === "en" 
                  ? "Connected dynamically with the surrounding 3D orbital galaxy model." 
                  : "చుట్టుపక్కల 3D కక్ష్య గెలాక్సీ మోడల్‌తో డైనమిక్‌గా అనుసంధానించబడింది."}
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
