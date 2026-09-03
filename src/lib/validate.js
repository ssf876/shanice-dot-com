// Paste-in contract validators (spec: "Content model — the paste-in contract").
// Each validator returns an array of human-readable error strings; an empty array
// means the content satisfies the contract. Placeholder text passes by design —
// a missing or emptied required field must fail CI, not the live site.

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim() !== ''

const isNonEmptyStringArray = (value) =>
  Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString)

const isHttpUrl = (value) =>
  typeof value === 'string' && /^https?:\/\/\S+$/.test(value)

// Enough of an email shape to catch a paste-in typo — not a full RFC 5322 parser.
const isEmailShaped = (value) =>
  isNonEmptyString(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

// YAML dates may arrive as strings or Date objects depending on quoting.
const isDateShaped = (value) =>
  value instanceof Date
    ? !Number.isNaN(value.getTime())
    : isNonEmptyString(value) && !Number.isNaN(new Date(value).getTime())

function requireString(errors, field, value) {
  if (!isNonEmptyString(value)) errors.push(`${field} is missing or empty`)
}

function requireStringArray(errors, field, value) {
  if (!isNonEmptyStringArray(value)) {
    errors.push(`${field} must be a non-empty array of non-empty strings`)
  }
}

// url and repo are optional per the contract — a value that IS present must be a link.
function optionalHttpUrl(errors, field, value) {
  if (value === undefined || value === null || value === '') return
  if (!isHttpUrl(value)) {
    errors.push(`${field} must be an http(s) URL or left empty`)
  }
}

export function validateProfile(profile) {
  if (profile === null || typeof profile !== 'object') {
    return ['profile must be an object']
  }
  const errors = []
  requireString(errors, 'profile.name', profile.name)
  requireString(errors, 'profile.title', profile.title)
  if (!isEmailShaped(profile.email)) {
    errors.push('profile.email is missing or not a valid email address')
  }
  if (!Array.isArray(profile.socials) || profile.socials.length === 0) {
    errors.push('profile.socials must be a non-empty array')
  } else {
    profile.socials.forEach((social, index) => {
      requireString(errors, `profile.socials[${index}].label`, social?.label)
      if (!isHttpUrl(social?.url)) {
        errors.push(`profile.socials[${index}].url must be an http(s) URL`)
      }
    })
  }
  requireStringArray(errors, 'profile.bio', profile.bio)
  requireStringArray(errors, 'profile.ama', profile.ama)
  if (!Array.isArray(profile.experience) || profile.experience.length === 0) {
    errors.push('profile.experience must be a non-empty array')
  } else {
    profile.experience.forEach((job, index) => {
      requireString(errors, `profile.experience[${index}].role`, job?.role)
      requireString(errors, `profile.experience[${index}].company`, job?.company)
      requireString(errors, `profile.experience[${index}].period`, job?.period)
      requireStringArray(
        errors,
        `profile.experience[${index}].highlights`,
        job?.highlights,
      )
    })
  }
  return errors
}

export function validateProject(project, index = 0) {
  if (project === null || typeof project !== 'object') {
    return [`projects[${index}] must be an object`]
  }
  const errors = []
  requireString(errors, `projects[${index}].title`, project.title)
  requireString(errors, `projects[${index}].tagline`, project.tagline)
  requireStringArray(errors, `projects[${index}].tech`, project.tech)
  if (typeof project.highlight !== 'boolean') {
    errors.push(`projects[${index}].highlight must be a boolean`)
  }
  optionalHttpUrl(errors, `projects[${index}].url`, project.url)
  optionalHttpUrl(errors, `projects[${index}].repo`, project.repo)
  return errors
}

export function validatePost(post) {
  if (post === null || typeof post !== 'object') {
    return ['post must be an object']
  }
  const errors = []
  requireString(errors, 'post.title', post.title)
  if (!isDateShaped(post.date)) {
    errors.push('post.date is missing or not a parseable date')
  }
  requireString(errors, 'post.description', post.description)
  requireStringArray(errors, 'post.tags', post.tags)
  return errors
}
