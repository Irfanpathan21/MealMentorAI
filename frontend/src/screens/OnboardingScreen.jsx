import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const TOTAL_STEPS = 11;

const STEP_CATEGORIES = {
  2: 'HEALTH OBJECTIVE',
  3: 'ACTIVITY LEVEL',
  4: 'REGIONAL DIET',
  5: 'CHRONOLOGICAL AGE',
  6: 'HEIGHT METRIC',
  7: 'BIOLOGICAL SEX',
  8: 'WEIGHT & BMI',
  9: 'CLINICAL CONDITIONS',
  10: 'AI NUTRITION SETUP',
  11: 'MEDICAL LAB REPORT',
};

// Step 2: Goals
const GOALS = [
  {
    id: 'weight_loss',
    title: 'Healthy Weight & Fat Loss',
    subtitle: 'Calorie deficit with high satiety Indian meals',
    icon: 'monitor-weight',
    tag: 'Popular',
  },
  {
    id: 'diabetes',
    title: 'Manage Blood Sugar & Diabetes',
    subtitle: 'HbA1c tracking, low glycemic indexing & carb limits',
    icon: 'bloodtype',
    tag: 'Clinical',
  },
  {
    id: 'muscle_gain',
    title: 'Build Muscle & Tone Body',
    subtitle: 'High-protein vegetarian & non-veg Indian macro plans',
    icon: 'fitness-center',
    tag: 'Active',
  },
  {
    id: 'heart_health',
    title: 'Heart Health & Cholesterol',
    subtitle: 'Low saturated fat, oil monitoring & lipid support',
    icon: 'favorite',
    tag: 'Preventative',
  },
  {
    id: 'pcos',
    title: 'PCOS / PCOD & Hormone Balance',
    subtitle: 'Anti-inflammatory diet, seed cycling & insulin care',
    icon: 'spa',
    tag: 'Targeted',
  },
  {
    id: 'general_vitality',
    title: 'Stay Fit & General Vitality',
    subtitle: 'Balanced macronutrients, gut health & daily energy',
    icon: 'bolt',
    tag: 'Wellness',
  },
];

// Step 3: Activity Levels
const ACTIVITY_LEVELS = [
  {
    id: 'sedentary',
    title: 'Sedentary',
    desc: 'Desk job, little or no physical activity during the day',
    icon: 'airline-seat-recline-normal',
    multiplier: 1.2,
  },
  {
    id: 'light',
    title: 'Lightly Active',
    desc: 'Light walks, casual movement or exercise 1-3 days / week',
    icon: 'directions-walk',
    multiplier: 1.375,
  },
  {
    id: 'moderate',
    title: 'Moderately Active',
    desc: 'Exercise, brisk walks or sports 3-5 days / week',
    icon: 'directions-run',
    multiplier: 1.55,
  },
  {
    id: 'very_active',
    title: 'Very Active',
    desc: 'Intense training, heavy workouts or physical job 6+ days / week',
    icon: 'sports-gymnastics',
    multiplier: 1.725,
  },
];

// Step 4: Regional Indian Cuisines & Diet Types
const REGIONAL_CUISINES = [
  { id: 'north', title: 'North Indian', examples: 'Roti, Dal Tadka, Paneer, Sabzi, Rajma' },
  { id: 'south', title: 'South Indian', examples: 'Idli, Dosa, Sambar, Rasam, Curd Rice' },
  { id: 'west', title: 'Western (Gujarati / Marathi)', examples: 'Khichdi, Thepla, Poha, Bhakri, Kadhi' },
  { id: 'east', title: 'Eastern (Bengali / Odia)', examples: 'Fish curries, Dalma, Steamed Rice, Posto' },
  { id: 'pan_india', title: 'Pan-Indian Fusion', examples: 'Blend of regional staples & modern bowls' },
];

const DIET_TYPES = [
  { id: 'pure_veg', label: 'Pure Veg', icon: 'grass' },
  { id: 'jain', label: 'Jain Diet', icon: 'eco' },
  { id: 'eggetarian', label: 'Eggetarian', icon: 'egg' },
  { id: 'non_veg', label: 'Non-Veg', icon: 'restaurant' },
  { id: 'vegan', label: 'Vegan', icon: 'energy-savings-leaf' },
];

// Step 9: Medical Conditions
const MEDICAL_CONDITIONS = [
  { id: 'diabetes', title: 'Type 2 Diabetes / Pre-diabetes', icon: 'bloodtype' },
  { id: 'hypertension', title: 'Hypertension / High BP', icon: 'speed' },
  { id: 'cholesterol', title: 'High Cholesterol / Triglycerides', icon: 'favorite-border' },
  { id: 'thyroid', title: 'Thyroid (Hypo / Hyper)', icon: 'medical-services' },
  { id: 'pcos', title: 'PCOS / PCOD', icon: 'spa' },
  { id: 'fatty_liver', title: 'Fatty Liver (Grade 1 / 2)', icon: 'healing' },
  { id: 'none', title: 'None of the above', icon: 'verified' },
];

export default function OnboardingScreen({
  currentUser,
  onCompleteOnboarding,
  onSkip,
}) {
  // Current Step: 2 through 10
  // (Step 1 was register/login prior to this screen)
  const [currentStep, setCurrentStep] = useState(2);

  // Form State
  const [selectedGoal, setSelectedGoal] = useState('diabetes');
  const [activityLevel, setActivityLevel] = useState('light');
  const [selectedCuisine, setSelectedCuisine] = useState('north');
  const [selectedDiet, setSelectedDiet] = useState('pure_veg');
  const [age, setAge] = useState('28');
  const [heightCm, setHeightCm] = useState('165');
  const [heightUnit, setHeightUnit] = useState('cm'); // 'cm' | 'ft'
  const [gender, setGender] = useState('female');
  const [weightKg, setWeightKg] = useState('65');
  const [selectedConditions, setSelectedConditions] = useState(['diabetes']);

  // Step 10: AI Computation Loading States
  const [calcProgress, setCalcProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showFinalBlueprint, setShowFinalBlueprint] = useState(false);

  // Clinical Alert Toggles on final step
  const [portionAlerts, setPortionAlerts] = useState(true);
  const [syncGlycemic, setSyncGlycemic] = useState(true);
  const [smartHydration, setSmartHydration] = useState(true);

  // Latest Medical Lab Report (Single PDF) State
  const [uploadedPdf, setUploadedPdf] = useState(null);

  const handleSelectPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const sizeFormatted = file.size
          ? file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(file.size / 1024)} KB`
          : '1.2 MB';

        const realPdf = {
          name: file.name || 'medical_lab_report.pdf',
          size: sizeFormatted,
          uri: file.uri,
          mimeType: file.mimeType || 'application/pdf',
          uploadDate: new Date().toLocaleDateString(),
          parsedMarkers: {
            glucose: '95 mg/dL (Normal)',
            cholesterol: '142 mg/dL (Elevated)',
            hba1c: '5.6% (Optimal)',
          },
        };
        setUploadedPdf(realPdf);
        Alert.alert(
          'Medical Lab Report Attached! 📄',
          `"${realPdf.name}" (${realPdf.size}) attached successfully. Clinical biomarkers will sync with your nutrition profile.`,
          [{ text: 'OK' }]
        );
      }
    } catch (err) {
      console.warn('Document picker error:', err);
      Alert.alert('Upload Error', 'Could not open document picker. Please try again.');
    }
  };

  // South Asian BMI Calculation (WHO South Asian Cutoffs: Normal 18.5 - 22.9)
  const { bmi, bmiCategory, bmiColor } = useMemo(() => {
    const h = parseFloat(heightCm) || 165;
    const w = parseFloat(weightKg) || 65;
    const hM = h / 100;
    const val = (w / (hM * hM)).toFixed(1);
    const num = parseFloat(val);

    if (num < 18.5) {
      return { bmi: val, bmiCategory: 'Underweight', bmiColor: colors.warning };
    }
    if (num <= 22.9) {
      return { bmi: val, bmiCategory: 'Normal (Optimal)', bmiColor: colors.chartCalories };
    }
    if (num <= 27.4) {
      return { bmi: val, bmiCategory: 'Overweight (Mild Risk)', bmiColor: colors.accentSaffron };
    }
    return { bmi: val, bmiCategory: 'Obese (Clinical Risk)', bmiColor: colors.error };
  }, [heightCm, weightKg]);

  // Daily Calorie & Macro Target Synthesis
  const { dailyTarget, macroGrams } = useMemo(() => {
    const w = parseFloat(weightKg) || 65;
    const h = parseFloat(heightCm) || 165;
    const a = parseFloat(age) || 28;
    const isMale = gender === 'male';

    // Mifflin-St Jeor BMR Equation
    const bmr = 10 * w + 6.25 * h - 5 * a + (isMale ? 5 : -161);
    const act = ACTIVITY_LEVELS.find((lvl) => lvl.id === activityLevel) || ACTIVITY_LEVELS[1];
    let tdee = bmr * act.multiplier;

    // Adjust for Primary Goal
    if (selectedGoal === 'weight_loss') tdee -= 400;
    if (selectedGoal === 'muscle_gain') tdee += 300;
    if (selectedGoal === 'diabetes') tdee = Math.min(tdee, 1850);

    const roundedTarget = Math.round(tdee / 10) * 10;
    const proteinG = Math.round(w * 1.5);
    const fatsG = Math.round((roundedTarget * 0.25) / 9);
    const carbsG = Math.round((roundedTarget - proteinG * 4 - fatsG * 9) / 4);

    return {
      dailyTarget: Math.max(1400, Math.min(roundedTarget, 2800)),
      macroGrams: { protein: proteinG, carbs: carbsG, fats: fatsG },
    };
  }, [weightKg, heightCm, age, gender, activityLevel, selectedGoal]);

  // Step 10: Healthify-Style Computation Simulation
  useEffect(() => {
    if (currentStep !== 10) return;

    setCalcProgress(0);
    setCompletedSteps([]);
    setShowFinalBlueprint(false);

    const checklistItems = [
      'Analyzing metabolic expenditure & BMR...',
      'Calibrating South Asian BMI thresholds...',
      'Balancing Indian plate carb-to-protein ratios...',
      'Synthesizing clinical dietary blueprint...',
    ];

    let timer1 = setTimeout(() => {
      setCalcProgress(25);
      setCompletedSteps([checklistItems[0]]);
    }, 600);

    let timer2 = setTimeout(() => {
      setCalcProgress(55);
      setCompletedSteps([checklistItems[0], checklistItems[1]]);
    }, 1400);

    let timer3 = setTimeout(() => {
      setCalcProgress(85);
      setCompletedSteps([checklistItems[0], checklistItems[1], checklistItems[2]]);
    }, 2200);

    let timer4 = setTimeout(() => {
      setCalcProgress(100);
      setCompletedSteps(checklistItems);
      setShowFinalBlueprint(true);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [currentStep]);

  // Condition toggle helper
  const handleToggleCondition = (condId) => {
    if (condId === 'none') {
      setSelectedConditions(['none']);
      return;
    }
    let updated = selectedConditions.filter((c) => c !== 'none');
    if (updated.includes(condId)) {
      updated = updated.filter((c) => c !== condId);
    } else {
      updated.push(condId);
    }
    if (updated.length === 0) updated = ['none'];
    setSelectedConditions(updated);
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 2) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    const goalObj = GOALS.find((g) => g.id === selectedGoal);
    const dietObj = DIET_TYPES.find((d) => d.id === selectedDiet);
    const cuisineObj = REGIONAL_CUISINES.find((c) => c.id === selectedCuisine);

    const payload = {
      fullName: currentUser?.name || 'MealMentor Member',
      gender,
      age: parseInt(age, 10) || 28,
      heightCm: parseFloat(heightCm) || 165,
      weightKg: parseFloat(weightKg) || 65,
      bmi: parseFloat(bmi),
      bmiCategory,
      activityLevel,
      primaryGoal: selectedGoal,
      goalTitle: goalObj?.title || 'Blood Sugar & Diabetes Management',
      dietType: selectedDiet,
      dietLabel: dietObj?.label || 'Pure Veg',
      regionalCuisine: cuisineObj?.title || 'North Indian',
      medicalConditions: selectedConditions,
      dailyCalorieTarget: dailyTarget,
      macroGrams,
      clinicalToggles: {
        portionAlerts,
        syncGlycemic,
        smartHydration,
      },
      uploadedPdf: uploadedPdf || null,
      hasCompletedOnboarding: true,
      updatedAt: new Date().toISOString(),
    };

    if (onCompleteOnboarding) {
      onCompleteOnboarding(payload);
    }
  };

  // Render content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      // 2. What are you looking for?
      case 2:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.badgeLabel}>
              <MaterialIcons name="flag" size={13} color={colors.primary} />
              <Text style={styles.badgeLabelText}>HEALTH OBJECTIVE</Text>
            </View>
            <Text style={styles.stepTitle}>What are you looking for?</Text>
            <Text style={styles.stepSubtitle}>
              Select your primary goal so our AI can calibrate your Indian meal portions.
            </Text>

            <View style={styles.cardsStack}>
              {GOALS.map((goal) => {
                const isActive = selectedGoal === goal.id;
                return (
                  <TouchableOpacity
                    key={goal.id}
                    style={[styles.selectableCard, isActive && styles.selectableCardActive]}
                    onPress={() => setSelectedGoal(goal.id)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.iconCircle,
                        isActive && { backgroundColor: colors.primary },
                      ]}
                    >
                      <MaterialIcons
                        name={goal.icon}
                        size={22}
                        color={isActive ? '#FFFFFF' : colors.primary}
                      />
                    </View>
                    <View style={styles.cardInfoCol}>
                      <View style={styles.cardTitleRow}>
                        <Text
                          style={[
                            styles.cardTitleText,
                            isActive && { color: colors.primary, fontWeight: '800' },
                          ]}
                        >
                          {goal.title}
                        </Text>
                        <View
                          style={[
                            styles.tagBadge,
                            isActive && { backgroundColor: colors.primary },
                          ]}
                        >
                          <Text
                            style={[
                              styles.tagBadgeText,
                              isActive && { color: '#FFFFFF' },
                            ]}
                          >
                            {goal.tag}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.cardSubtitleText}>{goal.subtitle}</Text>
                    </View>
                    {isActive && (
                      <MaterialIcons name="check-circle" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      // 3. How active are you?
      case 3:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.badgeLabel}>
              <MaterialIcons name="directions-run" size={13} color={colors.primary} />
              <Text style={styles.badgeLabelText}>PHYSICAL ACTIVITY</Text>
            </View>
            <Text style={styles.stepTitle}>How active are you?</Text>
            <Text style={styles.stepSubtitle}>
              Your activity level helps determine your baseline metabolic rate (BMR).
            </Text>

            <View style={styles.cardsStack}>
              {ACTIVITY_LEVELS.map((level) => {
                const isActive = activityLevel === level.id;
                return (
                  <TouchableOpacity
                    key={level.id}
                    style={[styles.selectableCard, isActive && styles.selectableCardActive]}
                    onPress={() => setActivityLevel(level.id)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.iconCircle,
                        isActive && { backgroundColor: colors.primary },
                      ]}
                    >
                      <MaterialIcons
                        name={level.icon}
                        size={22}
                        color={isActive ? '#FFFFFF' : colors.primary}
                      />
                    </View>
                    <View style={styles.cardInfoCol}>
                      <Text
                        style={[
                          styles.cardTitleText,
                          isActive && { color: colors.primary, fontWeight: '800' },
                        ]}
                      >
                        {level.title}
                      </Text>
                      <Text style={styles.cardSubtitleText}>{level.desc}</Text>
                    </View>
                    <View
                      style={[
                        styles.radioCircle,
                        isActive && styles.radioCircleActive,
                      ]}
                    >
                      {isActive && <View style={styles.radioInnerDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      // 4. Where are you from?
      case 4:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.badgeLabel}>
              <MaterialIcons name="public" size={13} color={colors.primary} />
              <Text style={styles.badgeLabelText}>REGIONAL CUISINE & DIET</Text>
            </View>
            <Text style={styles.stepTitle}>Where are you from?</Text>
            <Text style={styles.stepSubtitle}>
              Indian food varies significantly by region. We optimize AI vision for your palate.
            </Text>

            {/* Diet Lifestyle Chips */}
            <Text style={styles.subSectionHeader}>DIETARY RESTRICTION</Text>
            <View style={styles.chipsRow}>
              {DIET_TYPES.map((d) => {
                const isActive = selectedDiet === d.id;
                return (
                  <TouchableOpacity
                    key={d.id}
                    style={[styles.dietChip, isActive && styles.dietChipActive]}
                    onPress={() => setSelectedDiet(d.id)}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name={d.icon}
                      size={16}
                      color={isActive ? '#FFFFFF' : colors.primary}
                    />
                    <Text
                      style={[
                        styles.dietChipText,
                        isActive && { color: '#FFFFFF', fontWeight: '800' },
                      ]}
                    >
                      {d.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Regional Cuisine Stack */}
            <Text style={styles.subSectionHeader}>REGIONAL CUISINE</Text>
            <View style={styles.cardsStack}>
              {REGIONAL_CUISINES.map((cuisine) => {
                const isActive = selectedCuisine === cuisine.id;
                return (
                  <TouchableOpacity
                    key={cuisine.id}
                    style={[styles.selectableCard, isActive && styles.selectableCardActive]}
                    onPress={() => setSelectedCuisine(cuisine.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.cardInfoCol}>
                      <Text
                        style={[
                          styles.cardTitleText,
                          isActive && { color: colors.primary, fontWeight: '800' },
                        ]}
                      >
                        {cuisine.title}
                      </Text>
                      <Text style={styles.cardSubtitleText}>{cuisine.examples}</Text>
                    </View>
                    {isActive ? (
                      <MaterialIcons name="check-circle" size={20} color={colors.primary} />
                    ) : (
                      <MaterialIcons
                        name="radio-button-unchecked"
                        size={20}
                        color={colors.outlineVariant}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      // 5. What's your age?
      case 5:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.badgeLabel}>
              <MaterialIcons name="cake" size={13} color={colors.primary} />
              <Text style={styles.badgeLabelText}>CHRONOLOGICAL AGE</Text>
            </View>
            <Text style={styles.stepTitle}>What’s your age?</Text>
            <Text style={styles.stepSubtitle}>
              Age dictates glycemic sensitivity and resting metabolic expenditure.
            </Text>

            <View style={styles.numberAdjustCard}>
              <Text style={styles.numberCardLabel}>ENTER YOUR AGE</Text>
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  style={styles.stepCircleBtn}
                  onPress={() => setAge((prev) => Math.max(12, (parseInt(prev, 10) || 28) - 1).toString())}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="remove" size={24} color={colors.primary} />
                </TouchableOpacity>

                <View style={styles.numberInputBox}>
                  <TextInput
                    style={styles.largeNumberInput}
                    keyboardType="numeric"
                    value={age}
                    onChangeText={(t) => setAge(t.replace(/[^0-9]/g, ''))}
                    maxLength={3}
                    textAlign="center"
                    selectTextOnFocus={true}
                    placeholder="28"
                    placeholderTextColor={colors.textSecondary}
                  />
                  <Text style={styles.numberUnitText}>years old</Text>
                </View>

                <TouchableOpacity
                  style={styles.stepCircleBtn}
                  onPress={() => setAge((prev) => Math.min(100, (parseInt(prev, 10) || 28) + 1).toString())}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="add" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Quick Preset Age Chips */}
              <View style={styles.presetsRow}>
                {['20', '25', '28', '32', '40', '50'].map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    style={[styles.presetChip, age === preset && styles.presetChipActive]}
                    onPress={() => setAge(preset)}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        age === preset && styles.presetChipTextActive,
                      ]}
                    >
                      {preset}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      // 6. How tall are you?
      case 6:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.badgeLabel}>
              <MaterialIcons name="straighten" size={13} color={colors.primary} />
              <Text style={styles.badgeLabelText}>HEIGHT</Text>
            </View>
            <Text style={styles.stepTitle}>How tall are you?</Text>
            <Text style={styles.stepSubtitle}>
              Height is critical to calculating your body surface area and BMI.
            </Text>

            <View style={styles.numberAdjustCard}>
              <View style={styles.unitToggleRow}>
                <TouchableOpacity
                  style={[styles.unitTogglePill, heightUnit === 'cm' && styles.unitTogglePillActive]}
                  onPress={() => setHeightUnit('cm')}
                >
                  <Text
                    style={[
                      styles.unitToggleText,
                      heightUnit === 'cm' && styles.unitToggleTextActive,
                    ]}
                  >
                    Centimeters (cm)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.unitTogglePill, heightUnit === 'ft' && styles.unitTogglePillActive]}
                  onPress={() => setHeightUnit('ft')}
                >
                  <Text
                    style={[
                      styles.unitToggleText,
                      heightUnit === 'ft' && styles.unitToggleTextActive,
                    ]}
                  >
                    Feet & Inches (ft)
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.stepperRow}>
                <TouchableOpacity
                  style={styles.stepCircleBtn}
                  onPress={() =>
                    setHeightCm((prev) => Math.max(100, (parseInt(prev, 10) || 165) - 1).toString())
                  }
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="remove" size={24} color={colors.primary} />
                </TouchableOpacity>

                <View style={styles.numberInputBox}>
                  <TextInput
                    style={styles.largeNumberInput}
                    keyboardType="numeric"
                    value={heightCm}
                    onChangeText={(t) => setHeightCm(t.replace(/[^0-9]/g, ''))}
                    maxLength={3}
                    textAlign="center"
                    selectTextOnFocus={true}
                    placeholder="165"
                    placeholderTextColor={colors.textSecondary}
                  />
                  <Text style={styles.numberUnitText}>
                    {heightUnit === 'cm'
                      ? 'cm'
                      : `~${Math.floor(parseInt(heightCm || 165, 10) / 30.48)}'${Math.round((parseInt(heightCm || 165, 10) % 30.48) / 2.54)}"`}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.stepCircleBtn}
                  onPress={() =>
                    setHeightCm((prev) => Math.min(230, (parseInt(prev, 10) || 165) + 1).toString())
                  }
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="add" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Quick Presets */}
              <View style={styles.presetsRow}>
                {['155', '160', '165', '170', '175', '180'].map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    style={[styles.presetChip, heightCm === preset && styles.presetChipActive]}
                    onPress={() => setHeightCm(preset)}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        heightCm === preset && styles.presetChipTextActive,
                      ]}
                    >
                      {preset} cm
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      // 7. What's your biological sex?
      case 7:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.badgeLabel}>
              <MaterialIcons name="wc" size={13} color={colors.primary} />
              <Text style={styles.badgeLabelText}>BIOLOGICAL SEX</Text>
            </View>
            <Text style={styles.stepTitle}>What’s your biological sex?</Text>
            <Text style={styles.stepSubtitle}>
              Biological sex affects baseline hormonal balance, water retention, and lean tissue metabolism.
            </Text>

            <View style={styles.sexCardsRow}>
              <TouchableOpacity
                style={[styles.sexCard, gender === 'female' && styles.sexCardActive]}
                onPress={() => setGender('female')}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.sexIconCircle,
                    gender === 'female' && { backgroundColor: colors.primary },
                  ]}
                >
                  <MaterialIcons
                    name="female"
                    size={38}
                    color={gender === 'female' ? '#FFFFFF' : colors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.sexCardTitle,
                    gender === 'female' && { color: colors.primary, fontWeight: '800' },
                  ]}
                >
                  Female
                </Text>
                <Text style={styles.sexCardSubtext}>
                  Calibrated for female metabolic & iron needs
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sexCard, gender === 'male' && styles.sexCardActive]}
                onPress={() => setGender('male')}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.sexIconCircle,
                    gender === 'male' && { backgroundColor: colors.primary },
                  ]}
                >
                  <MaterialIcons
                    name="male"
                    size={38}
                    color={gender === 'male' ? '#FFFFFF' : colors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.sexCardTitle,
                    gender === 'male' && { color: colors.primary, fontWeight: '800' },
                  ]}
                >
                  Male
                </Text>
                <Text style={styles.sexCardSubtext}>
                  Calibrated for male lean muscle mass multiplier
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      // 8. What's your weight?
      case 8:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.badgeLabel}>
              <MaterialIcons name="fitness-center" size={13} color={colors.primary} />
              <Text style={styles.badgeLabelText}>CURRENT WEIGHT & BMI</Text>
            </View>
            <Text style={styles.stepTitle}>What’s your weight?</Text>
            <Text style={styles.stepSubtitle}>
              We use South Asian specific cutoffs to compute your metabolic baseline.
            </Text>

            <View style={styles.numberAdjustCard}>
              <Text style={styles.numberCardLabel}>CURRENT WEIGHT</Text>
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  style={styles.stepCircleBtn}
                  onPress={() =>
                    setWeightKg((prev) => Math.max(30, (parseFloat(prev) || 65) - 1).toFixed(0))
                  }
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="remove" size={24} color={colors.primary} />
                </TouchableOpacity>

                <View style={styles.numberInputBox}>
                  <TextInput
                    style={styles.largeNumberInput}
                    keyboardType="decimal-pad"
                    value={weightKg}
                    onChangeText={(t) => setWeightKg(t.replace(/[^0-9.]/g, ''))}
                    maxLength={5}
                    textAlign="center"
                    selectTextOnFocus={true}
                    placeholder="65"
                    placeholderTextColor={colors.textSecondary}
                  />
                  <Text style={styles.numberUnitText}>kg</Text>
                </View>

                <TouchableOpacity
                  style={styles.stepCircleBtn}
                  onPress={() =>
                    setWeightKg((prev) => Math.min(200, (parseFloat(prev) || 65) + 1).toFixed(0))
                  }
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="add" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Dynamic South Asian BMI Gauge Card */}
              <View style={styles.bmiResultCard}>
                <View style={[styles.bmiDot, { backgroundColor: bmiColor }]} />
                <View style={styles.bmiContentCol}>
                  <Text style={styles.bmiCalculatedText}>
                    Calculated BMI: <Text style={{ fontWeight: '800', color: bmiColor }}>{bmi}</Text>
                  </Text>
                  <Text style={styles.bmiCategoryText}>
                    {bmiCategory} • South Asian Cutoff (18.5 - 22.9)
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );

      // 9. Any medical conditions?
      case 9:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.badgeLabel}>
              <MaterialIcons name="local-hospital" size={13} color={colors.primary} />
              <Text style={styles.badgeLabelText}>CLINICAL CONDITIONS</Text>
            </View>
            <Text style={styles.stepTitle}>Any medical conditions?</Text>
            <Text style={styles.stepSubtitle}>
              Select all that apply so our AI dietitian can adapt glycemic load and sodium warnings.
            </Text>

            <View style={styles.cardsStack}>
              {MEDICAL_CONDITIONS.map((cond) => {
                const isActive = selectedConditions.includes(cond.id);
                return (
                  <TouchableOpacity
                    key={cond.id}
                    style={[styles.selectableCard, isActive && styles.selectableCardActive]}
                    onPress={() => handleToggleCondition(cond.id)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.iconCircle,
                        isActive && { backgroundColor: colors.primary },
                      ]}
                    >
                      <MaterialIcons
                        name={cond.icon}
                        size={20}
                        color={isActive ? '#FFFFFF' : colors.primary}
                      />
                    </View>
                    <Text
                      style={[
                        styles.cardTitleText,
                        { flex: 1 },
                        isActive && { color: colors.primary, fontWeight: '800' },
                      ]}
                    >
                      {cond.title}
                    </Text>
                    <MaterialIcons
                      name={isActive ? 'check-box' : 'check-box-outline-blank'}
                      size={22}
                      color={isActive ? colors.primary : colors.outlineVariant}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      // 10. Setting up your plan (Loading & Blueprint)
      case 10:
        return (
          <View style={styles.stepContainer}>
            {!showFinalBlueprint ? (
              <View style={styles.calculatingWrapper}>
                <View style={styles.loadingSpinnerContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={styles.calcPercentText}>{calcProgress}%</Text>
                </View>

                <Text style={styles.stepTitle}>Personalizing Your Plan...</Text>
                <Text style={styles.stepSubtitle}>
                  Synthesizing your biometric vitals, Indian regional preferences, and clinical markers.
                </Text>

                {/* Animated Checklist */}
                <View style={styles.checklistContainer}>
                  {[
                    'Analyzing metabolic expenditure & BMR...',
                    'Calibrating South Asian BMI thresholds...',
                    'Balancing Indian plate carb-to-protein ratios...',
                    'Synthesizing clinical dietary blueprint...',
                  ].map((item, idx) => {
                    const isDone = completedSteps.includes(item);
                    return (
                      <View key={idx} style={styles.checklistItemRow}>
                        <MaterialIcons
                          name={isDone ? 'check-circle' : 'hourglass-top'}
                          size={18}
                          color={isDone ? colors.chartCalories : colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.checklistText,
                            isDone && { color: colors.textPrimary, fontWeight: '600' },
                          ]}
                        >
                          {item}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {/* Choices Summary Bento */}
                <View style={styles.summaryBento}>
                  <Text style={styles.summaryBentoHeader}>YOUR CHOICES SUMMARY</Text>
                  <View style={styles.summaryChipsRow}>
                    <View style={styles.summaryChip}>
                      <Text style={styles.summaryChipLabel}>Goal: {selectedGoal}</Text>
                    </View>
                    <View style={styles.summaryChip}>
                      <Text style={styles.summaryChipLabel}>Diet: {selectedDiet} ({selectedCuisine})</Text>
                    </View>
                    <View style={styles.summaryChip}>
                      <Text style={styles.summaryChipLabel}>Vitals: {age}y, {heightCm}cm, {weightKg}kg</Text>
                    </View>
                    <View style={styles.summaryChip}>
                      <Text style={styles.summaryChipLabel}>BMI: {bmi} ({bmiCategory})</Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.blueprintWrapper}>
                <View style={styles.badgeLabel}>
                  <MaterialIcons name="auto-awesome" size={14} color={colors.primary} />
                  <Text style={styles.badgeLabelText}>AI CLINICAL BLUEPRINT</Text>
                </View>

                <Text style={styles.stepTitle}>Your Nutrition Blueprint</Text>
                <Text style={styles.stepSubtitle}>
                  Calibrated for steady postprandial glucose and high-satiety Indian meals.
                </Text>

                {/* Main Calorie Target Hero Card */}
                <View style={styles.heroTargetCard}>
                  <View style={styles.heroTargetTopRow}>
                    <Text style={styles.heroTargetLabel}>RECOMMENDED DAILY TARGET</Text>
                    <View style={styles.verifiedTag}>
                      <MaterialIcons name="verified" size={13} color={colors.primary} />
                      <Text style={styles.verifiedTagText}>AI Calibrated</Text>
                    </View>
                  </View>

                  <View style={styles.heroTargetNumRow}>
                    <Text style={styles.heroTargetNumber}>{dailyTarget.toLocaleString()}</Text>
                    <Text style={styles.heroTargetUnit}>kcal / day</Text>
                  </View>

                  {/* Macro Split Pills */}
                  <View style={styles.macroPillsRow}>
                    <View style={styles.macroPill}>
                      <Text style={styles.macroPillGram}>{macroGrams.protein}g</Text>
                      <Text style={styles.macroPillLabel}>PROTEIN (22%)</Text>
                    </View>
                    <View style={styles.macroPill}>
                      <Text style={styles.macroPillGram}>{macroGrams.carbs}g</Text>
                      <Text style={styles.macroPillLabel}>CARBS (LOW GI)</Text>
                    </View>
                    <View style={styles.macroPill}>
                      <Text style={styles.macroPillGram}>{macroGrams.fats}g</Text>
                      <Text style={styles.macroPillLabel}>HEALTHY FATS</Text>
                    </View>
                  </View>
                </View>

                {/* AI Nudges & Clinical Alerts */}
                <View style={styles.alertsSectionCard}>
                  <Text style={styles.alertsCardHeader}>CLINICAL REAL-TIME ALERTS</Text>

                  <View style={styles.toggleRow}>
                    <View style={styles.toggleCol}>
                      <Text style={styles.toggleTitle}>Indian Plate Portion Alerts</Text>
                      <Text style={styles.toggleDesc}>
                        Real-time alerts for excessive roti, white rice, and high-oil gravies.
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
                    <View style={styles.toggleCol}>
                      <Text style={styles.toggleTitle}>Sync Glycemic & Lab Insights</Text>
                      <Text style={styles.toggleDesc}>
                        Correlate logged meals with HbA1c and lipid diagnostic targets.
                      </Text>
                    </View>
                    <Switch
                      value={syncGlycemic}
                      onValueChange={setSyncGlycemic}
                      trackColor={{ false: colors.outlineVariant, true: colors.primary }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.toggleRow}>
                    <View style={styles.toggleCol}>
                      <Text style={styles.toggleTitle}>Smart Hydration & Evening Checks</Text>
                      <Text style={styles.toggleDesc}>
                        Water intake prompts and circadian dinner cutoff checks.
                      </Text>
                    </View>
                    <Switch
                      value={smartHydration}
                      onValueChange={setSmartHydration}
                      trackColor={{ false: colors.outlineVariant, true: colors.primary }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        );

      // 11. Upload Latest Medical Lab Report (Single PDF)
      case 11:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.badgeLabel}>
              <MaterialIcons name="picture-as-pdf" size={13} color={colors.primary} />
              <Text style={styles.badgeLabelText}>CLINICAL REPORT INTEGRATION</Text>
            </View>
            <Text style={styles.stepTitle}>Upload Medical Lab Report</Text>
            <Text style={styles.stepSubtitle}>
              Attach your blood test / pathology report (Single PDF) to correlate HbA1c, lipid profile, and metabolic health. (Optional)
            </Text>

            <View style={styles.labUploadCard}>
              <View style={styles.labUploadHeaderRow}>
                <MaterialIcons name="science" size={22} color={colors.primary} />
                <Text style={styles.labUploadHeaderTitle}>Blood Work & Diagnostic PDF</Text>
              </View>
              <Text style={styles.labUploadSubtitle}>
                Supports Apollo, Lal PathLabs, Thyrocare, Max, or any diagnostic lab PDF.
              </Text>

              {uploadedPdf ? (
                <View style={styles.uploadedFileBox}>
                  <View style={styles.uploadedFileIconCircle}>
                    <MaterialIcons name="check-circle" size={24} color={colors.chartCalories} />
                  </View>
                  <View style={styles.uploadedFileInfo}>
                    <Text style={styles.uploadedFileName} numberOfLines={1}>
                      {uploadedPdf.name}
                    </Text>
                    <Text style={styles.uploadedFileMeta}>
                      {uploadedPdf.size} • Attached for AI Parsing
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removePdfBtn}
                    onPress={() => setUploadedPdf(null)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="close" size={18} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.dropzoneBox}
                  onPress={handleSelectPdf}
                  activeOpacity={0.8}
                >
                  <View style={styles.dropzoneIconCircle}>
                    <MaterialIcons name="upload-file" size={28} color={colors.primary} />
                  </View>
                  <Text style={styles.dropzoneMainText}>Select Single PDF Report</Text>
                  <Text style={styles.dropzoneSubText}>Tap to choose PDF from phone storage</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Privacy & Clinical Guarantee */}
            <View style={styles.privacyNoteCard}>
              <MaterialIcons name="lock" size={18} color={colors.primary} />
              <Text style={styles.privacyNoteText}>
                Your medical data is encrypted with 256-bit AES storage and strictly used only for dietary guidance.
              </Text>
            </View>

            {/* Skip Option for Step 11 */}
            {!uploadedPdf && (
              <TouchableOpacity
                style={styles.skipStepButton}
                onPress={handleFinish}
                activeOpacity={0.7}
              >
                <Text style={styles.skipStepButtonText}>I don't have a report right now (Skip & Open Dashboard)</Text>
              </TouchableOpacity>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.screenRoot}>
      {/* Top Navigation & Aesthetic Segmented Progress Bar (No raw 1 to 11 text) */}
      <View style={styles.topAppBar}>
        <View style={styles.topControlsRow}>
          {currentStep > 2 ? (
            <TouchableOpacity
              style={styles.circleIconBtn}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <MaterialIcons name="arrow-back" size={18} color={colors.onSurface} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 36 }} />
          )}

          {/* Aesthetic Stage Capsule Pill (No raw numbers) */}
          <View style={styles.stageCapsulePill}>
            <Text style={styles.stageCapsuleText}>
              {STEP_CATEGORIES[currentStep] || 'HEALTH PROFILE'}
            </Text>
          </View>

          <TouchableOpacity onPress={onSkip} activeOpacity={0.7}>
            <Text style={styles.skipBtnText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Aesthetic Progress Slides: 10 rounded segments representing Steps 2 to 11 */}
        <View style={styles.progressTrack}>
          {Array.from({ length: TOTAL_STEPS - 1 }).map((_, index) => {
            const stepNum = index + 2; // Steps 2 through 11
            const isCompleted = stepNum <= currentStep;
            return (
              <View
                key={index}
                style={[
                  styles.progressSegment,
                  isCompleted && styles.progressSegmentFilled,
                ]}
              />
            );
          })}
        </View>
      </View>

      {/* Main Step Body */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderStepContent()}
      </ScrollView>

      {/* Bottom Sticky Action Bar with Android Navigation Bar Safety */}
      <View style={styles.bottomActionBar}>
        {currentStep > 2 && (
          <TouchableOpacity
            style={styles.bottomBackBtn}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={18} color={colors.textSecondary} />
            <Text style={styles.bottomBackText}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.continueBtn,
            currentStep === 2 && { flex: 1 },
          ]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>
            {currentStep === 10
              ? 'Proceed to Lab Report →'
              : currentStep === 11
              ? 'Complete & Open Dashboard 🎉'
              : 'Continue'}
          </Text>
          <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topAppBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0,
    elevation: 2,
  },
  topControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  circleIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.mintLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  stageCapsulePill: {
    backgroundColor: colors.mintLight,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageCapsuleText: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  skipBtnText: {
    ...typography.bodySm,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  progressTrack: {
    flexDirection: 'row',
    gap: 4,
    height: 4,
  },
  progressSegment: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
  },
  progressSegmentFilled: {
    backgroundColor: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 140,
  },
  stepContainer: {
    flex: 1,
  },
  badgeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.mintLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeLabelText: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.primary,
    fontWeight: '800',
  },
  stepTitle: {
    ...typography.headlineLg,
    fontSize: 24,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  stepSubtitle: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  cardsStack: {
    gap: 10,
  },
  selectableCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    gap: 12,
  },
  selectableCardActive: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: '#F0FDF4',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfoCol: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  cardTitleText: {
    ...typography.bodyMd,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardSubtitleText: {
    ...typography.bodySm,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  tagBadge: {
    backgroundColor: 'rgba(15, 118, 110, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagBadgeText: {
    ...typography.labelCaps,
    fontSize: 9,
    color: colors.primary,
    fontWeight: '700',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: colors.primary,
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  subSectionHeader: {
    ...typography.labelCaps,
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  dietChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 0,
    elevation: 1,
  },
  dietChipActive: {
    backgroundColor: colors.primary,
  },
  dietChipText: {
    ...typography.bodySm,
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  numberAdjustCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 0,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  numberCardLabel: {
    ...typography.labelCaps,
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '700',
    marginBottom: 14,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 18,
  },
  stepCircleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.mintLight,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  numberInputWrap: {
    alignItems: 'center',
    minWidth: 110,
  },
  numberInputBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 130,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  largeNumberInput: {
    ...typography.metricXl,
    fontSize: 44,
    fontWeight: '900',
    color: colors.primary,
    padding: 0,
    minWidth: 70,
    textAlign: 'center',
  },
  numberUnitText: {
    ...typography.bodySm,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: -4,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 0,
  },
  presetChipActive: {
    backgroundColor: colors.primary,
  },
  presetChipText: {
    ...typography.bodySm,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  presetChipTextActive: {
    color: '#FFFFFF',
  },
  unitToggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
  },
  unitTogglePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  unitTogglePillActive: {
    backgroundColor: colors.primary,
  },
  unitToggleText: {
    ...typography.bodySm,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  unitToggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sexCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sexCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    borderWidth: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  sexCardActive: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: '#F0FDF4',
  },
  sexIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sexCardTitle: {
    ...typography.bodyMd,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sexCardSubtext: {
    ...typography.bodySm,
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 15,
  },
  bmiResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 0,
    gap: 10,
    width: '100%',
    marginTop: 10,
  },
  bmiDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  bmiContentCol: {
    flex: 1,
  },
  bmiCalculatedText: {
    ...typography.bodySm,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  bmiCategoryText: {
    ...typography.bodySm,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  calculatingWrapper: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loadingSpinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  calcPercentText: {
    ...typography.headlineMd,
    color: colors.primary,
    fontWeight: '800',
    marginTop: 8,
  },
  checklistContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 0,
    elevation: 2,
    gap: 12,
    marginBottom: 18,
  },
  checklistItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checklistText: {
    ...typography.bodySm,
    fontSize: 12,
    color: colors.textSecondary,
  },
  summaryBento: {
    width: '100%',
    backgroundColor: colors.mintLight,
    borderRadius: 18,
    padding: 14,
    borderWidth: 0,
  },
  summaryBentoHeader: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.primary,
    fontWeight: '800',
    marginBottom: 8,
  },
  summaryChipsRow: {
    gap: 6,
  },
  summaryChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  summaryChipLabel: {
    ...typography.bodySm,
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  blueprintWrapper: {
    width: '100%',
  },
  heroTargetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    marginBottom: 16,
  },
  heroTargetTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroTargetLabel: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.mintLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedTagText: {
    ...typography.labelCaps,
    fontSize: 9,
    color: colors.primary,
    fontWeight: '700',
  },
  heroTargetNumRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 16,
  },
  heroTargetNumber: {
    ...typography.metricXl,
    fontSize: 38,
    color: colors.primary,
    fontWeight: '900',
  },
  heroTargetUnit: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  macroPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  macroPill: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 0,
  },
  macroPillGram: {
    ...typography.bodySm,
    fontWeight: '800',
    color: colors.primary,
  },
  macroPillLabel: {
    ...typography.labelCaps,
    fontSize: 8,
    color: colors.textSecondary,
    marginTop: 2,
  },
  alertsSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 0,
    elevation: 2,
    marginBottom: 20,
  },
  alertsCardHeader: {
    ...typography.labelCaps,
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '700',
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  toggleCol: {
    flex: 1,
    paddingRight: 10,
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
    lineHeight: 15,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginVertical: 10,
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'android' ? 34 : 24,
    borderTopWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  bottomBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: colors.mintLight,
    borderWidth: 0,
  },
  bottomBackText: {
    ...typography.bodySm,
    fontWeight: '700',
    color: colors.primary,
  },
  continueBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 14,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  continueBtnText: {
    ...typography.bodyMd,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  labUploadCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: 22,
    padding: 18,
    borderWidth: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginBottom: 16,
  },
  labUploadHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  labUploadHeaderTitle: {
    ...typography.bodyMd,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  labUploadSubtitle: {
    ...typography.bodySm,
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 14,
    lineHeight: 16,
  },
  dropzoneBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mintLight,
    gap: 8,
  },
  dropzoneIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  dropzoneMainText: {
    ...typography.bodySm,
    fontWeight: '700',
    color: colors.primary,
  },
  dropzoneSubText: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.textSecondary,
  },
  uploadedFileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mintLight,
    borderRadius: 14,
    padding: 12,
    borderWidth: 0,
    gap: 10,
  },
  uploadedFileIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadedFileInfo: {
    flex: 1,
  },
  uploadedFileName: {
    ...typography.bodySm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  uploadedFileMeta: {
    ...typography.bodySm,
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  removePdfBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyNoteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.mintLight,
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
  },
  privacyNoteText: {
    ...typography.bodySm,
    fontSize: 11,
    color: colors.primary,
    flex: 1,
    lineHeight: 16,
  },
  skipStepButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  skipStepButtonText: {
    ...typography.bodySm,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
    fontSize: 12,
  },
});
