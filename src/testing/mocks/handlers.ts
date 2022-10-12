import { rest } from 'msw'
import { response } from './github-repo-response'

export const handlers = [
    rest.get('https://api.github.com/search/repositories', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json(response))
    })
]
