import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const TABS = [
  { key: 'dashboard', label: 'Today', icon: 'dashboard' },
  { key: 'history', label: 'Meals', icon: 'restaurant-menu' },
  { key: 'scan', label: 'Scan Food', icon: 'photo-camera', isCenter: true },
  { key: 'chat', label: 'Dietitian', icon: 'smart-toy' },
  { key: 'profile', label: 'Profile', icon: 'person' },
];

export default function BottomNavBar({ activeTab, onSelectTab }) {
  return (
    <View style={styles.navContainer}>
      <View style={styles.tabsRow}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const isCenter = tab.isCenter;

          if (isCenter) {
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.centerTabButton, isActive && styles.centerTabButtonActive]}
                onPress={() => onSelectTab(tab.key)}
                activeOpacity={0.85}
              >
                <View style={styles.centerIconCircle}>
                  <MaterialIcons name={tab.icon} size={26} color={colors.onPrimary} />
                </View>
                <Text style={styles.centerTabLabel}>{tab.label}</Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => onSelectTab(tab.key)}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={tab.icon}
                size={22}
                color={isActive ? colors.onPrimaryContainer : colors.onSurfaceVariant}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopWidth: 0,
    paddingVertical: 6,
    paddingBottom: Platform.OS === 'android' ? 26 : 14,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 14,
    minWidth: 62,
  },
  tabButtonActive: {
    backgroundColor: colors.primaryContainer,
  },
  tabLabel: {
    ...typography.labelCaps,
    fontSize: 10,
    marginTop: 3,
  },
  tabLabelActive: {
    color: colors.onPrimaryContainer,
    fontWeight: '700',
  },
  tabLabelInactive: {
    color: colors.onSurfaceVariant,
    fontWeight: '500',
  },
  centerTabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
  },
  centerTabButtonActive: {
    transform: [{ scale: 1.05 }],
  },
  centerIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 0,
  },
  centerTabLabel: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.primary,
    marginTop: 2,
    fontWeight: '700',
  },
});
