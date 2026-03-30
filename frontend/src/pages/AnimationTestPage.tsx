import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./AnimationTestPage.css";

// ── Shared card content ────────────────────────────────────────────
function PendingFace({ station }: { station: string }) {
  return (
    <div className="atp-card atp-card--pending">
      <div className="atp-card__badge atp-card__badge--blurred">On Time</div>
      <div className="atp-card__station">{station}</div>
      <div className="atp-card__train atp-card__train--blurred">ICE 123</div>
      <div className="atp-card__hint">tap to flip</div>
    </div>
  );
}

function ResultFace({ station, variant }: { station: string; variant: "on-time" | "delayed" }) {
  return (
    <div className={`atp-card atp-card--${variant}`}>
      <div className="atp-card__badge">{variant === "on-time" ? "On Time" : "Delayed"}</div>
      <div className="atp-card__station">{station}</div>
      <div className="atp-card__train">ICE 123</div>
    </div>
  );
}

// ── Flip demo card ─────────────────────────────────────────────────
interface FlipVariant {
  label: string;
  params: string;
  animate: (flipped: boolean) => Record<string, unknown>;
  transition: (flipped: boolean) => Record<string, unknown>;
}

const FLIP_VARIANTS: FlipVariant[] = [
  {
    label: "Snappy Spring",
    params: "stiffness 300 · damping 25",
    animate: (f) => ({ rotateY: f ? 180 : 0 }),
    transition: () => ({ type: "spring", stiffness: 300, damping: 25 }),
  },
  {
    label: "Soft Spring",
    params: "stiffness 60 · damping 12",
    animate: (f) => ({ rotateY: f ? 180 : 0 }),
    transition: () => ({ type: "spring", stiffness: 60, damping: 12 }),
  },
  {
    label: "Elastic Bounce",
    params: "stiffness 80 · damping 6",
    animate: (f) => ({ rotateY: f ? 180 : 0 }),
    transition: () => ({ type: "spring", stiffness: 80, damping: 6 }),
  },
  {
    label: "Smooth Ease",
    params: "easeInOut · 0.55s",
    animate: (f) => ({ rotateY: f ? 180 : 0 }),
    transition: () => ({ type: "tween", ease: "easeInOut", duration: 0.55 }),
  },
  {
    label: "Anticipate",
    params: "cubic-bezier overshoot · 0.6s",
    animate: (f) => ({ rotateY: f ? 180 : 0 }),
    transition: () => ({
      type: "tween",
      ease: [0.68, -0.55, 0.27, 1.55],
      duration: 0.6,
    }),
  },
  {
    label: "Scale + Flip",
    params: "spring + scale dip at 90°",
    animate: (f) => ({
      rotateY: f ? 180 : 0,
      scale: [1, 0.82, 1],
    }),
    transition: () => ({
      rotateY: { type: "spring", stiffness: 180, damping: 20 },
      scale: { duration: 0.45, ease: "easeInOut" },
    }),
  },
];

function DemoFlipCard({
  variant,
  station,
  resultVariant,
}: {
  variant: FlipVariant;
  station: string;
  resultVariant: "on-time" | "delayed";
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="atp-demo">
      <div className="atp-demo__label">{variant.label}</div>
      <div className="atp-demo__params">{variant.params}</div>

      {/* 3D scene */}
      <div className="atp-scene" onClick={() => setFlipped((f) => !f)}>
        <motion.div
          className="atp-scene__inner"
          animate={variant.animate(flipped) as never}
          transition={variant.transition(flipped) as never}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="atp-scene__face atp-scene__face--front">
            <PendingFace station={station} />
          </div>
          <div className="atp-scene__face atp-scene__face--back">
            <ResultFace station={station} variant={resultVariant} />
          </div>
        </motion.div>
      </div>

      <button className="atp-reset" onClick={() => setFlipped(false)}>
        reset
      </button>
    </div>
  );
}

// ── AnimatePresence list demo ──────────────────────────────────────
const STATIONS = [
  { id: "BL", name: "Berlin Hbf", variant: "on-time" as const },
  { id: "AH", name: "Hamburg Hbf", variant: "delayed" as const },
  { id: "MH", name: "München Hbf", variant: "on-time" as const },
  { id: "FF", name: "Frankfurt Hbf", variant: "delayed" as const },
  { id: "KK", name: "Köln Hbf", variant: "on-time" as const },
];

function ListDemo() {
  const [items, setItems] = useState(STATIONS.slice(0, 2));
  const next = STATIONS.find((s) => !items.find((i) => i.id === s.id));

  return (
    <div className="atp-list-demo">
      <div className="atp-list-demo__controls">
        <button
          className="atp-btn atp-btn--add"
          onClick={() => next && setItems((prev) => [next, ...prev])}
          disabled={!next}
        >
          + add card
        </button>
        <button
          className="atp-btn atp-btn--remove"
          onClick={() => setItems((prev) => prev.slice(1))}
          disabled={items.length === 0}
        >
          remove last
        </button>
      </div>

      <div className="atp-list">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              layout
            >
              <ResultFace station={item.name} variant={item.variant} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────
interface Props {
  onBack: () => void;
}

export function AnimationTestPage({ onBack }: Props) {
  return (
    <div className="atp">
      <div className="atp__header">
        <button className="atp__back" onClick={onBack}>
          ← back
        </button>
        <div>
          <h1 className="atp__title">Animation Lab</h1>
          <p className="atp__subtitle">
            Framer Motion flip variants — click any card to flip, "reset" to flip back.
          </p>
        </div>
      </div>

      <section className="atp__section">
        <h2 className="atp__section-title">Flip transition variants</h2>
        <div className="atp-grid">
          {FLIP_VARIANTS.map((v, i) => (
            <DemoFlipCard
              key={v.label}
              variant={v}
              station={STATIONS[i % STATIONS.length].name}
              resultVariant={i % 2 === 0 ? "on-time" : "delayed"}
            />
          ))}
        </div>
      </section>

      <section className="atp__section">
        <h2 className="atp__section-title">AnimatePresence — list entry / exit</h2>
        <p className="atp__desc">Demonstrates how cards animate in and out of a history list.</p>
        <ListDemo />
      </section>
    </div>
  );
}
