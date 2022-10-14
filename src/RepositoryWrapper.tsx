import { useGitHubRepo } from './data/github'
import { oneWeekAgo } from './dates'
import Repositories from './Repositories'

type RepositoryWrapperProps = {
    showOnlyFavorites: boolean
}

function RepositoryWrapper({ showOnlyFavorites }: RepositoryWrapperProps) {
    const repoQuery = useGitHubRepo(oneWeekAgo())

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
