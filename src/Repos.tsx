import fetch from 'cross-fetch'
import { useEffect, useState } from "react"
import { GitHubApi } from './constants'

// TODO: pass current year/month
const PARAMS = 'q=created:>2022-10-01&sort=stars&order=desc'

type ApiResponse = {
    items: Repository[]
}

type Repository = {
    name: string
    stargazers_count: number
}

function Repos() {
    const [data, setData] = useState<Repository[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch(`${GitHubApi.searchRepos}?${PARAMS}`)
                if (!response.ok) {
                    throw new Error(`HTTP error (status ${response.status})`)
                }
                const json = await response.json() as unknown as ApiResponse
                setData(json.items)
                // console.log(json.items)
            } catch (err) {
                setError((err as Error).message)
                setData([])
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    return (
        <>
            {data.length > 0
                ? <ul>{data.map(d => <Repo repo={d} key={d.name} />)}</ul>
                : null
            }

            {loading
                ? <span data-testid="loading-indicator">Loading…</span>
                : null}

            {error !== null
                ? <span data-testid="api-error-repos">Could not load repositories. 😢</span>
                : null
            }
        </>
    )
}

const Repo = ({ repo }: { repo: Repository }) =>
    <li>{repo.name} ({repo.stargazers_count} ⭐s)</li>

export default Repos