import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import type { Station } from "../types/viewmodels";
import { germanyGeoJson } from "../data/gemanyGeoJson";

interface Props {
  stations: Station[];
  onSelect: (station: Station) => void;
}

export function GermanyMap({ stations, onSelect }: Props) {
  return (
    <MapContainer
      center={[51.2, 10.5]} // center of Germany
      zoom={6}
      style={{ height: "400px", width: "100%" }}
    >
      {/* Free OSM tiles */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Germany border */}
      <GeoJSON data={germanyGeoJson} style={{ color: "blue", weight: 2, fillOpacity: 0 }} />

      {/* Stations */}
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
    </MapContainer>
  );
}
