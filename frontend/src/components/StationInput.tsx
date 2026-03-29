import { useState, useRef, useMemo } from "react";
import Fuse from "fuse.js";

interface Props {
  label: string;
  value: string;
  stations: string[];
  onChange: (value: string) => void;
}

export function StationInput({ label, value, stations, onChange }: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(() => new Fuse(stations, { threshold: 0.8 }), [stations]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    onChange(query);

    if (query.trim().length === 0) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const results = fuse.search(query, { limit: 5 }).map((r) => r.item);
    setSuggestions(results);
    setOpen(results.length > 0);
  }

  function handleSelect(station: string) {
    onChange(station);
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
          value={value}
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
              key={station}
              role="option"
              aria-selected={station === value}
              onMouseDown={() => handleSelect(station)}
            >
              {station}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
