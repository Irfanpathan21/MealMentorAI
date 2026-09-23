import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function HealthMarkerRow({
  name = 'LDL Cholesterol',
  value = '142 mg/dL',
  status = 'High', // 'High' | 'Normal' | 'Low'
}) {
  const getStatusConfig = () => {
    switch (status) {
      case 'High':
        return {
          icon: 'arrow-upward',
          bgColor: colors.errorContainer,
          textColor: colors.onErrorContainer,
        };
      case 'Low':
        return {
          icon: 'arrow-downward',
          bgColor: '#FFF3E0',
          textColor: colors.chartCarbs,
        };
      case 'Normal':
      default:
        return {
          icon: 'check-circle',
          bgColor: colors.surfaceContainerHigh,
          textColor: colors.onSurface,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={styles.container}>
      <View style={styles.infoArea}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: config.bgColor }]}>
        <MaterialIcons name={config.icon} size={14} color={config.textColor} />
        <Text style={[styles.statusText, { color: config.textColor }]}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    marginBottom: 8,
  },
  infoArea: {
    flex: 1,
  },
  name: {
    ...typography.bodyMd,
    fontWeight: '700',
    color: colors.onBackground,
    marginBottom: 2,
  },
  value: {
    ...typography.dataDisplay,
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    ...typography.labelCaps,
    fontSize: 10,
    fontWeight: '700',
  },
});
