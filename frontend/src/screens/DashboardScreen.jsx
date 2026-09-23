import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import CircularProgress from '../components/CircularProgress';
import AiInsightCard from '../components/AiInsightCard';
import MealCard from '../components/MealCard';

const { width } = Dimensions.get('window');

export default function DashboardScreen({
  currentUser = null,
  userProfile = null,
  meals = [],
  waterGlasses = 5,
  onUpdateWater,
  onNavigateToScan,
  onNavigateToChat,
  onNavigateToReports,
  onNavigateToAnalytics,
  onNavigateToSuggestions,
}) {
  const [selectedMeal, setSelectedMeal] = useState(null);

  // Targets based on userProfile or clinical defaults
  const targetCalories = Number(userProfile?.dailyCalorieTarget) || 2100;
  const targetProtein = Number(userProfile?.dailyProteinTarget) || 125;
  const targetCarbs = Number(userProfile?.dailyCarbsTarget) || 220;
  const targetFat = Number(userProfile?.dailyFatTarget) || 55;

  // Real dynamic calculations from logged meals
  const currentCalories = meals.reduce((sum, m) => sum + (Number(m.calories) || 0), 0);
  const currentProtein = meals.reduce((sum, m) => sum + (Number(m.protein) || 0), 0);
  const currentCarbs = meals.reduce((sum, m) => sum + (Number(m.carbs) || 0), 0);
  const currentFat = meals.reduce((sum, m) => sum + (Number(m.fat) || 0), 0);

  const remainingCalories = Math.max(0, targetCalories - currentCalories);
  const firstName = currentUser?.name?.split(' ')[0] || 'Health User';
  const activeGoal = userProfile?.goalTitle || 'Clinical Nutrition & Metabolic Health';

  const handleWaterChange = (delta) => {
    if (onUpdateWater) {
      const next = Math.max(0, Math.min(16, waterGlasses + delta));
      onUpdateWater(next);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Personalized Welcome Banner */}
      <View style={styles.welcomeBanner}>
        <View style={styles.welcomeTextCol}>
          <Text style={styles.welcomeGreeting}>Namaste, {firstName}! 🌿</Text>
          <View style={styles.goalPill}>
            <MaterialIcons name="verified" size={13} color={colors.primary} />
            <Text style={styles.goalPillText} numberOfLines={1}>
              {activeGoal}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.quickScanBtn}
          onPress={onNavigateToScan}
          activeOpacity={0.85}
        >
          <MaterialIcons name="camera-alt" size={16} color={colors.onPrimary} />
          <Text style={styles.quickScanText}>Scan Meal</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Overview Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Overview</Text>

        <View style={styles.macroGrid}>
          {/* Main Calorie Card (Full Width) */}
          <View style={styles.calorieCard}>
            <View style={styles.calorieTextContainer}>
              <Text style={styles.macroLabel}>CALORIES</Text>
              <View style={styles.calorieRow}>
                <Text style={styles.calorieMainNumber}>{currentCalories.toLocaleString()}</Text>
                <Text style={styles.calorieTarget}>/ {targetCalories.toLocaleString()} kcal</Text>
              </View>
              <Text style={styles.calorieRemaining}>
                {remainingCalories === 0 ? 'Target achieved today! 🎉' : `${remainingCalories} kcal remaining`}
              </Text>
            </View>

            <CircularProgress
              size={84}
              strokeWidth={9}
              progress={Math.min(1, currentCalories / Math.max(1, targetCalories))}
              color={colors.chartCalories}
              backgroundColor={colors.surfaceContainerHigh}
            >
              <MaterialIcons name="local-fire-department" size={28} color={colors.chartCalories} />
            </CircularProgress>
          </View>

          {/* Sub Macros Row: Protein, Carbs, Fat */}
          <View style={styles.subMacroRow}>
            {/* Protein Card */}
            <View style={styles.subMacroCard}>
              <Text style={styles.macroLabel}>PROTEIN</Text>
              <View style={styles.progressSpacing}>
                <CircularProgress
                  size={56}
                  strokeWidth={6}
                  progress={Math.min(1, currentProtein / Math.max(1, targetProtein))}
                  color={colors.chartProtein}
                  backgroundColor={colors.surfaceContainerHigh}
                />
              </View>
              <Text style={styles.macroValue}>
                {currentProtein}<Text style={styles.macroTotal}>/{targetProtein}g</Text>
              </Text>
            </View>

            {/* Carbs Card */}
            <View style={styles.subMacroCard}>
              <Text style={styles.macroLabel}>CARBS</Text>
              <View style={styles.progressSpacing}>
                <CircularProgress
                  size={56}
                  strokeWidth={6}
                  progress={Math.min(1, currentCarbs / Math.max(1, targetCarbs))}
                  color={colors.chartCarbs}
                  backgroundColor={colors.surfaceContainerHigh}
                />
              </View>
              <Text style={styles.macroValue}>
                {currentCarbs}<Text style={styles.macroTotal}>/{targetCarbs}g</Text>
              </Text>
            </View>

            {/* Fat Card */}
            <View style={styles.subMacroCard}>
              <Text style={styles.macroLabel}>HEALTHY FAT</Text>
              <View style={styles.progressSpacing}>
                <CircularProgress
                  size={56}
                  strokeWidth={6}
                  progress={Math.min(1, currentFat / Math.max(1, targetFat))}
                  color={colors.chartFat}
                  backgroundColor={colors.surfaceContainerHigh}
                />
              </View>
              <Text style={styles.macroValue}>
                {currentFat}<Text style={styles.macroTotal}>/{targetFat}g</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Interactive Hydration Tracker */}
      <View style={styles.section}>
        <View style={styles.waterCard}>
          <View style={styles.waterLeft}>
            <View style={styles.waterIconCircle}>
              <MaterialIcons name="local-drink" size={24} color="#0284C7" />
            </View>
            <View>
              <Text style={styles.waterTitle}>Daily Hydration</Text>
              <Text style={styles.waterSubtitle}>
                {waterGlasses} of 8 glasses ({waterGlasses * 250} ml)
              </Text>
            </View>
          </View>
          <View style={styles.waterControls}>
            <TouchableOpacity
              style={styles.waterBtn}
              onPress={() => handleWaterChange(-1)}
              activeOpacity={0.7}
            >
              <MaterialIcons name="remove" size={18} color="#0284C7" />
            </TouchableOpacity>
            <Text style={styles.waterCount}>{waterGlasses}</Text>
            <TouchableOpacity
              style={[styles.waterBtn, styles.waterBtnAdd]}
              onPress={() => handleWaterChange(1)}
              activeOpacity={0.7}
            >
              <MaterialIcons name="add" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* AI Clinical Insight Card */}
      <View style={styles.section}>
        <AiInsightCard
          title="AI Clinical Insight"
          badge="Personalized"
          message={
            currentCalories === 0
              ? `Ready for today's meals! Tap 'Scan Meal' or 'Add Meal' below to automatically calculate calories and nutrients.`
              : remainingCalories > 600
              ? `You have ${remainingCalories} kcal left today. Aim for high-fiber lentils, roasted chana, or fresh greens for balanced satiety.`
              : `Great pacing today! Ensure you finish with light hydration and herbal infusion before bedtime.`
          }
          actionText="Ask AI Dietitian"
          onActionPress={onNavigateToChat}
        />
      </View>

      {/* Today's Real Logs Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Today's Logged Meals ({meals.length})</Text>
          <TouchableOpacity
            style={styles.addMealButton}
            onPress={onNavigateToScan}
            activeOpacity={0.7}
          >
            <Text style={styles.addMealText}>Add Meal</Text>
            <MaterialIcons name="add" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Real Logged Meals */}
        {meals.map((meal, index) => (
          <MealCard
            key={meal.id || index.toString()}
            title={meal.title || 'Indian Meal'}
            mealType={meal.mealType || 'Meal'}
            time={meal.time || 'Logged'}
            calories={Number(meal.calories) || 0}
            imageUrl={meal.imageUri || meal.imageUrl || null}
            protein={meal.protein}
            carbs={meal.carbs}
            fat={meal.fat}
            onPress={() => setSelectedMeal(meal.id || index)}
          />
        ))}

        {/* Empty State / Add Meal Prompt */}
        <TouchableOpacity
          style={styles.emptyMealSlot}
          onPress={onNavigateToScan}
          activeOpacity={0.8}
        >
          <MaterialIcons name="restaurant" size={24} color={colors.primary} />
          <Text style={styles.emptyMealText}>Log another meal or snack</Text>
          <Text style={styles.emptyMealSubtext}>Tap to take a photo, scan a plate, or choose from gallery</Text>
        </TouchableOpacity>
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
  section: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.headlineSm,
    color: colors.onSurface,
    fontWeight: '700',
    marginBottom: 12,
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  addMealText: {
    ...typography.labelCaps,
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'none',
  },
  macroGrid: {
    gap: 12,
  },
  calorieCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  calorieTextContainer: {
    flex: 1,
  },
  macroLabel: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
    marginBottom: 6,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  calorieMainNumber: {
    ...typography.headlineLg,
    color: colors.primary,
    fontWeight: '800',
    fontSize: 28,
  },
  calorieTarget: {
    ...typography.dataDisplay,
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  calorieRemaining: {
    ...typography.bodySm,
    color: colors.secondary,
    fontWeight: '600',
    marginTop: 4,
  },
  subMacroRow: {
    flexDirection: 'row',
    gap: 10,
  },
  subMacroCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    borderWidth: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  progressSpacing: {
    marginVertical: 8,
  },
  macroValue: {
    ...typography.dataDisplay,
    fontSize: 14,
    color: colors.onSurface,
    fontWeight: '700',
  },
  macroTotal: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    fontWeight: '400',
  },
  waterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  waterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  waterIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterTitle: {
    ...typography.headlineSm,
    fontSize: 15,
    fontWeight: '700',
    color: colors.textMain,
  },
  waterSubtitle: {
    ...typography.bodySm,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  waterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  waterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterBtnAdd: {
    backgroundColor: '#0284C7',
  },
  waterCount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMain,
    minWidth: 18,
    textAlign: 'center',
  },
  emptyMealSlot: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    marginTop: 8,
  },
  emptyMealText: {
    ...typography.bodyMd,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 6,
  },
  emptyMealSubtext: {
    ...typography.bodySm,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  welcomeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  welcomeTextCol: {
    flex: 1,
    marginRight: 10,
  },
  welcomeGreeting: {
    ...typography.headlineSm,
    color: colors.primary,
    fontWeight: '800',
    fontSize: 18,
  },
  goalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mintLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 6,
    gap: 5,
  },
  goalPillText: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.primary,
    fontWeight: '700',
  },
  quickScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryContainer,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 14,
    gap: 6,
    elevation: 2,
  },
  quickScanText: {
    ...typography.labelCaps,
    fontSize: 11,
    color: colors.onPrimary,
    fontWeight: '700',
  },
});
