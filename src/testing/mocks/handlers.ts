import { rest } from 'msw'
import { GitHubApi } from '../../data/github'
import { fakeRepoResponse } from './github-repo-response'

export const handlers = [
    rest.get(GitHubApi.searchRepos, (req, res, ctx) => {
        const query = req.url.searchParams.get('q') || ''
        const queries = query.split(' ').map(q => q.split(':'))
        const lang = queries.find(q => q[0] === 'language')

        let items = [...fakeRepoResponse.items]

        if (lang) {
            items = items.filter(i => i.language?.toLowerCase() === lang[1])
        }

        const body = { ...fakeRepoResponse, items }

        return res(ctx.status(200), ctx.json(body))
    })
]
