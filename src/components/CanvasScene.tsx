import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SKILL_NODES, PROJECTS } from "../data";
import { SkillNode } from "../types";

interface CanvasSceneProps {
  activeCategory: string;
  activeProjectIndex: number;
  runtimeLanguage: "en" | "te";
  activeStepIndex: number;
  scrollY: number;
  snapCount?: number;
}

// 3D Point Projection Helper
interface Point3D {
  x: number;
  y: number;
  z: number;
}

class BackgroundStar {
  x: number;
  y: number;
  z: number;
  baseY: number;
  size: number;
  color: string;

  constructor() {
    this.x = (Math.random() - 0.5) * 800;
    this.baseY = (Math.random() - 0.5) * 1200;
    this.y = this.baseY;
    this.z = Math.random() * 800 - 400;
    this.size = Math.random() * 1.5 + 0.5;
    this.color = Math.random() > 0.8 ? "rgba(0, 102, 255, 0.4)" : "rgba(255, 255, 255, 0.3)";
  }

  update(scrollAngle: number, globalYOffset: number) {
    // Rotate around central Y pole
    const cosAngle = Math.cos(scrollAngle * 0.3);
    const sinAngle = Math.sin(scrollAngle * 0.3);
    
    // Original coords rotated
    const rx = this.x * cosAngle - this.z * sinAngle;
    const rz = this.x * sinAngle + this.z * cosAngle;
    
    // Add scroll vertical movement parallax
    const ry = this.baseY + globalYOffset * 0.4;

    return { rx, ry, rz };
  }
}

class SplashParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  gravity: number;
  color: string;

  constructor(x: number, y: number, intensity: number) {
    this.x = x;
    this.y = y;
    // Shoot upward
    this.vy = -Math.random() * intensity * 2.2 - 1.5;
    this.vx = (Math.random() - 0.5) * intensity * 1.5;
    this.alpha = 1.0;
    this.size = Math.random() * 2.5 + 1.0;
    this.gravity = 0.12;
    this.color = Math.random() > 0.6 
      ? `rgba(96, 165, 250, ${0.4 + Math.random() * 0.4})` // soft blue
      : `rgba(255, 255, 255, ${0.5 + Math.random() * 0.5})`; // white
  }

  update() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.98; // Drag
    this.alpha -= 0.012;
    return this.alpha > 0;
  }
}

class FloatingSpark {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  lifetime: number;
  maxLifetime: number;

  constructor(width: number, height: number) {
    this.x = (Math.random() - 0.5) * 600;
    this.y = Math.random() * (height || 800);
    this.z = Math.random() * 600 - 300;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = -Math.random() * 0.9 - 0.3; // Floating up
    this.size = Math.random() * 1.6 + 0.4;
    this.maxLifetime = Math.random() * 200 + 100;
    this.lifetime = this.maxLifetime;
    
    const colors = ["rgba(96, 165, 250, ", "rgba(147, 197, 253, ", "rgba(255, 255, 255, ", "rgba(191, 219, 254, "];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  reset(width: number, height: number) {
    this.x = (Math.random() - 0.5) * 600;
    this.y = (height || 800) + 20; // reset at the bottom
    this.z = Math.random() * 600 - 300;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = -Math.random() * 0.9 - 0.3;
    this.size = Math.random() * 1.6 + 0.4;
    this.lifetime = Math.random() * 200 + 100;
  }

  update(scrollAngle: number, globalYOffset: number, width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;
    this.lifetime--;

    if (this.lifetime <= 0 || this.y < -50) {
      this.reset(width, height);
    }

    const cosAngle = Math.cos(scrollAngle * 0.12);
    const sinAngle = Math.sin(scrollAngle * 0.12);
    
    const rx = this.x * cosAngle - this.z * sinAngle;
    const rz = this.x * sinAngle + this.z * cosAngle;
    
    const ry = this.y + globalYOffset * 0.28;

    return { rx, ry, rz };
  }
}

export default function CanvasScene({ activeCategory, activeProjectIndex, runtimeLanguage, activeStepIndex, scrollY, snapCount }: CanvasSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Responsive metrics
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [scrollSpeed, setScrollSpeed] = useState(0);
  
  // Interactive stats
  const [hoveredNodeName, setHoveredNodeName] = useState<string | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0 });

  // WebGL or Spring Water Surface Points
  // We represent the water body at the bottom of the screen (typically 160px height)
  // Simple but highly organic spring-chain simulation
  const WAVE_POINTS_COUNT = 85;
  const wavePoints = useRef<{ x: number; y: number; vy: number; targetY: number }[]>([]);
  const splashParticles = useRef<SplashParticle[]>([]);
  const sparks = useRef<FloatingSpark[]>([]);
  
  // Kinetic Impact and Spark Physics Controllers
  const cameraShakeRef = useRef(0);
  const ambientPulseRef = useRef(0);
  const gsapShakeRef = useRef({ intensity: 0 });

  // Stars setup
  const stars = useRef<BackgroundStar[]>([]);
  const rotationAngleRef = useRef(0);
  const globalYOffsetRef = useRef(0);

  // Initialize nodes and stars
  useEffect(() => {
    // Setup stars
    const starsArr = [];
    for (let i = 0; i < 180; i++) {
      starsArr.push(new BackgroundStar());
    }
    stars.current = starsArr;

    // Setup sparks
    const sparksArr = [];
    for (let i = 0; i < 75; i++) {
      sparksArr.push(new FloatingSpark(800, 600));
    }
    sparks.current = sparksArr;

    // Setup active spring points for the water
    const pts = [];
    for (let i = 0; i < WAVE_POINTS_COUNT; i++) {
      pts.push({
        x: 0, // calculated based on width
        y: 0, // offset
        vy: 0,
        targetY: 0
      });
    }
    wavePoints.current = pts;
  }, []);

  // Track scroll speed based on prop variations
  const lastScrollYRef = useRef(0);
  const speedTimerRef = useRef<any>(null);

  useEffect(() => {
    const diff = scrollY - lastScrollYRef.current;
    lastScrollYRef.current = scrollY;
    
    setScrollSpeed(prev => Math.abs(diff) * 0.45 + prev * 0.25);
    
    if (speedTimerRef.current) clearTimeout(speedTimerRef.current);
    speedTimerRef.current = setTimeout(() => {
      setScrollSpeed(0);
    }, 50);

    return () => {
      if (speedTimerRef.current) clearTimeout(speedTimerRef.current);
    };
  }, [scrollY]);

  // Active step change triggers beautiful water splash, camera shake, and ambient pulse
  const lastStepIndexRef = useRef(-1);
  useEffect(() => {
    if (activeStepIndex === lastStepIndexRef.current) return;
    lastStepIndexRef.current = activeStepIndex;

    const pts = wavePoints.current;
    if (!pts || pts.length === 0) return;

    // Trigger physical camera kinetic impact and full-screen ambient pulse!
    cameraShakeRef.current = 14; 
    ambientPulseRef.current = 1.0;

    // Displace wave heights downward (momentum shock effect)
    // And launch an array of custom SplashParticles shooting high into the screen
    const particleCount = 140;
    for (let k = 0; k < particleCount; k++) {
      const xRatio = Math.random();
      const ptIdx = Math.floor(xRatio * (WAVE_POINTS_COUNT - 1));
      
      const pt = pts[ptIdx];
      if (pt) {
        // Displace the physical spring point to simulate heavy momentum impact
        pt.vy += (Math.random() * 24 + 10);
        
        // Spawn splash particle shooting upward with random velocities
        const xPos = pt.x;
        const yPos = pt.y;
        
        const intensity = Math.random() * 16 + 9;
        splashParticles.current.push(new SplashParticle(xPos, yPos, intensity));
      }
    }
  }, [activeStepIndex]);

  // GSAP tactile settle bounce animation triggered on snap-to-place completion
  const lastSnapCountRef = useRef(0);
  useEffect(() => {
    if (snapCount === undefined || snapCount === 0 || snapCount === lastSnapCountRef.current) return;
    lastSnapCountRef.current = snapCount;

    // Use GSAP to animate a precise tactile physical camera shake bounce on stop
    gsap.killTweensOf(gsapShakeRef.current);
    gsapShakeRef.current.intensity = 15; // Set starting tactile impact
    
    // Smooth custom physical decay curve
    gsap.to(gsapShakeRef.current, {
      intensity: 0,
      duration: 0.65,
      ease: "power2.out",
    });
  }, [snapCount]);

  // Monitor canvas size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });
        
        // Distribute wave points evenly across width
        if (wavePoints.current.length > 0) {
          const step = clientWidth / (WAVE_POINTS_COUNT - 1);
          wavePoints.current.forEach((pt, idx) => {
            pt.x = idx * step;
            pt.targetY = clientHeight - 80; // Water level 80px from bottom standard
            pt.y = pt.targetY;
          });
        }
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    
    // Setup ResizeObserver (for safe bounds)
    const observer = new ResizeObserver(() => updateSize());
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener("resize", updateSize);
      observer.disconnect();
    };
  }, []);

  // Main high-performance render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let frameTime = 0;
    
    const physicsTension = 0.024;
    const physicsDamping = 0.08;
    const waveSpread = 0.025; // neighbor propagation multiplier

    const render = () => {
      animId = requestAnimationFrame(render);
      frameTime += 0.016; // roughly 60fps pacing

      // Decay kinetic physics factors each frame at 120Hz/60Hz rate
      cameraShakeRef.current *= 0.92;
      ambientPulseRef.current *= 0.94;

      // Calculate camera shake offsets combining immediate scroll momentum and GSAP snap-stop settle
      const totalShake = cameraShakeRef.current + gsapShakeRef.current.intensity;
      const shakeX = (Math.random() - 0.5) * totalShake;
      const shakeY = (Math.random() - 0.5) * totalShake;

      // 1. CLEAR & BACKGROUND GRID
      ctx.fillStyle = "#040404";
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Radial dark background glow
      const bgGlow = ctx.createRadialGradient(
        dimensions.width / 2, dimensions.height / 2, 50,
        dimensions.width / 2, dimensions.height / 2, dimensions.width * 0.7
      );
      bgGlow.addColorStop(0, "rgba(5, 12, 38, 0.25)");
      bgGlow.addColorStop(0.5, "rgba(2, 4, 10, 0.1)");
      bgGlow.addColorStop(1, "rgba(4, 4, 4, 1)");
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Gentle cybernetic background tracking grid
      ctx.strokeStyle = "rgba(40, 50, 90, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < dimensions.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, dimensions.height);
        ctx.stroke();
      }
      for (let y = dimensions.height % gridSize; y < dimensions.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(dimensions.width, y);
        ctx.stroke();
      }

      // Compute dynamic variables based on scroll
      // Scroll maps to rotation around the master pole
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      );
      const totalScrollable = documentHeight - dimensions.height || 1000;
      const scrollRatio = scrollY / totalScrollable;
      
      const targetAngle = scrollRatio * Math.PI * 4; // Two complete 3D revolutions
      // Smooth interpolation for rotation
      rotationAngleRef.current += (targetAngle - rotationAngleRef.current) * 0.08;
      
      const targetYOffset = -scrollRatio * 800; // Vertical camera shift simulation
      globalYOffsetRef.current += (targetYOffset - globalYOffsetRef.current) * 0.08;

      const focalLength = 320;
      const centerX = dimensions.width / 2 + shakeX;
      const centerY = dimensions.height / 2 - 80 + shakeY; // slightly offset vertical center up

      // --- 1.5 FULL SCREEN CINEMATIC IMPACT GLOW PULSE ---
      if (ambientPulseRef.current > 0.01) {
        const pulseAlpha = ambientPulseRef.current * 0.14;
        const colorAccent = activeProjectIndex === 1 ? "239, 68, 68" : "59, 130, 246";
        
        ctx.fillStyle = `rgba(${colorAccent}, ${pulseAlpha})`;
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      }

      // 2. RENDER THE CENTRAL TIMELINE POLE (The Invisible Column)
      // Visualized as a faint elegant vertical grid, glowing orbits
      ctx.strokeStyle = "rgba(59, 130, 246, 0.07)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, 50);
      ctx.lineTo(centerX, dimensions.height - 120);
      ctx.stroke();

      // Horizontal subtle glowing timeline marks on the column
      for (let h = 100; h < dimensions.height - 150; h += 140) {
        const pulse = Math.sin(frameTime * 1.5 + h * 0.01) * 0.4 + 0.6;
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.05 + pulse * 0.05})`;
        ctx.beginPath();
        ctx.arc(centerX, h, 25, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3. RENDER BACKGROUND STARS WITH PROP DEPTH
      stars.current.forEach(star => {
        const { rx, ry, rz } = star.update(rotationAngleRef.current, globalYOffsetRef.current);
        
        // 3D camera mapping
        const scale = focalLength / (focalLength + rz + 400);
        if (scale < 0) return; // behind camera
        
        const px = centerX + rx * scale;
        const py = centerY + ry * scale;
        const pSize = star.size * scale;

        // Skip if out of bounds
        if (px < 0 || px > dimensions.width || py < 0 || py > dimensions.height - 80) return;

        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3b. RENDER CYBERNETIC RISING SPARKS (Volumetric floating dust)
      sparks.current.forEach(spark => {
        const { rx, ry, rz } = spark.update(rotationAngleRef.current, globalYOffsetRef.current, dimensions.width, dimensions.height);
        
        const scale = focalLength / (focalLength + rz + 300);
        if (scale < 0) return;
        
        const px = centerX + rx * scale;
        const py = centerY + ry * scale;
        const pSize = spark.size * scale * (activeProjectIndex === 1 ? 1.25 : 1.0);
        
        if (px < 0 || px > dimensions.width || py < 0 || py > dimensions.height - 80) return;
        
        // Soft gradient fadeout near edge boundaries
        const alpha = Math.max(0.01, Math.min(0.38, (py / (dimensions.height || 600)) * 0.48));
        ctx.fillStyle = activeProjectIndex === 1
          ? `rgba(239, 68, 68, ${alpha})`
          : `${spark.color}${alpha})`;
          
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- FUTURISTIC 3D DOUBLE HELIX COIL SYSTEM ---
      const helixRadius = 110;
      const helixPitch = 0.007; // density of DNA helix winds
      const rungsSpacing = 16;
      const helixStartY = 40;
      const helixEndY = dimensions.height - 120;
      
      ctx.lineWidth = 1;
      const isCrimson = activeProjectIndex === 1;

      for (let y = helixStartY; y < helixEndY; y += 4) {
        const baseAngle = rotationAngleRef.current * 1.3 + (y * helixPitch);
        const floatOffset = Math.sin(frameTime * 1.2 + y * 0.004) * 5;
        const radius = helixRadius + floatOffset;
        
        // Left & right helix nodes
        const pt1_3d = {
          x: Math.cos(baseAngle) * radius,
          y: y,
          z: Math.sin(baseAngle) * radius
        };
        
        const pt2_3d = {
          x: Math.cos(baseAngle + Math.PI) * radius,
          y: y,
          z: Math.sin(baseAngle + Math.PI) * radius
        };
        
        const scale1 = focalLength / (focalLength + pt1_3d.z + 180);
        const px1 = centerX + pt1_3d.x * scale1;
        const py1 = pt1_3d.y;
        
        const scale2 = focalLength / (focalLength + pt2_3d.z + 180);
        const px2 = centerX + pt2_3d.x * scale2;
        const py2 = pt2_3d.y;

        if (scale1 < 0 || scale2 < 0) continue;

        // Draw structural connector rungs (ladder bars)
        if (Math.round(y) % rungsSpacing === 0) {
          const rungAlpha = Math.max(0.01, (1.2 - Math.abs(pt1_3d.z / radius)) * 0.11);
          ctx.strokeStyle = isCrimson 
            ? `rgba(239, 68, 68, ${rungAlpha})` 
            : `rgba(59, 130, 246, ${rungAlpha})`;
          
          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.lineTo(px2, py2);
          ctx.stroke();
          
          const beadAlpha = Math.max(0.01, (1.2 - Math.abs(pt1_3d.z / radius)) * 0.25);
          ctx.fillStyle = isCrimson 
            ? `rgba(248, 113, 113, ${beadAlpha})` 
            : `rgba(96, 165, 250, ${beadAlpha})`;
          
          ctx.beginPath();
          ctx.arc(px1, py1, 1.8 * scale1, 0, Math.PI * 2);
          ctx.arc(px2, py2, 1.8 * scale2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw main continuous strand dots
        const strandAlpha1 = Math.max(0.01, (1.2 - Math.abs(pt1_3d.z / radius)) * 0.14);
        ctx.fillStyle = isCrimson 
          ? `rgba(239, 68, 68, ${strandAlpha1})` 
          : `rgba(59, 130, 246, ${strandAlpha1})`;
        ctx.beginPath();
        ctx.arc(px1, py1, 1.25 * scale1, 0, Math.PI * 2);
        ctx.fill();

        const strandAlpha2 = Math.max(0.01, (1.2 - Math.abs(pt2_3d.z / radius)) * 0.14);
        ctx.fillStyle = isCrimson 
          ? `rgba(239, 68, 68, ${strandAlpha2})` 
          : `rgba(59, 130, 246, ${strandAlpha2})`;
        ctx.beginPath();
        ctx.arc(px2, py2, 1.25 * scale2, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- 3D FLOATING RINGS SECTION TIMELINE NAVIGATION SYSTEM ---
      const sectionLabels = [
        "00 / REVEAL",
        "01 / BIO",
        "02 / SKILLS",
        "03 / INTERESTS",
        "04 / PROJECT A",
        "05 / PROJECT B",
        "06 / WORKFLOW",
        "07 / CONTACT"
      ];
      
      sectionLabels.forEach((label, i) => {
        // Rings drift along the helix with camera displacement
        const relativeY = 82 + i * 54;
        const ringAngleOffset = i * (Math.PI / 4.4);
        const currentRingAngle = rotationAngleRef.current * 1.3 + ringAngleOffset;
        
        const isActive = activeStepIndex === i;
        const activePulse = isActive ? (Math.sin(frameTime * 4.5) * 0.15 + 0.85) : 0.35;
        const ringRadius = isActive ? 140 : 120;
        
        // Plot circle lines in 3D perspective
        const segments = 32;
        ctx.lineWidth = isActive ? 1.5 : 0.75;
        ctx.beginPath();
        
        for (let s = 0; s <= segments; s++) {
          const sAngle = (s / segments) * Math.PI * 2;
          const rx = Math.cos(sAngle) * ringRadius;
          const rz = Math.sin(sAngle) * ringRadius;
          
          const depth = focalLength / (focalLength + rz + 180);
          if (depth < 0) continue;
          
          const px = centerX + rx * depth;
          const py = relativeY + (globalYOffsetRef.current * 0.15); // floating offset
          
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        
        const opacity = Math.max(0.01, (1.0 - Math.abs(i - activeStepIndex) * 0.42));
        const colorAccent = isCrimson ? "239, 68, 68" : "59, 130, 246";
        ctx.strokeStyle = `rgba(${colorAccent}, ${opacity * activePulse * 0.22})`;
        ctx.stroke();

        // Active label hovering indicator
        if (isActive) {
          const frontAngle = 3 * Math.PI / 2; // closest z depth coordinate
          const fx = Math.cos(frontAngle) * ringRadius;
          const fz = Math.sin(frontAngle) * ringRadius;
          
          const fDepth = focalLength / (focalLength + fz + 180);
          const fpx = centerX + fx * fDepth;
          const fpy = relativeY + (globalYOffsetRef.current * 0.15);
          
          ctx.fillStyle = `rgba(${colorAccent}, ${opacity * 0.95})`;
          ctx.beginPath();
          ctx.arc(fpx, fpy, 4.2 * fDepth, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 8.5px JetBrains Mono, monospace";
          ctx.letterSpacing = "2px";
          ctx.textAlign = "center";
          ctx.fillText(label, fpx, fpy - 9);
        }
      });

      // 4. WATER PHYSICS COLLISION DETECTION & DISPLACEMENT RIPPLES
      if (scrollSpeed > 0.01 && wavePoints.current.length > 0) {
        const randomXIdx = Math.floor(Math.random() * WAVE_POINTS_COUNT);
        const impulse = scrollSpeed * 0.22;
        if (scrollSpeed > 25) {
          wavePoints.current[randomXIdx].vy += Math.random() * impulse * 1.5;
          
          if (Math.random() > 0.4 && splashParticles.current.length < 120) {
            const ptX = wavePoints.current[randomXIdx].x;
            const ptY = wavePoints.current[randomXIdx].y;
            splashParticles.current.push(new SplashParticle(ptX, ptY, scrollSpeed * 0.18));
          }
        } else {
          wavePoints.current[randomXIdx].vy += (Math.random() - 0.5) * impulse * 0.5;
        }
      }

      // Cursor water disturbances
      const mouse = mouseRef.current;
      if (mouse.x > -500 && mouse.y > dimensions.height - 180 && wavePoints.current.length > 0) {
        const mouseXRatio = mouse.x / dimensions.width;
        const rawPtIdx = mouseXRatio * (WAVE_POINTS_COUNT - 1);
        const targetIdx = Math.max(0, Math.min(WAVE_POINTS_COUNT - 1, Math.floor(rawPtIdx)));
        
        const sweepR = 5; 
        const forceMagnitude = Math.min(15, Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy) * 0.65 + 1.2);
        
        for (let offset = -sweepR; offset <= sweepR; offset++) {
          const idx = targetIdx + offset;
          if (idx >= 0 && idx < WAVE_POINTS_COUNT) {
            const distanceFactor = 1 - Math.abs(offset) / (sweepR + 1);
            wavePoints.current[idx].vy += Math.sin(frameTime * 4) * forceMagnitude * distanceFactor * 0.08;
          }
        }
      }

      // Update Water Physics spring system
      const pts = wavePoints.current;
      if (pts.length > 0) {
        for (let i = 0; i < WAVE_POINTS_COUNT; i++) {
          const displacement = pts[i].y - pts[i].targetY;
          const acceleration = -physicsTension * displacement - physicsDamping * pts[i].vy;
          pts[i].vy += acceleration;
          pts[i].y += pts[i].vy;
        }

        const leftOffsets = new Array(WAVE_POINTS_COUNT).fill(0);
        const rightOffsets = new Array(WAVE_POINTS_COUNT).fill(0);

        for (let iter = 0; iter < 4; iter++) {
          for (let i = 0; i < WAVE_POINTS_COUNT; i++) {
            if (i > 0) {
              leftOffsets[i] = waveSpread * (pts[i].y - pts[i - 1].y);
              pts[i - 1].vy += leftOffsets[i];
            }
            if (i < WAVE_POINTS_COUNT - 1) {
              rightOffsets[i] = waveSpread * (pts[i].y - pts[i + 1].y);
              pts[i + 1].vy += rightOffsets[i];
            }
          }
          
          for (let i = 0; i < WAVE_POINTS_COUNT; i++) {
            if (i > 0) pts[i - 1].y += leftOffsets[i];
            if (i < WAVE_POINTS_COUNT - 1) pts[i + 1].y += rightOffsets[i];
          }
        }
      }

      // Update & Render Splash Particles
      splashParticles.current = splashParticles.current.filter(p => {
        const isAlive = p.update();
        if (isAlive) {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const rawIdx = Math.floor((p.x / dimensions.width) * (WAVE_POINTS_COUNT - 1));
          if (rawIdx >= 0 && rawIdx < WAVE_POINTS_COUNT) {
            pts[rawIdx].vy += Math.random() * 2;
          }
        }
        return isAlive;
      });

      let currentHoveredName: string | null = null;
      if (currentHoveredName !== hoveredNodeName) {
        setHoveredNodeName(currentHoveredName);
      }

      // 6. RENDER MASTER PHYSICAL WATER SURFACE AT BOTTOM
      if (pts.length > 0) {
        ctx.beginPath();
        ctx.moveTo(0, dimensions.height);
        ctx.lineTo(pts[0].x, pts[0].y);

        for (let i = 0; i < WAVE_POINTS_COUNT - 1; i++) {
          const xc = (pts[i].x + pts[i + 1].x) / 2;
          const yc = (pts[i].y + pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
        }
        
        ctx.lineTo(pts[WAVE_POINTS_COUNT - 1].x, pts[WAVE_POINTS_COUNT - 1].y);
        ctx.lineTo(dimensions.width, dimensions.height);
        ctx.closePath();

        const waterGradients = ctx.createLinearGradient(0, dimensions.height - 130, 0, dimensions.height);
        waterGradients.addColorStop(0, "rgba(10, 31, 85, 0.44)");
        waterGradients.addColorStop(0.3, "rgba(4, 18, 56, 0.72)");
        waterGradients.addColorStop(1, "rgba(4, 4, 4, 0.98)");
        
        ctx.fillStyle = waterGradients;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 0; i < WAVE_POINTS_COUNT - 1; i++) {
          const xc = (pts[i].x + pts[i + 1].x) / 2;
          const yc = (pts[i].y + pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
        }
        ctx.lineTo(pts[WAVE_POINTS_COUNT - 1].x, pts[WAVE_POINTS_COUNT - 1].y);
        
        const isViewingCrimsonProject = activeProjectIndex === 1;
        const edgeLightGradient = ctx.createLinearGradient(0, 0, dimensions.width, 0);
        if (isViewingCrimsonProject) {
          edgeLightGradient.addColorStop(0, "rgba(220, 38, 38, 0.1)");
          edgeLightGradient.addColorStop(0.5, "rgba(239, 68, 68, 0.75)");
          edgeLightGradient.addColorStop(1, "rgba(220, 38, 38, 0.1)");
        } else {
          edgeLightGradient.addColorStop(0, "rgba(59, 130, 246, 0.15)");
          edgeLightGradient.addColorStop(0.5, "rgba(96, 165, 250, 0.75)");
          edgeLightGradient.addColorStop(1, "rgba(59, 130, 246, 0.15)");
        }
        
        ctx.strokeStyle = edgeLightGradient;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // 7. WATER VOLUMETRIC GRID REFLECTIONS
        ctx.strokeStyle = "rgba(59, 130, 246, 0.04)";
        ctx.lineWidth = 1;
        const reflectionCount = 20;
        const step = dimensions.width / reflectionCount;
        for (let i = 1; i < reflectionCount; i++) {
          const rxPos = i * step;
          const mapIdx = Math.floor((rxPos / dimensions.width) * (WAVE_POINTS_COUNT - 1));
          const wY = pts[mapIdx]?.y || (dimensions.height - 80);
          
          ctx.beginPath();
          ctx.moveTo(rxPos, wY);
          
          for (let ry = wY; ry < dimensions.height - 10; ry += 8) {
            const cycleOffset = Math.sin((ry * 0.1) + frameTime * 4.5) * 5;
            ctx.lineTo(rxPos + cycleOffset, ry);
          }
          ctx.stroke();
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [dimensions, scrollY, scrollSpeed, activeCategory, activeProjectIndex, hoveredNodeName, activeStepIndex]);

  // Track mouse globally in window (non-blocking pointer mechanism)
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const currX = e.clientX - rect.left;
      const currY = e.clientY - rect.top;
      
      const mouse = mouseRef.current;
      mouse.vx = currX - mouse.lastX;
      mouse.vy = currY - mouse.lastY;
      mouse.lastX = currX;
      mouse.lastY = currY;
      mouse.x = currX;
      mouse.y = currY;
    };

    const handleWindowMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener("mousemove", handleWindowMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleWindowMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      document.removeEventListener("mouseleave", handleWindowMouseLeave);
    };
  }, [dimensions]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 select-none">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full pointer-events-none block transition-opacity duration-300"
      />
      {hoveredNodeName && (
        <div 
          className="absolute text-xs font-mono px-3 py-1.5 rounded-full border border-blue-500/20 glass-panel bg-black/95 text-blue-200 pointer-events-none select-none z-30 shadow-xl shadow-black/80 flex items-center gap-1.5 transition-all duration-300"
          style={{ 
            left: Math.max(15, Math.min(dimensions.width - 250, mouseRef.current.x + 15)) + "px",
            top: Math.max(15, Math.min(dimensions.height - 50, mouseRef.current.y - 40)) + "px"
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
          <span>{hoveredNodeName}</span>
        </div>
      )}
    </div>
  );
}
