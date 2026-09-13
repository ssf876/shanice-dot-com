// Content validators return field-level errors for required public content.

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim() !== ''

const isNonEmptyStringArray = (value) =>
  Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString)

const isHttpUrl = (value) =>
  typeof value === 'string' && /^https?:\/\/\S+$/.test(value)

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
  return errors
}

export function validateProject(project, index = 0) {
  if (project === null || typeof project !== 'object') {
    return [`projects[${index}] must be an object`]
  }
  const errors = []
  requireString(errors, `projects[${index}].title`, project.title)
  requireString(errors, `projects[${index}].tagline`, project.tagline)
  requireString(errors, `projects[${index}].summary`, project.summary)
  requireStringArray(errors, `projects[${index}].body`, project.body)
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
