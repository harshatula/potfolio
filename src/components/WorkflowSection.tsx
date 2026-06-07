import { WORKFLOW_STEPS, APPROACH_PRINCIPLES } from "../data";
import { LOCALIZATION } from "../localization";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as Icons from "lucide-react";

interface WorkflowSectionProps {
  currentLang: "en" | "te";
}

export default function WorkflowSection({ currentLang }: WorkflowSectionProps) {
  const t = LOCALIZATION[currentLang];
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const getIconComponent = (iconName: string, color: string) => {
    const IconComp = (Icons as any)[iconName];
    return IconComp ? <IconComp className={`w-4 h-4 ${color}`} /> : <Icons.HelpCircle className="w-4 h-4" />;
  };

  return (
    <section id="workflow" className="relative py-8 sm:py-12 px-6 max-w-7xl mx-auto select-none overflow-hidden">
      
      {/* Background glow circle */}
      <div className="absolute left-10 top-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10 animate-glow-pulse"></div>

      {/* Chapter header */}
      <div className="space-y-1.5 mb-6 text-center max-w-2xl mx-auto">
        <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase">05 . THE BLUEPRINT</span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">{t.workflowTitle}</h2>
        <p className="text-xs font-sans font-light text-neutral-400">
          {t.workflowSubtitle}
        </p>
      </div>

      {/* Grid: Interactive Timeline on left, Blueprint expansion on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Side: Timeline Navigation */}
        <div className="lg:col-span-6 relative">
          
          {/* Vertical central continuous timeline cable */}
          <div className="absolute left-6 top-5 bottom-5 w-[2px] bg-white/[0.04]">
            {/* Glowing active progress line fill */}
            <div 
              className="absolute top-0 w-full bg-blue-500 transition-all duration-500"
              style={{ height: `${(activeStepIdx / (WORKFLOW_STEPS.length - 1)) * 100}%` }}
            ></div>
          </div>

          <div className="space-y-2">
            {WORKFLOW_STEPS.map((step, idx) => {
              const isActive = activeStepIdx === idx;
              
              return (
                <button
                  key={step.title}
                  onClick={() => setActiveStepIdx(idx)}
                  className={`relative flex items-center gap-4 w-full p-2.5 px-3.5 border text-left cursor-pointer transition-all duration-300 rounded ${
                    isActive
                      ? "bg-white/5 border-white/15"
                      : "bg-transparent border-transparent hover:bg-white/[0.02]"
                  }`}
                >
                  {/* Architectural step badge connector node */}
                  <div className={`relative z-10 w-5 h-5 flex items-center justify-center border text-[8.5px] font-mono font-bold transition-all duration-300 rounded ${
                    isActive
                      ? "bg-blue-500 border-blue-400 text-white shadow-md shadow-blue-500/20"
                      : "bg-[#040404] border-white/10 text-neutral-400 hover:text-white"
                  }`}>
                    0{idx + 1}
                  </div>

                  <div>
                    <h4 className={`text-xs font-display font-medium transition-colors duration-300 uppercase tracking-wider ${
                      isActive ? "text-blue-400 font-bold" : "text-neutral-300 hover:text-white"
                    }`}>
                      {step.title}
                    </h4>
                    <span className="text-[7.5px] font-mono text-neutral-500 tracking-widest block uppercase">
                      {step.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: High Spec expanded view card */}
        <div className="lg:col-span-6 lg:sticky lg:top-24">
          <div className="bg-white/5 border border-white/10 p-5 relative overflow-hidden backdrop-blur-md min-h-[220px] flex flex-col justify-between rounded-xl">
            
            {/* Corner geometric decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStepIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-3"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-white/10 animate-none">
                  <div className="p-2 bg-white/5 border border-white/10 text-blue-400 rounded">
                    {getIconComponent(WORKFLOW_STEPS[activeStepIdx].icon, "text-blue-400")}
                  </div>
                  <div className="text-left">
                    <span className="text-[7.5px] font-mono text-neutral-500 tracking-widest block uppercase">PIPELINE PHASE 0{activeStepIdx + 1}</span>
                    <h3 className="font-display font-medium text-xs tracking-widest text-white uppercase mt-0.5">
                      {WORKFLOW_STEPS[activeStepIdx].title}
                    </h3>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-300 leading-relaxed font-sans font-light text-left">
                  {WORKFLOW_STEPS[activeStepIdx].description}
                </p>

              </motion.div>
            </AnimatePresence>

            {/* Approach Core Principles list */}
            <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
              <span className="text-[8px] font-mono text-neutral-500 tracking-widest uppercase block">{t.approachTitle}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {APPROACH_PRINCIPLES.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <span className="text-[8.5px] font-mono tracking-wider font-semibold text-white block uppercase">{item.title}</span>
                    <span className="text-[9.5px] text-neutral-400 block font-sans font-light leading-normal">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
