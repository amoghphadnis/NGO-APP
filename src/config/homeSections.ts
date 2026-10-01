import { Ionicons } from '@expo/vector-icons';

export type HomeFormType = 'professional' | 'puc' | 'semiProfessional';

export interface ScholarshipCardItem {
  id: string;
  title: string;
  formType: HomeFormType;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  description: string;
  benefits: string[];
}

export interface RenewalCardItem {
  id: string;
  title: string;
  route: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  description: string;
}

export interface HomeSection {
  id: string;
  title: string;
  subtitle: string;
  accent?: 'primary' | 'success';
  items: ScholarshipCardItem[] | RenewalCardItem[];
}

export const homeSections: HomeSection[] = [
  {
    id: 'new-scholarships',
    title: 'Apply for a New Scholarship',
    subtitle: 'Choose the scholarship that matches your education.',
    accent: 'primary',
    items: [
      {
        id: 'professional',
        title: 'Professional',
        formType: 'professional',
        icon: 'briefcase-outline',
        description: 'For professional courses like Engineering, Medicine, Architecture',
        benefits: ['Higher amounts', 'Merit-based', 'Course verification'],
      },
      {
        id: 'puc',
        title: 'PUC-I',
        formType: 'puc',
        icon: 'school-outline',
        description: 'For students in Pre-University College (11th & 12th grade)',
        benefits: ['Foundation scholarship', 'Academic based', 'Stream benefits'],
      },
      {
        id: 'semi-professional',
        title: 'Semi Professional',
        formType: 'semiProfessional',
        icon: 'medkit-outline',
        description: 'For B.Sc Nursing, GNM, Physiotherapy, Agriculture, Veterinary, Horticulture and similar courses',
        benefits: ['Nursing & Agriculture', 'Need-based', 'Document verification'],
      },

    ],
  },
];
