import { useState } from 'react'

function App() {
  const [station, setStation] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    // TODO: fetch departures for `station` from backend
    console.log('searching for:', station)
  }

  return (
    <main>
      <h1>bahnflip</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter station name"
          value={station}
          onChange={e => setStation(e.target.value)}
          aria-label="Station"
        />
        <button type="submit">Search</button>
      </form>
    </main>
  )
}

export default App
