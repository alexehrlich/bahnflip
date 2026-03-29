import { useState, useRef } from "react";
import { StationInput } from "./StationInput";
import type { Station } from "../types/viewmodels";
import "./MapSearchOverlay.css";

interface Props {
  stations: Station[];
  selected: Station | null;
  onSelect: (station: Station) => void;
}

export function MapSearchOverlay({ stations, selected, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleExpand() {
    setExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleCollapse() {
    setExpanded(false);
  }

  return (
    <div className="mso">
      {expanded ? (
        <div className="mso__bar">
          <span className="mso__icon" aria-hidden="true">
            <SearchIcon />
          </span>
          <StationInput
            selected={selected}
            stations={stations}
            onSelect={onSelect}
            inputRef={inputRef}
          />
          <button className="mso__close" onClick={handleCollapse} aria-label="Close search">
            ✕
          </button>
        </div>
      ) : (
        <button className="mso__trigger" onClick={handleExpand} aria-label="Open search">
          <SearchIcon />
        </button>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
