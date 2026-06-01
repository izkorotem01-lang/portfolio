import React from "react";

/** Quiet premium canvas — deep navy + soft cyan ambient (no scroll snake). */
const GlobalBackground = () => (
  <div
    className="site-background fixed inset-0 z-0 overflow-hidden pointer-events-none"
    aria-hidden
  >
    <div className="site-background__ambient" />
    <div className="site-background__grain" />
  </div>
);

export default GlobalBackground;
