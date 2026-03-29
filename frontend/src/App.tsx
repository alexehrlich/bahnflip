import { useState, useEffect, useRef } from "react";
import { FlipResultCards } from "./components/FlipResultCards";
import { MapSearchOverlay } from "./components/MapSearchOverlay";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { AboutPage } from "./pages/AboutPage";
import { fetchStations } from "./api/stationsApi";
import type { FlipResult, Station } from "./types/viewmodels";
import "leaflet/dist/leaflet.css";
import { GermanyMap } from "./components/GermanyGeoMap";
import "./App.css";

function App() {
  const [page, setPage] = useState<"home" | "about">("home");
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [history, setHistory] = useState<FlipResult[]>([]);
  const skipFlyRef = useRef(false);

  useEffect(() => {
    fetchStations().then(setStations).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedStation) return;

    const isDelayed = Math.random() > 0.5;
    const result: FlipResult = {
      bahnhof: selectedStation,
      next_train: {
        train_name: `ICE ${Math.floor(Math.random() * 900) + 100}`,
        train_id: `mock-${Date.now()}`,
        delay: isDelayed ? Math.floor(Math.random() * 15) + 1 : 0,
      },
    };
    setHistory((prev) => [result, ...prev]);
  }, [selectedStation]);

  return (
    <>
      <Header onAboutClick={() => setPage("about")} />
      {page === "about" ? (
        <AboutPage onBack={() => setPage("home")} />
      ) : (
        <div className="app-layout">
          <div className="app-map">
            <GermanyMap
              stations={stations}
              selected={selectedStation}
              onSelect={setSelectedStation}
              skipFlyRef={skipFlyRef}
            />
            <MapSearchOverlay
              stations={stations}
              selected={selectedStation}
              onSelect={setSelectedStation}
            />
          </div>
          <div className="app-right">
            <FlipResultCards results={history} />
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default App;
