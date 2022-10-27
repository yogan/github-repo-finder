import fetch from 'cross-fetch'
import { useQuery } from "@tanstack/react-query"
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

export const useGitHubRepo = (createdAfter: YearMonthDayString, language: string) =>
    useQuery<ApiResponse>(['repos', language, {date: createdAfter}], () =>
        fetch(buildUrl(createdAfter, language))
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error (status ${res.status})`)
                }
                return res.json()
            })
    )
