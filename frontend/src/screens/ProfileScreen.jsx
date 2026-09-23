import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function ProfileScreen({
  currentUser,
  userProfile,
  onEditGoals,
  onLogout,
  onExportPdf,
  onNavigateToReports,
  onNavigateToAnalytics,
}) {
  const [portionAlerts, setPortionAlerts] = useState(true);
  const [hydrationAlerts, setHydrationAlerts] = useState(true);
  const [proactiveNudges, setProactiveNudges] = useState(true);

  const userName = currentUser?.name || userProfile?.fullName || 'Ananya Sharma';
  const userEmail = currentUser?.email || 'ananya.sharma@example.com';
  const age = userProfile?.age || '28';
  const height = userProfile?.heightCm || '165';
  const weight = userProfile?.weightKg || '65';
  const bmi = userProfile?.bmi || '23.9';
  const bmiCategory = userProfile?.bmiCategory || 'Normal';
  const goalTitle = userProfile?.goalTitle || 'Manage Blood Sugar & Diabetes';
  const dietLabel = userProfile?.dietLabel || 'Pure Vegetarian';
  const regionalCuisine = userProfile?.regionalCuisine || 'North Indian';
  const calories = userProfile?.dailyCalorieTarget || 1850;
  const protein = userProfile?.macroGrams?.protein || 101;
  const carbs = userProfile?.macroGrams?.carbs || 180;
  const fats = userProfile?.macroGrams?.fats || 55;

  const handleExportData = () => {
    if (onExportPdf) {
      onExportPdf();
    } else {
      Alert.alert(
        'Export Clinical Report 📄',
        `Preparing PDF health summary for ${userName}:\n• Blood Biomarkers (Apollo Diagnostics)\n• Calorie & Macro Adherence (Last 30 Days)\n• Dietary Archetype: ${dietLabel} (${regionalCuisine})\n\nReady to download & share with your physician.`,
        [{ text: 'Download PDF', onPress: () => Alert.alert('Downloaded', 'MealMentor_Clinical_Report.pdf saved to device.') }, { text: 'Cancel', style: 'cancel' }]
      );
    }
  };

  const handleSyncDiagnostics = () => {
    Alert.alert(
      'Diagnostic Sync Active 🩺',
      'Syncing with ABDM (Ayushman Bharat) and Apollo Diagnostics cloud vault... All clinical markers up to date.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Ambient Top Glow */}
      <View style={styles.topAmbientGlow} />

      {/* Header Bar */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity
          style={styles.editHeaderBtn}
          onPress={onEditGoals}
          activeOpacity={0.7}
        >
          <MaterialIcons name="edit" size={18} color={colors.primary} />
          <Text style={styles.editHeaderBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.avatarRow}>
          <View style={styles.avatarRing}>
            <LinearGradient
              colors={[colors.primary, '#10b981']}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarInitials}>
                {userName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </Text>
            </LinearGradient>
            <View style={styles.avatarBadge}>
              <MaterialIcons name="check" size={12} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.userInfoCol}>
            <Text style={styles.userNameText}>{userName}</Text>
            <View style={styles.verifiedEmailRow}>
              <MaterialIcons name="verified" size={14} color={colors.primary} />
              <Text style={styles.userEmailText} numberOfLines={1}>
                {userEmail}
              </Text>
            </View>
            <View style={styles.memberPill}>
              <MaterialIcons name="auto-awesome" size={12} color={colors.primary} />
              <Text style={styles.memberPillText}>Clinical Care Member • Pro</Text>
            </View>
          </View>
        </View>

        {/* 4-Stat Biometric Micro-Pill Matrix */}
        <View style={styles.biometricGrid}>
          <View style={styles.bioChip}>
            <Text style={styles.bioChipLabel}>AGE</Text>
            <Text style={styles.bioChipValue}>{age} yrs</Text>
          </View>
          <View style={styles.bioChip}>
            <Text style={styles.bioChipLabel}>HEIGHT</Text>
            <Text style={styles.bioChipValue}>{height} cm</Text>
          </View>
          <View style={styles.bioChip}>
            <Text style={styles.bioChipLabel}>WEIGHT</Text>
            <Text style={styles.bioChipValue}>{weight} kg</Text>
          </View>
          <View style={styles.bioChip}>
            <Text style={styles.bioChipLabel}>BMI</Text>
            <Text style={styles.bioChipValue}>
              {bmi} <Text style={styles.bmiStatusText}>({bmiCategory})</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* 2 Dedicated Hub Bars: Medical Lab Reports & Nutrition Analytics */}
      <View style={styles.hubBarsSection}>
        <TouchableOpacity
          style={styles.hubBar}
          onPress={onNavigateToReports}
          activeOpacity={0.8}
        >
          <View style={[styles.hubIconCircle, { backgroundColor: 'rgba(15, 118, 110, 0.12)' }]}>
            <MaterialIcons name="biotech" size={24} color={colors.primary} />
          </View>
          <View style={styles.hubBarContent}>
            <Text style={styles.hubBarTitle}>Medical Lab Reports</Text>
            <Text style={styles.hubBarSubtitle}>
              Upload & inspect latest blood test PDF and clinical markers
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.hubBar}
          onPress={onNavigateToAnalytics}
          activeOpacity={0.8}
        >
          <View style={[styles.hubIconCircle, { backgroundColor: 'rgba(14, 165, 233, 0.12)' }]}>
            <MaterialIcons name="insights" size={24} color={colors.chartProtein} />
          </View>
          <View style={styles.hubBarContent}>
            <Text style={styles.hubBarTitle}>Nutrition Analytics & Trends</Text>
            <Text style={styles.hubBarSubtitle}>
              7-day calorie adherence, macro splits & nutrient coverage
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Health Baseline & Clinical Focus Card */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleLeft}>
            <MaterialIcons name="track-changes" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Health Baseline & Clinical Focus</Text>
          </View>
          <TouchableOpacity onPress={onEditGoals} activeOpacity={0.7}>
            <Text style={styles.sectionHeaderLink}>Edit Goals</Text>
          </TouchableOpacity>
        </View>

        {/* Primary Goal Pill */}
        <View style={styles.goalHighlightBox}>
          <View style={styles.goalIconCircle}>
            <MaterialIcons name="bloodtype" size={18} color={colors.primary} />
          </View>
          <View style={styles.goalInfoCol}>
            <Text style={styles.goalMainTitle}>{goalTitle}</Text>
            <Text style={styles.goalSubtitleText}>
              Personalized glycemic calibration & Indian plate balancing
            </Text>
          </View>
          <View style={styles.activeProtocolBadge}>
            <Text style={styles.activeProtocolText}>Active</Text>
          </View>
        </View>

        {/* Dietary Archetype Row */}
        <View style={styles.dietaryRow}>
          <MaterialIcons name="grass" size={18} color={colors.chartCalories} />
          <Text style={styles.dietaryRowLabel}>Dietary Lifestyle:</Text>
          <Text style={styles.dietaryRowValue}>
            {dietLabel} ({regionalCuisine})
          </Text>
        </View>

        <View style={styles.macroSplitRow}>
          <View style={styles.macroSplitPill}>
            <Text style={styles.macroSplitNum}>{calories}</Text>
            <Text style={styles.macroSplitUnit}>kcal / day</Text>
          </View>
          <View style={styles.macroSplitPill}>
            <Text style={styles.macroSplitNum}>{protein}g</Text>
            <Text style={styles.macroSplitUnit}>Protein</Text>
          </View>
          <View style={styles.macroSplitPill}>
            <Text style={styles.macroSplitNum}>{carbs}g</Text>
            <Text style={styles.macroSplitUnit}>Carbs (Low GI)</Text>
          </View>
          <View style={styles.macroSplitPill}>
            <Text style={styles.macroSplitNum}>{fats}g</Text>
            <Text style={styles.macroSplitUnit}>Fats</Text>
          </View>
        </View>
      </View>

      {/* Connected Health & Biomarkers Card */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleLeft}>
            <MaterialIcons name="biotech" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Connected Health & Biomarkers</Text>
          </View>
          <TouchableOpacity onPress={handleSyncDiagnostics} activeOpacity={0.7}>
            <View style={styles.syncNowBadge}>
              <MaterialIcons name="sync" size={14} color={colors.primary} />
              <Text style={styles.syncNowText}>Sync Now</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.labSubtitle}>
          Latest Lab Sync: Aug 2026 • Apollo Diagnostics Vault
        </Text>

        {/* Quick Biomarker Chips */}
        <View style={styles.biomarkerRow}>
          <View style={styles.markerChip}>
            <Text style={styles.markerName}>Fasting Glucose</Text>
            <Text style={styles.markerVal}>95 mg/dL</Text>
            <View style={[styles.markerStatusPill, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[styles.markerStatusText, { color: colors.chartCalories }]}>
                Normal
              </Text>
            </View>
          </View>

          <View style={styles.markerChip}>
            <Text style={styles.markerName}>LDL Cholesterol</Text>
            <Text style={styles.markerVal}>142 mg/dL</Text>
            <View style={[styles.markerStatusPill, { backgroundColor: colors.errorContainer }]}>
              <Text style={[styles.markerStatusText, { color: colors.error }]}>High</Text>
            </View>
          </View>

          <View style={styles.markerChip}>
            <Text style={styles.markerName}>HbA1c Target</Text>
            <Text style={styles.markerVal}>5.6 %</Text>
            <View style={[styles.markerStatusPill, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[styles.markerStatusText, { color: colors.chartCalories }]}>
                Optimal
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Integrations Row */}
        <View style={styles.integrationsRow}>
          <View style={styles.integrationItem}>
            <View style={styles.onlineDot} />
            <MaterialIcons name="favorite" size={16} color="#E11D48" />
            <Text style={styles.integrationLabel}>Apple Health / Google Fit</Text>
          </View>
          <View style={styles.integrationItem}>
            <View style={styles.onlineDot} />
            <MaterialIcons name="health-and-safety" size={16} color={colors.primary} />
            <Text style={styles.integrationLabel}>ABDM Ayushman Bharat</Text>
          </View>
        </View>
      </View>

      {/* Clinical Settings & Notifications Card */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionTitleLeft}>
          <MaterialIcons name="tune" size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Clinical Alerts & AI Settings</Text>
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleTextCol}>
            <Text style={styles.toggleTitle}>Real-Time Indian Plate Alerts</Text>
            <Text style={styles.toggleDesc}>
              Portion warnings for rice, roti count, and sabzi fiber ratios.
            </Text>
          </View>
          <Switch
            value={portionAlerts}
            onValueChange={setPortionAlerts}
            trackColor={{ false: colors.outlineVariant, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.toggleRow}>
          <View style={styles.toggleTextCol}>
            <Text style={styles.toggleTitle}>Smart Hydration & Evening Checks</Text>
            <Text style={styles.toggleDesc}>
              Circadian digestive window nudges and water intake prompts.
            </Text>
          </View>
          <Switch
            value={hydrationAlerts}
            onValueChange={setHydrationAlerts}
            trackColor={{ false: colors.outlineVariant, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.toggleRow}>
          <View style={styles.toggleTextCol}>
            <Text style={styles.toggleTitle}>AI Dietitian Proactive Insights</Text>
            <Text style={styles.toggleDesc}>
              Dr. Aisha real-time meal suggestions based on glycemic trends.
            </Text>
          </View>
          <Switch
            value={proactiveNudges}
            onValueChange={setProactiveNudges}
            trackColor={{ false: colors.outlineVariant, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.exportPdfButton}
          onPress={handleExportData}
          activeOpacity={0.85}
        >
          <MaterialIcons name="picture-as-pdf" size={20} color={colors.primary} />
          <Text style={styles.exportPdfText}>Export Health Data & Reports (PDF)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            Alert.alert('Sign Out', 'Are you sure you want to sign out of MealMentor AI?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Out', style: 'destructive', onPress: onLogout },
            ]);
          }}
          activeOpacity={0.8}
        >
          <MaterialIcons name="logout" size={18} color={colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* ABDM Trust Footnote */}
      <View style={styles.footerTrust}>
        <MaterialIcons name="security" size={15} color={colors.primary} />
        <Text style={styles.footerTrustText}>
          ABDM Integrated • HIPAA & ISO 27001 Certified Clinical Vault
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 40,
    backgroundColor: colors.background,
  },
  topAmbientGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: 'rgba(204, 251, 241, 0.45)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    zIndex: 2,
  },
  headerTitle: {
    ...typography.headlineLg,
    fontSize: 24,
    color: colors.primary,
    fontWeight: '800',
  },
  editHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    elevation: 1,
  },
  editHeaderBtnText: {
    ...typography.bodySm,
    color: colors.primary,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarRing: {
    position: 'relative',
    marginRight: 16,
  },
  avatarGradient: {
    width: 68,
    height: 68,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  avatarInitials: {
    ...typography.headlineMd,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.chartCalories,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoCol: {
    flex: 1,
  },
  userNameText: {
    ...typography.headlineSm,
    color: colors.textMain,
    fontWeight: '800',
  },
  verifiedEmailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  userEmailText: {
    ...typography.bodySm,
    color: colors.textMuted,
  },
  memberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mintLight,
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
    alignSelf: 'flex-start',
    gap: 4,
  },
  memberPillText: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.primary,
    fontWeight: '700',
  },
  biometricGrid: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 14,
  },
  bioChip: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 0,
  },
  bioChipLabel: {
    ...typography.labelCaps,
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '700',
  },
  bioChipValue: {
    ...typography.bodySm,
    fontSize: 12,
    color: colors.textMain,
    fontWeight: '700',
    marginTop: 2,
  },
  bmiStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.headlineSm,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  sectionHeaderLink: {
    ...typography.bodySm,
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  goalHighlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mintLight,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.25)',
    marginBottom: 12,
    gap: 10,
  },
  goalIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalInfoCol: {
    flex: 1,
  },
  goalMainTitle: {
    ...typography.bodyMd,
    fontWeight: '700',
    color: colors.primary,
  },
  goalSubtitleText: {
    ...typography.bodySm,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  activeProtocolBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeProtocolText: {
    ...typography.labelCaps,
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  dietaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  dietaryRowLabel: {
    ...typography.bodySm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  dietaryRowValue: {
    ...typography.bodySm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  macroSplitRow: {
    flexDirection: 'row',
    gap: 6,
  },
  macroSplitPill: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 0,
  },
  macroSplitNum: {
    ...typography.bodySm,
    fontWeight: '800',
    color: colors.primary,
  },
  macroSplitUnit: {
    ...typography.labelCaps,
    fontSize: 9,
    color: colors.textSecondary,
  },
  syncNowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.mintLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  syncNowText: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.primary,
    fontWeight: '700',
  },
  labSubtitle: {
    ...typography.bodySm,
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  biomarkerRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  markerChip: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    borderWidth: 0,
    alignItems: 'center',
  },
  markerName: {
    ...typography.labelCaps,
    fontSize: 9,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  markerVal: {
    ...typography.bodySm,
    fontWeight: '800',
    color: colors.textPrimary,
    marginVertical: 4,
  },
  markerStatusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  markerStatusText: {
    ...typography.labelCaps,
    fontSize: 9,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginVertical: 12,
  },
  integrationsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  integrationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.chartCalories,
  },
  integrationLabel: {
    ...typography.bodySm,
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  toggleTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  toggleTitle: {
    ...typography.bodySm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  toggleDesc: {
    ...typography.bodySm,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionSection: {
    gap: 12,
    marginBottom: 20,
  },
  exportPdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 14,
  },
  exportPdfText: {
    ...typography.bodyMd,
    fontWeight: '700',
    color: colors.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  logoutText: {
    ...typography.bodySm,
    fontWeight: '700',
    color: colors.error,
  },
  footerTrust: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  footerTrustText: {
    ...typography.bodySm,
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  hubBarsSection: {
    gap: 10,
    marginBottom: 16,
  },
  hubBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceCard,
    borderRadius: 20,
    padding: 16,
    borderWidth: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    gap: 14,
  },
  hubIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubBarContent: {
    flex: 1,
  },
  hubBarTitle: {
    ...typography.bodyMd,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  hubBarSubtitle: {
    ...typography.bodySm,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
});
