import { Repository } from '../data/github'
import RepositoryCard from './RepositoryCard'
import './Repositories.css'

export type Favorites = number[]

type RepositoriesProps = {
    showOnlyFavorites: boolean
    favorites: Repository['id'][]
    toggleFavorite: (id: Repository['id']) => void
    repositories: Repository[]
}

const Repositories =
    ({ showOnlyFavorites, favorites, toggleFavorite, repositories }: RepositoriesProps) => {
        const filteredRepositories = showOnlyFavorites
            ? repositories.filter(repo => favorites.includes(repo.id))
            : repositories

        return (
            <div className='repo-container'>
                {filteredRepositories.map(repo =>
                    <RepositoryCard
                        key={repo.id}
                        repo={repo}
                        favorites={favorites}
                        toggleFavorite={toggleFavorite}
                    />)
                }
            </div>
        )
    }

export default Repositories