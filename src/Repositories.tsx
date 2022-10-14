import './Repositories.css'
import { Repository } from './data/github'

const Repositories = ({ repositories }: { repositories: Repository[] }) =>
    <div className='repo-container'>
        {repositories.map(repo => <Repo repo={repo} key={repo.name} />)}
    </div>

const Repo = ({ repo }: { repo: Repository }) =>
    <div className='repo-card' data-testid='repository'>
        <div>

            <h2 title={repo.name}>
                <a href={repo.html_url}>{repo.name}</a>
            </h2>
            <h3>⭐ {repo.stargazers_count}</h3>
            <p>{repo.description}</p>
        </div>
        <div className='bottom'>
            <button>❤️ Mark as favorite</button>
        </div>
    </div>

export default Repositories