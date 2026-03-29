import type { Station } from "../types/viewmodels";

export async function fetchStations(): Promise<Station[]> {
  const response = await fetch("/api/list");
  if (response.status === 404) {
    console.error("Station list not found (404) — the backend may not have data loaded yet.");
    return [];
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch stations: ${response.status}`);
  }
  const map: Station[] = await response.json();
  return map;
}
