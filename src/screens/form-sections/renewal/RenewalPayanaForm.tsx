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
import VPDatePickerField from '@/components/common/VPDatePickerField';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FileUploadField from '@/components/form/FileUploadField';

import { renewalPayanaSchema, RenewalPayanaFormValues } from '@/validation/renewalPayanaSchemas';
import {
  getPayanaRenewalDropdowns,
  submitPayanaRenewal,
  PayanaRenewalDropdownItem,
} from '@/api/renewalPayanaApi';
import { pickDocument } from '@/utils/filePicker';
import { UploadedDocument, DocumentFile } from '@/types/documents';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

type FileKey = 'marksheetFile' | 'feesReceiptFile' | 'passbookFile' | 'selfieFile' | 'aadhaarFile';

interface UploadMeta {
  isUploading: boolean;
  uploaded: boolean;
  error?: string;
  progress: number;
}

const LETTERS_OPTIONS: Option<number>[] = [1, 2, 3, 4].map((n) => ({ value: n, label: String(n) }));

interface Props {
  navigation?: any;
}

function toOptions(items: PayanaRenewalDropdownItem[]): Option<string>[] {
  return items.map((i) => ({ value: i.name, label: i.name }));
}

export default function RenewalPayanaForm({ navigation }: Props) {
  const [dropdowns, setDropdowns] = useState({
    districts: [] as Option<string>[],
    areaTypes: [] as Option<string>[],
    casteCategories: [] as Option<string>[],
    collegeTypes: [] as Option<string>[],
  });
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  const [uploadMeta, setUploadMeta] = useState<Record<FileKey, UploadMeta>>({
    marksheetFile: { isUploading: false, uploaded: false, progress: 0 },
    feesReceiptFile: { isUploading: false, uploaded: false, progress: 0 },
    passbookFile: { isUploading: false, uploaded: false, progress: 0 },
    selfieFile: { isUploading: false, uploaded: false, progress: 0 },
    aadhaarFile: { isUploading: false, uploaded: false, progress: 0 },
  });

  const { control, handleSubmit, setValue, watch, formState } =
    useForm<RenewalPayanaFormValues>({
      resolver: zodResolver(renewalPayanaSchema),
      mode: 'onChange',
      defaultValues: {
        emailId: '',
        studentName: '',
        district: '',
        taluk: '',
        payanaId: '',
        dateOfBirth: '',
        residentialAddress: '',
        currentAddress: '',
        primaryNumber: '',
        alternateNumber: '',
        place: '',
        caste: '',
        fatherOccupation: '',
        motherOccupation: '',
        familyIncome: undefined,
        bankBalance: undefined,
        collegeName: '',
        collegeType: '',
        collegeContact: '',
        courseS: '',
        courseStream: '',
        annualFees: undefined,
        totalExpenses: undefined,
        scholarshipAmount: undefined,
        donorName: '',
        lettersWritten: undefined,
        achievement: '',
        percentage: '',
        accountHolder: '',
        accountNumber: '',
        ifsc: '',
        bankName: '',
        branch: '',
        houseVisitLink: '',
        marksheetFile: undefined,
        feesReceiptFile: undefined,
        passbookFile: undefined,
        selfieFile: undefined,
        aadhaarFile: undefined,
      },
    });

  const fileValues = watch([
    'marksheetFile',
    'feesReceiptFile',
    'passbookFile',
    'selfieFile',
    'aadhaarFile',
  ]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPayanaRenewalDropdowns();
        setDropdowns({
          districts: toOptions(data.districts),
          areaTypes: toOptions(data.areaTypes),
          casteCategories: toOptions(data.casteCategories),
          collegeTypes: toOptions(data.collegeTypes),
        });
      } catch (e) {
        console.error('[RenewalPayanaForm] Dropdown load failed:', e);
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

  const onSubmit = async (data: RenewalPayanaFormValues) => {
    setSubmitting(true);
    setSubmitError(undefined);
    try {
      await submitPayanaRenewal(data);
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
            Your Payana Renewal application has been received successfully.
          </Text>
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

  const [marksheet, feesReceipt, passbook, selfie, aadhaar] = fileValues;

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
            <Text style={styles.headerTitle}>Payana Renewal Form</Text>
            <Text style={styles.headerSubtitle}>2025-26</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Note */}
          <View style={styles.noteBox}>
            <Text style={styles.noteHeading}>Note:</Text>
            <Text style={styles.noteText}>This form has to be filled by only Payana Students.</Text>
          </View>

          {/* Guidelines */}
          <FormCard>
            <View style={styles.guidelineBox}>
              <Text style={styles.guidelineHeading}>Guidelines</Text>
              <Text style={styles.guidelineItem}>• Read all instructions carefully before filling the application</Text>
              <Text style={styles.guidelineItem}>• Fill the online application with all relevant information</Text>
              <Text style={styles.guidelineItem}>
                • Keep the contact number mentioned in the application form for Payana financial assistance
              </Text>
              <Text style={styles.guidelineItem}>
                • Take clear photos of all the documents before filling the application
              </Text>
              <Text style={styles.guidelineSubHeading}>Keep the following documents ready:</Text>
              <Text style={styles.docItem}>📄  Latest Marksheet copy (if available)</Text>
              <Text style={styles.docItem}>🏦  Student Bank Passbook (1st Page)</Text>
              <Text style={styles.docItem}>📸  Applicant's recent Selfie / Photo</Text>
              <Text style={styles.docItem}>🆔  Student's Aadhaar Card Photo</Text>
            </View>
            <Text style={styles.requiredNote}>* Indicates required fields</Text>
          </FormCard>

          {/* ── Basic Details ── */}
          <FormSectionHeader icon="person" title="Basic Details" showRequired />

          <FormCard>
            <Controller
              control={control}
              name="emailId"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  placeholder="student@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={formState.errors.emailId?.message}
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
                  value={value ?? ''}
                  options={dropdowns.districts}
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
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Enter taluk"
                  error={formState.errors.taluk?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="payanaId"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Payana ID Number"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Your Payana ID"
                  error={formState.errors.payanaId?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="studentName"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Name of Student"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Full name"
                  error={formState.errors.studentName?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field: { onChange, value } }) => (
                <VPDatePickerField
                  label="Date of Birth"
                  value={value ?? ''}
                  onChange={onChange}
                  error={formState.errors.dateOfBirth?.message}
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
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Permanent address"
                  multiline
                  numberOfLines={3}
                  error={formState.errors.residentialAddress?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="currentAddress"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Current Address"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Current address"
                  multiline
                  numberOfLines={3}
                  error={formState.errors.currentAddress?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="primaryNumber"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Primary (WhatsApp) Number"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="10-digit number"
                  keyboardType="phone-pad"
                  error={formState.errors.primaryNumber?.message}
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
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="place"
              render={({ field: { onChange, value } }) => (
                <ModalSelectField
                  label="Place"
                  value={value ?? ''}
                  options={dropdowns.areaTypes}
                  onChange={onChange}
                  placeholder="Select place type"
                  error={formState.errors.place?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="caste"
              render={({ field: { onChange, value } }) => (
                <ModalSelectField
                  label="Caste"
                  value={value ?? ''}
                  options={dropdowns.casteCategories}
                  onChange={onChange}
                  placeholder="Select caste"
                  error={formState.errors.caste?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="fatherOccupation"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Father's Occupation"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="e.g. Farmer, Teacher"
                  error={formState.errors.fatherOccupation?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="motherOccupation"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Mother's Occupation"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="e.g. Housewife, Teacher"
                  error={formState.errors.motherOccupation?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="familyIncome"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Family Annual Income"
                  value={value !== undefined ? String(value) : ''}
                  onChangeText={(t) => onChange(t ? parseFloat(t) : undefined)}
                  keyboardType="numeric"
                  prefix="₹"
                  placeholder="Annual income"
                  error={formState.errors.familyIncome?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="bankBalance"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Parents Bank Balance"
                  value={value !== undefined ? String(value) : ''}
                  onChangeText={(t) => onChange(t ? parseFloat(t) : undefined)}
                  keyboardType="numeric"
                  prefix="₹"
                  placeholder="Optional"
                  error={formState.errors.bankBalance?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="collegeName"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="College / School Name"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Enter college/school name"
                  error={formState.errors.collegeName?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="collegeType"
              render={({ field: { onChange, value } }) => (
                <ModalSelectField
                  label="College / School Type"
                  value={value ?? ''}
                  options={dropdowns.collegeTypes}
                  onChange={onChange}
                  placeholder="Select type"
                  error={formState.errors.collegeType?.message}
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
          </FormCard>

          {/* ── Current Year Details 2025-26 ── */}
          <FormSectionHeader icon="school" title="Current Year Details 2025-26" showRequired />

          <FormCard>
            <Controller
              control={control}
              name="courseS"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Course Studying / Applying"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="e.g. BE, B.Com, ITI"
                  error={formState.errors.courseS?.message}
                  required
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
                  placeholder="e.g. Science, Commerce"
                  error={formState.errors.courseStream?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="annualFees"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Annual College / School Fees"
                  value={value !== undefined ? String(value) : ''}
                  onChangeText={(t) => onChange(t ? parseFloat(t) : undefined)}
                  keyboardType="numeric"
                  prefix="₹"
                  placeholder="Annual fees"
                  error={formState.errors.annualFees?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="totalExpenses"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Total Educational Expenses"
                  value={value !== undefined ? String(value) : ''}
                  onChangeText={(t) => onChange(t ? parseFloat(t) : undefined)}
                  keyboardType="numeric"
                  prefix="₹"
                  placeholder="Including tuition + living"
                  error={formState.errors.totalExpenses?.message}
                  required
                />
              )}
            />
          </FormCard>

          {/* ── Academic Year 2024-25 Details ── */}
          <FormSectionHeader icon="trophy" title="Academic Year 2024-25 Details" />

          <FormCard>
            <Text style={styles.sectionNote}>Enter the details of the Academic year</Text>
            <Controller
              control={control}
              name="scholarshipAmount"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Total Scholarship Amount"
                  value={value !== undefined ? String(value) : ''}
                  onChangeText={(t) => onChange(t ? parseFloat(t) : undefined)}
                  keyboardType="numeric"
                  prefix="₹"
                  placeholder="Amount received last year"
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
                  label="Donor Name"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Last year's donor"
                  error={formState.errors.donorName?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="lettersWritten"
              render={({ field: { onChange, value } }) => (
                <ModalSelectField
                  label="Letters Written"
                  value={value ?? null}
                  options={LETTERS_OPTIONS}
                  onChange={onChange}
                  placeholder="Select count"
                  error={formState.errors.lettersWritten?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="achievement"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Student Achievement"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Awards, activities, etc."
                  error={formState.errors.achievement?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="percentage"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Secured Percentage"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="e.g. 85% or First Class"
                  error={formState.errors.percentage?.message}
                  required
                />
              )}
            />
          </FormCard>

          {/* ── Bank Details ── */}
          <FormSectionHeader icon="card" title="Bank Details" showRequired />

          <FormCard>
            <Text style={styles.bankNote}>
              The financial support amount will be transferred directly to the student's bank
              account. Make sure you are giving the correct details.
            </Text>
            <Controller
              control={control}
              name="accountHolder"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Account Holder Name (as per Passbook)"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Name as in bank records"
                  error={formState.errors.accountHolder?.message}
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
              name="branch"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="Bank Branch Name"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Branch name"
                  error={formState.errors.branch?.message}
                  required
                />
              )}
            />
          </FormCard>

          {/* ── Documents Upload ── */}
          <FormSectionHeader icon="document-attach" title="Documents Upload" />

          <FormCard>
            <Text style={styles.docNote}>
              Make sure you upload clear photos of all documents.{'\n'}
              Only one file per document is allowed (Max: 10 MB).
            </Text>

            <FileUploadField
              title="Latest Marksheet / Semester Result"
              subtitle="Max file size: 10 MB"
              badge="Optional"
              file={marksheet?.file}
              meta={uploadMeta.marksheetFile}
              onUpload={() => handlePickFile('marksheetFile')}
              onDelete={() => handleDeleteFile('marksheetFile')}
              acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
            />

            <FileUploadField
              title="Fees Receipt"
              subtitle="Max file size: 10 MB"
              badge="Optional"
              file={feesReceipt?.file}
              meta={uploadMeta.feesReceiptFile}
              onUpload={() => handlePickFile('feesReceiptFile')}
              onDelete={() => handleDeleteFile('feesReceiptFile')}
              acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
            />

            <FileUploadField
              title="Student Bank Passbook (First Page)"
              subtitle="Max file size: 10 MB"
              badge="Optional"
              file={passbook?.file}
              meta={uploadMeta.passbookFile}
              onUpload={() => handlePickFile('passbookFile')}
              onDelete={() => handleDeleteFile('passbookFile')}
              acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
            />

            <FileUploadField
              title="Student Latest Selfie / Photo"
              subtitle="Max file size: 10 MB"
              badge="Optional"
              file={selfie?.file}
              meta={uploadMeta.selfieFile}
              onUpload={() => handlePickFile('selfieFile')}
              onDelete={() => handleDeleteFile('selfieFile')}
              acceptedTypes={['image/jpeg', 'image/png']}
            />

            <FileUploadField
              title="Student Aadhaar Card Photo"
              subtitle="Max file size: 10 MB"
              badge="Optional"
              file={aadhaar?.file}
              meta={uploadMeta.aadhaarFile}
              onUpload={() => handlePickFile('aadhaarFile')}
              onDelete={() => handleDeleteFile('aadhaarFile')}
              acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
            />

            <Controller
              control={control}
              name="houseVisitLink"
              render={({ field: { onChange, value } }) => (
                <VPInputField
                  label="House Visit Google Link"
                  value={value ?? ''}
                  onChangeText={onChange}
                  placeholder="Paste Google link here"
                  keyboardType="url"
                  autoCapitalize="none"
                  error={formState.errors.houseVisitLink?.message}
                  required
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

          {/* Submit */}
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
                  <Text style={styles.submitButtonText}>Submit</Text>
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
    marginBottom: spacing.md,
  },
  noteHeading: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: '#92400E',
    fontWeight: '700',
    marginBottom: 2,
  },
  noteText: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: '#92400E',
  },
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
  guidelineSubHeading: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: '#1D4ED8',
    fontWeight: '600',
    marginTop: spacing.xs,
    marginBottom: 2,
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
    paddingLeft: spacing.xs,
  },
  requiredNote: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.error,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  sectionNote: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontStyle: 'italic',
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
    backgroundColor: colors.success,
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
