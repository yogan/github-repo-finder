import reactLogo from './assets/react.svg'
import './App.css'
import Repos from './Repos'

function App() {
  return (
    <>
      <header>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <h1>GitHub Repository Finder</h1>
      </header>
      <main>
        <Repos />
      </main>
    </>
  )
}

export default App
