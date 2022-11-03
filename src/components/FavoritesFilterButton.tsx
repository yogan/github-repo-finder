import { Repository } from '../data/github'

type FavoritesFilterButtonProps = {
    showOnlyFavorites: boolean
    favorites: Repository['id'][]
    toggleOnlyFavorites: () => void
}

const FavoritesFilterButton =
    ({ showOnlyFavorites, favorites, toggleOnlyFavorites }: FavoritesFilterButtonProps) =>
        <button onClick={() => toggleOnlyFavorites()}>
            {showOnlyFavorites
                ? 'Show all repositories'
                : `Show only favorites (${favorites.length})`}
        </button>

export default FavoritesFilterButton