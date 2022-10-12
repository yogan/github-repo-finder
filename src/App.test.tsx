import { rest } from 'msw'
import { expect, it } from 'vitest'
import { render, screen, waitFor, waitForElementToBeRemoved, within } from './testing/utils'
import App from './App'
import { response as mockedGitHubResponse } from './testing/mocks/github-repo-response'
import { server } from './testing/mocks/server'
import { GitHubApi } from './constants'

it('Should show a heading', () => {
    render(<App />)

    expect(screen.getByRole(
        'heading', { name: 'GitHub Repository Finder', level: 1 })
    ).toBeDefined()
})

it('Should load and render all mocked GitHub repositories', async () => {
    render(<App />)

    await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

    const { getAllByRole } = within(await screen.findByRole('list'))
    const repos = getAllByRole("listitem")

    expect(repos.length).toBe(mockedGitHubResponse.items.length)
})

it('Should show an error message when the API is failing', async () => {
    server.resetHandlers(
        rest.get(GitHubApi.searchRepos, (_req, res, ctx) => res(ctx.status(400)))
    )

    render(<App />)

    await waitFor(() => screen.findByTestId('api-error-repos'))
})