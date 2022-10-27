import { rest } from 'msw'
import { beforeEach, expect, it } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, UserEvent, userEvent, waitFor, waitForElementToBeRemoved, within } from '../testing/utils'
import { fakeRepoResponse } from '../testing/mocks/github-repo-response'
import { server } from '../testing/mocks/server'
import { GitHubApi } from '../data/github'
import { languageOptions } from './LanguageDropdown'
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

it('Should show repository cards with properties and the description', async () => {
    const user = userEvent.setup()
    render(createApp())

    await waitForElementToBeRemoved(queryLoadingIndicator)

    const repos = await findRepoCards()
    expect(repos.length).toBe(fakeRepoResponse.items.length)

    const testAllRepos = repos.map(async (repo) => {
        const repoName = within(repo).getByRole('heading').textContent
        const repoFromApi = fakeRepoResponse.items.find(repo => repo.name === repoName)

        const stars = within(repo).getByTestId('repo-stars')
        expect(stars.textContent).toContain(repoFromApi?.stargazers_count)

        if (repoFromApi?.language) {
            const language = within(repo).getByTestId('repo-language')
            expect(language.textContent).toContain(repoFromApi.language)
        } else {
            // don't render the item if no language set
            const language = within(repo).queryByTestId('repo-language')
            expect(language).toBeNull()
        }

        if (repoFromApi?.description) {
            const description = within(repo).getByTestId('repo-description')
            expect(description.textContent).toBe(repoFromApi?.description)
        } else {
            // don't render the item if no description set
            const description = within(repo).queryByTestId('repo-description')
            expect(description).toBeNull()
        }
    })

    await Promise.all(testAllRepos)
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

it('Should have a dropdown to optionally filter for a language', async () => {
    render(createApp())

    const dropdown = screen.getByLabelText(/Language filter/)

    const options = within(dropdown).getAllByRole('option')
    expect(options.length).toBe(languageOptions.length)

    const selectedOption = within(dropdown).getByRole('option',
        { name: /Any language/ }) as HTMLOptionElement
    expect(selectedOption.selected).toBe(true)
})

it('Should only show repositories matching the selected language', async () => {
    const numberOfAllRepos = fakeRepoResponse.items.length
    const user = userEvent.setup()
    render(createApp())

    const dropdown = screen.getByLabelText(/Language filter/)

    await waitForElementToBeRemoved(queryLoadingIndicator)

    const allRepos = await findRepoCards()
    expect(allRepos.length).toBe(numberOfAllRepos)

    // show only Python repos
    await user.selectOptions(dropdown, 'Python')

    const pythonRepos = await findRepoCards()
    expect(pythonRepos.length).toBeLessThan(numberOfAllRepos)

    pythonRepos.forEach((repo) => {
        const language = within(repo).getByTestId('repo-language')
        expect(language.textContent).toContain('Python')
    })

    // show only TypeScript repos
    await user.selectOptions(dropdown, 'TypeScript')

    const tsRepos = await findRepoCards()
    expect(tsRepos.length).toBeLessThan(numberOfAllRepos)

    tsRepos.forEach((repo) => {
        const language = within(repo).getByTestId('repo-language')
        expect(language.textContent).toContain('TypeScript')
    })

    // show all repos (any language) again
    await user.selectOptions(dropdown, screen.getByText(/Any language/))

    const allReposAgain = await findRepoCards()
    expect(allReposAgain.length).toBe(numberOfAllRepos)
})

it('Should have a button to toggle between favorite and all repos', async () => {
    const clickOnFavoriteButton = async (user: UserEvent, card: HTMLElement) =>
        await user.click(within(card).getByRole('button', { name: /favorite/i }))

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