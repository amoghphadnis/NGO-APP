export interface LegalSection {
  title: string;
  content: string;
}

// TODO: Replace with API integration in future
// Fetch from backend endpoint and cache locally for offline access
export const TERMS_CONTENT: LegalSection[] = [
  {
    title: 'Terms & Conditions',
    content: 'Effective Date: 13th JUNE 2026\nLast Updated: 13th JUNE 2026',
  },
  {
    title: '1. Acceptance of Terms',
    content: 'By downloading, installing, or using Vidya Poshak APP or Portal, you agree to be bound by these Terms & Conditions. If you do not agree, please uninstall and discontinue use immediately.',
  },
  {
    title: '2. Eligibility',
    content: 'You must be at least 16 years old to use this application. If under 16, you must have parental/guardian consent. Or representative from Vidya Poshak',
  },
  {
    title: '3. License to Use',
    content: 'We grant you a limited, non-exclusive, non-transferable license to use the app for personal, non-commercial purposes, subject to these terms.',
  },
  {
    title: '4. User Responsibilities',
    content: 'You agree not to:\n• Use the app for unlawful purposes.\n• Attempt to reverse-engineer, modify, or hack the app.\n• Upload harmful or malicious content.',
  },
  {
    title: '5. Intellectual Property',
    content: 'All content, trademarks, and code in the app are owned by Vidya Poshak and protected by applicable laws.',
  },
  {
    title: '6. In-App Purchases & Payments',
    content: 'If applicable, all purchases are processed via the app store\'s payment system. Refunds follow the store\'s policies.',
  },
  {
    title: '7. Termination',
    content: 'We may suspend or terminate your access if you violate these terms.',
  },
  {
    title: '8. Limitation of Liability',
    content: 'We are not liable for any indirect, incidental, or consequential damages arising from your use of the app.',
  },
  {
    title: '9. Changes to Terms',
    content: 'We may update these terms at any time. Continued use after changes means you accept the updated terms.',
  },
];

// TODO: Replace with API integration in future
// Fetch from backend endpoint and cache locally for offline access
export const PRIVACY_CONTENT: LegalSection[] = [
  {
    title: 'Privacy Policy',
    content: 'Effective Date: 13th JUNE 2026\nLast Updated: 13th JUNE 2026',
  },
  {
    title: '1. Information We Collect',
    content: '• Personal Data: Name, email, phone.\n• Usage Data: Device type, IP address, app activity.\n• Optional Data: Location (only if you grant permission).\n• Other relevant PI as required.',
  },
  {
    title: '2. How We Use Your Data',
    content: '• To provide and improve the opportunity.\n• To personalize student and volunteer experience.\n• To send important updates or notifications.',
  },
  {
    title: '3. Data Sharing',
    content: 'We do not sell your personal data. We collect for the effective benefits for the community and Students.',
  },
  {
    title: '4. Data Security',
    content: 'We use encryption and secure servers to protect your data, but no method is 100% secure.',
  },
  {
    title: '5. Your Rights',
    content: 'You may request access, correction, or deletion of your personal data by contacting Vidya Poshak and its representative.',
  },
  {
    title: '6. Cookies & Tracking',
    content: 'We may use cookies or similar technologies to improve app performance and analytics.',
  },
  {
    title: '7. Children\'s Privacy',
    content: 'We do not knowingly collect data from children under 16 without parental consent.',
  },
  {
    title: '8. Changes to Privacy Policy',
    content: 'We may update this policy. Continued use after updates means you accept the changes.',
  },
];
