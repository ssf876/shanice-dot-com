import { NavLink, Outlet } from 'react-router-dom'
import { profile } from '../content/profile.js'

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/writing', label: 'Writing' },
  { to: '/contact', label: 'Contact' },
]

// Shared chrome for every route: skip link, header nav, routed page, footer.
export default function Layout() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <nav className="site-nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main id="main-content" className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <ul className="social-links">
          {profile.socials.map((social) => (
            <li key={social.url}>
              <a href={social.url}>{social.label}</a>
            </li>
          ))}
        </ul>
      </footer>
    </>
  )
}
