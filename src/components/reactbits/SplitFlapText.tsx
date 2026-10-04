'use client';

/**
 * <SplitFlapText /> — split-flap (airport board) text reveal, React Bits style.
 * Each tile cycles through the charset then settles on the target character.
 */

import * as React from "react";
import "./splitflap.css";

export type SplitFlapTextProps = {
  text: string;
  charset?: string;
  /** Pad the display with blank tiles up to this length. */
  padTo?: number;
  /** Font size in px. */
  fontSize?: number;
  /** Seconds per flip step. */
  flipDuration?: number;
  /** How many flip steps a tile cycles before settling. */
  flipsPerChar?: number;
  tileColor?: string;
  textColor?: string;
  tileRadius?: number;
  /** Gap between tiles in px. */
  gap?: number;
  className?: string;
};

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.";

export function SplitFlapText({
  text,
  charset = DEFAULT_CHARSET,
  padTo,
  fontSize = 48,
  flipDuration = 0.1,
  flipsPerChar = 10,
  tileColor = "#1e293b",
  textColor = "#38bdf8",
  tileRadius = 8,
  gap = 6,
  className,
}: SplitFlapTextProps) {
  const target = React.useMemo(() => {
    const length = padTo ?? text.length;
    return text.padEnd(length, " ").slice(0, length).split("");
  }, [text, padTo]);

  const [shown, setShown] = React.useState<string[]>(() => target.map(() => charset[0]));
  const [settled, setSettled] = React.useState(false);

  React.useEffect(() => {
    let tick = 0;
    setSettled(false);
    const total = flipsPerChar + target.length; // staggered settle window
    const interval = window.setInterval(() => {
      tick += 1;
      if (tick >= total) {
        setShown(target);
        setSettled(true);
        window.clearInterval(interval);
        return;
      }
      setShown(() =>
        target.map((char, index) => {
          // Tiles settle left→right: tile i settles once tick > flipsPerChar + i.
          if (tick >= flipsPerChar + index) return char;
          if (char === " ") return " ";
          const jitter = (tick * 7 + index * 13) % charset.length;
          return charset[jitter];
        }),
      );
    }, Math.max(30, flipDuration * 1000));

    return () => window.clearInterval(interval);
  }, [target, charset, flipsPerChar, flipDuration]);

  return (
    <div
      className={`sft ${className ?? ""}`}
      style={{ gap, fontSize, "--sft-bg": tileColor, "--sft-fg": textColor, "--sft-radius": `${tileRadius}px`, "--sft-flip": `${flipDuration}s` } as React.CSSProperties}
      role="img"
      aria-label={text}
    >
      {shown.map((char, index) => (
        <span
          key={`${index}-${settled ? "s" : char}`}
          className="sft-tile"
          data-blank={char === " " || undefined}
          data-settled={settled || undefined}
        >
          <span className="sft-hinge" aria-hidden />
          <span className="sft-char" key={`${index}-${char}`}>
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </div>
  );
}

export default SplitFlapText;
