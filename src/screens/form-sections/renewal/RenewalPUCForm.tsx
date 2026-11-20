import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DecimalInputField from '@/components/common/DecimalInputField';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import VPDatePickerField from '@/components/common/VPDatePickerField';
import VPInputField from '@/components/common/VPInputField';

import { getRenewalPucDropdowns, submitRenewalPuc } from '@/api/renewalPucApi';
import FileUploadField from '@/components/form/FileUploadField';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { DocumentFile, UploadedDocument } from '@/types/documents';
import { pickDocument } from '@/utils/filePicker';
import { RenewalPucFormValues, renewalPucSchema } from '@/validation/renewalPucSchemas';

const GENDER_OPTIONS: Option<string>[] = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const COLLEGE_TYPE_OPTIONS: Option<string>[] = [
  { value: 'Government', label: 'Government' },
  { value: 'Aided', label: 'Aided' },
  { value: 'Private', label: 'Private' },
];

const YES_NO_OPTIONS: Option<string>[] = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];

const COURSE_YEAR_OPTIONS: Option<string>[] = [
  { value: '1st Year', label: '1st Year' },
  { value: '2nd Year', label: '2nd Year' },
  { value: '3rd Year', label: '3rd Year' },
  { value: '4th Year', label: '4th Year' },
];

type FileKey =
  | 'marksheet'
  | 'passbook'
  | 'photo'
  | 'thankingVideo'
  | 'feesReceipt'
  | 'thankingVolunteerLetter';

interface UploadMeta {
  isUploading: boolean;
  uploaded: boolean;
  error?: string;
  progress: number;
}

interface Props {
  navigation?: any;
}

export default function RenewalPUCForm({ navigation }: Props) {
  const [districtOptions, setDistrictOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [renewalId, setRenewalId] = useState<number | undefined>();
  const [submitError, setSubmitError] = useState<string | undefined>();

  const [uploadMeta, setUploadMeta] = useState<Record<FileKey, UploadMeta>>({
    marksheet: { isUploading: false, uploaded: false, progress: 0 },
    passbook: { isUploading: false, uploaded: false, progress: 0 },
    photo: { isUploading: false, uploaded: false, progress: 0 },
    thankingVideo: { isUploading: false, uploaded: false, progress: 0 },
    feesReceipt: { isUploading: false, uploaded: false, progress: 0 },
    thankingVolunteerLetter: { isUploading: false, uploaded: false, progress: 0 },
  });

  const { control, handleSubmit, setValue, watch, formState } = useForm<RenewalPucFormValues>({
    resolver: zodResolver(renewalPucSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      applicantName: '',
      vpid: '',
      whatsApp: '',
      alternateNumber: '',
      district: 0,
      taluk: '',
      address: '',
      currentAddress: '',
      otherDistrict: '',
      gender: '',
      dob: '',
      latestResult: '',
      scholarshipAmount: 0,
      donorName: '',
      lettersCount: 0,
      course: '',
      courseYear: '',
      courseStream: '',
      collegeName: '',
      collegeContact: '',
      collegeType: '',
      collegeFees: 0,
      totalExpenses: 0,
      achievements: '',
      invitedToCamp: '',
      attendedCamp: '',
      campCount: 0,
      campPlace: '',
      campDate: '',
      vdssAttended: '',
      vdss_Topics: '',
      accountHolderName: '',
      accountNumber: '',
      ifsc: '',
      bankName: '',
      branchName: '',
      parentBankBalance: 0,
      marksheet: undefined,
      thankingLetters: [],
      passbook: undefined,
      photo: undefined,
      thankingVideo: undefined,
      feesReceipt: undefined,
      thankingVolunteerLetter: undefined,
      houseVisitLink: '',
      renewalPreviousVPID: '',
    },
  });

  const attendedCamp = watch('attendedCamp');
  const vdssAttended = watch('vdssAttended');
  const selectedDistrict = watch('district');
  const marksheetFile = watch('marksheet');
  const thankingLetters = watch('thankingLetters') || [];
  const passbookFile = watch('passbook');
  const photoFile = watch('photo');
  const thankingVideoFile = watch('thankingVideo');
  const feesReceiptFile = watch('feesReceipt');
  const thankingVolunteerLetterFile = watch('thankingVolunteerLetter');

  const isOtherDistrict = districtOptions
    .find((d) => d.value === selectedDistrict)
    ?.label.toLowerCase()
    .includes('other');

  useEffect(() => {
    (async () => {
      try {
        const response = await getRenewalPucDropdowns();
        if (response.success && response.data) {
          setDistrictOptions(
            (response.data.districts || []).map((d) => ({
              value: Number(d.value),
              label: d.label,
            }))
          );
        }
      } catch (e) {
        console.error('[RenewalPUCForm] Failed to load dropdowns:', e);
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

  const handleAddThankingLetter = async () => {
    const file = await pickDocument();
    if (!file) return;
    const doc: UploadedDocument = {
      file: file as DocumentFile,
      uploadedAt: new Date().toISOString(),
    };
    setValue('thankingLetters', [...thankingLetters, doc], { shouldValidate: true });
  };

  const handleRemoveThankingLetter = (index: number) => {
    setValue(
      'thankingLetters',
      thankingLetters.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: RenewalPucFormValues) => {
    setSubmitting(true);
    setSubmitError(undefined);
    try {
      const res = await submitRenewalPuc(data);
      setRenewalId(res.renewalId);
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
            Your Renewal PUC application has been received.
          </Text>
          {renewalId ? (
            <View style={styles.renewalIdCard}>
              <Text style={styles.renewalIdLabel}>Renewal ID</Text>
              <Text style={styles.renewalIdValue}>#{renewalId}</Text>
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
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
          <View style={styles.headerTitleBlock}>
            <Text style={styles.headerTitle}>Vidya Poshak Renewal Form</Text>
            <Text style={styles.headerSubtitle}>PUC - 2025-26</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Guidelines */}
          <FormCard>
            <View style={styles.guidelineBox}>
              <Text style={styles.guidelineHeading}>Guidelines:</Text>
              <Text style={styles.guidelineItem}>• Please use the original Vidya Poshak login credentials</Text>
              <Text style={styles.guidelineItem}>• Ensure all details match your previously submitted documents</Text>
              <Text style={styles.guidelineItem}>• The renewal form should include academic results from last year</Text>
            </View>
            <View style={styles.noteBox}>
              <Text style={styles.noteHeading}>Document Requirements:</Text>
              <Text style={styles.noteItem}>• Student ID card / Name (Same as VP ID)</Text>
              <Text style={styles.noteItem}>• Last academic result (PDF/JPG)</Text>
              <Text style={styles.noteItem}>• Bank details (if changed)</Text>
            </View>
            <View style={styles.importantBox}>
              <Text style={styles.importantText}>
                By filling this renewal form, you confirm all information is current and choose to continue Vidya Poshak financial assistance.
              </Text>
            </View>
          </FormCard>

          {/* ── Section 2: Applicant Information ── */}
          <FormSectionHeader icon="person" title="Section 2: Applicant's Information" showRequired />

          <FormCard>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  placeholder="student@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={formState.errors.email?.message}
                  required
                />
              )}
            />
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
              name="vpid"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="VP ID"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Your Vidya Poshak ID"
                  error={formState.errors.vpid?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="whatsApp"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="WhatsApp Number"
                  value={value}
                  onChangeText={onChange}
                  placeholder="10-digit number"
                  keyboardType="phone-pad"
                  error={formState.errors.whatsApp?.message}
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
              name="address"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Postal Address"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter full address"
                  multiline
                  numberOfLines={3}
                  error={formState.errors.address?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="currentAddress"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Current Address (if different)"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Optional"
                  multiline
                  numberOfLines={3}
                  error={formState.errors.currentAddress?.message}
                />
              )}
            />
            {isOtherDistrict && (
              <Controller
                control={control}
                name="otherDistrict"
                render={({ field: { onChange, value } }) => (
                  <VPInputField
                    label="Specify District"
                    value={value ?? ''}
                    onChangeText={onChange}
                    placeholder="Enter your district"
                    error={formState.errors.otherDistrict?.message}
                    required
                  />
                )}
              />
            )}
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
            <Controller
              control={control}
              name="dob"
              render={({ field: { onChange, value } }) => (
                <VPDatePickerField
                  label="Date of Birth"
                  value={value}
                  onChange={onChange}
                  error={formState.errors.dob?.message}
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
              name="latestResult"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Latest Academic Result (% / Grade)"
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g. 85% or First Class"
                  error={formState.errors.latestResult?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="scholarshipAmount"
              render={({ field: { onChange, value } }) => (
                <DecimalInputField
                  label="Scholarship Amount Received Last Year"
                  value={value}
                  onChangeValue={(v) => onChange(v ?? 0)}
                  placeholder="Enter amount"
                  prefix="₹"
                  error={formState.errors.scholarshipAmount?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="donorName"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Donor Name (if any)"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Optional"
                  error={formState.errors.donorName?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="lettersCount"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="No. of Thank-You Letters Sent"
                  value={value !== undefined ? String(value) : ''}
                  onChangeText={(t) => onChange(parseInt(t) || 0)}
                  keyboardType="number-pad"
                  placeholder="0"
                  error={formState.errors.lettersCount?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="course"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Course"
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g. PUC, B.Com, B.E."
                  error={formState.errors.course?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="courseYear"
              render={({ field: { onChange, value } }) => (
                <ModalSelectField
                  label="Course Year"
                  value={value}
                  options={COURSE_YEAR_OPTIONS}
                  onChange={onChange}
                  placeholder="Select year"
                  error={formState.errors.courseYear?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="courseStream"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Course Stream / Specialization"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="e.g. Science, Commerce"
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
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter college name"
                  error={formState.errors.collegeName?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="collegeContact"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="College Contact Number"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Optional"
                  keyboardType="phone-pad"
                  error={formState.errors.collegeContact?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="collegeType"
              render={({ field: { onChange, value } }) => (
                <ModalSelectField
                  label="College Type"
                  value={value}
                  options={COLLEGE_TYPE_OPTIONS}
                  onChange={onChange}
                  placeholder="Select college type"
                  error={formState.errors.collegeType?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="collegeFees"
              render={({ field: { onChange, value } }) => (
                <DecimalInputField
                  label="College Fees (Annual)"
                  value={value}
                  onChangeValue={(v) => onChange(v ?? 0)}
                  prefix="₹"
                  error={formState.errors.collegeFees?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="totalExpenses"
              render={({ field: { onChange, value } }) => (
                <DecimalInputField
                  label="Total Annual Expenses"
                  value={value}
                  onChangeValue={(v) => onChange(v ?? 0)}
                  prefix="₹"
                  error={formState.errors.totalExpenses?.message}
                  helperText="Include tuition + living expenses"
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="achievements"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Student Achievements"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Awards, ranks, extracurriculars..."
                  multiline
                  numberOfLines={3}
                  error={formState.errors.achievements?.message}
                />
              )}
            />
          </FormCard>

          {/* ── Section 4: Residential Bridge Camp ── */}
          <FormSectionHeader icon="people" title="Section 4: Residential Bridge Camp Details" />

          <FormCard>
            <Controller
              control={control}
              name="invitedToCamp"
              render={({ field: { onChange, value } }) => (
                <ModalSelectField
                  label="Have you been invited to the camp?"
                  value={value}
                  options={YES_NO_OPTIONS}
                  onChange={onChange}
                  placeholder="Select"
                  error={formState.errors.invitedToCamp?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="attendedCamp"
              render={({ field: { onChange, value } }) => (
                <ModalSelectField
                  label="Have you attended the camp?"
                  value={value}
                  options={YES_NO_OPTIONS}
                  onChange={onChange}
                  placeholder="Select"
                  error={formState.errors.attendedCamp?.message}
                  required
                />
              )}
            />
            {attendedCamp === 'Yes' && (
              <>
                <Controller
                  control={control}
                  name="campCount"
                  render={({ field: { onChange, value } }) => (
                    <VPInputField
                      label="Number of times attended"
                      value={value !== undefined ? String(value) : ''}
                      onChangeText={(t) => onChange(parseInt(t) || 0)}
                      keyboardType="number-pad"
                      placeholder="0"
                      error={formState.errors.campCount?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="campPlace"
                  render={({ field: { onChange, value } }) => (
                    <VPInputField
                      label="Camp Place"
                      value={value ?? ''}
                      onChangeText={onChange}
                      placeholder="City/town of camp"
                      error={formState.errors.campPlace?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="campDate"
                  render={({ field: { onChange, value } }) => (
                    <VPDatePickerField
                      label="Camp Date"
                      value={value ?? ''}
                      onChange={onChange}
                      error={formState.errors.campDate?.message}
                    />
                  )}
                />
              </>
            )}
            <Controller
              control={control}
              name="vdssAttended"
              render={({ field: { onChange, value } }) => (
                <ModalSelectField
                  label="Have you attended VDSS?"
                  value={value ?? ''}
                  options={YES_NO_OPTIONS}
                  onChange={onChange}
                  placeholder="Select"
                  error={formState.errors.vdssAttended?.message}
                />
              )}
            />
            {vdssAttended === 'Yes' && (
              <Controller
                control={control}
                name="vdss_Topics"
                render={({ field: { onChange, value } }) => (
                  <VPInputField
                    label="VDSS Topics Covered"
                    value={value ?? ''}
                    onChangeText={onChange}
                    placeholder="e.g. Leadership, Career..."
                    multiline
                    numberOfLines={2}
                    error={formState.errors.vdss_Topics?.message}
                  />
                )}
              />
            )}
          </FormCard>

          {/* ── Section 5: Account Details ── */}
          <FormSectionHeader icon="card" title="Section 5: Account Details" showRequired />

          <FormCard>
            <Text style={styles.bankNote}>
              Enter your bank account details as per your bank passbook.
            </Text>
            <Controller
              control={control}
              name="accountHolderName"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Account Holder Name"
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
              name="accountNumber"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Bank Account Number"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Account number"
                  keyboardType="number-pad"
                  error={formState.errors.accountNumber?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="ifsc"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="IFSC Code"
                  value={value}
                  onChangeText={(t) => onChange(t.toUpperCase())}
                  placeholder="e.g. SBIN0001234"
                  autoCapitalize="characters"
                  error={formState.errors.ifsc?.message}
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
              name="branchName"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Branch Name"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Branch name"
                  error={formState.errors.branchName?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="parentBankBalance"
              render={({ field: { onChange, value } }) => (
                <DecimalInputField
                  label="Parent Bank Balance"
                  value={value}
                  onChangeValue={(v) => onChange(v ?? 0)}
                  prefix="₹"
                  placeholder="Current balance"
                  error={formState.errors.parentBankBalance?.message}
                />
              )}
            />
          </FormCard>

          {/* ── Section 6: Documents Upload ── */}
          <FormSectionHeader icon="document-attach" title="Section 6: Documents Upload" showRequired />

          <FormCard>
            <Text style={styles.docNote}>
              Upload documents (photo or PDF). Latest marksheet is required.
            </Text>

            <FileUploadField
              title="Latest Marksheet / Result"
              subtitle="Upload 1 file. Max 5 MB."
              badge="Required"
              file={marksheetFile?.file}
              meta={uploadMeta.marksheet}
              onUpload={() => handlePickFile('marksheet')}
              onDelete={() => handleDeleteFile('marksheet')}
              acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
            />
            {formState.errors.marksheet?.message ? (
              <Text style={styles.fileErrorText}>{formState.errors.marksheet.message}</Text>
            ) : null}

            <View style={styles.thankingHeader}>
              <Text style={styles.thankingTitle}>Thanking Letters to Donor</Text>
              <TouchableOpacity
                style={styles.addLetterBtn}
                onPress={handleAddThankingLetter}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={18} color={colors.card} />
                <Text style={styles.addLetterBtnText}>Add Letter</Text>
              </TouchableOpacity>
            </View>
            {thankingLetters.map((doc, index) => (
              <View key={index} style={styles.letterRow}>
                <Ionicons name="document-text-outline" size={18} color={colors.primary} />
                <Text style={styles.letterName} numberOfLines={1}>
                  {doc.file.name}
                </Text>
                <TouchableOpacity onPress={() => handleRemoveThankingLetter(index)}>
                  <Ionicons name="close-circle" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
            {thankingLetters.length === 0 && (
              <Text style={styles.letterEmpty}>
                No letters added — tap "Add Letter" to attach thank-you letters.
              </Text>
            )}

            <FileUploadField
              title="Bank Passbook First Page"
              subtitle="Optional. Max 5 MB."
              file={passbookFile?.file}
              meta={uploadMeta.passbook}
              onUpload={() => handlePickFile('passbook')}
              onDelete={() => handleDeleteFile('passbook')}
              acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
            />

            <FileUploadField
              title="Student Photo / Selfie"
              subtitle="Optional. Max 5 MB."
              file={photoFile?.file}
              meta={uploadMeta.photo}
              onUpload={() => handlePickFile('photo')}
              onDelete={() => handleDeleteFile('photo')}
              acceptedTypes={['image/jpeg', 'image/png']}
            />

            <FileUploadField
              title="Thanking Video for Donor"
              subtitle="Optional. Max 100 MB."
              file={thankingVideoFile?.file}
              meta={uploadMeta.thankingVideo}
              onUpload={() => handlePickFile('thankingVideo')}
              onDelete={() => handleDeleteFile('thankingVideo')}
              maxSize={100 * 1024 * 1024}
              acceptedTypes={['video/mp4', 'video/quicktime', 'video/x-msvideo']}
            />

            <FileUploadField
              title="College Fees Receipt"
              subtitle="Optional. Max 5 MB."
              file={feesReceiptFile?.file}
              meta={uploadMeta.feesReceipt}
              onUpload={() => handlePickFile('feesReceipt')}
              onDelete={() => handleDeleteFile('feesReceipt')}
              acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
            />

            <FileUploadField
              title="Thanking Letter to Volunteer"
              subtitle="Optional. Max 5 MB."
              file={thankingVolunteerLetterFile?.file}
              meta={uploadMeta.thankingVolunteerLetter}
              onUpload={() => handlePickFile('thankingVolunteerLetter')}
              onDelete={() => handleDeleteFile('thankingVolunteerLetter')}
              acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
            />
          </FormCard>

          {/* ── Section 7: Additional Info ── */}
          <FormSectionHeader icon="link" title="Additional Information" />

          <FormCard>
            <Controller
              control={control}
              name="houseVisitLink"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="House Visit Location Link (Google Maps)"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Optional — paste Google Maps link"
                  error={formState.errors.houseVisitLink?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="renewalPreviousVPID"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Previous VP ID (if changed)"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Optional"
                  error={formState.errors.renewalPreviousVPID?.message}
                />
              )}
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
              onPress={() => handleSubmit(onSubmit)()}
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
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
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
  backButton: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  headerTitleBlock: {
    flex: 1,
  },
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  guidelineBox: {
    backgroundColor: '#FEF9C3',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  guidelineHeading: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: '#92400E',
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  guidelineItem: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: '#92400E',
    marginBottom: 2,
  },
  noteBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  noteHeading: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: '#1D4ED8',
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  noteItem: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: '#1D4ED8',
    marginBottom: 2,
  },
  importantBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  importantText: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: '#166534',
    fontStyle: 'italic',
  },
  bankNote: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  docNote: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  fileErrorText: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.error,
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
  },
  thankingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  thankingTitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  addLetterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    gap: 4,
  },
  addLetterBtnText: {
    color: colors.card,
    fontSize: platform.normalize.fontSize.caption,
    fontWeight: '600',
  },
  letterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  letterName: {
    flex: 1,
    fontSize: platform.normalize.fontSize.caption,
    color: colors.textPrimary,
  },
  letterEmpty: {
    fontSize: platform.normalize.fontSize.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
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
  submitContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
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
  submitButtonDisabled: {
    opacity: 0.65,
  },
  submitButtonText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.card,
    fontWeight: '700',
  },
  bottomPadding: {
    height: spacing.xl,
  },
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
  renewalIdCard: {
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
  renewalIdLabel: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  renewalIdValue: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
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
