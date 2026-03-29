import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  GeoJSON,
  useMap,
  Tooltip,
  AttributionControl,
} from "react-leaflet";
import type { Station } from "../types/viewmodels";
import { germanyGeoJson } from "../data/gemanyGeoJson";
import { useEffect, useRef } from "react";
import type { LatLngExpression, Map as LeafletMap } from "leaflet";

interface Props {
  stations: Station[];
  selected?: Station | null;
  onSelect: (station: Station) => void;
  skipFlyRef: React.MutableRefObject<boolean>;
}

const GERMANY_CENTER: LatLngExpression = [51.2, 10.5];
const DEFAULT_ZOOM = 6;

function MapUpdater({
  selected,
  skipFlyRef,
}: {
  selected?: Station | null;
  skipFlyRef: React.MutableRefObject<boolean>;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selected) return;
    if (skipFlyRef.current) {
      skipFlyRef.current = false;
      return;
    }
    map.flyTo([selected.geo_lat, selected.geo_lon], 10, { duration: 1.5 });
  }, [selected, map, skipFlyRef]);

  return null;
}

function MapCapture({ mapRef }: { mapRef: React.MutableRefObject<LeafletMap | null> }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map]);
  return null;
}

export function GermanyMap({ stations, selected, onSelect, skipFlyRef }: Props) {
  const mapRef = useRef<LeafletMap | null>(null);

  const geoJsonStyle = () => ({
    color: "#EC0016",
    weight: 2.0,
    fillOpacity: 0,
  });

  return (
    <div style={{ position: "relative", height: "600px", width: "100%" }}>
      <MapContainer
        center={GERMANY_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: "100%", width: "100%" }}
        zoomSnap={0.25}
        wheelPxPerZoomLevel={120}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap &copy; CARTO"
        />

        <GeoJSON data={germanyGeoJson} style={geoJsonStyle} />

        {stations.map((s) => {
          const isSelected = selected?.bhf_id === s.bhf_id;
          return (
            <CircleMarker
              key={s.bhf_id}
              center={[s.geo_lat, s.geo_lon]}
              radius={5}
              pathOptions={{
                color: "#EC0016",
                weight: 1.5,
                fillColor: isSelected ? "#EC0016" : "#ffffff",
                fillOpacity: 1,
              }}
              eventHandlers={{
                mouseover: (e) =>
                  !isSelected && e.target.setStyle({ fillColor: "#EC0016", fillOpacity: 0.35 }),
                mouseout: (e) =>
                  !isSelected && e.target.setStyle({ fillColor: "#ffffff", fillOpacity: 1 }),
                click: () => {
                  skipFlyRef.current = true;
                  onSelect(s);
                },
              }}
            >
              <Popup>{s.bhf_name}</Popup>
              <Tooltip direction="top" offset={[0, -6]} opacity={1} permanent={false}>
                {s.bhf_name}
              </Tooltip>
            </CircleMarker>
          );
        })}

        <MapUpdater selected={selected} skipFlyRef={skipFlyRef} />
        <MapCapture mapRef={mapRef} />
        <AttributionControl position="topright" />
      </MapContainer>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(100,110,130,0.08)",
          pointerEvents: "none",
          zIndex: 400,
        }}
      />

      <button
        className="map-home-btn"
        onClick={() => mapRef.current?.flyTo(GERMANY_CENTER, DEFAULT_ZOOM, { duration: 1 })}
        title="Reset view"
      >
        ⌂
      </button>
    </div>
  );
}
