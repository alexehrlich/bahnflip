import { useState, useRef } from "react";
import type { FlipResult } from "../types/viewmodels";
import "./FlipResultCards.css";

export interface CardState {
  result: FlipResult;
  flipped: boolean;
}

interface Props {
  cards: CardState[];
  onFlip: (trainId: string) => void;
}

export function FlipResultCards({ cards, onFlip }: Props) {
  if (cards.length === 0) {
    return (
      <div className="flip-history flip-history--empty">
        <div className="flip-empty">
          <div className="flip-empty__coin">?</div>
          <p className="flip-empty__text">Select a station on the map to flip</p>
        </div>
      </div>
    );
  }

  const firstFlippedIdx = cards.findIndex((c) => c.flipped);

  return (
    <div className="flip-history">
      {cards.map((card, i) => (
        <FlipCard
          key={card.result.next_train.train_id}
          card={card}
          onFlip={() => onFlip(card.result.next_train.train_id)}
          isLatestFlipped={card.flipped && i === firstFlippedIdx}
        />
      ))}
    </div>
  );
}

function FlipCard({
  card,
  onFlip,
  isLatestFlipped,
}: {
  card: CardState;
  onFlip: () => void;
  isLatestFlipped: boolean;
}) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [cardHeight, setCardHeight] = useState(100);
  const cardRef = useRef<HTMLDivElement>(null);
  const isDelayed = card.result.next_train.delay > 0;

  function handleClick() {
    setCardHeight(cardRef.current?.offsetHeight ?? 100);
    onFlip();
  }

  // ── Pending (not yet flipped) ──────────────────
  if (!card.flipped) {
    return (
      <div ref={cardRef} className="flip-card flip-card--pending" onClick={handleClick}>
        <PendingCardContent result={card.result} />
      </div>
    );
  }

  // ── Flipping (animation in progress) ──────────
  if (!hasAnimated) {
    return (
      <div className="flip-card-3d" style={{ height: cardHeight }}>
        <div className="flip-card-3d__inner" onAnimationEnd={() => setHasAnimated(true)}>
          <div className="flip-card-3d__front flip-card flip-card--pending">
            <PendingCardContent result={card.result} />
          </div>
          <div
            className={[
              "flip-card-3d__back flip-card",
              isDelayed ? "flip-card--delayed" : "flip-card--on-time",
            ].join(" ")}
          >
            <FlipCardContent result={card.result} isDelayed={isDelayed} />
          </div>
        </div>
      </div>
    );
  }

  // ── Settled result ─────────────────────────────
  return (
    <div
      className={[
        "flip-card",
        isDelayed ? "flip-card--delayed" : "flip-card--on-time",
        isLatestFlipped ? "flip-card--latest" : "flip-card--history",
      ].join(" ")}
    >
      <FlipCardContent result={card.result} isDelayed={isDelayed} />
    </div>
  );
}

/** Pending face: same DOM structure as FlipCardContent, badge + train blurred */
function PendingCardContent({ result }: { result: FlipResult }) {
  const isDelayed = result.next_train.delay > 0;
  return (
    <>
      <div className="flip-card__header">
        <span className="flip-card__status-badge flip-card__status-badge--blurred">
          {isDelayed ? "Delayed" : "On Time"}
        </span>
        <span className="flip-card__hint">tap to flip ↵</span>
      </div>
      <div className="flip-card__station">{result.bahnhof.bhf_name}</div>
      <div className="flip-card__train flip-card__train--blurred">
        {result.next_train.train_name}
      </div>
    </>
  );
}

/** Result face */
function FlipCardContent({ result, isDelayed }: { result: FlipResult; isDelayed: boolean }) {
  return (
    <>
      <div className="flip-card__header">
        <span className="flip-card__status-badge">{isDelayed ? "Delayed" : "On Time"}</span>
        {isDelayed && <span className="flip-card__delay">+{result.next_train.delay} min</span>}
      </div>
      <div className="flip-card__station">{result.bahnhof.bhf_name}</div>
      <div className="flip-card__train">{result.next_train.train_name}</div>
    </>
  );
}
