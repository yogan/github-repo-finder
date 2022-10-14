import { rest } from 'msw'
import { beforeEach, expect, it } from 'vitest'
import { render, screen, userEvent, waitFor, waitForElementToBeRemoved, within } from './testing/utils'
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

// Persistency is nice for the real app, but for the tests it is good practice
// to have a well-defined starting state. Therefore we clear the local storage
// before each test case (which means starting w/o any marked favorites).
beforeEach(() => window.localStorage.clear())

const findRepoCards = async () => await screen.findAllByTestId('repository')

const queryLoadingIndicator = () => screen.queryByTestId('loading-indicator')

it('Should show a heading', () => {
    render(createApp())

    expect(screen.getByRole(
        'heading', { name: 'GitHub Repository Finder', level: 1 })
    ).toBeDefined()
})

it('Should have buttons on repo cards to mark and unmark favorites', async () => {
    const user = userEvent.setup()
    render(createApp())

    await waitForElementToBeRemoved(queryLoadingIndicator)

    const repos = await findRepoCards()

    const testAllRepos = repos.map(async (repo) => {
        const button = within(repo).getByRole('button')
        expect(button.textContent).toContain('Mark as favorite')

        await user.click(button)

        const buttonAfterClick = within(repo).getByRole('button')
        expect(buttonAfterClick.textContent).toContain('Remove favorite')
    })

    await Promise.all(testAllRepos)
})

it('Should have a button to toggle between favorite and all repos', async () => {
    const user = userEvent.setup()
    render(createApp())

    await waitForElementToBeRemoved(queryLoadingIndicator)

    const repos = await findRepoCards()
    expect(repos.length).toBe(fakeRepoResponse.items.length)

    // mark three repositories as favorites
    await user.click(within(repos[0]).getByRole('button'))
    await user.click(within(repos[1]).getByRole('button'))
    await user.click(within(repos[4]).getByRole('button'))

    const toggleFavsOnlyButton =
        screen.getByRole('button', { name: 'Show only favorites' })

    await user.click(toggleFavsOnlyButton)

    // after being clicked, the button shall change its text
    expect(toggleFavsOnlyButton.textContent).toBe('Show all repositories')

    const filteredRepos = await findRepoCards()
    expect(filteredRepos.length).toBe(3) // only favorites visible

    // remove first repository from favorites
    await user.click(within(filteredRepos[0]).getByRole('button'))

    const remainingFilteredRepos = await findRepoCards()
    expect(remainingFilteredRepos.length).toBe(2)

    await user.click(toggleFavsOnlyButton) // back to all repositories

    // after being clicked, the button shall change its text back
    expect(toggleFavsOnlyButton.textContent).toBe('Show only favorites')

    const allRepos = await findRepoCards()
    expect(allRepos.length).toBe(fakeRepoResponse.items.length) // all repos again
})

it('Should show an error message when the API is failing', async () => {
    server.resetHandlers(
        rest.get(GitHubApi.searchRepos, (_req, res, ctx) => res(ctx.status(400)))
    )

    render(createApp())

    await waitFor(() => screen.findByTestId('api-error-repos'))
})