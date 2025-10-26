"use client"

import { useEffect, useRef } from "react"
import type React from "react"

/**
 * RationBackground
 * Fixed, subtle, layered background:
 *  - Layer 1: rice grain texture (very low opacity), slow drift
 *  - Layer 2: ration icon pattern (very low opacity), counter drift
 *  - Floating ration items layer: sacks, wheat, rice, pulses, oil can
 *  - Light vignette to keep content readable
 *
 * Performance:
 *  - GPU-accelerated transforms only
 *  - Pointer events disabled
 *  - Gentle mouse parallax for interactivity
 */
export default function RationBackground() {
  const layer1Ref = useRef<HTMLDivElement | null>(null)
  const layer2Ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth - 0.5) * 6 // max ~3px each side
      const y = (e.clientY / innerHeight - 0.5) * 6
      if (layer1Ref.current) layer1Ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      if (layer2Ref.current) layer2Ref.current.style.transform = `translate3d(${-x}px, ${-y}px, 0)`
    }

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return

    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return (
    <>
      {/* Texture layer */}
      <div
        ref={layer1Ref}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.18]"
        style={{
          backgroundImage: "url('/images/ration-grain-texture.jpg')",
          backgroundRepeat: "repeat",
          backgroundSize: "600px 600px",
          animation: "srn-pan-a 120s linear infinite",
          mixBlendMode: "multiply",
          willChange: "transform",
        }}
      />
      {/* Icon pattern layer */}
      <div
        ref={layer2Ref}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.10]"
        style={{
          backgroundImage: "url('/images/ration-icons-pattern.jpg')",
          backgroundRepeat: "repeat",
          backgroundSize: "480px 480px",
          animation: "srn-pan-b 160s linear infinite",
          willChange: "transform",
        }}
      />
      {/* Floating ration items layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        // Keep extremely subtle; readability first
        style={{ opacity: 0.12 }}
      >
        {
          // Configure a small set of floating items with varied positions/sizes/durations
          [
            { src: "/images/items/ration-sack.jpg", left: "8%", top: "12%", w: 56, d: 19, dl: 0.0 },
            { src: "/images/items/wheat.jpg", left: "22%", top: "68%", w: 48, d: 23, dl: 2.0 },
            { src: "/images/items/rice-bowl.jpg", left: "41%", top: "18%", w: 52, d: 21, dl: 1.2 },
            { src: "/images/items/pulses.jpg", left: "63%", top: "74%", w: 54, d: 26, dl: 0.8 },
            { src: "/images/items/oil-can.jpg", left: "78%", top: "28%", w: 50, d: 24, dl: 1.6 },
            { src: "/images/items/wheat.jpg", left: "12%", top: "82%", w: 44, d: 28, dl: 0.4 },
            { src: "/images/items/ration-sack.jpg", left: "54%", top: "56%", w: 58, d: 22, dl: 1.0 },
            { src: "/images/items/rice-bowl.jpg", left: "86%", top: "62%", w: 46, d: 25, dl: 2.2 },
            { src: "/images/items/pulses.jpg", left: "32%", top: "40%", w: 48, d: 20, dl: 1.8 },
            { src: "/images/items/oil-can.jpg", left: "70%", top: "10%", w: 48, d: 27, dl: 0.6 },
            // Keep total <= 12 for performance
          ].map((it, idx) => {
            const style: React.CSSProperties = {
              position: "absolute",
              left: it.left,
              top: it.top,
              width: it.w,
              height: "auto",
              // Use CSS vars for per-item timing
              // @ts-expect-error CSS custom property
              "--d": `${it.d}s`,
              // @ts-expect-error CSS custom property
              "--dl": `${it.dl}s`,
              filter: "grayscale(1) contrast(0.9) brightness(0.6)",
              willChange: "transform",
            }
            return (
              <img
                key={idx}
                src={it.src || "/placeholder.svg"}
                alt=""
                aria-hidden="true"
                className="srn-floater select-none"
                draggable={false}
                style={style}
              />
            )
          })
        }
      </div>
      {/* Soft vignette for readability */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% -10%, color-mix(in oklab, var(--background) 0%, transparent) 0%, transparent 60%), radial-gradient(800px 400px at 50% 120%, color-mix(in oklab, var(--background) 0%, transparent) 0%, transparent 60%), linear-gradient(var(--background), var(--background))",
          opacity: 0.9,
        }}
      />
      <style jsx global>{`
        /* background slow-drift animations */
        @keyframes srn-pan-a {
          0% {
            background-position: 0 0;
          }
          50% {
            background-position: 300px 200px;
          }
          100% {
            background-position: 0 0;
          }
        }
        @keyframes srn-pan-b {
          0% {
            background-position: 0 0;
          }
          50% {
            background-position: -260px -180px;
          }
          100% {
            background-position: 0 0;
          }
        }

        /* Floating items gentle movement */
        .srn-floater {
          animation:
            srn-float var(--d) ease-in-out infinite,
            srn-sway calc(var(--d) * 1.6) linear infinite;
          animation-delay: var(--dl, 0s);
          transform-origin: 50% 50%;
          opacity: 0.9; /* combined with parent opacity */
        }
        @keyframes srn-float {
          0% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50% { transform: translate3d(0, -14px, 0) rotate(0.25deg); }
          100% { transform: translate3d(0, 0, 0) rotate(0deg); }
        }
        @keyframes srn-sway {
          0% { transform: translate3d(0, 0, 0) }
          25% { transform: translate3d(6px, 0, 0) }
          50% { transform: translate3d(0, 0, 0) }
          75% { transform: translate3d(-6px, 0, 0) }
          100% { transform: translate3d(0, 0, 0) }
        }

        /* Respect reduced motion – disable animations globally for our background */
        @media (prefers-reduced-motion: reduce) {
          [style*="animation: srn-pan-a"],
          [style*="animation: srn-pan-b"],
          .srn-floater {
            animation: none !important;
          }
        }
      `}</style>
    </>
  )
}
