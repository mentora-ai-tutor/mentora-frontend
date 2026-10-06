'use client';

const stages = [
  'Peer Matched',
  'Question Generated',
  'Collaboration',
  'Evaluation',
  'Summary',
  'Recommendation',
];

interface SessionProgressProps {
  currentStage: number;
}

export default function SessionProgress({ currentStage }: SessionProgressProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {stages.map((stage, i) => {
        const isCompleted = i < currentStage;
        const isCurrent = i === currentStage;

        return (
          <div key={i} className="flex items-center gap-1 shrink-0">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  isCompleted
                    ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                    : isCurrent
                      ? 'bg-teal-500 text-white border border-teal-400'
                      : 'bg-white/5 text-white/30 border border-white/10'
                }`}
              >
                {isCompleted ? '✓' : i + 1}
              </div>
              <span
                className={`text-[11px] font-medium whitespace-nowrap ${
                  isCurrent ? 'text-white' : isCompleted ? 'text-teal-400/80' : 'text-white/30'
                }`}
              >
                {stage}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div
                className={`w-6 h-px mx-1 ${
                  isCompleted ? 'bg-teal-500/40' : 'bg-white/10'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
