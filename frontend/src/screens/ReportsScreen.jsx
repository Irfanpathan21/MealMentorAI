import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import HealthMarkerRow from '../components/HealthMarkerRow';

export default function ReportsScreen() {
  const [selectedFile, setSelectedFile] = useState('blood_work_aug_2026.pdf');

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile(file.name);
        Alert.alert(
          'Health Report Uploaded! 📄',
          `"${file.name}" uploaded successfully. AI diagnostic parsing updated your biomarker insights.`,
          [{ text: 'OK' }]
        );
      }
    } catch (err) {
      console.warn('Document picker error:', err);
      Alert.alert('Upload Error', 'Could not open file picker. Please try again.');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Title & Description */}
      <View style={styles.headerSection}>
        <Text style={styles.screenTitle}>Health Report Analysis</Text>
        <Text style={styles.screenSubtitle}>
          Upload your latest lab results to personalize your nutritional plan.
        </Text>
      </View>

      {/* Document Upload Area */}
      <TouchableOpacity
        style={styles.dropzone}
        onPress={handleSelectFile}
        activeOpacity={0.8}
      >
        <View style={styles.uploadIconCircle}>
          <MaterialIcons name="upload-file" size={32} color={colors.primary} />
        </View>
        <Text style={styles.dropzoneTitle}>Upload Lab Report</Text>
        <Text style={styles.dropzoneSubtitle}>PDF, JPG, or PNG up to 10MB</Text>
        <View style={styles.selectFileButton}>
          <Text style={styles.selectFileText}>
            {selectedFile ? `Uploaded: ${selectedFile}` : 'Select File'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Parsed Health Markers */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <MaterialIcons name="biotech" size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Parsed Markers</Text>
        </View>

        <View style={styles.markersContainer}>
          <HealthMarkerRow
            name="LDL Cholesterol"
            value="142 mg/dL"
            status="High"
          />
          <HealthMarkerRow
            name="Fasting Glucose"
            value="95 mg/dL"
            status="Normal"
          />
          <HealthMarkerRow
            name="Vitamin D (25-OH)"
            value="22 ng/mL"
            status="Low"
          />
        </View>
      </View>

      {/* AI Interpretation */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <MaterialIcons name="auto-awesome" size={20} color={colors.aiGradientEnd} />
          <Text style={styles.sectionTitle}>AI Interpretation</Text>
        </View>

        <View style={styles.interpretationCard}>
          <Text style={styles.interpretationText}>
            Based on your recent lab results, we're optimizing your meal plan to target{' '}
            <Text style={styles.highlightPrimary}>elevated LDL cholesterol</Text> and{' '}
            <Text style={styles.highlightWarning}>low Vitamin D</Text>.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.adjustmentHeader}>RECOMMENDED ADJUSTMENTS</Text>

          <View style={styles.adjustmentsList}>
            <View style={styles.adjustmentItem}>
              <MaterialIcons name="check" size={18} color={colors.primary} style={styles.adjIcon} />
              <Text style={styles.adjustmentText}>
                Increase soluble fiber intake (oats, legumes, chia) by 15g/day.
              </Text>
            </View>

            <View style={styles.adjustmentItem}>
              <MaterialIcons name="check" size={18} color={colors.primary} style={styles.adjIcon} />
              <Text style={styles.adjustmentText}>
                Incorporate Vitamin D fortified foods and morning sunlight (15-20 min).
              </Text>
            </View>

            <View style={styles.adjustmentItem}>
              <MaterialIcons name="close" size={18} color={colors.error} style={styles.adjIcon} />
              <Text style={styles.adjustmentText}>
                Reduce saturated fats from heavy gravies and processed red meat by 20%.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 18,
  },
  screenTitle: {
    ...typography.headlineLg,
    fontSize: 24,
    color: colors.onBackground,
    fontWeight: '700',
    marginBottom: 4,
  },
  screenSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  dropzone: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  dropzoneTitle: {
    ...typography.headlineSm,
    fontSize: 16,
    color: colors.onBackground,
    fontWeight: '700',
    marginBottom: 4,
  },
  dropzoneSubtitle: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    marginBottom: 14,
  },
  selectFileButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    elevation: 2,
  },
  selectFileText: {
    ...typography.labelCaps,
    fontSize: 11,
    color: colors.onPrimary,
    fontWeight: '700',
  },
  section: {
    marginBottom: 22,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    ...typography.headlineSm,
    fontSize: 16,
    color: colors.onBackground,
    fontWeight: '700',
  },
  markersContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  interpretationCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 16,
    borderWidth: 0,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  interpretationText: {
    ...typography.bodyMd,
    color: colors.onBackground,
    lineHeight: 22,
  },
  highlightPrimary: {
    fontWeight: '700',
    color: colors.primary,
  },
  highlightWarning: {
    fontWeight: '700',
    color: colors.chartCarbs,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    marginVertical: 12,
  },
  adjustmentHeader: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.onSurfaceVariant,
    marginBottom: 10,
  },
  adjustmentsList: {
    gap: 10,
  },
  adjustmentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  adjIcon: {
    marginTop: 2,
  },
  adjustmentText: {
    ...typography.bodySm,
    color: colors.onBackground,
    flex: 1,
    lineHeight: 18,
  },
});
