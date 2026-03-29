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
  const [overlayDismissed, setOverlayDismissed] = useState(false);
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
      const flippedOnly = prev.filter((c) => c.flipped);
      return [newCard, ...flippedOnly];
    });
    setOverlayDismissed(false);
  }, [selectedStation]);

  function handleFlip(trainId: string) {
    setCards((prev) =>
      prev.map((c) =>
        c.result.next_train.train_id === trainId ? { ...c, flipped: true } : c,
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
              <div
                className="mobile-card-overlay"
                onClick={(e) => e.stopPropagation()}
              >
                <FlipResultCards
                  cards={[latestCard]}
                  onFlip={handleFlip}
                />
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
