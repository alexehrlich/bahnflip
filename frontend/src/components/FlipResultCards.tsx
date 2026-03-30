import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FlipResult, Station } from "../types/viewmodels";
import "./FlipResultCards.css";

export interface CardState {
  id: string;            // stable identifier used as React key
  station: Station;
  result: FlipResult | null;
  error: string | null;
  loading: boolean;      // true while API call is in-flight
  flipped: boolean;
}

interface Props {
  cards: CardState[];
  onFlip: (id: string) => void;
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
      <AnimatePresence initial={false} custom={undefined}>
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            layout
            custom={card.flipped}
            variants={{
              initial: { opacity: 0, y: -20, scale: 0.95 },
              animate: { opacity: 1, y: 0, scale: 1 },
              exit: (flipped: boolean) => ({
                opacity: 0,
                x: flipped ? 60 : -60,
                scale: 0.9,
                transition: flipped
                  ? { type: "spring", stiffness: 300, damping: 28 }
                  : { duration: 0.16, ease: "easeIn" },
              }),
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <FlipCard
              card={card}
              onFlip={() => onFlip(card.id)}
              isLatestFlipped={card.flipped && i === firstFlippedIdx}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Resolve card variant ───────────────────────────────────────
type CardVariant = "on-time" | "delayed" | "cancelled" | "error";

function resolveVariant(card: CardState): CardVariant {
  if (card.error) return "error";
  const delay = card.result!.next_train.delay;
  if (delay === -1) return "cancelled";
  if (delay >= 6) return "delayed";
  return "on-time";
}

// ── FlipCard container ─────────────────────────────────────────
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

  function handleClick() {
    if (card.loading) return;
    setCardHeight(cardRef.current?.offsetHeight ?? 100);
    onFlip();
  }

  // ── Pending ────────────────────────────────────────
  if (!card.flipped) {
    return (
      <div
        ref={cardRef}
        className={[
          "flip-card flip-card--pending",
          card.loading ? "flip-card--loading" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={handleClick}
      >
        <PendingCardContent card={card} />
      </div>
    );
  }

  // ── Animating ──────────────────────────────────────
  const variant = resolveVariant(card);
  if (!hasAnimated) {
    return (
      <div className="flip-card-3d" style={{ height: cardHeight }}>
        <motion.div
          className="flip-card-3d__inner"
          animate={{ rotateY: -180 }}
          transition={{ type: "tween", ease: [0.68, -0.55, 0.27, 1.55], duration: 0.6 }}
          onAnimationComplete={() => setHasAnimated(true)}
        >
          <div className="flip-card-3d__front flip-card flip-card--pending">
            <PendingCardContent card={card} />
          </div>
          <div className={`flip-card-3d__back flip-card flip-card--${variant}`}>
            <ResultCardContent card={card} variant={variant} />
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Settled ────────────────────────────────────────
  return (
    <div
      className={[
        "flip-card",
        `flip-card--${variant}`,
        isLatestFlipped ? "flip-card--latest" : "flip-card--history",
      ].join(" ")}
    >
      <ResultCardContent card={card} variant={variant} />
    </div>
  );
}

// ── Pending face ───────────────────────────────────────────────
function PendingCardContent({ card }: { card: CardState }) {
  if (card.loading) {
    return (
      <>
        <div className="flip-card__header">
          <div className="flip-card__loading-dots">
            <span /><span /><span />
          </div>
        </div>
        <div className="flip-card__station">{card.station.bhf_name}</div>
        <div className="flip-card__train flip-card__train--blurred">fetching…</div>
      </>
    );
  }

  const badgeLabel = card.result
    ? card.result.next_train.delay > 0 ? "Delayed" : "On Time"
    : "●●●";
  const trainLabel = card.result?.next_train.train_name ?? "●●●";

  return (
    <>
      <div className="flip-card__header">
        <span className="flip-card__status-badge flip-card__status-badge--blurred">
          {badgeLabel}
        </span>
        <span className="flip-card__hint">tap to flip ↵</span>
      </div>
      <div className="flip-card__station">{card.station.bhf_name}</div>
      <div className="flip-card__train flip-card__train--blurred">{trainLabel}</div>
    </>
  );
}

// ── Result face ────────────────────────────────────────────────
function ResultCardContent({ card, variant }: { card: CardState; variant: CardVariant }) {
  if (variant === "error") {
    return (
      <>
        <div className="flip-card__header">
          <span className="flip-card__status-badge">No data</span>
        </div>
        <div className="flip-card__station">{card.station.bhf_name}</div>
        <div className="flip-card__train">{card.error}</div>
      </>
    );
  }

  const result = card.result!;
  const { delay, train_name } = result.next_train;

  if (variant === "cancelled") {
    return (
      <>
        <div className="flip-card__header">
          <span className="flip-card__status-badge">Cancelled</span>
        </div>
        <div className="flip-card__station">{result.bahnhof.bhf_name}</div>
        <div className="flip-card__train">{train_name}</div>
      </>
    );
  }

  return (
    <>
      <div className="flip-card__header">
        <span className="flip-card__status-badge">
          {variant === "delayed" ? "Delayed" : "On Time"}
        </span>
        {delay > 0 && (
          <span className="flip-card__delay">+{delay} min</span>
        )}
      </div>
      <div className="flip-card__station">{result.bahnhof.bhf_name}</div>
      <div className="flip-card__train">{train_name}</div>
    </>
  );
}
