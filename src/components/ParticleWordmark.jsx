import { useEffect, useRef } from "react";

export default function ParticleWordmark() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let generation = 0;
    let cleanup;

    const mount = async () => {
      const current = ++generation;
      cleanup?.();
      cleanup = undefined;
      if (preference.matches) return;
      try {
        const { mountParticleWordmark } = await import("../effects/particleWordmark");
        if (!disposed && current === generation) cleanup = mountParticleWordmark(root);
      } catch {
        // The HTML wordmark remains visible if WebGL or the module is unavailable.
        root.classList.remove("is-live");
      }
    };

    mount();
    preference.addEventListener("change", mount);
    return () => {
      disposed = true;
      generation += 1;
      preference.removeEventListener("change", mount);
      cleanup?.();
    };
  }, []);

  return (
    <div className="particle-wordmark" ref={rootRef} role="img" aria-label="Breaking Bad">
      <span className="particle-wordmark__fallback" aria-hidden="true">breakingBad</span>
      <canvas className="particle-wordmark__canvas" aria-hidden="true" />
    </div>
  );
}
