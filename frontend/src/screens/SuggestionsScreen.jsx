import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const PROACTIVE_ITEMS = [
  {
    id: 'p1',
    category: 'PROTEIN GAP FILLER',
    title: 'Spiced Paneer Tikka (Grilled)',
    description: 'Bridges your remaining 20g protein target before dinner without excessive carbs.',
    calories: 220,
    protein: '22g Protein',
    tag: 'Recommended for Dinner',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'p2',
    category: 'CHOLESTEROL OPTIMIZATION',
    title: 'Chia Seed & Almond Pudding',
    description: 'High in soluble fiber to directly support your LDL cholesterol goal.',
    calories: 180,
    protein: '6g Protein',
    tag: 'Lab Marker Support',
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'p3',
    category: 'VITAMIN D ACCELERATOR',
    title: 'Fortified Masala Oats with Seeds',
    description: 'Enriched with Vitamin D3 and pumpkin seeds for micro-mineral balance.',
    calories: 240,
    protein: '11g Protein',
    tag: 'Quick Snack',
    image: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?q=80&w=400&auto=format&fit=crop',
  },
];

export default function SuggestionsScreen({ onSelectMeal }) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerSection}>
        <View style={styles.badgeRow}>
          <MaterialIcons name="auto-awesome" size={16} color={colors.aiGradientEnd} />
          <Text style={styles.badgeText}>AI REAL-TIME NUDGES</Text>
        </View>
        <Text style={styles.title}>Proactive Suggestions</Text>
        <Text style={styles.subtitle}>
          Personalized recommendations based on today's logged intake and blood markers.
        </Text>
      </View>

      <View style={styles.cardsList}>
        {PROACTIVE_ITEMS.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.categoryLabel}>{item.category}</Text>
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>{item.tag}</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <Image source={{ uri: item.image }} style={styles.foodImage} />
              <View style={styles.foodInfo}>
                <Text style={styles.foodTitle}>{item.title}</Text>
                <Text style={styles.foodDesc} numberOfLines={2}>
                  {item.description}
                </Text>

                <View style={styles.foodMeta}>
                  <Text style={styles.foodCalories}>{item.calories} kcal</Text>
                  <View style={styles.dot} />
                  <Text style={styles.foodProtein}>{item.protein}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.quickAddButton}
              onPress={() => onSelectMeal && onSelectMeal(item)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="add" size={18} color={colors.onPrimary} />
              <Text style={styles.quickAddText}>Quick Log to Journal</Text>
            </TouchableOpacity>
          </View>
        ))}
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
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  badgeText: {
    ...typography.labelCaps,
    color: colors.primary,
    fontSize: 10,
  },
  title: {
    ...typography.headlineLg,
    fontSize: 24,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  cardsList: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryLabel: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.secondary,
    fontWeight: '700',
  },
  tagBadge: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: {
    ...typography.labelCaps,
    fontSize: 9,
    color: colors.primary,
    textTransform: 'none',
  },
  cardBody: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  foodImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
  },
  foodInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  foodTitle: {
    ...typography.bodyMd,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 2,
  },
  foodDesc: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    lineHeight: 16,
    marginBottom: 6,
  },
  foodMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  foodCalories: {
    ...typography.dataDisplay,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.outline,
  },
  foodProtein: {
    ...typography.dataDisplay,
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    elevation: 1,
  },
  quickAddText: {
    ...typography.labelCaps,
    fontSize: 11,
    color: colors.onPrimary,
    fontWeight: '700',
    textTransform: 'none',
  },
});
