import type { FlipResult } from "../types/viewmodels";

export class FlipServerError extends Error {
  constructor(message = "Could not retrieve train data") {
    super(message);
    this.name = "FlipServerError";
  }
}

export async function fetchFlip(stationId: string): Promise<FlipResult> {
  const response = await fetch(`/api/flip?bahnhof=${encodeURIComponent(stationId)}`);
  if (response.status === 500) {
    throw new FlipServerError();
  }
  if (!response.ok) {
    throw new Error(`Unexpected error: ${response.status}`);
  }
  return response.json();
}
