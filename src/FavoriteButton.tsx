type FavoriteButtonProps = {
    id: number
    isFavorite: boolean
    toggleFavorite: (id: number) => void
}
const FavoriteButton =
    ({ id, isFavorite, toggleFavorite }: FavoriteButtonProps) =>
        <button onClick={() => toggleFavorite(id)}>
            {isFavorite
                ? '🖤 Remove favorite'
                : '❤️ Mark as favorite'}
        </button>

export default FavoriteButton