import { useState } from 'react'

import LanguageDropdown, { LanguageDropdownProps } from './LanguageDropdown'
import FavoritesFilterButton from './FavoritesFilterButton'
import { Favorites } from './Repositories'
import RepositoryWrapper from './RepositoryWrapper'
import { useLocalStorage } from '../hooks/LocalStorage'
import './App.css'

function App() {
    const [favorites, setFavorites] = useLocalStorage<Favorites>('favorites', [])

    const toggleFavorite = (id: number) => {
        if (favorites.includes(id)) {
            setFavorites(favorites.filter(fav => fav !== id))
        } else {
            setFavorites([...favorites, id])
        }
    }

    const [onlyFavorites, setOnlyFavorites] = useState(false)
    const toggleOnlyFavorites = () => setOnlyFavorites(!onlyFavorites)

    const [language, setLanguage] = useState('all')

    const onLanguageChange: LanguageDropdownProps['onChange']
        = (event) => setLanguage(event.target.value)

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
                <div className='toolbar'>
                    <LanguageDropdown
                        onChange={onLanguageChange}
                    />
                    <FavoritesFilterButton
                        showOnlyFavorites={onlyFavorites}
                        favorites={favorites}
                        toggleOnlyFavorites={toggleOnlyFavorites}
                    />
                </div>
                <RepositoryWrapper
                    language={language}
                    showOnlyFavorites={onlyFavorites}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                />
            </main>
        </>
    )
}

export default App
