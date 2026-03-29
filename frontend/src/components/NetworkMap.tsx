import { MAP_STATIONS, MAP_EDGES } from "../data/networkMap";
import { GERMANY_BORDER_PATH } from "../data/germanyBorder";
import type { Station } from "../types/viewmodels";

interface Props {
  stations: Station[];
  selected: Station | null;
  onSelect: (station: Station) => void;
}

function labelOffset(anchor?: string): [number, number, string] {
  switch (anchor) {
    case "left":
      return [-8, 3, "end"];
    case "top":
      return [0, -7, "middle"];
    case "bottom":
      return [0, 14, "middle"];
    default:
      return [8, 3, "start"];
  }
}

export function NetworkMap({ stations, selected, onSelect }: Props) {
  // Map station name → Station object for lookup by map node id (which is the name)
  const availableByName = new Map(stations.map((s) => [s.bhf_name, s]));

  return (
    <svg
      viewBox="0 0 1000 1120"
      style={{ width: "100%", height: "auto", display: "block" }}
      aria-label="German long-distance train network map"
    >
      {/* Germany border outline */}
      <path
        d={GERMANY_BORDER_PATH}
        fill="#f5f5f5"
        stroke="#bbbbbb"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {/* Edges */}
      {MAP_EDGES.map((edge, i) => {
        const from = MAP_STATIONS.find((s) => s.id === edge.from);
        const to = MAP_STATIONS.find((s) => s.id === edge.to);
        if (!from || !to) return null;
        return (
          <line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={edge.style === "main" ? "#cc0000" : "#aaaaaa"}
            strokeWidth={edge.style === "main" ? 2 : 1.5}
          />
        );
      })}

      {/* Station markers + labels */}
      {MAP_STATIONS.map((mapStation) => {
        const backendStation = availableByName.get(mapStation.id);
        const isSelected = selected?.bhf_name === mapStation.id;
        const isAvailable = backendStation !== undefined;
        const markerColor = isSelected ? "#0055cc" : isAvailable ? "#cc0000" : "#999999";
        const [dx, dy, anchor] = labelOffset(mapStation.anchor);

        return (
          <g
            key={mapStation.id}
            onClick={() => backendStation && onSelect(backendStation)}
            style={{ cursor: isAvailable ? "pointer" : "default" }}
          >
            {mapStation.type === "interchange" ? (
              <rect
                x={mapStation.x - 4.5}
                y={mapStation.y - 4.5}
                width={9}
                height={9}
                transform={`rotate(45,${mapStation.x},${mapStation.y})`}
                fill={isSelected ? markerColor : "white"}
                stroke={markerColor}
                strokeWidth={isSelected ? 2 : 1.5}
              />
            ) : (
              <circle
                cx={mapStation.x}
                cy={mapStation.y}
                r={isSelected ? 5.5 : 4}
                fill={isSelected ? markerColor : "white"}
                stroke={markerColor}
                strokeWidth={isSelected ? 2 : 1.5}
              />
            )}
            <text
              x={mapStation.x + dx}
              y={mapStation.y + dy}
              fontSize={8}
              textAnchor={anchor}
              fill={isSelected ? markerColor : "#222222"}
              fontWeight={isSelected ? "bold" : "normal"}
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {mapStation.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
