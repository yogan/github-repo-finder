import { Repository } from '../data/github'

type FavoritesFilterButtonProps = {
    showOnlyFavorites: boolean
    favorites: Repository['id'][]
    toggleOnlyFavorites: () => void
}

const FavoritesFilterButton =
    ({ showOnlyFavorites, favorites, toggleOnlyFavorites }: FavoritesFilterButtonProps) =>
        <button
            onClick={() => toggleOnlyFavorites()}
            disabled={favorites.length === 0}
            title={favorites.length === 0
                ? 'Set some favorites first'
                : ''
            }
        >
            {showOnlyFavorites
                ? 'Show all repositories'
                : `Show only favorites (${favorites.length})`}
        </button>

export default FavoritesFilterButton