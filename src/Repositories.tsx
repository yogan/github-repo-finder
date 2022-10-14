import './Repositories.css'
import { Repository } from './data/github'
import { useLocalStorage } from './hooks/LocalStorage'
import RepositoryCard from './RepositoryCard'

export type Favorites = number[]

const Repositories = ({ repositories }: { repositories: Repository[] }) => {
    const [favorites, setFavorites] = useLocalStorage<Favorites>('favorites', [])

    const toggleFavorite = (id: number) => {
        if (favorites.includes(id)) {
            setFavorites(favorites.filter(fav => fav !== id))
        } else {
            setFavorites([...favorites, id])
        }
    }

    return (
        <div className='repo-container'>
            {repositories.map(repo =>
                <RepositoryCard
                    key={repo.name}
                    repo={repo}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                />)
            }
        </div>
    )
}

export default Repositories