import { useGitHubRepo } from '../data/github'
import { oneWeekAgo } from '../utils/dates'
import Repositories from './Repositories'

type RepositoryWrapperProps = {
    language: string
    showOnlyFavorites: boolean
}

function RepositoryWrapper({ language, showOnlyFavorites }: RepositoryWrapperProps) {
    const repoQuery = useGitHubRepo(oneWeekAgo(), language)

    if (repoQuery.isLoading) {
        return <span data-testid="loading-indicator">Loading…</span>
    }

    if (repoQuery.isError) {
        return <span data-testid="api-error-repos">
            Could not load repositories. 😢
        </span>
    }

    return (
        <Repositories
            showOnlyFavorites={showOnlyFavorites}
            repositories={repoQuery.data.items}
        />
    )
}

export default RepositoryWrapper
