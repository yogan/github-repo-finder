import { Repository } from './data/github'
import FavoriteButton from './FavoriteButton'
import { Favorites } from './Repositories'

type RepositoryCardProps = {
    repo: Repository
    favorites: Favorites
    toggleFavorite: (id: number) => void
}

const RepositoryCard =
    ({ repo, favorites, toggleFavorite }: RepositoryCardProps) => {

        const isFavorite = favorites.includes(repo.id)

        return (
            <div className='repo-card' data-testid='repository'>
                <div>
                    <h2 title={repo.name}>
                        <a href={repo.html_url}>{repo.name}</a>
                    </h2>
                    <h3>⭐ {repo.stargazers_count}</h3>
                    <p>{repo.description}</p>
                </div>
                <div className='bottom'>
                    <FavoriteButton
                        id={repo.id}
                        isFavorite={isFavorite}
                        toggleFavorite={toggleFavorite}
                    />
                </div>
            </div>
        )
    }

export default RepositoryCard