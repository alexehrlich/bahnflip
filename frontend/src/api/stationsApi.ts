export async function fetchStations(): Promise<string[]> {
  const response = await fetch("/api/list");
  if (!response.ok) {
    throw new Error(`Failed to fetch stations: ${response.status}`);
  }
  return response.json();
}
