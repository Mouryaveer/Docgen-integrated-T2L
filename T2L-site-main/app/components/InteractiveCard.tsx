"use client";

import React, { useRef } from "react";

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  href?: string;
  style?: React.CSSProperties;
}

export default function InteractiveCard({
  children,
  className = "",
  as: Component = "div",
  href,
  style = {},
}: InteractiveCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;

    // Check prefers-reduced-motion
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    // Apply 3D tilt transformation matching reference behavior
    card.style.transform = `translateY(-6px) rotateX(${py * -4}deg) rotateY(${px * 4}deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "";
  };

  const props = {
    ref: cardRef as React.Ref<HTMLElement>,
    className,
    style,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    ...(href ? { href } : {}),
  };

  return <Component {...props}>{children}</Component>;
}
