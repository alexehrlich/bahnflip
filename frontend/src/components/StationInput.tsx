import { useState, useRef, useMemo, useEffect } from "react";
import Fuse from "fuse.js";
import type { Station } from "../types/viewmodels";
import "./StationInput.css";

interface Props {
  selected: Station | null;
  stations: Station[];
  onSelect: (station: Station) => void;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function StationInput({
  selected,
  stations,
  onSelect,
  placeholder = "Search station…",
  inputRef,
}: Props) {
  const [inputValue, setInputValue] = useState(selected?.bhf_name ?? "");
  const [suggestions, setSuggestions] = useState<Station[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const fuse = useMemo(
    () => new Fuse(stations, { keys: ["bhf_name"], threshold: 0.4 }),
    [stations],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputValue(selected?.bhf_name ?? "");
  }, [selected]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    setInputValue(query);
    setActiveIndex(-1);
    if (query.trim().length === 0) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const results = fuse.search(query, { limit: 5 }).map((r) => r.item);
    setSuggestions(results);
    setOpen(results.length > 0);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => {
        const next = Math.min(i + 1, suggestions.length - 1);
        scrollOptionIntoView(next);
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => {
        const next = i <= 0 ? suggestions.length - 1 : i - 1;
        scrollOptionIntoView(next);
        return next;
      });
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  function scrollOptionIntoView(index: number) {
    const list = listRef.current;
    if (!list) return;
    const item = list.children[index] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }

  function handleSelect(station: Station) {
    onSelect(station);
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleBlur(e: React.FocusEvent) {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div ref={containerRef} className="station-input" onBlur={handleBlur}>
      <input
        ref={inputRef}
        type="text"
        className="station-input__field"
        value={inputValue}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        aria-label="Station"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? `station-opt-${activeIndex}` : undefined}
      />
      {open && (
        <ul ref={listRef} className="station-input__dropdown" role="listbox">
          {suggestions.map((station, i) => (
            <li
              key={station.bhf_id}
              id={`station-opt-${i}`}
              className={[
                "station-input__option",
                station.bhf_id === selected?.bhf_id ? "station-input__option--selected" : "",
                i === activeIndex ? "station-input__option--active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              role="option"
              aria-selected={station.bhf_id === selected?.bhf_id}
              onMouseDown={() => handleSelect(station)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              {station.bhf_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
