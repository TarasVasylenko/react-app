import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import { createContext, useContext } from 'react'
import reactLogo from './assets/react.svg'

import ToDo from './components/ToDo';

const AppContext = createContext(null)

function useAppContext() {
  const value = useContext(AppContext)
  return value
}

function Home() {
  const { appName, description } = useAppContext()

  return (
    <div>
      <h2>Home</h2>
      <p>Welcome to the Home page of this simple React Router example.</p>
      <div className="page-meta">
        <strong>{appName}</strong> – {description.home}
      </div>
    </div>
  )
}

function About() {
  const { appName, description } = useAppContext()

  return (
    <div>
      <h2>About</h2>
      <p>This page contains some information about this demo application.</p>
      <div className="page-meta">
        <strong>{appName}</strong> – {description.about}
      </div>
    </div>
  )
}

function Contacts() {
  const { appName, description, contactEmail } = useAppContext()

  return (
    <div>
      <h2>Contacts</h2>
      <p>You can reach us at contact@example.com.</p>
      <div className="page-meta">
        <strong>{appName}</strong> – {description.contacts} Email: {contactEmail}
      </div>
    </div>
  )
}


function App() {
  const contextValue = {
    appName: 'My React Router App',
    contactEmail: 'contact@example.com',
    description: {
      home: 'Shared app context shown on the Home page.',
      about: 'This text also comes from the shared React context.',
      contacts: 'All pages read from the same context object.',
    },
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="App">
        <header>
          <div className="header-left">
            <img src={reactLogo} className="header-logo" alt="React logo" />
            <h1>My React Router App</h1>
          </div>
          <nav>
              <ul>
                  <li>
                      <Link to="/">Home</Link>
                  </li>
                  <li>
                      <Link to="/about">About</Link>
                  </li>
                  <li>
                      <Link to="/contacts">Contacts</Link>
                  </li>
                  <li>
                      <Link to="/todo">ToDo</Link>
                  </li>
              </ul>
          </nav>
        </header>

          <main>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/todo" element={<ToDo />} />
              </Routes>
        </main>
      </div>
    </AppContext.Provider>
  )
}

export default App
