import { FormDataUnion, isProfessionalForm } from '@/types/forms';

export const mapFormToApi = (formData: FormDataUnion) => {
  const baseMapping = {
    studentName: formData.personal.name ?? '',
    email: formData.contact.email ?? '',
    contactNumber: formData.contact.phone ?? '',
    fatherName: formData.family.fatherOccupation ?? '',
    motherName: formData.family.motherOccupation ?? '',
    addressLine1: formData.address.address ?? '',
    city: formData.address.place ?? '',
    district: formData.address.district ?? '',
    taluk: formData.address.taluk ?? '',
    zipCode: formData.address.pincode ?? '',
    marksCard: formData.documents.marksCard ?? null,
    aadhaar: formData.documents.aadhaar ?? null,
    incomeCert: formData.documents.incomeCert ?? null,
  };

  if (isProfessionalForm(formData)) {
    return {
      ...baseMapping,
      scholarshipCategory: formData.category.scholarshipCategory ?? '',
      courseType: formData.category.courseType ?? '',
      puPercentage: formData.academic.puPercentage ?? 0,
      course: formData.academic.course ?? '',
      collegeName: formData.academic.collegeName ?? '',
      collegeType: formData.academic.collegeType ?? 'Government',
      annualCollegeFees: formData.academic.annualCollegeFees ?? 0,
      bankName: formData.bank.bankName ?? '',
      accountNumber: formData.bank.accountNumber ?? '',
      ifscCode: formData.bank.ifscCode ?? '',
      accountHolderName: formData.bank.accountHolderName ?? '',
      branchName: formData.bank.branchName ?? '',
    };
  }

  // PUC form - return base mapping only
  return baseMapping;
};
