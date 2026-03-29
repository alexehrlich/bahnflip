import { useState, useEffect } from "react";
import { StationInput } from "./components/StationInput";
import { fetchStations } from "./api/stationsApi";

function App() {
  const [station, setStation] = useState("");
  const [stations, setStations] = useState<string[]>([]);

  useEffect(() => {
    fetchStations().then(setStations).catch(console.error);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    // TODO: fetch departures for `station` from backend
    console.log("searching for:", station);
  }

  return (
    <main>
      <h1>bahnflip</h1>
      <form onSubmit={handleSearch}>
        <StationInput
          label="Station"
          value={station}
          stations={stations}
          onChange={setStation}
        />
        <button type="submit">Search</button>
      </form>
    </main>
  );
}

export default App;
