import './Repositories.css'
import { Repository } from './data/github'
import { useLocalStorage } from './hooks/LocalStorage'
import RepositoryCard from './RepositoryCard'

export type Favorites = number[]

type RepositoriesProps = {
    showOnlyFavorites: boolean
    repositories: Repository[]
}

const Repositories =
    ({ showOnlyFavorites, repositories }: RepositoriesProps) => {
        const [favorites, setFavorites] = useLocalStorage<Favorites>('favorites', [])

        const toggleFavorite = (id: number) => {
            if (favorites.includes(id)) {
                setFavorites(favorites.filter(fav => fav !== id))
            } else {
                setFavorites([...favorites, id])
            }
        }

        const filteredRepositories = showOnlyFavorites
            ? repositories.filter(repo => favorites.includes(repo.id))
            : repositories

        return (
            <div className='repo-container'>
                {filteredRepositories.map(repo =>
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