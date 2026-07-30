export const APP_TITLES = {
  dashboard: 'Dashboard',
  applyScholarship: 'Apply Scholarship',
  renewalScholarship: 'Renewal Scholarship',
  houseVisit: 'House Visit',
  approvals: 'Approvals',
  notifications: 'Notifications',
  settings: 'Settings',
  privacyPolicy: 'Privacy Policy',
  termsAndConditions: 'Terms & Conditions',
  renewalPuc: 'Renewal PUC',
  renewalProfessional: 'Renewal Professional',
  renewalPayana: 'Renewal Payana',
  professionalApplication: 'New Professional Student Information Sheet-\n2026-2027',
  pucApplication: 'Vidya Poshak Financial Assistance Application\nfor PUC-I Commerce and Diploma-I Students\n2026-2027',
  semiProfessionalApplication: 'Vidya Poshak Financial Assistance Application\nfor Semi-Professional Students 2026-2027',
  payanaApplication: 'Payana New Student Application',
} as const;

export const DASHBOARD_MENU_SECTIONS = {
  scholarships: APP_TITLES.applyScholarship,
  renewals: APP_TITLES.renewalScholarship,
  approvals: APP_TITLES.approvals,
} as const;

export const DASHBOARD_MENU_ITEMS = {
  newScholarship: {
    label: APP_TITLES.applyScholarship,
    route: '/form-selection',
  },
  renewalPuc: {
    label: APP_TITLES.renewalPuc,
    route: '/renewal-puc',
  },
  renewalProfessional: {
    label: APP_TITLES.renewalProfessional,
    route: '/renewal-professional',
  },
  renewalPayana: {
    label: APP_TITLES.renewalPayana,
    route: '/renewal-payana',
  },
} as const;
