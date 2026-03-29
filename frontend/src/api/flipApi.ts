import type { FlipResult } from "../types/viewmodels";

export async function fetchFlip(stationName: string): Promise<FlipResult> {
  const response = await fetch(`/api/flip?bahnhof=${encodeURIComponent(stationName)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch flip: ${response.status}`);
  }
  return response.json();
}
