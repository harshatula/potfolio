import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [hoveredEl, setHoveredEl] = useState<HTMLElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // High fidelity spring parameters matching standard premium interfaces
  const springConfig = { stiffness: 220, damping: 28, mass: 0.8 };
  const quickSpringConfig = { stiffness: 280, damping: 26, mass: 0.7 };

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const cursorWidth = useMotionValue(18);
  const cursorHeight = useMotionValue(18);
  const cursorRadius = useMotionValue(999);

  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  const width = useSpring(cursorWidth, quickSpringConfig);
  const height = useSpring(cursorHeight, quickSpringConfig);
  const borderRadius = useSpring(cursorRadius, quickSpringConfig);

  // Check if device supports a fine pointer (e.g. mouse cursor) to avoid broken touch styles
  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsFinePointer(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Set up event delegation for hover tracking
  useEffect(() => {
    if (!isFinePointer) return;

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("button, a, select, textarea, [role='button'], .cursor-pointer, [data-interactive]");
      if (interactive) {
        setHoveredEl(interactive as HTMLElement);
        setIsHovered(true);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("button, a, select, textarea, [role='button'], .cursor-pointer, [data-interactive]");
      if (interactive && (!e.relatedTarget || !(e.relatedTarget as HTMLElement).closest("button, a, select, textarea, [role='button'], .cursor-pointer, [data-interactive]"))) {
        setHoveredEl(null);
        setIsHovered(false);
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mouseout", onMouseOut);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isFinePointer]);

  // Track coordinates and snap to element boundaries
  useEffect(() => {
    if (!isFinePointer) return;

    const onMouseMove = (e: MouseEvent) => {
      if (hoveredEl) {
        const rect = hoveredEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Snappy magnetic pulling effect pull coordinates towards center slightly
        const pullX = centerX + (e.clientX - centerX) * 0.12;
        const pullY = centerY + (e.clientY - centerY) * 0.12;

        mouseX.set(pullX);
        mouseY.set(pullY);

        // Snap and cover the element with subtle margin expansion
        const padding = 12;
        cursorWidth.set(rect.width + padding);
        cursorHeight.set(rect.height + padding);
        
        // Match base boundary curves (e.g. rounded buttons vs perfect circles)
        const computedStyle = window.getComputedStyle(hoveredEl);
        const radius = parseFloat(computedStyle.borderRadius);
        cursorRadius.set(isNaN(radius) || radius === 0 ? 6 : radius + 6);
      } else {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        cursorWidth.set(16);
        cursorHeight.set(16);
        cursorRadius.set(999); // standard circle
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [isFinePointer, hoveredEl]);

  if (!isFinePointer) return null;

  return (
    <>
      {/* Outer dynamic cybernetic snapping ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] border transition-colors duration-150 transform-gpu"
        style={{
          x,
          y,
          width,
          height,
          borderRadius,
          // CSS centering of coordinate target
          translateX: "-50%",
          translateY: "-50%",
          borderColor: isHovered 
            ? "rgba(59, 130, 246, 0.45)" 
            : "rgba(255, 255, 255, 0.22)",
          backgroundColor: isHovered 
            ? "rgba(59, 130, 246, 0.04)" 
            : "transparent",
          boxShadow: isHovered 
            ? "0 0 12px rgba(59, 130, 246, 0.15)" 
            : "none",
          scale: isClicked ? 0.92 : 1,
        }}
      />

      {/* Inner precise pinpoint core tracking pixel */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full transform-gpu bg-blue-400"
        style={{
          x,
          y,
          width: 5,
          height: 5,
          translateX: "-50%",
          translateY: "-50%",
          boxShadow: "0 0 8px rgba(96, 165, 250, 0.8)",
          scale: isClicked ? 0.6 : isHovered ? 0.4 : 1,
          opacity: 0.9,
        }}
      />
    </>
  );
}
