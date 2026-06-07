import React, { useState, useEffect, useRef } from "react";
import Navigation from "./components/Navigation";
import LandingSection from "./components/LandingSection";
import AboutSection from "./components/AboutSection";
import TechnicalSection from "./components/TechnicalSection";
import InterestsSection from "./components/InterestsSection";
import ProjectShowcase from "./components/ProjectShowcase";
import WorkflowSection from "./components/WorkflowSection";
import ContactSection from "./components/ContactSection";
import CanvasScene from "./components/CanvasScene";
import CustomCursor from "./components/CustomCursor";
import { Copyright } from "lucide-react";

interface HelicalSectionProps {
  children: React.ReactNode;
  id: string;
  index: number;
  scrollY: number;
}

function HelicalSection({ children, id, index, scrollY }: HelicalSectionProps) {
  const [vh, setVh] = useState(800);
  
  useEffect(() => {
    setVh(window.innerHeight || 800);
    const handleResize = () => setVh(window.innerHeight || 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute scroll offset progress for the current step (0 matches center)
  const targetScroll = index * vh;
  const progress = (scrollY - targetScroll) / vh;
  
  // Helical spiral variables (rotated around central Y axis)
  const rotateY = progress * -75; // 75 deg continuous spiral
  const translateZ = -Math.abs(progress) * 700; // recess back into the 3D depth
  const translateX = Math.sin(progress * Math.PI) * -180; // sweep sidebar
  const translateY = progress * -180; // vertical drift
  const scale = 1 - Math.min(0.24, Math.abs(progress) * 0.24);
  const opacity = Math.max(0, 1 - Math.abs(progress) * 1.1);

  const isFarHidden = Math.abs(progress) > 0.98;
  const isCurrentlyActive = Math.round(scrollY / vh) === index;

  return (
    <div
      id={id}
      className="w-full h-screen min-h-screen overflow-hidden flex items-center justify-center snap-start relative"
      style={{
        transformStyle: "preserve-3d",
        pointerEvents: (isCurrentlyActive || Math.abs(progress) < 0.75) ? "auto" : "none",
      }}
    >
      <div
        id={`scroll-inner-${id}`}
        className="w-full max-h-[82vh] sm:max-h-[85vh] lg:max-h-[88vh] overflow-y-auto thin-scrollbar flex flex-col items-center justify-start transform-gpu select-text py-2 sm:py-4 px-4 sm:px-6 scroll-smooth"
        style={{
          transform: `perspective(1600px) rotateY(${rotateY}deg) translate3d(${translateX}px, ${translateY}px, ${translateZ}px) scale(${scale})`,
          opacity: isFarHidden ? 0 : opacity,
          transformStyle: "preserve-3d",
          willChange: "transform, opacity",
          transition: "opacity 300ms cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      >
        {children}
      </div>

      {id !== "contact" && (
        <button
          onClick={() => {
            const innerSection = document.getElementById(`scroll-inner-${id}`);
            if (innerSection) {
              const currentInnerScroll = innerSection.scrollTop;
              const maxInnerScroll = innerSection.scrollHeight - innerSection.clientHeight;
              // If there's content remaining to scroll down below (at least 20px of distance)
              if (currentInnerScroll < maxInnerScroll - 20) {
                innerSection.scrollBy({ top: innerSection.clientHeight * 0.65, behavior: "smooth" });
                return;
              }
            }

            const container = document.querySelector(".scroll-container");
            if (container) {
              const liveVh = container.clientHeight || window.innerHeight || 800;
              const targetTop = (index + 1) * liveVh;
              container.scrollTo({ top: targetTop, behavior: "smooth" });
            } else {
              const nextSections = ["about", "skills", "interests", "projects", "workflow", "contact"];
              const nextId = nextSections[index];
              const el = document.getElementById(nextId);
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[9px] font-mono tracking-widest text-[#999999]/85 hover:text-blue-400 cursor-pointer group transition-all duration-300 z-[120] pointer-events-auto select-none"
        >
          <span className="opacity-60 group-hover:opacity-100 transition-opacity">SCROLL DOWN</span>
          <svg className="w-3.5 h-3.5 animate-bounce text-blue-500/80 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function App() {
  const currentLang = "en";
  const [activeCategory, setActiveCategory] = useState<string>("mobile");
  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>("");

  const [scrollY, setScrollY] = useState(0);
  const targetScrollYRef = useRef(0);
  const currentScrollYRef = useRef(0);
  const [interpolatedScrollY, setInterpolatedScrollY] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Precise snapping stop detection (combines high-fidelity scrollend and custom debounce fallbacks)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let timeoutId: any = null;
    let isScrollingActive = false;

    const checkAndTriggerSnap = () => {
      if (!isScrollingActive) return;
      isScrollingActive = false;

      const scrollPos = container.scrollTop;
      const vh = window.innerHeight || 800;
      const stepIndex = Math.round(scrollPos / vh);
      const distance = Math.abs(scrollPos - stepIndex * vh);

      if (distance < 15) {
        setSnapCount(prev => prev + 1);
      }
    };

    const handleScrollEvent = () => {
      isScrollingActive = true;
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        checkAndTriggerSnap();
      }, 120);
    };

    const handleScrollEnd = () => {
      isScrollingActive = true; // force active to guarantee triggering on scrollend
      if (timeoutId) clearTimeout(timeoutId);
      checkAndTriggerSnap();
    };

    container.addEventListener("scroll", handleScrollEvent, { passive: true });
    container.addEventListener("scrollend", handleScrollEnd, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScrollEvent);
      container.removeEventListener("scrollend", handleScrollEnd);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // High performance frame-independent spring interpolation loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    
    const updateInterpolation = (now: number) => {
      animId = requestAnimationFrame(updateInterpolation);
      
      const deltaTime = Math.min(32, now - lastTime) / 1000; // Cap to avoid speed runaways
      lastTime = now;
      
      const target = targetScrollYRef.current;
      const current = currentScrollYRef.current;
      const diff = target - current;
      
      if (Math.abs(diff) > 0.04) {
        const speed = 5.2; // Softer spring stiffness factor for silky-smooth luxury slide feel
        currentScrollYRef.current += diff * (1 - Math.exp(-speed * deltaTime));
        setInterpolatedScrollY(currentScrollYRef.current);
      } else if (current !== target) {
        currentScrollYRef.current = target;
        setInterpolatedScrollY(target);
      }
    };
    
    animId = requestAnimationFrame(updateInterpolation);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollPosition = e.currentTarget.scrollTop;
    targetScrollYRef.current = scrollPosition; // Update physics target
    setScrollY(scrollPosition); // Keep real scroll ratio
    
    const vh = window.innerHeight || 800;
    const currentStep = Math.round(scrollPosition / vh);
    if (currentStep !== activeStepIndex) {
      setActiveStepIndex(currentStep);
    }
  };

  useEffect(() => {
    const sectionIds = ["landing", "about", "skills", "interests", "projects", "projects", "workflow", "contact"];
    const id = sectionIds[activeStepIndex];
    if (id === "landing") {
      setActiveSection("");
    } else {
      setActiveSection(id);
    }
  }, [activeStepIndex]);

  const helicalSteps = [
    { titleEn: "About", id: "about", index: 1 },
    { titleEn: "Skills", id: "skills", index: 2 },
    { titleEn: "Interests", id: "interests", index: 3 },
    { titleEn: "Projects", id: "projects", index: 4 },
    { titleEn: "Workflow", id: "workflow", index: 6 },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#040404] text-[#E0E0E0] selection:bg-blue-500/20 selection:text-blue-300">
      
      {/* Cinematic Custom Magnetic Cursor */}
      <CustomCursor />
      
      {/* Background Lighting & Atmosphere */}
      <div className="absolute inset-x-0 top-0 bottom-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
        {/* The Invisible Axis (Subtle visual hint of central 3D cylinder) */}
        <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500/15 to-transparent" />
      </div>

      {/* Absolute fixed 3D Projection & Water Ripple canvas backdrop */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <CanvasScene 
          activeCategory={activeCategory} 
          activeProjectIndex={activeProjectIndex}
          runtimeLanguage={currentLang}
          activeStepIndex={activeStepIndex}
          scrollY={interpolatedScrollY}
          snapCount={snapCount}
        />
      </div>

      {/* Global Navigation Header (Floating Glass) */}
      <Navigation 
        currentLang={currentLang} 
        activeSection={activeSection}
      />

      {/* 3D Helical Navigation sidebar on left hand side (Desktop) */}
      <div className="hidden lg:flex fixed left-12 top-1/2 -translate-y-1/2 w-32 h-[350px] z-30 flex-col items-center justify-between pointer-events-auto">
        {/* Central glowing thread representing the Pole */}
        <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/0 via-blue-500/30 to-blue-500/0" />
        
        {helicalSteps.map((step) => {
          const isActive = activeStepIndex === step.index || (step.id === "projects" && (activeStepIndex === 4 || activeStepIndex === 5));
          const vh = window.innerHeight || 800;
          const currentTargetIndex = (step.id === "projects" && activeStepIndex === 5) ? 5 : step.index;
          const progress = (interpolatedScrollY - (currentTargetIndex * vh)) / vh;
          const ribbonAngle = progress * -80; // matching rotation
          
          return (
            <button
              key={step.id}
              onClick={() => {
                const container = document.querySelector(".scroll-container");
                if (container) {
                  const vh = container.clientHeight || window.innerHeight || 800;
                  container.scrollTo({ top: step.index * vh, behavior: "smooth" });
                } else {
                  const el = document.getElementById(step.id);
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="group relative w-full h-12 flex items-center justify-center transition-all duration-300 cursor-pointer"
              style={{
                perspective: "500px",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className={`py-1.5 px-3 border text-[9px] font-mono uppercase tracking-widest text-center shadow-lg shadow-black/60 transition-all duration-300 select-none rounded ${
                  isActive
                    ? "bg-blue-600/20 border-blue-500 text-blue-300 font-bold scale-110 shadow-blue-500/10"
                    : "bg-[#0b0c10]/95 border-white/5 text-neutral-400 group-hover:border-blue-500/40 group-hover:text-blue-400"
                }`}
                style={{
                  transform: `rotateY(${ribbonAngle}deg) translateZ(20px)`,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "visible",
                }}
              >
                {step.titleEn}
              </div>
            </button>
          );
        })}
      </div>

      {/* Master snap scrolling container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="scroll-container w-full h-full overflow-y-auto scroll-smooth snap-y snap-mandatory relative z-10 select-none pb-0"
        style={{
          perspective: "1600px",
          transformStyle: "preserve-3d",
        }}
      >
        
        {/* Step 0: Landing cinematic Reveal screen */}
        <HelicalSection id="landing" index={0} scrollY={interpolatedScrollY}>
          <LandingSection currentLang={currentLang} />
        </HelicalSection>

        {/* Step 1: About biography section */}
        <HelicalSection id="about" index={1} scrollY={interpolatedScrollY}>
          <AboutSection currentLang={currentLang} />
        </HelicalSection>

        {/* Step 2: Technical skills galaxy */}
        <HelicalSection id="skills" index={2} scrollY={interpolatedScrollY}>
          <TechnicalSection 
            currentLang={currentLang} 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory} 
          />
        </HelicalSection>

        {/* Step 3: Creative interests */}
        <HelicalSection id="interests" index={3} scrollY={interpolatedScrollY}>
          <InterestsSection currentLang={currentLang} />
        </HelicalSection>

        {/* Step 4: First engineering showcase project */}
        <HelicalSection id="projects" index={4} scrollY={interpolatedScrollY}>
          <ProjectShowcase 
            currentLang={currentLang} 
            activeProjectIndex={0} 
            setActiveProjectIndex={setActiveProjectIndex} 
          />
        </HelicalSection>

        {/* Step 5: Second engineering showcase project */}
        <HelicalSection id="projects-2" index={5} scrollY={interpolatedScrollY}>
          <ProjectShowcase 
            currentLang={currentLang} 
            activeProjectIndex={1} 
            setActiveProjectIndex={setActiveProjectIndex} 
          />
        </HelicalSection>

        {/* Step 6: Procedural checklist workflows */}
        <HelicalSection id="workflow" index={6} scrollY={interpolatedScrollY}>
          <WorkflowSection currentLang={currentLang} />
        </HelicalSection>

        {/* Step 7: Network contact terminals */}
        <HelicalSection id="contact" index={7} scrollY={interpolatedScrollY}>
          <ContactSection currentLang={currentLang} />
        </HelicalSection>

        {/* Unified clean footer sitting natively inside scrolling container at the very bottom */}
        <footer className="w-full border-t border-white/[0.04] bg-[#020202]/95 py-12 px-6 text-center text-xs text-neutral-500 font-mono snap-start select-text">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Copyright className="w-4 h-4 text-blue-500/50" />
              <span>HARSHA PRANAY © {new Date().getFullYear()}</span>
            </div>
            <span className="text-[10px] text-neutral-600 uppercase tracking-widest">
              {currentLang === "en" 
                ? "All rights reserved. Immersive spatial graphics optimized for 60fps." 
                : "అన్ని హక్కులూ సబ్‌స్క్రైబ్డ్. గరిష్ట వేగం సాఫ్ట్‌వేర్ అభివృద్ధి."}
            </span>
          </div>
        </footer>

      </div>

    </div>
  );
}
