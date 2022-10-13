import { Repository } from "./data/github";

const Repositories = ({ repositories }: { repositories: Repository[] }) =>
    <ul>
        {repositories.map(repo => <Repo repo={repo} key={repo.name} />)}
    </ul>

const Repo = ({ repo }: { repo: Repository }) =>
    <li>{repo.name} ({repo.stargazers_count} ⭐s)</li>

export default Repositories