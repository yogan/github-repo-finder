type FavoritesFilterButtonProps = {
    showOnlyFavorites: boolean
    toggleOnlyFavorites: () => void
}

const FavoritesFilterButton =
    ({ showOnlyFavorites, toggleOnlyFavorites }: FavoritesFilterButtonProps) =>
        <button onClick={() => toggleOnlyFavorites()}>
            {showOnlyFavorites
                ? 'Show all repositories'
                : 'Show only favorites'}
        </button>

export default FavoritesFilterButton