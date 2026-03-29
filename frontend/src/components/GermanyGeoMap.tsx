import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from "react-leaflet";
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
      map.flyTo([selected.geo_lat, selected.geo_lon], 12, {
        duration: 1.5,
      });
    }
  }, [selected, map]);

  return null;
}

export function GermanyMap({ stations, selected, onSelect }: Props) {
  const germanyCenter: LatLngExpression = [51.2, 10.5];

  const geoJsonStyle = () => ({
    color: "blue",
    weight: 2,
    fillOpacity: 0,
  });

  return (
    <MapContainer center={germanyCenter} zoom={6} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <GeoJSON data={germanyGeoJson} style={geoJsonStyle} />

      {stations.map((s) => (
        <Marker
          key={s.bhf_id}
          position={[s.geo_lat, s.geo_lon]}
          eventHandlers={{
            click: () => onSelect(s),
          }}
        >
          <Popup>{s.bhf_name}</Popup>
        </Marker>
      ))}

      {/* Move map when a station is selected externally */}
      <MapUpdater selected={selected} />
    </MapContainer>
  );
}
