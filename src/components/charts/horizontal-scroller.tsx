"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Horizontal scroll area that opens scrolled to the right end, so wide
 * month-by-month tables show the latest months first on narrow screens.
 */
export function HorizontalScroller({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);
  return (
    <div ref={ref} className={`overflow-x-auto overscroll-x-contain ${className}`}>
      {children}
    </div>
  );
}
