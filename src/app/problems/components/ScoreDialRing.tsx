const SCORE_DIAL_RADIUS = 52;
const SCORE_DIAL_STROKE_WIDTH = 8;
const SCORE_DIAL_VIEWBOX = 128;
const SCORE_DIAL_CENTER = 64;

type ScoreDialRingProps = {
  score: number;
};

export function ScoreDialRing({ score }: ScoreDialRingProps) {
  const circumference = 2 * Math.PI * SCORE_DIAL_RADIUS;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative size-[128px] shrink-0">
      <svg
        role="img"
        aria-label="Score dial"
        viewBox={`0 0 ${SCORE_DIAL_VIEWBOX} ${SCORE_DIAL_VIEWBOX}`}
        className="size-full -rotate-90"
      >
        <circle
          cx={SCORE_DIAL_CENTER}
          cy={SCORE_DIAL_CENTER}
          r={SCORE_DIAL_RADIUS}
          fill="none"
          stroke="var(--color-surface-card)"
          strokeWidth={SCORE_DIAL_STROKE_WIDTH}
        />
        <circle
          cx={SCORE_DIAL_CENTER}
          cy={SCORE_DIAL_CENTER}
          r={SCORE_DIAL_RADIUS}
          fill="none"
          stroke="var(--color-success)"
          strokeWidth={SCORE_DIAL_STROKE_WIDTH}
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[28px] font-bold leading-none tabular-nums text-ink">
          {score}
        </span>
        <span className="font-mono text-[14px] text-mute">/100</span>
      </div>
    </div>
  );
}
