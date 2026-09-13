export const timelineYears = [2026, 2023, 2021, 2020, 2016]

// Null months preserve year-only precision. Entries are in start-date order.
export const timeline = [
  {
    id: 'howard', category: 'Education', company: 'HOWARD UNIVERSITY',
    role: 'B.B.A. International Business', period: '2016–May 2020',
    description: 'Minor in French',
    startYear: 2016, startMonth: null, endYear: 2020, endMonth: 5,
  },
  {
    id: 'bnp-analyst', category: 'Work', company: 'BNP PARIBAS',
    role: 'Global Markets Analyst', period: 'Jul 2020–Jul 2021',
    description: 'Product Development · Electronic Execution · Prime Services',
    startYear: 2020, startMonth: 7, endYear: 2021, endMonth: 7,
  },
  {
    id: 'columbia', category: 'Education', company: 'COLUMBIA UNIVERSITY',
    role: 'M.S. Applied Analytics', period: '2021–Feb 2023',
    description: 'Analytics · Data Systems · Frameworks',
    startYear: 2021, startMonth: null, endYear: 2023, endMonth: 2,
  },
  {
    id: 'paypal-analyst', category: 'Work', company: 'PAYPAL / BRAINTREE',
    role: 'Data Analyst', period: '2023–Feb 2026',
    description: 'Risk analytics, transaction data, and analytical infrastructure.',
    detail: 'Python · SQL',
    startYear: 2023, startMonth: null, endYear: 2026, endMonth: 2,
  },
  {
    id: 'paypal-engineer', category: 'Work', company: 'PAYPAL / BRAINTREE',
    role: 'Software Engineer, Data Engineering', period: 'Feb 2026–2026',
    description: 'Production data systems supporting risk and fraud workflows.',
    detail: 'Python · SQL · BigQuery · CI/CD',
    startYear: 2026, startMonth: 2, endYear: 2026, endMonth: null,
    ongoing: true,
  },
]
