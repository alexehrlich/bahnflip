import type { FlipResult } from "../types/viewmodels";
import "./FlipResultCards.css";

interface Props {
  results: FlipResult[];
}

export function FlipResultCards({ results }: Props) {
  if (results.length === 0) {
    return (
      <div className="flip-history flip-history--empty">
        <p>Select a station to see the next train.</p>
      </div>
    );
  }

  return (
    <div className="flip-history">
      {results.map((result, i) => (
        <FlipCard key={result.next_train.train_id} result={result} isLatest={i === 0} />
      ))}
    </div>
  );
}

function FlipCard({ result, isLatest }: { result: FlipResult; isLatest: boolean }) {
  const isDelayed = result.next_train.delay > 0;

  return (
    <div
      className={[
        "flip-card",
        isDelayed ? "flip-card--delayed" : "flip-card--on-time",
        isLatest ? "flip-card--latest" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flip-card__header">
        <span className="flip-card__status-badge">{isDelayed ? "Delayed" : "On Time"}</span>
        {isDelayed && <span className="flip-card__delay">+{result.next_train.delay} min</span>}
      </div>
      <div className="flip-card__station">{result.bahnhof.bhf_name}</div>
      <div className="flip-card__train">{result.next_train.train_name}</div>
    </div>
  );
}
