import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 72;
const CHART_HEIGHT = 160;

export default function AnalyticsScreen() {
  const [selectedRange, setSelectedRange] = useState('Week'); // 'Day' | 'Week' | 'Month'

  const points = [
    { x: 0, y: 100, day: 'Mon' },
    { x: CHART_WIDTH * 0.16, y: 80, day: 'Tue' },
    { x: CHART_WIDTH * 0.33, y: 120, day: 'Wed' },
    { x: CHART_WIDTH * 0.5, y: 50, day: 'Thu' },
    { x: CHART_WIDTH * 0.66, y: 70, day: 'Fri' },
    { x: CHART_WIDTH * 0.83, y: 35, day: 'Sat' },
    { x: CHART_WIDTH, y: 60, day: 'Sun' },
  ];

  const pathData = `M${points.map((p) => `${p.x},${p.y}`).join(' L')}`;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Title & Segmented Control */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.screenTitle}>Your Progress</Text>
          <Text style={styles.screenSubtitle}>Analyzing nutrient trends and habits</Text>
        </View>

        <View style={styles.segmentedControl}>
          {['Day', 'Week', 'Month'].map((range) => {
            const isActive = selectedRange === range;
            return (
              <TouchableOpacity
                key={range}
                style={[
                  styles.segmentButton,
                  isActive && styles.segmentButtonActive,
                ]}
                onPress={() => setSelectedRange(range)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.segmentText,
                    isActive && styles.segmentTextActive,
                  ]}
                >
                  {range}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Main Calorie Intake Chart Card */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartTitle}>Calorie Intake</Text>
            <Text style={styles.chartSubtitle}>Last 7 days</Text>
          </View>
          <View style={styles.statRight}>
            <Text style={styles.statValue}>1,940</Text>
            <Text style={styles.statUnit}>avg kcal</Text>
          </View>
        </View>

        {/* SVG Chart */}
        <View style={styles.chartSvgWrapper}>
          <Svg width={CHART_WIDTH} height={CHART_HEIGHT} style={styles.svgArea}>
            {/* Target 2,100 Line */}
            <Line
              x1="0"
              y1="65"
              x2={CHART_WIDTH}
              y2="65"
              stroke={colors.outlineVariant}
              strokeDasharray="5, 5"
              strokeWidth="1.5"
            />

            {/* Line Graph */}
            <Path
              d={pathData}
              fill="none"
              stroke={colors.primary}
              strokeWidth="3"
            />

            {/* Data Points */}
            {points.map((p, i) => (
              <Circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={i === 5 ? 5 : 4}
                fill={i === 5 ? colors.surface : colors.primary}
                stroke={colors.primary}
                strokeWidth={i === 5 ? 2.5 : 1}
              />
            ))}
          </Svg>

          {/* Target Label */}
          <Text style={styles.targetLabel}>Target 2,100</Text>

          {/* X-Axis Days */}
          <View style={styles.xAxisRow}>
            {points.map((p, i) => (
              <Text key={i} style={styles.xAxisDay}>
                {p.day}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {/* Bento Grid: Macro Split & Micronutrient Coverage */}
      <View style={styles.bentoGrid}>
        {/* Macro Distribution */}
        <View style={styles.bentoCard}>
          <Text style={styles.bentoTitle}>Macro Ratio</Text>
          <View style={styles.macroSplitBars}>
            <View style={[styles.splitBar, { flex: 28, backgroundColor: colors.chartProtein }]} />
            <View style={[styles.splitBar, { flex: 46, backgroundColor: colors.chartCarbs }]} />
            <View style={[styles.splitBar, { flex: 26, backgroundColor: colors.chartFat }]} />
          </View>
          <View style={styles.macroLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.chartProtein }]} />
              <Text style={styles.legendText}>Protein 28%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.chartCarbs }]} />
              <Text style={styles.legendText}>Carbs 46%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.chartFat }]} />
              <Text style={styles.legendText}>Fats 26%</Text>
            </View>
          </View>
        </View>

        {/* Micronutrient Coverage */}
        <View style={styles.bentoCard}>
          <Text style={styles.bentoTitle}>Micronutrient Coverage</Text>
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientName}>Dietary Fiber</Text>
            <View style={styles.nutrientProgressBar}>
              <View style={[styles.nutrientProgressFill, { width: '85%', backgroundColor: colors.primary }]} />
            </View>
            <Text style={styles.nutrientPct}>85%</Text>
          </View>

          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientName}>Vitamin D</Text>
            <View style={styles.nutrientProgressBar}>
              <View style={[styles.nutrientProgressFill, { width: '52%', backgroundColor: colors.chartCarbs }]} />
            </View>
            <Text style={styles.nutrientPct}>52%</Text>
          </View>

          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientName}>Iron & Zinc</Text>
            <View style={styles.nutrientProgressBar}>
              <View style={[styles.nutrientProgressFill, { width: '92%', backgroundColor: colors.chartProtein }]} />
            </View>
            <Text style={styles.nutrientPct}>92%</Text>
          </View>
        </View>
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
  headerRow: {
    marginBottom: 18,
    gap: 12,
  },
  screenTitle: {
    ...typography.headlineLg,
    fontSize: 24,
    color: colors.textMain,
    fontWeight: '700',
    marginBottom: 4,
  },
  screenSubtitle: {
    ...typography.bodyMd,
    color: colors.textMuted,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainer,
    borderRadius: 22,
    padding: 3,
    alignSelf: 'flex-start',
  },
  segmentButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 18,
  },
  segmentButtonActive: {
    backgroundColor: colors.primary,
    elevation: 2,
  },
  segmentText: {
    ...typography.labelCaps,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    textTransform: 'none',
  },
  segmentTextActive: {
    color: colors.onPrimary,
    fontWeight: '700',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginBottom: 18,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  chartTitle: {
    ...typography.headlineSm,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMain,
  },
  chartSubtitle: {
    ...typography.bodySm,
    color: colors.textMuted,
    marginTop: 2,
  },
  statRight: {
    alignItems: 'flex-end',
  },
  statValue: {
    ...typography.metricLg,
    fontSize: 24,
    color: colors.primary,
    fontWeight: '800',
  },
  statUnit: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.textMuted,
  },
  chartSvgWrapper: {
    marginTop: 10,
    position: 'relative',
    height: CHART_HEIGHT + 24,
  },
  svgArea: {
    overflow: 'visible',
  },
  targetLabel: {
    position: 'absolute',
    top: 45,
    right: 0,
    ...typography.labelCaps,
    fontSize: 9,
    color: colors.outline,
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  xAxisDay: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.textMuted,
  },
  bentoGrid: {
    gap: 16,
  },
  bentoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  bentoTitle: {
    ...typography.headlineSm,
    fontSize: 15,
    fontWeight: '700',
    color: colors.textMain,
    marginBottom: 14,
  },
  macroSplitBars: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 14,
    gap: 3,
  },
  splitBar: {
    borderRadius: 4,
  },
  macroLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...typography.bodySm,
    fontSize: 11,
    color: colors.textMuted,
  },
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nutrientName: {
    width: 90,
    ...typography.bodySm,
    fontSize: 12,
    color: colors.textMain,
  },
  nutrientProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 3,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  nutrientProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  nutrientPct: {
    width: 32,
    ...typography.dataDisplay,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'right',
  },
});
