import type { Station } from "../types/station";

export async function fetchStations(): Promise<Station[]> {
  const response = await fetch("/api/map");
  if (!response.ok) {
    throw new Error(`Failed to fetch stations: ${response.status}`);
  }
  const map: Record<string, string> = await response.json();
  return Object.entries(map).map(([id, name]) => ({ id, name }));
}
