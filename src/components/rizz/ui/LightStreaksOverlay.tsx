/** Fixed full-viewport anamorphic light streaks — pure gradients, compositor-only animation. */
export const LightStreaksOverlay = () => (
  <div className="light-streaks" aria-hidden="true">
    <div className="light-streak light-streak--blue light-streak--1" />
    <div className="light-streak light-streak--orange light-streak--2" />
    <div className="light-streak light-streak--orange light-streak--3" />
    <div className="light-streak light-streak--blue light-streak--4" />
  </div>
);
