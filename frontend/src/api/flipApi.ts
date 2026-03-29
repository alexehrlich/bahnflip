import type { operations } from "./types";
// Extract schema
// type User = components["schemas"]["User"];

export type FlipResult = operations["do_flip_flip_get"]["parameters"]["query"];

export async function fetchFlip(stationName: string): Promise<FlipResult> {
  const response = await fetch(`/api/flip?bahnhof=${encodeURIComponent(stationName)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch flip: ${response.status}`);
  }
  return response.json();
}
