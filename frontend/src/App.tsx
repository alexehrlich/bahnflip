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

function mockCard(station: Station): CardState {
  const roll = Math.random();

  if (roll < 0.1) {
    // 10 %: server error
    return { station, result: null, error: "Could not retrieve train data", flipped: false };
  }

  if (roll < 0.25) {
    // 15 %: cancelled  (delay === -1)
    return {
      station,
      result: {
        bahnhof: station,
        next_train: {
          train_name: `ICE ${Math.floor(Math.random() * 900) + 100}`,
          train_id: `mock-${Date.now()}`,
          delay: -1,
        },
      },
      error: null,
      flipped: false,
    };
  }

  const isDelayed = roll < 0.6; // 35 % delayed, 40 % on time
  return {
    station,
    result: {
      bahnhof: station,
      next_train: {
        train_name: `ICE ${Math.floor(Math.random() * 900) + 100}`,
        train_id: `mock-${Date.now()}`,
        delay: isDelayed ? Math.floor(Math.random() * 15) + 1 : 0,
      },
    },
    error: null,
    flipped: false,
  };
}

function App() {
  const [page, setPage] = useState<"home" | "about">("home");
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [cards, setCards] = useState<CardState[]>([]);
  const [overlayDismissed, setOverlayDismissed] = useState(false);
  const skipFlyRef = useRef(false);

  useEffect(() => {
    fetchStations().then(setStations).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedStation) return;
    const newCard = mockCard(selectedStation);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCards((prev) => [newCard, ...prev.filter((c) => c.flipped)]);
    setOverlayDismissed(false);
  }, [selectedStation]);

  function handleFlip(trainId: string) {
    setCards((prev) =>
      prev.map((c) =>
        (c.result?.next_train.train_id ?? `error-${c.station.bhf_id}`) === trainId
          ? { ...c, flipped: true }
          : c,
      ),
    );
  }

  const latestCard = cards[0] ?? null;
  const showMobileOverlay = latestCard !== null && !overlayDismissed;

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
              onMapClick={() => setOverlayDismissed(true)}
            />
            <MapSearchOverlay
              stations={stations}
              selected={selectedStation}
              onSelect={setSelectedStation}
            />
            {showMobileOverlay && (
              <div className="mobile-card-overlay" onClick={(e) => e.stopPropagation()}>
                <FlipResultCards cards={[latestCard]} onFlip={handleFlip} />
              </div>
            )}
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
