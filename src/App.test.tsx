import { rest } from 'msw'
import { expect, it } from 'vitest'
import { render, screen, waitFor, waitForElementToBeRemoved, within } from './testing/utils'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { fakeRepoResponse } from './testing/mocks/github-repo-response'
import { server } from './testing/mocks/server'
import { GitHubApi } from './data/github'

const createApp = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } }
    })

    return (
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    )
}

it('Should show a heading', () => {
    render(createApp())

    expect(screen.getByRole(
        'heading', { name: 'GitHub Repository Finder', level: 1 })
    ).toBeDefined()
})

it('Should load and render all mocked GitHub repositories', async () => {
    render(createApp())

    await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

    const repos = await screen.findAllByTestId('repository')
    expect(repos.length).toBe(fakeRepoResponse.items.length)
})

it('Should show a "mark as favorite" button for each repository', async () => {
    render(createApp())

    await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

    const repos = await screen.findAllByTestId('repository')

    repos.forEach(repo => {
        const button = within(repo).getByRole('button')
        expect(button.textContent).toContain('Mark as favorite')
    })
})

it('Should show an error message when the API is failing', async () => {
    server.resetHandlers(
        rest.get(GitHubApi.searchRepos, (_req, res, ctx) => res(ctx.status(400)))
    )

    render(createApp())

    await waitFor(() => screen.findByTestId('api-error-repos'))
})