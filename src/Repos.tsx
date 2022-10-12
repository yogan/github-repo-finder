import { Repository, useGitHubRepo } from './data/github'

function Repos() {
    const repoQuery = useGitHubRepo()

    if (repoQuery.isLoading) {
        return <span data-testid="loading-indicator">Loading…</span>
    }

    if (repoQuery.isError) {
        return <span data-testid="api-error-repos">
            Could not load repositories. 😢
        </span>
    }

    return <ul>
        {repoQuery.data.items.map(d => <Repo repo={d} key={d.name} />)}
    </ul>
}

const Repo = ({ repo }: { repo: Repository }) =>
    <li>{repo.name} ({repo.stargazers_count} ⭐s)</li>

export default Repos
