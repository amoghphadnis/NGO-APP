import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import VPInputField from '@/components/common/VPInputField';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FileUploadField from '@/components/form/FileUploadField';

import {
  renewalProfessionalSchema,
  RenewalProfessionalFormValues,
} from '@/validation/renewalProfessionalSchemas';
import {
  getRenewalProfessionalDropdowns,
  submitRenewalProfessional,
} from '@/api/renewalProfessionalApi';
import { pickDocument } from '@/utils/filePicker';
import { UploadedDocument, DocumentFile } from '@/types/documents';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

const GENDER_OPTIONS: Option<string>[] = [
  { value: 'Female', label: 'Female' },
  { value: 'Male', label: 'Male' },
  { value: 'Other', label: 'Other' },
];

const COURSE_YEAR_OPTIONS: Option<number>[] = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
];

type FileKey =
  | 'latestMarksheetFile'
  | 'studentPassbookFile'
  | 'studentSelfieFile'
  | 'collegeFrontPhotoFile'
  | 'thankingVideoFile'
  | 'parentsPassbookFile';

interface UploadMeta {
  isUploading: boolean;
  uploaded: boolean;
  error?: string;
  progress: number;
}

interface Props {
  navigation?: any;
}

export default function RenewalProfessionalForm({ navigation }: Props) {
  const [districtOptions, setDistrictOptions] = useState<Option<string>[]>([]);
  const [collegeTypeOptions, setCollegeTypeOptions] = useState<Option<string>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [prId, setPrId] = useState<number | undefined>();
  const [submitError, setSubmitError] = useState<string | undefined>();

  const [uploadMeta, setUploadMeta] = useState<Record<FileKey, UploadMeta>>({
    latestMarksheetFile: { isUploading: false, uploaded: false, progress: 0 },
    studentPassbookFile: { isUploading: false, uploaded: false, progress: 0 },
    studentSelfieFile: { isUploading: false, uploaded: false, progress: 0 },
    collegeFrontPhotoFile: { isUploading: false, uploaded: false, progress: 0 },
    thankingVideoFile: { isUploading: false, uploaded: false, progress: 0 },
    parentsPassbookFile: { isUploading: false, uploaded: false, progress: 0 },
  });

  const { control, handleSubmit, setValue, watch, formState } =
    useForm<RenewalProfessionalFormValues>({
      resolver: zodResolver(renewalProfessionalSchema),
      mode: 'onChange',
      defaultValues: {
        applicantName: '',
        vpidNumber: '',
        whatsAppNumber: '',
        alternateNumber: '',
        emailID: '',
        district: '',
        taluk: '',
        residentialAddress: '',
        gender: '',
        studentAchievement: '',
        latestResultPercentage: undefined,
        totalScholarshipAmount: undefined,
        donorName: '',
        lettersWrittenToDonor: undefined,
        courseStudyingApplying: '',
        currentCourseYear: undefined,
        courseStream: '',
        collegeName: '',
        collegeContactNumber: '',
        collegeType: '',
        expectedCollegeFees: undefined,
        totalEducationalExpenses: undefined,
        accountHolderName: '',
        bankAccountNumber: '',
        bankName: '',
        ifscCode: '',
        bankBranchName: '',
        parentsBankBalance: undefined,
        latestMarksheetFile: undefined,
        studentPassbookFile: undefined,
        studentSelfieFile: undefined,
        collegeFrontPhotoFile: undefined,
        thankingVideoFile: undefined,
        parentsPassbookFile: undefined,
      },
    });

  const fileValues = watch([
    'latestMarksheetFile',
    'studentPassbookFile',
    'studentSelfieFile',
    'collegeFrontPhotoFile',
    'thankingVideoFile',
    'parentsPassbookFile',
  ]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRenewalProfessionalDropdowns();
        setDistrictOptions(
          data.districts
            .map((d) => ({
              value: d.districtName || d.Name || d.name,
              label: d.districtName || d.Name || d.name,
            }))
            .filter((d): d is Option<string> => d.value !== undefined && d.label !== undefined)
        );
        setCollegeTypeOptions(
          data.collegeTypes.map((c) => ({ value: c.collegeTypeName, label: c.collegeTypeName }))
        );
      } catch (e) {
        console.error('[RenewalProfessionalForm] Dropdown load failed:', e);
      } finally {
        setLoadingDropdowns(false);
      }
    })();
  }, []);

  const handlePickFile = async (key: FileKey) => {
    setUploadMeta((prev) => ({
      ...prev,
      [key]: { isUploading: true, uploaded: false, error: undefined, progress: 0 },
    }));

    const file = await pickDocument();

    if (!file) {
      setUploadMeta((prev) => ({
        ...prev,
        [key]: { isUploading: false, uploaded: false, progress: 0 },
      }));
      return;
    }

    const uploadedDoc: UploadedDocument = {
      file: file as DocumentFile,
      uploadedAt: new Date().toISOString(),
    };

    setValue(key, uploadedDoc, { shouldValidate: true });
    setUploadMeta((prev) => ({
      ...prev,
      [key]: { isUploading: false, uploaded: true, progress: 100 },
    }));
  };

  const handleDeleteFile = (key: FileKey) => {
    setValue(key, undefined, { shouldValidate: true });
    setUploadMeta((prev) => ({
      ...prev,
      [key]: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
    }));
  };

  const onSubmit = async (data: RenewalProfessionalFormValues) => {
    setSubmitting(true);
    setSubmitError(undefined);
    try {
      const res = await submitRenewalProfessional(data);
      setPrId(res.prId);
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={80} color={colors.success} />
          <Text style={styles.successTitle}>Application Submitted!</Text>
          <Text style={styles.successSubtitle}>
            Your Professional Renewal application has been received.
          </Text>
          {prId ? (
            <View style={styles.idCard}>
              <Text style={styles.idLabel}>Application ID</Text>
              <Text style={styles.idValue}>#{prId}</Text>
            </View>
          ) : null}
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation?.goBack?.()}
            activeOpacity={0.8}
          >
            <Ionicons name="home" size={20} color={colors.card} />
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loadingDropdowns) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading form data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const [
    marksheetFile,
    passbookFile,
    selfieFile,
    collegeFrontFile,
    videoFile,
    parentsPassbookFile,
  ] = fileValues;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          {navigation?.goBack && (
            <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.card} />
            </TouchableOpacity>
          )}
          <View style={styles.headerTitleBlock}>
            <Text style={styles.headerTitle}>Vidya Poshak Renewal Form</Text>
            <Text style={styles.headerSubtitle}>Professional Students — 2025-26</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Note + Guidelines */}
          <FormCard>
            <View style={styles.noteBox}>
              <Text style={styles.noteHeading}>Note:</Text>
              <Text style={styles.noteItem}>
                1) This form has to be filled by only existing Vidya Poshak Students.
              </Text>
              <Text style={styles.noteItem}>
                2) If you are not an existing Vidya Poshak student and looking for support
                please call{' '}
                <Text style={styles.notePhone}>0836-2747357</Text>
              </Text>
            </View>

            <View style={styles.guidelineBox}>
              <Text style={styles.guidelineHeading}>Guidelines :</Text>
              <Text style={styles.guidelineItem}>
                • Please read all instructions carefully before filling out the application form.
              </Text>
              <Text style={styles.guidelineItem}>
                • Ensure the online application is filled with accurate and relevant information.
              </Text>
              <Text style={styles.guidelineItem}>
                • The contact number used must remain active for VP communication.
              </Text>
              <Text style={styles.guidelineItem}>
                • Keep the following documents ready before filling:
              </Text>
              <Text style={styles.docItem}>  1. Student's latest marks sheet</Text>
              <Text style={styles.docItem}>  2. Student's bank passbook first page (name, account no, IFSC)</Text>
              <Text style={styles.docItem}>  3. Student's recent selfie/photo</Text>
              <Text style={styles.docItem}>
                {'  '}4. Parents bank passbook first page and last 3 months transaction details
              </Text>
              <Text style={styles.guidelineItem}>
                • For more information/queries please contact your assigned staff mentor.
              </Text>
              <Text style={styles.warningText}>
                The name, email, and photo associated with your Google account will be recorded when
                you upload files and submit this form.
              </Text>
            </View>
          </FormCard>

          {/* ── Section 2: Applicant's Information ── */}
          <FormSectionHeader icon="person" title="Section 2: Applicant's Information" showRequired />

          <FormCard>
            <Controller
              control={control}
              name="applicantName"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Applicant Name"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter full name"
                  error={formState.errors.applicantName?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="vpidNumber"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="VP ID Number"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Your Vidya Poshak ID"
                  error={formState.errors.vpidNumber?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="whatsAppNumber"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="WhatsApp Number"
                  value={value}
                  onChangeText={onChange}
                  placeholder="10-digit number"
                  keyboardType="phone-pad"
                  error={formState.errors.whatsAppNumber?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="alternateNumber"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Alternate Number"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Optional"
                  keyboardType="phone-pad"
                  error={formState.errors.alternateNumber?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="emailID"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="E-mail ID"
                  value={value}
                  onChangeText={onChange}
                  placeholder="student@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={formState.errors.emailID?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="district"
              render={({ field: { onChange, value } }) => (
                <ModalSelectField
                  label="District"
                  value={value}
                  options={districtOptions}
                  onChange={onChange}
                  placeholder="Select district"
                  error={formState.errors.district?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="taluk"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Taluk"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter taluk"
                  error={formState.errors.taluk?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="residentialAddress"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Residential Address"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter full address"
                  multiline
                  numberOfLines={3}
                  error={formState.errors.residentialAddress?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <ModalSelectField
                  label="Gender"
                  value={value}
                  options={GENDER_OPTIONS}
                  onChange={onChange}
                  placeholder="Select gender"
                  error={formState.errors.gender?.message}
                  required
                />
              )}
            />
          </FormCard>

          {/* ── Section 3: Academic Details ── */}
          <FormSectionHeader icon="school" title="Section 3: Academic Details" showRequired />

          <FormCard>
            <Controller
              control={control}
              name="studentAchievement"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Student Achievement"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Academic, curricular, internship, placement updates..."
                  multiline
                  numberOfLines={4}
                  error={formState.errors.studentAchievement?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="latestResultPercentage"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Latest Result / Semester Result (%)"
                  value={value !== undefined ? String(value) : ''}
                  onChangeText={(t) => onChange(t ? parseFloat(t) : undefined)}
                  keyboardType="numeric"
                  placeholder="e.g. 85.5"
                  error={formState.errors.latestResultPercentage?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="totalScholarshipAmount"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Total Scholarship Amount"
                  value={value !== undefined ? String(value) : ''}
                  onChangeText={(t) => onChange(t ? parseFloat(t) : undefined)}
                  keyboardType="numeric"
                  prefix="₹"
                  placeholder="Amount received last year"
                  error={formState.errors.totalScholarshipAmount?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="donorName"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Donor Name"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Last year's donor name"
                  error={formState.errors.donorName?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="lettersWrittenToDonor"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="How many letters you wrote to donor last year"
                  value={value !== undefined ? String(value) : ''}
                  onChangeText={(t) => onChange(t ? parseInt(t) : undefined)}
                  keyboardType="number-pad"
                  placeholder="0"
                  error={formState.errors.lettersWrittenToDonor?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="courseStudyingApplying"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Course Studying / Applying"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="e.g. B.E., MBBS, B.Arch"
                  error={formState.errors.courseStudyingApplying?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="currentCourseYear"
              render={({ field: { onChange, value } }) => (
                <ModalSelectField
                  label="Current Course Year"
                  value={value ?? null}
                  options={COURSE_YEAR_OPTIONS}
                  onChange={onChange}
                  placeholder="Select year"
                  error={formState.errors.currentCourseYear?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="courseStream"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Course Stream"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="e.g. Computer Science"
                  error={formState.errors.courseStream?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="collegeName"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="College Name"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Enter college name"
                  error={formState.errors.collegeName?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="collegeContactNumber"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="College Contact Number"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Optional"
                  keyboardType="phone-pad"
                  error={formState.errors.collegeContactNumber?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="collegeType"
              render={({ field: { onChange, value } }) => (
                <ModalSelectField
                  label="College Type"
                  value={value ?? ''}
                  options={collegeTypeOptions}
                  onChange={onChange}
                  placeholder="Select college type"
                  error={formState.errors.collegeType?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="expectedCollegeFees"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Expected College Fees"
                  value={value !== undefined ? String(value) : ''}
                  onChangeText={(t) => onChange(t ? parseFloat(t) : undefined)}
                  keyboardType="numeric"
                  prefix="₹"
                  placeholder="Annual fees"
                  error={formState.errors.expectedCollegeFees?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="totalEducationalExpenses"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Total Educational Expenses for the Year (Expected)"
                  value={value !== undefined ? String(value) : ''}
                  onChangeText={(t) => onChange(t ? parseFloat(t) : undefined)}
                  keyboardType="numeric"
                  prefix="₹"
                  placeholder="Including tuition + living"
                  error={formState.errors.totalEducationalExpenses?.message}
                />
              )}
            />
          </FormCard>

          {/* ── Section 4: Account Details ── */}
          <FormSectionHeader icon="card" title="Section 4: Account Details" showRequired />

          <FormCard>
            <Text style={styles.bankNote}>
              Enter your bank account details as per your bank passbook.
            </Text>
            <Controller
              control={control}
              name="accountHolderName"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Account Holder Name as per Passbook"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Name as in bank records"
                  error={formState.errors.accountHolderName?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="bankAccountNumber"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Bank Account Number"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Account number"
                  keyboardType="number-pad"
                  error={formState.errors.bankAccountNumber?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="bankName"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Bank Name"
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g. State Bank of India"
                  error={formState.errors.bankName?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="ifscCode"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="IFSC Code"
                  value={value}
                  onChangeText={(t) => onChange(t.toUpperCase())}
                  placeholder="e.g. SBIN0001234"
                  autoCapitalize="characters"
                  error={formState.errors.ifscCode?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="bankBranchName"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Bank Branch Name"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Branch name"
                  error={formState.errors.bankBranchName?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="parentsBankBalance"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Parents Bank Balance (Earning Member)"
                  value={value !== undefined ? String(value) : ''}
                  onChangeText={(t) => onChange(t ? parseFloat(t) : undefined)}
                  keyboardType="numeric"
                  prefix="₹"
                  placeholder="Current balance"
                  error={formState.errors.parentsBankBalance?.message}
                />
              )}
            />
          </FormCard>

          {/* ── Section 5: Documents ── */}
          <FormSectionHeader icon="document-attach" title="Section 5: Documents Upload" />

          <FormCard>
            <Text style={styles.docNote}>
              Upload the following documents (Take photo in your mobile and upload).{'\n'}
              Only Images/photos/PDF are allowed.
            </Text>

            {/* Latest Marksheet */}
            <FileUploadField
              title="Latest Mark sheet / Semester Result"
              subtitle="Upload 1 file. Max 100 MB."
              badge="Required"
              file={marksheetFile?.file}
              meta={uploadMeta.latestMarksheetFile}
              onUpload={() => handlePickFile('latestMarksheetFile')}
              onDelete={() => handleDeleteFile('latestMarksheetFile')}
              acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
            />

            {/* Student Passbook */}
            <FileUploadField
              title="Student Bank Passbook First Page"
              subtitle="Upload 1 file. Max 100 MB."
              badge="Required"
              file={passbookFile?.file}
              meta={uploadMeta.studentPassbookFile}
              onUpload={() => handlePickFile('studentPassbookFile')}
              onDelete={() => handleDeleteFile('studentPassbookFile')}
              acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
            />

            {/* Student Selfie */}
            <FileUploadField
              title="Student Latest Selfie / Photo"
              subtitle="Upload 1 file. Max 100 MB."
              badge="Required"
              file={selfieFile?.file}
              meta={uploadMeta.studentSelfieFile}
              onUpload={() => handlePickFile('studentSelfieFile')}
              onDelete={() => handleDeleteFile('studentSelfieFile')}
              acceptedTypes={['image/jpeg', 'image/png']}
            />

            {/* College Front Photo */}
            <FileUploadField
              title="Student's Photo in Front of College"
              subtitle="Upload 1 file. Max 10 MB."
              badge="Required"
              file={collegeFrontFile?.file}
              meta={uploadMeta.collegeFrontPhotoFile}
              onUpload={() => handlePickFile('collegeFrontPhotoFile')}
              onDelete={() => handleDeleteFile('collegeFrontPhotoFile')}
              acceptedTypes={['image/jpeg', 'image/png']}
            />

            {/* Thanking Video */}
            <View style={styles.videoSection}>
              <View style={styles.videoInstructionBox}>
                <Text style={styles.videoInstructionTitle}>Thanking video to donor content</Text>
                <Text style={styles.videoInstructionItem}>1. Name and your Village/District</Text>
                <Text style={styles.videoInstructionItem}>
                  2. Course studying and % in final/last semester exam
                </Text>
                <Text style={styles.videoInstructionItem}>
                  3. Any academic achievement or extracurricular activities
                </Text>
                <Text style={styles.videoInstructionItem}>4. Your objective / goal in life</Text>
                <Text style={styles.videoInstructionItem}>5. Thank message to donor</Text>
                <Text style={styles.videoNote}>
                  Note: Record a selfie video with clear voice and smiling face. Talk in any
                  comfortable language. Record at least 30 sec to 1 minute.
                </Text>
                <Text style={styles.videoNote}>
                  If size is big, use any video compressor app to reduce size.
                </Text>
              </View>
              <FileUploadField
                title="Thanking Video for the Donor"
                subtitle="Upload 1 file. Max 100 MB."
                badge="Required"
                file={videoFile?.file}
                meta={uploadMeta.thankingVideoFile}
                onUpload={() => handlePickFile('thankingVideoFile')}
                onDelete={() => handleDeleteFile('thankingVideoFile')}
                acceptedTypes={['video/mp4', 'video/quicktime', 'video/x-msvideo']}
              />
            </View>

            {/* Parents Passbook */}
            <FileUploadField
              title="Parents Passbook First Page + Last 3 Months Transactions"
              subtitle="Upload 1 file. Max 100 MB."
              badge="Required"
              file={parentsPassbookFile?.file}
              meta={uploadMeta.parentsPassbookFile}
              onUpload={() => handlePickFile('parentsPassbookFile')}
              onDelete={() => handleDeleteFile('parentsPassbookFile')}
              acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
            />
          </FormCard>

          {/* Submission Error */}
          {submitError ? (
            <FormCard>
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={20} color={colors.error} />
                <Text style={styles.errorText}>{submitError}</Text>
              </View>
            </FormCard>
          ) : null}

          {/* Submit Button */}
          <View style={styles.submitContainer}>
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={submitting}
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator color={colors.card} size="small" />
              ) : (
                <>
                  <Ionicons name="send" size={20} color={colors.card} />
                  <Text style={styles.submitButtonText}>Submit Renewal</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
  loadingText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
  },
  backButton: { marginRight: spacing.md, padding: spacing.xs },
  headerTitleBlock: { flex: 1 },
  headerTitle: {
    fontSize: platform.normalize.fontSize.h2,
    lineHeight: platform.normalize.lineHeight.h2,
    color: colors.card,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.card,
    opacity: 0.85,
    marginTop: 2,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  noteBox: {
    backgroundColor: '#FEF9C3',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  noteHeading: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: '#92400E',
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  noteItem: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: '#92400E',
    marginBottom: 2,
  },
  notePhone: { fontWeight: '700', color: '#92400E' },
  guidelineBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: spacing.sm,
  },
  guidelineHeading: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: '#1D4ED8',
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  guidelineItem: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: '#1D4ED8',
    marginBottom: 3,
  },
  docItem: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: '#1D4ED8',
    marginBottom: 2,
    paddingLeft: spacing.sm,
  },
  warningText: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.error,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  bankNote: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  docNote: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  videoSection: { marginTop: spacing.sm },
  videoInstructionBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  videoInstructionTitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: '#1D4ED8',
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  videoInstructionItem: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: '#1D4ED8',
    marginBottom: 2,
  },
  videoNote: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: '#1E40AF',
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.error,
  },
  submitContainer: { marginTop: spacing.lg, marginBottom: spacing.md },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 16,
    minHeight: 56,
    gap: spacing.sm,
  },
  submitButtonDisabled: { opacity: 0.65 },
  submitButtonText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.card,
    fontWeight: '700',
  },
  bottomPadding: { height: spacing.xl },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  successTitle: {
    fontSize: platform.normalize.fontSize.h1,
    lineHeight: platform.normalize.lineHeight.h1,
    color: colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  idCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  idLabel: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  idValue: { fontSize: 28, color: colors.primary, fontWeight: '800', marginTop: spacing.xs },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 16,
    gap: spacing.sm,
  },
  homeButtonText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.card,
    fontWeight: '600',
  },
});
