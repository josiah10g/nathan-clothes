import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Check if initial load already ran in this session
    const hasLoaded = sessionStorage.getItem("nc_initial_loaded");
    if (hasLoaded) {
      setVisible(false);
      return;
    }

    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 3600);

    const removeTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("nc_initial_loaded", "true");
    }, 4100);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-100 flex flex-col items-center justify-center bg-background transition-all duration-500 ease-out ${
        fading ? "pointer-events-none opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Animated ambient glow */}
        <div className="absolute -inset-10 -z-10 animate-pulse rounded-full bg-primary/10 blur-2xl" />

        <p className="text-display text-2xl tracking-[0.4em] text-foreground sm:text-3xl animate-pulse">
          NATHAN&apos;S CLOTHES
        </p>
        <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Heavyweight Monochrome
        </p>

        {/* Minimal progress bar */}
        <div className="mt-6 h-0.5 w-36 overflow-hidden rounded-full bg-border/60">
          <div className="h-full w-full origin-left animate-loading-bar bg-foreground" />
        </div>
      </div>
    </div>
  );
}
