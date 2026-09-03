// Paste-in contract (spec: "Content model — the paste-in contract"): every word of
// copy lives in src/content/ — Shanice edits these files, never a component.
// Values below are clearly labeled placeholders; the validation test
// (src/test/content-validation.test.js) fails CI when a required field is missing
// or empty, so a typo'd paste never ships silently.

export const profile = {
  name: 'Shanice Sinclair',
  title: 'Software Engineer', // paste-in confirms: vs. "Data Analyst"
  email: 'shanice.s.sinclair@gmail.com',
  socials: [{ label: 'GitHub', url: 'https://github.com/ssf876' }],
  bio: ['Paste first bio paragraph here.', 'Paste second paragraph here.'],
  experience: [
    {
      role: 'Paste role here — e.g. Data Analyst',
      company: 'Paste company here',
      period: 'Paste period here — e.g. 2022 – present',
      highlights: ['Paste one highlight per line — metrics over duties.'],
    },
  ],
  ama: ['Ask me about moving from data analysis into engineering.'],
}
