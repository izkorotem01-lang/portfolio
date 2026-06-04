import React from "react";

/** Animated ambient layer — only rendered inside #intro-zone (hero + highlights). */
const IntroMotionBackground = () => (
  <div className="intro-motion-bg" aria-hidden>
    <div className="intro-motion-bg__mesh" />
    <div className="intro-motion-bg__grid" />
    <div className="intro-motion-bg__orb intro-motion-bg__orb--cyan" />
    <div className="intro-motion-bg__orb intro-motion-bg__orb--orange" />
    <div className="intro-motion-bg__orb intro-motion-bg__orb--blend" />
    <div className="intro-motion-bg__sweep" />
  </div>
);

export default IntroMotionBackground;
