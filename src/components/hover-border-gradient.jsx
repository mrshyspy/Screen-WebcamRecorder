"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // fixed import
import { cn } from "../utils/cn";

// constant values outside to avoid recreation on each render
const DIRECTIONS = ["TOP", "LEFT", "BOTTOM", "RIGHT"];

const MOVING_MAP = {
  TOP: "radial-gradient(20.7% 50% at 50% 0%, #fff 0%, rgba(255, 255, 255, 0) 100%)",
  LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, #fff 0%, rgba(255, 255, 255, 0) 100%)",
  BOTTOM: "radial-gradient(20.7% 50% at 50% 100%, #fff 0%, rgba(255, 255, 255, 0) 100%)",
  RIGHT: "radial-gradient(16.2% 41.2% at 100% 50%, #fff 0%, rgba(255, 255, 255, 0) 100%)",
};

const HIGHLIGHT =
  "radial-gradient(75% 181.1% at 50% 50%, #3275F8 0%, rgba(255, 255, 255, 0) 100%)";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Component = "button",
  duration = 1,
  clockwise = true,
  ...props
}) {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState("TOP");

  // rotation logic
  const rotateDirection = (currentDirection) => {
    const currentIndex = DIRECTIONS.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + DIRECTIONS.length) % DIRECTIONS.length
      : (currentIndex + 1) % DIRECTIONS.length;
    return DIRECTIONS[nextIndex];
  };

  // auto-rotate background when not hovered
  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prev) => rotateDirection(prev));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration, clockwise]);

  return (
    <Component
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex items-center justify-center w-fit h-min rounded-full p-px overflow-visible transition duration-500",
        "bg-black/20 hover:bg-black/10 dark:bg-white/20",
        containerClassName
      )}
      {...props}
    >
      {/* Content wrapper */}
      <div
        className={cn(
          "relative z-10 bg-black text-white px-4 py-2 rounded-[inherit]",
          "dark:bg-white dark:text-black",
          className
        )}
      >
        {children}
      </div>

      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] z-0"
        style={{ filter: "blur(2px)" }}
        initial={{ background: MOVING_MAP[direction] }}
        animate={{
          background: hovered ? [MOVING_MAP[direction], HIGHLIGHT] : MOVING_MAP[direction],
        }}
        transition={{ ease: "linear", duration }}
      />

      {/* Inner mask */}
      <div className="absolute inset-[2px] rounded-[inherit] bg-black dark:bg-white z-0" />
    </Component>
  );
}
