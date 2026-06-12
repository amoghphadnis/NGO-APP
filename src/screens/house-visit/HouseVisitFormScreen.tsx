/**
 * House Visit Form Screen - Simplified Implementation
 * Sections A-L - Comprehensive Household Assessment
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { houseVisitApi } from '@/api/houseVisitApi';
import { pickDocument } from '@/utils/filePicker';

// ============================================================================
// Reusable Form Components (defined outside main component to prevent re-renders)
// ============================================================================

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

const InputField = React.memo(function InputField({ label, value, onChange, placeholder, multiline }: InputFieldProps) {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );
});

interface CheckboxGroupProps {
  label: string;
  options: string[];
  values: string[];
  onToggle: (value: string) => void;
}

const CheckboxGroup = React.memo(function CheckboxGroup({ label, options, values, onToggle }: CheckboxGroupProps) {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.checkboxRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.checkbox, values.includes(opt) && styles.checkboxSelected]}
            onPress={() => onToggle(opt)}
            activeOpacity={0.7}
          >
            <Text style={[styles.checkboxText, values.includes(opt) && styles.checkboxTextSelected]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

interface RadioGroupProps {
  label: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
}

const RadioGroup = React.memo(function RadioGroup({ label, options, value, onSelect }: RadioGroupProps) {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.checkboxRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.checkbox, value === opt && styles.checkboxSelected]}
            onPress={() => onSelect(opt)}
            activeOpacity={0.7}
          >
            <Text style={[styles.checkboxText, value === opt && styles.checkboxTextSelected]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

export default function HouseVisitFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ studentId: string; source: string; studentName?: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const studentId = parseInt(params.studentId || '0', 10);
  const source = params.source || 'puc';
  const initialStudentName = params.studentName ? decodeURIComponent(params.studentName) : '';

  // DateTime picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDeclarationDatePicker, setShowDeclarationDatePicker] = useState(false);

  // Form state - all fields from HTML reference
  const [formData, setFormData] = useState({
    // Section A
    studentName: initialStudentName,
    courseInstitution: '',
    address: '',
    visitDate: new Date().toISOString(), // Store as ISO string
    fieldSupervisor: '',
    personsInteracted: '',

    // Section B
    houseType: [] as string[],
    ownership: [] as string[],
    rooms: [] as string[],
    floor: [] as string[],

    // Social Data
    rationCard: '',
    digitalAccess: '',
    livingCondition: [] as string[],
    latestElecBill: '',
    elecUnitsCons: '',
    internetBillCharges: '',
    remarkLivingCondition: '',

    // Section C: Family
    familyMembers: [{ name: '', relation: '', age: '', education: '', occupation: '', income: '' }],
    totalFamily: '',

    // Section D: Income
    primaryIncome: [] as string[],
    natureOfIncome: [] as string[],
    primaryEarningPerson: '',
    averageIncome: '',
    incomeShocks: [] as string[],

    // Section E: Land
    agriculturalLand: [] as string[],
    waterSource: [] as string[],
    cropPattern: [] as string[],
    otherLandHoldings: '',

    // Section F: Education
    totalChildrenStudying: '',
    annualEducationExpense: '',
    scholarshipSupport: '',
    governmentSchemes: '',

    // Section G: Debt
    educationalLoanAmount: '',
    outstandingLoans: [] as string[],
    outstandingLoanAmount: '',
    monthlyEMI: '',

    // Section H: Health
    vulnerability: '',
    healthRemarks: '',

    // Section I: Assets
    assets: [] as string[],

    // Section J: Student Development
    extracurricular: [] as string[],
    studentAspiration: '',
    consentParticipation: '',
    studentDevRemarks: '',

    // Section K: Assessment
    vulnerabilityLevel: [] as string[],
    studentMotivation: '',
    recommendation: [] as string[],
    justification: '',

    // Section L: Declaration
    declaration: '',
    declarationDate: new Date().toISOString().split('T')[0],
    uploadedFiles: [] as { uri: string; name: string; type: string; size: number }[],
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field: string, value: string) => {
    setFormData((prev) => {
      const current = (prev as any)[field] as string[];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const updateFamilyMember = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.familyMembers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, familyMembers: updated };
    });
  };

  const addFamilyMember = () => {
    setFormData((prev) => ({
      ...prev,
      familyMembers: [...prev.familyMembers, { name: '', relation: '', age: '', education: '', occupation: '', income: '' }],
    }));
  };

  const handleFilePick = async () => {
    const file = await pickDocument();
    if (file) {
      setFormData(prev => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, file],
      }));
      Alert.alert('Success', `File "${file.name}" selected successfully`);
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index),
    }));
  };

  const onSubmit = async () => {
    if (!formData.studentName || !formData.address) {
      Alert.alert('Error', 'Please fill in required fields (Student Name, Address)');
      return;
    }

    setIsSubmitting(true);
    try {
      // Build payload
      const payload = {
        StudentID: studentId,
        Source: source.toUpperCase(),
        StudentName: formData.studentName,
        CourseInstitution: formData.courseInstitution,
        Address: formData.address,
        VisitDate: formData.visitDate,
        FieldSupervisorName: formData.fieldSupervisor,
        PersonsInteracted: formData.personsInteracted,
        HouseType: formData.houseType.join(','),
        Ownership: formData.ownership.join(','),
        Rooms: formData.rooms.join(','),
        Floor: formData.floor.join(','),
        RationCardType: formData.rationCard,
        DigitalAccess: formData.digitalAccess,
        LivingCondition: formData.livingCondition.join(','),
        LatestElecBill: formData.latestElecBill,
        ElecUnitsCons: formData.elecUnitsCons,
        InternetBillCharges: formData.internetBillCharges,
        RemarkGeneralLivingCondition: formData.remarkLivingCondition,
        FamilyMembers: formData.familyMembers.map(m => ({
          Name: m.name,
          Relation: m.relation,
          Age: m.age,
          Education: m.education,
          Occupation: m.occupation,
          MonthlyIncome: m.income,
        })),
        Totalfamily: formData.totalFamily,
        PrimaryIncomeSource: formData.primaryIncome.join(','),
        NatureofIncome: formData.natureOfIncome.join(','),
        PrimaryEarning: formData.primaryEarningPerson,
        AverageIncome: formData.averageIncome,
        IncomeShocks: formData.incomeShocks.join(','),
        AgriculturalLand: formData.agriculturalLand.join(','),
        WaterSource: formData.waterSource.join(','),
        CropPattern: formData.cropPattern.join(','),
        OtherLandHoldings: formData.otherLandHoldings,
        TotalChildrenStudying: formData.totalChildrenStudying,
        AnnualEducationExpense: formData.annualEducationExpense,
        ScholarshipSupport: formData.scholarshipSupport,
        GovernmentSchemes: formData.governmentSchemes,
        EducationalLoanAmount: formData.educationalLoanAmount,
        AnyOutstandingLoans: formData.outstandingLoans.join(','),
        OutstandingLoanAmount: formData.outstandingLoanAmount,
        MonthlyEMI: formData.monthlyEMI,
        HealthVulnerability: formData.vulnerability,
        HealthVulnerabilityRemarks: formData.healthRemarks,
        Assets: formData.assets.join(','),
        Extracurricular: formData.extracurricular.join(','),
        StudentAspiration: formData.studentAspiration,
        ConsentParticipation: formData.consentParticipation,
        Remarks: formData.studentDevRemarks,
        HouseholdVulnerabilityLevel: formData.vulnerabilityLevel.join(','),
        StudentMotivation: formData.studentMotivation,
        Recommendation: formData.recommendation.join(','),
        SupervisorJustification: formData.justification,
        DeclarationConfirmation: formData.declaration,
        DeclarationDate: formData.declarationDate,
      };

      console.log('[HouseVisit] Submitting payload:', JSON.stringify(payload, null, 2));
      
      const response = await houseVisitApi.create(payload);

      console.log('[HouseVisit] API response:', JSON.stringify(response, null, 2));

      if (response.success) {
        Alert.alert(
          'Success',
          'House visit form submitted successfully!',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to submit form');
      }
    } catch (error: any) {
      console.error('[HouseVisit] Submit error:', error);
      Alert.alert(
        'Error',
        error?.message || 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>House Visit Form</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={styles.infoText}>Student ID: {studentId} | Type: {source.toUpperCase()}</Text>
        </View>

        {/* Section A: Basic Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>A. Basic Details</Text>
          <InputField label="Student Name *" value={formData.studentName} onChange={(v: string) => updateField('studentName', v)} placeholder="Enter student name" />
          <InputField label="Course & Institution" value={formData.courseInstitution} onChange={(v: string) => updateField('courseInstitution', v)} placeholder="Enter course and institution" />
          <InputField label="Address *" value={formData.address} onChange={(v: string) => updateField('address', v)} placeholder="Enter address" multiline />

          {/* Date & Time Picker */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Date & Time of Visit *</Text>
            <TouchableOpacity 
              style={styles.dateTimeButton} 
              onPress={() => {
                if (Platform.OS === 'android') {
                  // Android opens native dialog automatically
                  setShowDatePicker(true);
                } else {
                  setShowDatePicker(!showDatePicker);
                }
              }}
            >
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <Text style={styles.dateTimeText}>
                {formData.visitDate ? new Date(formData.visitDate).toLocaleString() : 'Tap to select Date & Time'}
              </Text>
            </TouchableOpacity>
            {/* iOS Date Picker shown as overlay outside ScrollView */}
          </View>

          <InputField label="Field Supervisor Name" value={formData.fieldSupervisor} onChange={(v: string) => updateField('fieldSupervisor', v)} placeholder="Enter supervisor name" />
          <InputField label="Person(s) Interacted Onsite" value={formData.personsInteracted} onChange={(v: string) => updateField('personsInteracted', v)} placeholder="Enter names of persons interacted" />
        </View>

        {/* Section B: Housing & Living Conditions */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>B. Housing & Living Conditions</Text>
          <CheckboxGroup label="Type of House" options={['Kutcha', 'Semi-Pucca', 'Pucca']} values={formData.houseType} onToggle={(v) => toggleArrayValue('houseType', v)} />
          <CheckboxGroup label="Ownership" options={['Own', 'Rented', "Relative's", 'Government Housing']} values={formData.ownership} onToggle={(v) => toggleArrayValue('ownership', v)} />
          <CheckboxGroup label="Rooms" options={['1', '2', 'More than 3']} values={formData.rooms} onToggle={(v) => toggleArrayValue('rooms', v)} />
          <CheckboxGroup label="Floor" options={['Ground', '1', '2', '3+']} values={formData.floor} onToggle={(v) => toggleArrayValue('floor', v)} />
          <Text style={styles.sectionTitle}>Social Data</Text>
          <RadioGroup label="Ration Card Type" options={['BPL', 'PHH', 'NPHH', 'APL']} value={formData.rationCard} onSelect={(v) => updateField('rationCard', v)} />
          <RadioGroup label="Digital & Learning Access" options={['Smartphone', 'Keypad', 'iPhone', 'Laptop / Tablet']} value={formData.digitalAccess} onSelect={(v) => updateField('digitalAccess', v)} />
          <CheckboxGroup label="General Living Condition" options={['Poor', 'Average', 'Satisfactory']} values={formData.livingCondition} onToggle={(v) => toggleArrayValue('livingCondition', v)} />
          <InputField label="Latest Electricity Bill Amount" value={formData.latestElecBill} onChange={(v: string) => updateField('latestElecBill', v)} placeholder="Enter amount" />
          <InputField label="Electricity Units Consumed" value={formData.elecUnitsCons} onChange={(v: string) => updateField('elecUnitsCons', v)} placeholder="Enter units" />
          <InputField label="Internet Bill Charges" value={formData.internetBillCharges} onChange={(v: string) => updateField('internetBillCharges', v)} placeholder="Enter amount" />
          <InputField label="Remarks on General Living Condition" value={formData.remarkLivingCondition} onChange={(v: string) => updateField('remarkLivingCondition', v)} placeholder="Enter remarks" multiline />
        </View>

        {/* Section C: Family Composition */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>C. Family Composition</Text>
          {formData.familyMembers.map((member, idx) => (
            <View key={idx} style={styles.familyRow}>
              <Text style={styles.familyLabel}>Member {idx + 1}</Text>
              <InputField label="Name" value={member.name} onChange={(v: string) => updateFamilyMember(idx, 'name', v)} placeholder="Enter name" />
              <InputField label="Relation" value={member.relation} onChange={(v: string) => updateFamilyMember(idx, 'relation', v)} placeholder="Enter relation" />
              <InputField label="Age" value={member.age} onChange={(v: string) => updateFamilyMember(idx, 'age', v)} placeholder="Enter age" />
              <InputField label="Education" value={member.education} onChange={(v: string) => updateFamilyMember(idx, 'education', v)} placeholder="Enter education" />
              <InputField label="Occupation" value={member.occupation} onChange={(v: string) => updateFamilyMember(idx, 'occupation', v)} placeholder="Enter occupation" />
              <InputField label="Monthly Income" value={member.income} onChange={(v: string) => updateFamilyMember(idx, 'income', v)} placeholder="Enter income" />
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addFamilyMember}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Family Member</Text>
          </TouchableOpacity>
          <InputField label="Total Family Members" value={formData.totalFamily} onChange={(v: string) => updateField('totalFamily', v)} placeholder="Enter total family count" />
        </View>

        {/* Section D: Income & Livelihood */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>D. Income Stability & Livelihood</Text>
          <CheckboxGroup label="Primary Income Source" options={['Daily Wage', 'Agriculture', 'Private Job', 'Self-Employed', 'Pension']} values={formData.primaryIncome} onToggle={(v) => toggleArrayValue('primaryIncome', v)} />
          <CheckboxGroup label="Nature of Income" options={['Regular', 'Irregular', 'Seasonal']} values={formData.natureOfIncome} onToggle={(v) => toggleArrayValue('natureOfIncome', v)} />
          <InputField label="Primary Earning Person" value={formData.primaryEarningPerson} onChange={(v: string) => updateField('primaryEarningPerson', v)} placeholder="Enter name of primary earner" />
          <InputField label="Average Monthly Income" value={formData.averageIncome} onChange={(v: string) => updateField('averageIncome', v)} placeholder="Enter average income" />
          <CheckboxGroup label="Income Shocks Experienced" options={['Job Loss', 'Crop Failure', 'Health Emergency']} values={formData.incomeShocks} onToggle={(v) => toggleArrayValue('incomeShocks', v)} />
        </View>

        {/* Section E: Land Holdings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>E. Land & Other Holdings</Text>
          <CheckboxGroup label="Agricultural Land" options={['Dry Land', 'Irrigated Land', 'Farm']} values={formData.agriculturalLand} onToggle={(v) => toggleArrayValue('agriculturalLand', v)} />
          <CheckboxGroup label="Water Source" options={['Rainwater', 'Borewell', 'Canal', 'Other']} values={formData.waterSource} onToggle={(v) => toggleArrayValue('waterSource', v)} />
          <CheckboxGroup label="Crop Pattern" options={['Rabi', 'Kharif', 'Summer']} values={formData.cropPattern} onToggle={(v) => toggleArrayValue('cropPattern', v)} />
          <InputField label="Other Land Holdings" value={formData.otherLandHoldings} onChange={(v: string) => updateField('otherLandHoldings', v)} placeholder="Enter other land holdings" />
        </View>

        {/* Section F: Educational Expenses */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>F. Educational Expenses</Text>
          <InputField label="Total Children Studying" value={formData.totalChildrenStudying} onChange={(v: string) => updateField('totalChildrenStudying', v)} placeholder="Enter number of children" />
          <InputField label="Annual Education Expense" value={formData.annualEducationExpense} onChange={(v: string) => updateField('annualEducationExpense', v)} placeholder="Enter annual expense" />
          <RadioGroup label="Scholarship Support" options={['Yes', 'No']} value={formData.scholarshipSupport} onSelect={(v) => updateField('scholarshipSupport', v)} />
          <InputField label="Government Schemes" value={formData.governmentSchemes} onChange={(v: string) => updateField('governmentSchemes', v)} placeholder="Enter government schemes if any" />
        </View>

        {/* Section G: Debt & Financial */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>G. Debt & Financial Stress</Text>
          <InputField label="Educational Loan Amount" value={formData.educationalLoanAmount} onChange={(v: string) => updateField('educationalLoanAmount', v)} placeholder="Enter loan amount" />
          <CheckboxGroup label="Any Outstanding Loans" options={['Bank', 'SHG', 'Private', 'Moneylender']} values={formData.outstandingLoans} onToggle={(v) => toggleArrayValue('outstandingLoans', v)} />
          <InputField label="Outstanding Loan Amount" value={formData.outstandingLoanAmount} onChange={(v: string) => updateField('outstandingLoanAmount', v)} placeholder="Enter outstanding amount" />
          <InputField label="Monthly EMI" value={formData.monthlyEMI} onChange={(v: string) => updateField('monthlyEMI', v)} placeholder="Enter monthly EMI" />
        </View>

        {/* Section H: Health Vulnerability */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>H. Health & Social Vulnerability</Text>
          <RadioGroup label="Vulnerability Type" options={['Chronic Illness', 'Disability', 'Single Parent', 'Orphan/Guardian', 'Elderly Dependents']} value={formData.vulnerability} onSelect={(v) => updateField('vulnerability', v)} />
          <InputField label="Remarks" value={formData.healthRemarks} onChange={(v: string) => updateField('healthRemarks', v)} placeholder="Enter remarks on health vulnerability" multiline />
        </View>

        {/* Section I: Assets & Digital Learning */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>I. Assets & Digital Learning Access</Text>
          <CheckboxGroup label="Assets" options={['Tractor', 'Car', 'Livestock', 'Two-wheeler', 'Other']} values={formData.assets} onToggle={(v) => toggleArrayValue('assets', v)} />
        </View>

        {/* Section J: Student Development */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>J. Student Development & Participation</Text>
          <CheckboxGroup label="Extracurricular" options={['Sports', 'NSS', 'NMMS Exam', 'Dance', 'Debate', 'Music', 'Other', 'No Participation']} values={formData.extracurricular} onToggle={(v) => toggleArrayValue('extracurricular', v)} />
          <InputField label="Student Aspiration" value={formData.studentAspiration} onChange={(v: string) => updateField('studentAspiration', v)} placeholder="Enter student aspirations" />
          <RadioGroup label="Consent for Participation" options={['Yes', 'No']} value={formData.consentParticipation} onSelect={(v) => updateField('consentParticipation', v)} />
          <InputField label="Remarks" value={formData.studentDevRemarks} onChange={(v: string) => updateField('studentDevRemarks', v)} placeholder="Enter remarks" multiline />
        </View>

        {/* Section K: Supervisor Assessment */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>K. Supervisor's Assessment</Text>
          <CheckboxGroup label="Household Vulnerability Level" options={['High', 'Moderate', 'Low']} values={formData.vulnerabilityLevel} onToggle={(v) => toggleArrayValue('vulnerabilityLevel', v)} />
          <RadioGroup label="Student Motivation" options={['High', 'Average', 'Needs Support']} value={formData.studentMotivation} onSelect={(v) => updateField('studentMotivation', v)} />
          <CheckboxGroup label="Recommendation" options={['Strongly Recommended', 'Recommended', 'Not Recommended']} values={formData.recommendation} onToggle={(v) => toggleArrayValue('recommendation', v)} />
          <InputField label="Justification" value={formData.justification} onChange={(v: string) => updateField('justification', v)} placeholder="Enter justification for recommendation" multiline />
        </View>

        {/* Section L: Declaration & File Upload */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>L. Declaration & Document Upload</Text>
          <InputField label="Declaration Confirmation *" value={formData.declaration} onChange={(v: string) => updateField('declaration', v)} placeholder="Enter declaration confirmation" multiline />

          {/* Declaration Date Picker */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Declaration Date</Text>
            <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDeclarationDatePicker(true)}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <Text style={formData.declarationDate ? styles.dateTimeText : styles.dateTimePlaceholder}>
                {formData.declarationDate ? new Date(formData.declarationDate).toLocaleDateString() : 'Select Date'}
              </Text>
            </TouchableOpacity>
            {showDeclarationDatePicker && (
              <DateTimePicker
                value={formData.declarationDate ? new Date(formData.declarationDate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === 'android') {
                    setShowDeclarationDatePicker(false);
                  }
                  if (selectedDate) {
                    updateField('declarationDate', selectedDate.toISOString().split('T')[0]);
                  }
                }}
              />
            )}
          </View>
          <View style={styles.uploadSection}>
            <Text style={styles.label}>Upload Documents / Photos</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handleFilePick}>
              <Ionicons name="camera" size={20} color="#FFFFFF" />
              <Text style={styles.uploadButtonText}>Select Files</Text>
            </TouchableOpacity>
            <Text style={styles.uploadHint}>Upload house visit photos, documents, or supporting evidence</Text>
            
            {/* Display selected files */}
            {formData.uploadedFiles.length > 0 && (
              <View style={styles.selectedFilesContainer}>
                <Text style={styles.selectedFilesTitle}>Selected Files:</Text>
                {formData.uploadedFiles.map((file, index) => (
                  <React.Fragment key={`file-${index}`}>
                    <View style={styles.fileItem}>
                      <Ionicons name="document-outline" size={16} color={colors.primary} />
                      <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                      <TouchableOpacity onPress={() => removeFile(index)} style={styles.removeFileButton}>
                        <Ionicons name="close-circle" size={20} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </React.Fragment>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]} onPress={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>Submit House Visit</Text>}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* iOS DateTimePicker Overlay - Outside ScrollView */}
      {showDatePicker && Platform.OS === 'ios' && (
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerBackdrop} />
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Date & Time</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.pickerDone}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={formData.visitDate ? new Date(formData.visitDate) : new Date()}
              mode="datetime"
              display="spinner"
              style={styles.datePicker}
              textColor="#000000"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  updateField('visitDate', selectedDate.toISOString());
                }
              }}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, position: 'relative' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  backButton: { padding: spacing.xs, marginRight: spacing.sm },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
  scrollView: { flex: 1 },
  content: { padding: spacing.md },
  infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary + '10', padding: spacing.md, borderRadius: 8, marginBottom: spacing.md, gap: spacing.sm },
  infoText: { fontSize: 14, color: colors.textPrimary, fontWeight: '500' },
  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.primary, marginBottom: spacing.md },
  formGroup: { marginBottom: spacing.md },
  label: { fontSize: 14, fontWeight: '500', color: colors.textPrimary, marginBottom: spacing.xs },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: spacing.sm, fontSize: 14, color: colors.textPrimary },
  inputMultiline: { height: 80, textAlignVertical: 'top' },
  checkboxRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  checkbox: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: '#FFFFFF' },
  checkboxSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkboxText: { fontSize: 13, color: colors.textPrimary },
  checkboxTextSelected: { color: '#FFFFFF', fontWeight: '500' },
  familyRow: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: spacing.md, marginBottom: spacing.md },
  familyLabel: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.sm },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, padding: spacing.sm, borderRadius: 8, gap: spacing.xs },
  addButtonText: { color: '#FFFFFF', fontWeight: '500' },
  submitButton: { backgroundColor: colors.success, padding: spacing.md, borderRadius: 12, alignItems: 'center', marginTop: spacing.lg },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  uploadSection: { marginTop: spacing.md, padding: spacing.md, backgroundColor: colors.background, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  uploadButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, padding: spacing.sm, borderRadius: 8, gap: spacing.xs, marginTop: spacing.sm },
  uploadButtonText: { color: '#FFFFFF', fontWeight: '500' },
  uploadHint: { fontSize: 12, color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' },
  selectedFilesContainer: { marginTop: spacing.md },
  selectedFilesTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.xs },
  fileItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: spacing.sm, borderRadius: 6, marginBottom: spacing.xs, borderWidth: 1, borderColor: colors.border },
  fileName: { flex: 1, fontSize: 13, color: colors.textPrimary, marginLeft: spacing.xs, marginRight: spacing.xs },
  removeFileButton: { padding: 2 },
  dateTimeButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: spacing.sm, 
    borderWidth: 1.5, 
    borderColor: '#9CA3AF', 
    borderRadius: 8, 
    padding: spacing.sm, 
    backgroundColor: '#FFFFFF',
    minHeight: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateTimeText: { fontSize: 14, color: colors.textPrimary, fontWeight: '500' },
  dateTimePlaceholder: { fontSize: 14, color: colors.textSecondary },
  datePicker: {
    height: 200,
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    zIndex: 999,
  },
  pickerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  pickerDone: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
