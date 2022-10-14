import fetch from 'cross-fetch'
import { useQuery } from "@tanstack/react-query"
import { YearMonthDayString } from '../dates'

export const GitHubApi = {
    searchRepos: 'https://api.github.com/search/repositories'
}

type ApiResponse = {
    items: Repository[]
}

export type Repository = {
    name: string
    description: string
    html_url: string
    stargazers_count: number
}

const buildUrl = (createdAfter: YearMonthDayString) =>
    `${GitHubApi.searchRepos}?q=created:>${createdAfter}&sort=stars&order=desc`

export const useGitHubRepo = (createdAfter: YearMonthDayString) =>
    useQuery<ApiResponse>(['repos', {date: createdAfter}], () =>
        fetch(buildUrl(createdAfter))
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error (status ${res.status})`)
                }
                return res.json()
            })
    )
