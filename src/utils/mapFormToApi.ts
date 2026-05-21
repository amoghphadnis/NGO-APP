import { FormDataUnion, isProfessionalForm, isPUCForm } from '@/types/forms';

export const mapFormToApi = (formData: FormDataUnion) => {
  if (isProfessionalForm(formData)) {
    return {
      studentName: formData.personal.name ?? '',
      email: formData.contact.email ?? '',
      contactNumber: formData.contact.phone ?? '',
      fatherName: formData.family.fatherOccupationID ?? '',
      motherName: formData.family.motherOccupationID ?? '',
      addressLine1: formData.address.address ?? '',
      city: formData.address.place ?? '',
      district: formData.address.district ?? '',
      taluk: formData.address.taluk ?? '',
      zipCode: formData.address.pincode ?? '',
      marksCard: formData.documents.marksCard ?? null,
      aadhaar: formData.documents.aadhaar ?? null,
      incomeCert: formData.documents.incomeCert ?? null,
      puPercentage: formData.academic.puPercentage ?? 0,
      courseTypeID: formData.academic.courseTypeID ?? '',
      collegeName: formData.academic.collegeName ?? '',
      collegeTypeID: formData.academic.collegeTypeID ?? '1',
      collegeFees: formData.academic.collegeFees ?? 0,
      bankName: formData.bank.bankName ?? '',
      accountNumber: formData.bank.accountNumber ?? '',
      ifscCode: formData.bank.ifscCode ?? '',
      accountHolderName: formData.bank.accountHolderName ?? '',
      branchName: formData.bank.branchName ?? '',
    };
  }

  if (isPUCForm(formData)) {
    return {
      studentName: formData.personal.name ?? '',
      email: formData.contact.email ?? '',
      contactNumber: formData.contact.phone ?? '',
      fatherName: formData.family.fatherName ?? '',
      motherName: formData.family.motherName ?? '',
      addressLine1: formData.address.address ?? '',
      city: formData.address.place ?? '',
      district: formData.address.district ?? '',
      taluk: formData.address.taluk ?? '',
      zipCode: formData.address.pincode ?? '',
      caste: formData.category.caste ?? '',
      houseType: formData.category.houseType ?? '',
      monthlyRent: formData.category.monthlyRent ?? '',
      referenceSource: formData.category.referenceSource ?? '',
      course: formData.academic.course ?? '',
      collegeName: formData.academic.collegeName ?? '',
      collegeType: formData.academic.collegeType ?? '',
      expectedFees: formData.academic.expectedFees ?? 0,
      percentage: formData.academic.percentage ?? 0,
      totalMarks: formData.academic.totalMarks ?? 0,
      sslcMarksCard: formData.documents.sslcMarksCard ?? null,
      studentPhoto: formData.documents.studentPhoto ?? null,
      electricityBill: formData.documents.electricityBill ?? null,
      rationCard: formData.documents.rationCard ?? null,
      incomeCert: formData.documents.incomeCert ?? null,
      familyPhoto: formData.documents.familyPhoto ?? null,
      houseVideo: formData.documents.houseVideo ?? null,
      houseVisitLink: formData.documents.houseVisitLink ?? '',
    };
  }

  return {};
};
