import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function MealCard({
  title,
  mealType = 'Lunch',
  time = '1:30 PM',
  calories = 450,
  imageUrl,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="restaurant" size={24} color={colors.primary} />
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{mealType}</Text>
          </View>
          <Text style={styles.timeText}>{time}</Text>
        </View>
      </View>

      <View style={styles.calorieContainer}>
        <Text style={styles.calorieValue}>{calories}</Text>
        <Text style={styles.calorieUnit}>kcal</Text>
      </View>

      <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} style={styles.chevron} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  imageContainer: {
    width: 58,
    height: 58,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mintLight,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    ...typography.bodyMd,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeText: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.primary,
  },
  timeText: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
  calorieContainer: {
    alignItems: 'flex-end',
    marginRight: 4,
  },
  calorieValue: {
    ...typography.dataDisplay,
    color: colors.primary,
    fontWeight: '700',
  },
  calorieUnit: {
    ...typography.labelCaps,
    fontSize: 9,
    color: colors.onSurfaceVariant,
  },
  chevron: {
    marginLeft: 2,
  },
});
