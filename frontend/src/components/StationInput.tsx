import { useState, useRef, useMemo, useEffect } from "react";
import Fuse from "fuse.js";
import type { Station } from "../types/viewmodels";

interface Props {
  label: string;
  selected: Station | null;
  stations: Station[];
  onSelect: (station: Station) => void;
}

export function StationInput({ label, selected, stations, onSelect }: Props) {
  const [inputValue, setInputValue] = useState(selected?.bhf_name ?? "");
  const [suggestions, setSuggestions] = useState<Station[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(
    () => new Fuse(stations, { keys: ["bhf_name"], threshold: 0.4 }),
    [stations],
  );

  // Sync input text when selection changes externally (e.g. map click)
  useEffect(() => {
    setInputValue(selected?.bhf_name ?? "");
  }, [selected]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    setInputValue(query);

    if (query.trim().length === 0) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const results = fuse.search(query, { limit: 5 }).map((r) => r.item);
    setSuggestions(results);
    setOpen(results.length > 0);
  }

  function handleSelect(station: Station) {
    onSelect(station);
    setSuggestions([]);
    setOpen(false);
  }

  function handleBlur(e: React.FocusEvent) {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} onBlur={handleBlur} style={{ position: "relative" }}>
      <label>
        {label}
        <input
          type="text"
          value={inputValue}
          onChange={handleInput}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Station name"
          autoComplete="off"
        />
      </label>
      {open && (
        <ul role="listbox">
          {suggestions.map((station) => (
            <li
              key={station.bhf_id}
              role="option"
              aria-selected={station.bhf_id === selected?.bhf_id}
              onMouseDown={() => handleSelect(station)}
            >
              {station.bhf_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
