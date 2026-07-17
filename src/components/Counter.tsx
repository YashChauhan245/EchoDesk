"use client";

import { useState, useEffect } from "react";

interface CounterProps {
  value: number;
  duration?: number;
  format?: (val: number) => string;
}

export default function Counter({ 
  value, 
  duration = 1800, 
  format = (val) => String(Math.floor(val)) 
}: CounterProps) {
  const [count, setCount] = useState(0);
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    if (!started) return;
    const end = value;
    const totalMiliseconds = duration;
    const incrementTime = 16;
    const totalSteps = totalMiliseconds / incrementTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / totalSteps;
      const easeProgress = progress * (2 - progress); // Ease-out quad
      const nextValue = end * easeProgress;
      
      if (currentStep >= totalSteps) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(nextValue);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [started, value, duration]);

  return <span ref={setRef}>{format(count)}</span>;
}
