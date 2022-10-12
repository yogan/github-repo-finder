import { expect, it } from 'vitest'
import { render, screen, waitForElementToBeRemoved, within } from './testing/utils'
import App from './App'
import { response as mockedGitHubResponse } from './testing/mocks/github-repo-response'

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