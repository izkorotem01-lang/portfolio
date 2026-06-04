import React from "react";

/** Static site-wide canvas — motion lives only in #intro-zone. */
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
