import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON, useMap, Tooltip } from "react-leaflet";
import type { Station } from "../types/viewmodels";
import { germanyGeoJson } from "../data/gemanyGeoJson";
import { useEffect } from "react";
import type { LatLngExpression } from "leaflet";

interface Props {
  stations: Station[];
  selected?: Station | null;
  onSelect: (station: Station) => void;
}

function MapUpdater({ selected }: { selected?: Station | null }) {
  const map = useMap();

  useEffect(() => {
    if (selected) {
      map.setView([selected.geo_lat, selected.geo_lon], 12, {
  animate: true,
  duration: 2000,
});
    }
  }, [selected, map]);

  return null;
}

export function GermanyMap({ stations, selected, onSelect }: Props) {
  const germanyCenter: LatLngExpression = [51.2, 10.5];

  const geoJsonStyle = () => ({
    color: "#EC0016",
    weight: 2.0,
    fillOpacity: 0
  });

  return (
  <div style={{ position: "relative", height: "400px", width: "100%" }}>
    
    <MapContainer
      center={germanyCenter}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
      zoomSnap={0.25}
      wheelPxPerZoomLevel={120}
      preferCanvas={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap &copy; CARTO"
      />

      <GeoJSON data={germanyGeoJson} style={geoJsonStyle} />

      {stations.map((s) => (
        <CircleMarker
          key={s.bhf_id}
          center={[s.geo_lat, s.geo_lon]}
          radius={3}
          pathOptions={{
            color: "#EC0016",
            weight: 2,
            fillColor: "#ffffff",
            fillOpacity: 1,
          }}
          // style={{
          //   filter: "drop-shadow(0 0 4px rgba(236,0,22,0.6))",
          // }}
          eventHandlers={{
              mouseover: (e) => e.target.setStyle({ radius: 6 }),
              mouseout: (e) => e.target.setStyle({ radius: 3 }),
              click: () => onSelect(s),
          }}
        >
          <Popup>{s.bhf_name}</Popup>
          <Tooltip
            direction="top"
            offset={[0, -6]}
            opacity={1}
            permanent={false}
          >
            {s.bhf_name}
          </Tooltip>
        </CircleMarker>
      ))}

      <MapUpdater selected={selected} />
    </MapContainer>

    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(100,110,130,0.08)", // cooler gray tone
        pointerEvents: "none",
        zIndex: 400,
      }}
    />
  </div>
);
}
