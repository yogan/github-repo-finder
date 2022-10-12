import { rest } from 'msw'
import { GitHubApi } from '../../constants'
import { response } from './github-repo-response'

export const handlers = [
    rest.get(GitHubApi.searchRepos, (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json(response))
    })
]
