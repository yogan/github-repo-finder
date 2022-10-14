import { rest } from 'msw'
import { beforeEach, expect, it } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, UserEvent, userEvent, waitFor, waitForElementToBeRemoved, within } from '../testing/utils'
import { fakeRepoResponse } from '../testing/mocks/github-repo-response'
import { server } from '../testing/mocks/server'
import { GitHubApi } from '../data/github'
import App from './App'

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

        expect(button.textContent).toContain('Remove favorite')
    })

    await Promise.all(testAllRepos)
})

const clickOnFavoriteButton = async (user: UserEvent, card: HTMLElement) =>
    await user.click(within(card).getByRole('button', { name: /favorite/i }))

it('Should have a button to toggle between favorite and all repos', async () => {
    const user = userEvent.setup()
    render(createApp())

    await waitForElementToBeRemoved(queryLoadingIndicator)

    const repos = await findRepoCards()
    expect(repos.length).toBe(fakeRepoResponse.items.length)

    // mark three repositories as favorites
    await clickOnFavoriteButton(user, repos[0])
    await clickOnFavoriteButton(user, repos[1])
    await clickOnFavoriteButton(user, repos[4])

    const toggleFavsOnlyButton =
        screen.getByRole('button', { name: 'Show only favorites' })

    await user.click(toggleFavsOnlyButton)

    // after being clicked, the button shall change its text
    expect(toggleFavsOnlyButton.textContent).toBe('Show all repositories')

    const filteredRepos = await findRepoCards()
    expect(filteredRepos.length).toBe(3) // only favorites visible

    // remove first repository from favorites
    await clickOnFavoriteButton(user, filteredRepos[0])

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