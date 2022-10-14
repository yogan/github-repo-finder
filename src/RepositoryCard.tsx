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

        const cardClass = isFavorite ? 'repo-card favorite' : 'repo-card'

        return (
            <div className={cardClass} data-testid='repository'>
                <div>
                    <h2 title={repo.full_name}>
                        <a href={repo.html_url} target="_blank">{repo.name}</a>
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