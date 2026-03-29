import { useState, useEffect, useRef } from "react";
import { FlipResultCards } from "./components/FlipResultCards";
import type { CardState } from "./components/FlipResultCards";
import { MapSearchOverlay } from "./components/MapSearchOverlay";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { AboutPage } from "./pages/AboutPage";
import { fetchStations } from "./api/stationsApi";
import type { Station } from "./types/viewmodels";
import "leaflet/dist/leaflet.css";
import { GermanyMap } from "./components/GermanyGeoMap";
import "./App.css";

function App() {
  const [page, setPage] = useState<"home" | "about">("home");
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [cards, setCards] = useState<CardState[]>([]);
  const skipFlyRef = useRef(false);

  useEffect(() => {
    fetchStations().then(setStations).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedStation) return;

    const isDelayed = Math.random() > 0.5;
    const newCard: CardState = {
      result: {
        bahnhof: selectedStation,
        next_train: {
          train_name: `ICE ${Math.floor(Math.random() * 900) + 100}`,
          train_id: `mock-${Date.now()}`,
          delay: isDelayed ? Math.floor(Math.random() * 15) + 1 : 0,
        },
      },
      flipped: false,
    };

    setCards((prev) => {
      // Overwrite any existing unflipped card; keep all flipped ones
      const flippedOnly = prev.filter((c) => c.flipped);
      return [newCard, ...flippedOnly];
    });
  }, [selectedStation]);

  function handleFlip(trainId: string) {
    setCards((prev) =>
      prev.map((c) =>
        c.result.next_train.train_id === trainId ? { ...c, flipped: true } : c,
      ),
    );
  }

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
            <FlipResultCards cards={cards} onFlip={handleFlip} />
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default App;
