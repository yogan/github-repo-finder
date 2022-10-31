import fetch from 'cross-fetch'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { YearMonthDayString } from '../utils/dates'

export const GitHubApi = {
    searchRepos: 'https://api.github.com/search/repositories'
}

type ApiResponse = {
    items: Repository[]
}

export type Repository = {
    id: number
    name: string
    full_name: string
    description: string | null
    language: string | null
    html_url: string
    stargazers_count: number
}

const buildQuery = (createdAfter: YearMonthDayString, language: string) =>
    language === 'all'
        ? `created:>${createdAfter}`
        : `created:>${createdAfter}+language:${encodeURIComponent(language)}`

const buildUrl = (createdAfter: YearMonthDayString, language: string) =>
    `${GitHubApi.searchRepos}?q=${buildQuery(createdAfter, language)}&sort=stars&order=desc`

export const useGitHubRepo = (createdAfter: YearMonthDayString, language: string) => {
    const queryClient = useQueryClient()

    return useQuery<ApiResponse>(
        ['repos', language, { date: createdAfter }],
        () => fetch(buildUrl(createdAfter, language))
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error (status ${res.status})`)
                }
                return res.json()
            }),
        {
            initialData: () => {
                // We are improving UX by trying to do client-side filtering
                // of potentially already loaded repository data. If that is
                // available, we can basically instantly show this. It will be
                // replaced with the full backend result once the GitHub API
                // requests returns data.

                const allRepos = queryClient.getQueryData<ApiResponse>(
                    ['repos', 'all', { date: createdAfter }])

                if (allRepos === undefined) {
                    // There was nothing in the cache, so we'll have to wait
                    // for the "real" API request and cannot show anything yet.
                    return undefined
                }

                // We do have a result for any language repos in the cache.
                // So we filter by language within that result and return it.
                // Note that this will almost always be only a subset of the
                // real API response.
                const filteredRepos = allRepos.items
                    .filter(repo => repo.language?.toLowerCase() === language)
                    ?? []

                return {
                    ...allRepos,
                    items: filteredRepos.length > 0
                        ? filteredRepos
                        : allRepos.items
                }
            }
        }
    )
}