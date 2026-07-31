import React from "react";
import IntroMotionBackground from "@/components/IntroMotionBackground";

type IntroZoneProps = {
  children: React.ReactNode;
};

/** Wraps hero + highlights with motion background; rest of page uses static global canvas. */
const IntroZone = ({ children }: IntroZoneProps) => (
  <div id="intro-zone" className="intro-zone relative isolate overflow-x-clip">
    <IntroMotionBackground />
    <div className="intro-zone__content relative z-10">{children}</div>
    <div className="intro-zone__fade" aria-hidden />
  </div>
);

export default IntroZone;
