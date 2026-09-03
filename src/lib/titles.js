import { profile } from '../content/profile.js'

// Page <title>s derive from the content model, so a paste-in re-titles the
// whole site without touching a component.
export const homeTitle = () => `${profile.name} · ${profile.title}`

export const sectionTitle = (section) => `${section} · ${profile.name}`
