import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function AiInsightCard({
  title = 'AI Insight',
  badge = 'Proactive',
  message = 'Your fat intake is slightly below optimal for sustained energy today. Adding half an avocado or a handful of almonds to your next meal will bridge this gap perfectly.',
  actionText = 'View Snack Options',
  onActionPress,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <MaterialIcons name="lightbulb" size={20} color={colors.onPrimary} />
        </View>
        <View style={styles.titleArea}>
          <View style={styles.titleBadgeRow}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.pillBadge}>
              <Text style={styles.pillText}>{badge}</Text>
            </View>
          </View>
          <Text style={styles.message}>{message}</Text>

          {actionText && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onActionPress}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>{actionText}</Text>
              <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    padding: 18,
    borderWidth: 0,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    elevation: 2,
  },
  titleArea: {
    flex: 1,
    marginLeft: 12,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  title: {
    ...typography.headlineSm,
    fontSize: 15,
    fontWeight: '700',
    color: colors.onSurface,
  },
  pillBadge: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  pillText: {
    ...typography.labelCaps,
    fontSize: 9,
    color: colors.onSecondaryContainer,
    fontWeight: '700',
  },
  message: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  actionButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    gap: 6,
  },
  actionButtonText: {
    ...typography.labelCaps,
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'none',
  },
});
