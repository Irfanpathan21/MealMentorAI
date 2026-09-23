import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function TopAppBar({
  title = 'MealMentor AI',
  currentUser = null,
  onNotificationPress,
  onProfilePress,
}) {
  const userInitial = (currentUser?.name?.[0] || currentUser?.email?.[0] || 'U').toUpperCase();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.contentRow}>
        {/* User Profile Avatar */}
        <TouchableOpacity
          style={styles.avatarButton}
          onPress={onProfilePress}
          activeOpacity={0.8}
        >
          {currentUser?.photoURL ? (
            <Image
              source={{ uri: currentUser.photoURL }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>{userInitial}</Text>
            </View>
          )}
          <View style={styles.onlineBadge} />
        </TouchableOpacity>

        {/* Brand Title */}
        <Text style={styles.brandTitle}>{title}</Text>

        {/* Notification Bell */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <MaterialIcons name="notifications-none" size={24} color={colors.primary} />
          <View style={styles.unreadDot} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: (StatusBar.currentHeight || 24) + 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0,
    position: 'relative',
    backgroundColor: colors.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: {
    ...typography.labelLg,
    color: colors.onPrimary,
    fontWeight: '800',
    fontSize: 16,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.chartCalories,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  brandTitle: {
    ...typography.headlineMd,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.chartCarbs,
  },
});
