// A deliberately asymmetric car silhouette (wedge nose + headlight on the
// right, taller cabin toward the back-left) so "facing right" reads
// unambiguously — a symmetric car looks the same whichever way it's
// mirrored, which was the actual bug the first version had: the flip logic
// was fine, the car just had no visible front. Shared by RoadJourney (the
// desktop hill scene) and ProjectCarCarousel (the mobile single-screen one).
export default function CarIcon({ innerRef, width = 76, height = 42 }) {
  return (
    <div ref={innerRef} style={{ width, height }}>
      <svg width={width} height={height} viewBox="0 0 76 42" aria-hidden="true">
        <ellipse cx="40" cy="38" rx="32" ry="3" fill="rgba(0,0,0,0.18)" />
        <rect x="6" y="20" width="58" height="11" rx="5.5" fill="var(--accent)" />
        <path d="M60,19.5 L75,25.5 L60,31.5 Z" fill="var(--accent)" />
        <circle cx="71.5" cy="25.5" r="2.1" fill="#fff7d6" />
        <rect x="18" y="7" width="26" height="15" rx="7" fill="var(--accent)" />
        <path d="M22,10 L40,10 L36,20 L22,20 Z" fill="rgba(245,245,247,0.55)" />
        <circle cx="22" cy="32" r="8" fill="#1d1d1f" />
        <circle cx="22" cy="32" r="3.2" fill="#f5f5f7" />
        <circle cx="58" cy="32" r="8" fill="#1d1d1f" />
        <circle cx="58" cy="32" r="3.2" fill="#f5f5f7" />
      </svg>
    </div>
  );
}
