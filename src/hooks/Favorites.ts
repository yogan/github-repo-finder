import { Favorites } from '../components/Repositories'
import { useLocalStorage } from './LocalStorage'

export function useFavorites() {
    const [favorites, setFavorites] = useLocalStorage<Favorites>('favorites', [])

    const toggleFavorite = (id: number) => {
        if (favorites.includes(id)) {
            setFavorites(favorites.filter(fav => fav !== id))
        } else {
            setFavorites([...favorites, id])
        }
    }

    return [favorites, toggleFavorite] as const
}