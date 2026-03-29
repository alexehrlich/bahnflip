import { useState, useEffect, useRef } from "react";
import { FlipResultCards } from "./components/FlipResultCards";
import type { CardState } from "./components/FlipResultCards";
import { MapSearchOverlay } from "./components/MapSearchOverlay";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { AboutPage } from "./pages/AboutPage";
import { fetchStations } from "./api/stationsApi";
import { fetchFlip, FlipServerError } from "./api/flipApi";
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
  const pendingIdRef = useRef<string | null>(null);

  useEffect(() => {
    fetchStations().then(setStations).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedStation) return;
    const id = `${selectedStation.bhf_id}-${Date.now()}`;
    pendingIdRef.current = id;
    const pendingCard: CardState = {
      id,
      station: selectedStation,
      result: null,
      error: null,
      loading: true,
      flipped: false,
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCards((prev) => [pendingCard, ...prev.filter((c) => c.flipped)]);
    setOverlayDismissed(false);
    fetchFlip(selectedStation.bhf_id)
      .then((result) => {
        if (pendingIdRef.current !== id) return;
        setCards((prev) =>
          prev.map((c) => (c.id === id ? { ...c, result, loading: false } : c)),
        );
      })
      .catch((err) => {
        if (pendingIdRef.current !== id) return;
        const errorMsg =
          err instanceof FlipServerError ? err.message : "Could not retrieve train data";
        setCards((prev) =>
          prev.map((c) => (c.id === id ? { ...c, error: errorMsg, loading: false } : c)),
        );
      });
  }, [selectedStation]);

  function handleFlip(id: string) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)));
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
