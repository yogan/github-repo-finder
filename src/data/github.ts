import fetch from 'cross-fetch'
import { useQuery } from "@tanstack/react-query"

export const GitHubApi = {
    searchRepos: 'https://api.github.com/search/repositories'
}

type ApiResponse = {
    items: Repository[]
}

export type Repository = {
    name: string
    stargazers_count: number
}

// TODO: pass current year/month
const PARAMS = 'q=created:>2022-10-01&sort=stars&order=desc'

export const useGitHubRepo = () =>
    useQuery<ApiResponse>(['repos'], () =>
        fetch(`${GitHubApi.searchRepos}?${PARAMS}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error (status ${res.status})`)
                }
                return res.json()
            })
    )
