'use client';

/**
 * <FlexCarousel /> — horizontal showcase carousel with a center "lens"
 * (focused) area, React Bits style. Cards keep a fixed aspect ratio.
 */

import * as React from "react";
import "./flexcarousel.css";

export type FlexCarouselItem = {
  id: string;
  src: string;
  alt?: string;
  caption?: string;
};

export type FlexCarouselProps = {
  items: FlexCarouselItem[];
  /** "landscape" forces a 4:3 card ratio. */
  fit?: "landscape" | "square" | "portrait";
  /** Card height as a fraction of the viewport height. */
  cardHeight?: number;
  /** Visual preset. "liquid" = soft scale + opacity falloff. */
  preset?: "liquid" | "plain";
  /** Lens (focus zone) width as a fraction of the container. */
  lensWidth?: number;
  /** Lens height as a fraction of the card height. */
  lensHeight?: number;
  gap?: number;
  radius?: number;
  captions?: boolean;
  focusOnClick?: boolean;
  className?: string;
};

export function FlexCarousel({
  items,
  fit = "landscape",
  cardHeight = 0.42,
  preset = "liquid",
  lensWidth = 0.75,
  lensHeight = 0.85,
  gap = 16,
  radius = 12,
  captions = true,
  focusOnClick = true,
  className,
}: FlexCarouselProps) {
  const [focused, setFocused] = React.useState(0);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const ratio = fit === "landscape" ? "4 / 3" : fit === "portrait" ? "3 / 4" : "1 / 1";

  // Keep the focused card horizontally centered while scrolling.
  const centerOn = React.useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    if (!card) return;
    const offset = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
    track.scrollTo({ left: offset, behavior: "smooth" });
  }, []);

  const handleClick = (index: number) => {
    setFocused(index);
    if (focusOnClick) centerOn(index);
  };

  React.useEffect(() => {
    if (!focusOnClick) return;
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        Array.from(track.children).forEach((child, index) => {
          const el = child as HTMLElement;
          const cardCenter = el.offsetLeft + el.clientWidth / 2;
          const dist = Math.abs(cardCenter - center);
          if (dist < bestDist) {
            bestDist = dist;
            best = index;
          }
        });
        setFocused((prev) => (prev === best ? prev : best));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [focusOnClick]);

  if (!items.length) return null;

  return (
    <div className={`fc ${className ?? ""}`} style={{ "--fc-gap": `${gap}px`, "--fc-radius": `${radius}px` } as React.CSSProperties}>
      <div
        className="fc-track"
        ref={trackRef}
        style={{ gap, height: `calc(${cardHeight * 100}vh)` } as React.CSSProperties}
      >
        {items.map((item, index) => {
          const isFocused = index === focused;
          return (
            <figure
              key={item.id}
              className={`fc-card ${isFocused ? "is-focused" : ""} preset-${preset}`}
              onClick={() => handleClick(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") handleClick(index);
              }}
              style={{
                aspectRatio: ratio,
                "--fc-scale": isFocused ? lensHeight : 0.82,
              } as React.CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt ?? item.caption ?? ""} loading="lazy" draggable={false} />
              {captions && item.caption ? <figcaption>{item.caption}</figcaption> : null}
            </figure>
          );
        })}
      </div>
      {/* Lens guide — visual indicator of the focus zone */}
      <div className="fc-lens" aria-hidden style={{ width: `${lensWidth * 100}%` }} />
    </div>
  );
}

export default FlexCarousel;
