import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Projects from './pages/Projects.jsx'
import Writing from './pages/Writing.jsx'
import WritingPost from './pages/WritingPost.jsx'
import Contact from './pages/Contact.jsx'

// Route table — main.jsx supplies the router (tests use MemoryRouter).
// The catch-all 404 route lands with the NotFound page.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/writing" element={<Writing />} />
        <Route path="/writing/:slug" element={<WritingPost />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  )
}
