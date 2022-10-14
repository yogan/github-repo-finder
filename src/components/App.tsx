import { useState } from 'react'

import FavoritesFilterButton from './FavoritesFilterButton'
import RepositoryWrapper from './RepositoryWrapper'
import './App.css'

function App() {
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const toggleOnlyFavorites = () => setOnlyFavorites(!onlyFavorites)

  return (
    <>
      <header>
        <a href="https://reactjs.org" target="_blank">
          <img src="/react.svg" className="logo react" alt="React logo" />
        </a>
        <h1>GitHub Repository Finder</h1>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
      </header>
      <main>
        <FavoritesFilterButton
          showOnlyFavorites={onlyFavorites}
          toggleOnlyFavorites={toggleOnlyFavorites}
        />
        <RepositoryWrapper
          showOnlyFavorites={onlyFavorites}
        />
      </main>
    </>
  )
}

export default App
