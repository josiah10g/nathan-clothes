import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const triggerScreen = () => {
      setVisible(true);
      setFading(false);

      const fadeTimer = setTimeout(() => {
        setFading(true);
      }, 3600);

      const removeTimer = setTimeout(() => {
        setVisible(false);
      }, 4100);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    };

    // 1. Initial page load (if not loaded yet)
    const hasLoaded = sessionStorage.getItem("nc_initial_loaded");
    let cleanupInitial: (() => void) | undefined;
    if (!hasLoaded) {
      sessionStorage.setItem("nc_initial_loaded", "true");
      cleanupInitial = triggerScreen();
    }

    // 2. Event listener for login trigger
    const handleLoginEvent = () => {
      triggerScreen();
    };

    window.addEventListener("nc:show-loading-screen", handleLoginEvent);

    return () => {
      window.removeEventListener("nc:show-loading-screen", handleLoginEvent);
      if (cleanupInitial) cleanupInitial();
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
