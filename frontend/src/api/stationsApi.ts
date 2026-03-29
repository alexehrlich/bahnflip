import type { Station } from "../types/viewmodels";

export async function fetchStations(): Promise<Station[]> {
  const response = await fetch("/api/map");
  if (!response.ok) {
    throw new Error(`Failed to fetch stations: ${response.status}`);
  }
  const map: Station[] = await response.json();
  console.log(map);

  return map;
}
