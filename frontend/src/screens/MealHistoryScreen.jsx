import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import MealCard from '../components/MealCard';

const DAYS = [
  { day: 'MON', date: '14' },
  { day: 'TUE', date: '15' },
  { day: 'WED', date: '16' },
  { day: 'THU', date: '17' },
  { day: 'TODAY', date: '18', active: true },
];

export default function MealHistoryScreen({ meals = [], onNavigateToScan }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('18');

  // Dynamic calculations from logged meals
  const totalCalories = meals.reduce((sum, m) => sum + (Number(m.calories) || 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + (Number(m.protein) || 0), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + (Number(m.carbs) || 0), 0);
  const totalFat = meals.reduce((sum, m) => sum + (Number(m.fat) || 0), 0);

  const filteredMeals = meals.filter((m) =>
    (m.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.mealType || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Title & Search Bar */}
      <View style={styles.searchSection}>
        <Text style={styles.screenTitle}>Meal History & Diary</Text>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search logged meals..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Date Selector (Weekly Strip) */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.calendarTag}>
            <MaterialIcons name="calendar-today" size={14} color={colors.primary} />
            <Text style={styles.calendarText}>Current Cycle</Text>
          </View>
        </View>

        <View style={styles.weekStrip}>
          {DAYS.map((item) => {
            const isActive = selectedDay === item.date;
            return (
              <TouchableOpacity
                key={item.date}
                style={[
                  styles.dayCard,
                  isActive && styles.dayCardActive,
                ]}
                onPress={() => setSelectedDay(item.date)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayLabel,
                    isActive && styles.dayLabelActive,
                  ]}
                >
                  {item.day}
                </Text>
                <Text
                  style={[
                    styles.dayNumber,
                    isActive && styles.dayNumberActive,
                  ]}
                >
                  {item.date}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Daily Summary Mini-Dashboard */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryLabel}>TOTAL LOGGED TODAY</Text>
            <View style={styles.summaryValueRow}>
              <Text style={styles.summaryNumber}>{totalCalories.toLocaleString()}</Text>
              <Text style={styles.summaryUnit}>kcal</Text>
            </View>
          </View>

          <View style={styles.macrosCluster}>
            <View style={styles.macroStat}>
              <Text style={[styles.macroStatVal, { color: colors.chartProtein }]}>{totalProtein}g</Text>
              <Text style={styles.macroStatLbl}>PRO</Text>
            </View>
            <View style={styles.macroStat}>
              <Text style={[styles.macroStatVal, { color: colors.chartCarbs }]}>{totalCarbs}g</Text>
              <Text style={styles.macroStatLbl}>CARB</Text>
            </View>
            <View style={styles.macroStat}>
              <Text style={[styles.macroStatVal, { color: colors.chartFat }]}>{totalFat}g</Text>
              <Text style={styles.macroStatLbl}>FAT</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Logged Meals List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Logged Items ({filteredMeals.length})
        </Text>

        {filteredMeals.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="restaurant-menu" size={40} color={colors.mintLight} />
            <Text style={styles.emptyTitle}>No meals logged for this filter</Text>
            <Text style={styles.emptySubtitle}>Tap the camera button to snap and log your meal</Text>
          </View>
        ) : (
          filteredMeals.map((meal, index) => (
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
            />
          ))
        )}
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
  searchSection: {
    marginBottom: 18,
  },
  screenTitle: {
    ...typography.headlineLg,
    fontSize: 22,
    color: colors.textMain,
    fontWeight: '800',
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 0,
    paddingHorizontal: 14,
    height: 48,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    ...typography.bodyMd,
    color: colors.textMain,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    ...typography.headlineSm,
    fontSize: 16,
    color: colors.textMain,
    fontWeight: '700',
    marginBottom: 10,
  },
  calendarTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.mintLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  calendarText: {
    ...typography.labelCaps,
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  weekStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayCard: {
    flex: 1,
    height: 68,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    marginHorizontal: 3,
  },
  dayCardActive: {
    backgroundColor: colors.primary,
    elevation: 3,
  },
  dayLabel: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 4,
    fontWeight: '700',
  },
  dayLabelActive: {
    color: colors.mintLight,
  },
  dayNumber: {
    ...typography.headlineMd,
    fontSize: 17,
    color: colors.textMain,
    fontWeight: '800',
  },
  dayNumberActive: {
    color: '#FFFFFF',
  },
  summaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLeft: {
    justifyContent: 'center',
  },
  summaryLabel: {
    ...typography.labelCaps,
    fontSize: 9,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  summaryValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  summaryNumber: {
    ...typography.headlineLg,
    fontSize: 24,
    color: colors.primary,
    fontWeight: '800',
  },
  summaryUnit: {
    ...typography.dataDisplay,
    fontSize: 12,
    color: colors.textMuted,
  },
  macrosCluster: {
    flexDirection: 'row',
    gap: 12,
  },
  macroStat: {
    alignItems: 'center',
  },
  macroStatVal: {
    ...typography.bodySm,
    fontSize: 14,
    fontWeight: '800',
  },
  macroStatLbl: {
    ...typography.labelCaps,
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  emptyTitle: {
    ...typography.bodyMd,
    fontWeight: '700',
    color: colors.textMain,
    marginTop: 8,
  },
  emptySubtitle: {
    ...typography.bodySm,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
