'use client';

/**
 * <LogoLoop /> — infinite horizontal logo marquee, React Bits style.
 * Duplicates the list and animates a seamless translateX loop.
 */

import * as React from "react";
import "./logoloop.css";

export type LogoItem = {
  name: string;
  src: string;
  href?: string;
};

export type LogoLoopProps = {
  logos: LogoItem[];
  /** Scroll speed in px per second. */
  speed?: number;
  direction?: "left" | "right";
  /** Logo height in px. */
  logoHeight?: number;
  /** Gap between logos in px. */
  gap?: number;
  pauseOnHover?: boolean;
  scaleOnHover?: boolean;
  fadeOut?: boolean;
  ariaLabel?: string;
  className?: string;
};

export function LogoLoop({
  logos,
  speed = 50,
  direction = "left",
  logoHeight = 36,
  gap = 48,
  pauseOnHover = true,
  scaleOnHover = true,
  fadeOut = true,
  ariaLabel = "Logo loop",
  className,
}: LogoLoopProps) {
  if (!logos.length) return null;

  const duration = (logos.length * (logoHeight + gap)) / speed; // seconds per full cycle

  return (
    <div
      className={`ll ${className ?? ""}`}
      style={{ "--ll-gap": `${gap}px`, "--ll-logo-h": `${logoHeight}px`, "--ll-duration": `${duration}s`, "--ll-dir": direction === "left" ? -1 : 1 } as React.CSSProperties}
      role="region"
      aria-label={ariaLabel}
    >
      <div className={`ll-track${pauseOnHover ? " pause-on-hover" : ""}${fadeOut ? " fade-out" : ""}`}>
        {/* Two copies for a seamless loop */}
        {[0, 1].map((copy) => (
          <div className="ll-group" key={copy} aria-hidden={copy === 1 || undefined}>
            {logos.map((logo) => (
              <a
                key={`${copy}-${logo.name}`}
                href={logo.href ?? "#"}
                className={`ll-item${scaleOnHover ? " can-scale" : ""}`}
                tabIndex={copy === 1 ? -1 : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.src} alt={logo.name} style={{ height: logoHeight }} draggable={false} />
                <span>{logo.name}</span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogoLoop;
