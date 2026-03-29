import { useState, useEffect } from "react";
import { StationInput } from "./components/StationInput";
import { NetworkMap } from "./components/NetworkMap";
import { fetchStations } from "./api/stationsApi";
import { fetchFlip } from "./api/flipApi";
import type { FlipResult } from "./api/flipApi";
import type { Station } from "./types/station";

function App() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [flipResult, setFlipResult] = useState<FlipResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStations().then(setStations).catch(console.error);
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStation) return;
    setError(null);
    setFlipResult(null);
    try {
      const result = await fetchFlip(selectedStation.name);
      setFlipResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <main>
      <h1>bahnflip</h1>
      <form onSubmit={handleSearch}>
        <StationInput
          label="Station"
          selected={selectedStation}
          stations={stations}
          onSelect={setSelectedStation}
        />
        <button type="submit" disabled={!selectedStation}>
          Search
        </button>
      </form>
      {error && <p>{error}</p>}
      {flipResult && <p>Result: {flipResult.bhf_name}</p>}
      <NetworkMap stations={stations} selected={selectedStation} onSelect={setSelectedStation} />
    </main>
  );
}

export default App;
