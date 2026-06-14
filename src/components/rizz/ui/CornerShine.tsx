/** Fixed bottom-left corner accent — always visible while scrolling. */
export const CornerShine = () => (
  <div className="corner-shine" aria-hidden="true">
    <div className="corner-shine__glow" />
    <div className="corner-shine__line corner-shine__line--vertical" />
    <div className="corner-shine__line corner-shine__line--horizontal" />
  </div>
);
