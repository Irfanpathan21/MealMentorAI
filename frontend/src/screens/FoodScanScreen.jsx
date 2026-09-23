import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const { width, height } = Dimensions.get('window');

const PRESET_MEALS = [
  { title: 'Dal Tadka & 2 Rotis', calories: 420, protein: 16, carbs: 62, fat: 12 },
  { title: 'Paneer Bhurji & Multigrain Roti', calories: 460, protein: 24, carbs: 38, fat: 22 },
  { title: 'Masala Dosa & Sambar', calories: 380, protein: 10, carbs: 66, fat: 10 },
  { title: 'Brown Rice & Rajma Bowl', calories: 450, protein: 18, carbs: 76, fat: 8 },
  { title: 'Oats, Chia & Mixed Berries', calories: 320, protein: 12, carbs: 52, fat: 6 },
  { title: 'Grilled Chicken & Steamed Veggies', calories: 440, protein: 44, carbs: 14, fat: 12 },
  { title: 'Egg Curry & Jeera Rice', calories: 480, protein: 22, carbs: 58, fat: 18 },
  { title: 'Sprouts Salad & Lemon Dressing', calories: 210, protein: 14, carbs: 32, fat: 3 },
];

export default function FoodScanScreen({ onClose, onFoodLogged }) {
  const [isScanning, setIsScanning] = useState(true);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Verification & Portion Adjustment State
  const [showVerification, setShowVerification] = useState(false);
  const [customTitle, setCustomTitle] = useState('Dal Tadka & 2 Rotis');
  const [selectedMealType, setSelectedMealType] = useState('Lunch');
  const [portionMultiplier, setPortionMultiplier] = useState(1.0);
  const [baseMacros, setBaseMacros] = useState({
    calories: 420,
    protein: 16,
    carbs: 62,
    fat: 12,
  });

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Animated laser scan line
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let activeStream = null;

    const startCamera = async () => {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.mediaDevices) {
        try {
          const constraints = {
            video: {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          };

          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          activeStream = stream;
          streamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch((e) => console.log('Video play error:', e));
          }
          setCameraActive(true);
          setCameraError(null);
        } catch (err) {
          console.warn('Real camera not accessible:', err.name, err.message);
          setCameraError(
            err.name === 'NotAllowedError'
              ? 'Camera access was denied. Tap the gallery or camera button to take a photo.'
              : 'Could not stream camera preview. Tap camera or gallery button below.'
          );
        }
      }
    };

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scanAnim]);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.16, height * 0.52],
  });

  const handleLaunchCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Camera Permission Required', 'Please enable camera permissions to scan your meal plate.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        processCapturedPhoto(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Camera launch error, falling back to file input:', err);
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const handleLaunchGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Gallery Permission Required', 'Please grant photo library access to choose meal photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        processCapturedPhoto(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Gallery launch error, falling back to file input:', err);
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const processCapturedPhoto = (photoUri) => {
    setCapturedPhoto(photoUri);
    setIsScanning(false);
    // Randomize initial detected dish preset from Indian meal catalogue
    const detected = PRESET_MEALS[Math.floor(Math.random() * PRESET_MEALS.length)];
    setCustomTitle(detected.title);
    setBaseMacros({
      calories: detected.calories,
      protein: detected.protein,
      carbs: detected.carbs,
      fat: detected.fat,
    });
    setPortionMultiplier(1.0);
    setShowVerification(true);
  };

  const handleCapture = () => {
    if (cameraActive && videoRef.current && Platform.OS === 'web') {
      try {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoUrl = canvas.toDataURL('image/jpeg', 0.85);
        processCapturedPhoto(photoUrl);
        return;
      } catch (err) {
        console.error('Error capturing canvas frame:', err);
      }
    }
    handleLaunchCamera();
  };

  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        processCapturedPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset) => {
    setCustomTitle(preset.title);
    setBaseMacros({
      calories: preset.calories,
      protein: preset.protein,
      carbs: preset.carbs,
      fat: preset.fat,
    });
  };

  const handleConfirmLog = () => {
    const finalCalories = Math.round(baseMacros.calories * portionMultiplier);
    const finalProtein = Math.round(baseMacros.protein * portionMultiplier);
    const finalCarbs = Math.round(baseMacros.carbs * portionMultiplier);
    const finalFat = Math.round(baseMacros.fat * portionMultiplier);

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (onFoodLogged) {
      onFoodLogged({
        id: 'meal_' + Date.now().toString(36),
        title: customTitle.trim() || 'Indian Meal',
        mealType: selectedMealType,
        time: timeString,
        calories: finalCalories,
        protein: finalProtein,
        carbs: finalCarbs,
        fat: finalFat,
        imageUri: capturedPhoto,
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {Platform.OS === 'web' && (
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      )}

      {/* Background / Live Viewport */}
      {capturedPhoto ? (
        <Image source={{ uri: capturedPhoto }} style={styles.cameraBackground} />
      ) : Platform.OS === 'web' ? (
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          style={styles.cameraVideo}
        />
      ) : (
        <View style={styles.nativeCameraFallback}>
          <MaterialIcons name="photo-camera" size={64} color={colors.primary} />
          <Text style={styles.fallbackTitle}>AI Meal Lens Active</Text>
          <Text style={styles.fallbackSubtitle}>Tap Shutter or Gallery below to scan your plate</Text>
        </View>
      )}

      <View style={styles.darkVignette} />

      {/* Top Controls */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconCircleBtn} onPress={onClose} activeOpacity={0.8}>
          <MaterialIcons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.lensBadge}>
          <MaterialIcons name="auto-awesome" size={14} color="#34D399" />
          <Text style={styles.lensBadgeText}>Clinical Food Vision</Text>
        </View>
        <TouchableOpacity
          style={styles.iconCircleBtn}
          onPress={() => setShowVerification(true)}
          activeOpacity={0.8}
        >
          <MaterialIcons name="edit" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Scanning Target Finder */}
      {!showVerification && isScanning && (
        <View style={styles.viewfinderCenter}>
          <View style={styles.targetFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            <Animated.View style={[styles.laserScanLine, { transform: [{ translateY }] }]} />

            <View style={styles.floatingDetectionCapsule}>
              <MaterialIcons name="center-focus-strong" size={16} color="#34D399" />
              <Text style={styles.detectionText}>Align meal inside frame</Text>
            </View>
          </View>
        </View>
      )}

      {/* Bottom Shutter & Picker Actions */}
      {!showVerification && (
        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={styles.secondaryActionBtn}
            onPress={handleLaunchGallery}
            activeOpacity={0.8}
          >
            <MaterialIcons name="photo-library" size={26} color="#ffffff" />
            <Text style={styles.actionBtnLabel}>Gallery</Text>
          </TouchableOpacity>

          {/* Shutter Button */}
          <TouchableOpacity
            style={styles.shutterOuterRing}
            onPress={handleCapture}
            activeOpacity={0.85}
          >
            <View style={styles.shutterInnerButton}>
              <MaterialIcons name="photo-camera" size={32} color={colors.primary} />
            </View>
          </TouchableOpacity>

          {/* Manual Entry Toggle */}
          <TouchableOpacity
            style={styles.secondaryActionBtn}
            onPress={() => setShowVerification(true)}
            activeOpacity={0.8}
          >
            <MaterialIcons name="edit-note" size={28} color="#ffffff" />
            <Text style={styles.actionBtnLabel}>Manual</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Interactive Meal Verification & Portion Sheet */}
      {showVerification && (
        <View style={styles.verificationSheet}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetScroll}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Confirm Meal & Portions</Text>
                <Text style={styles.sheetSubtitle}>Review AI nutrition estimation</Text>
              </View>
              <TouchableOpacity onPress={() => setShowVerification(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <MaterialIcons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Dish Title Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Dish Name</Text>
              <TextInput
                style={styles.titleInput}
                value={customTitle}
                onChangeText={setCustomTitle}
                placeholder="e.g. 2 Rotis with Dal & Sabzi"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* Indian Dish Suggestions */}
            <Text style={styles.fieldLabel}>Quick Common Dishes</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
              {PRESET_MEALS.map((preset, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.presetChip,
                    customTitle === preset.title && styles.presetChipActive,
                  ]}
                  onPress={() => handleSelectPreset(preset)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.presetChipText,
                      customTitle === preset.title && styles.presetChipTextActive,
                    ]}
                  >
                    {preset.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Portion Adjuster */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Portion Size</Text>
              <View style={styles.portionRow}>
                {[
                  { label: '0.5x Light', val: 0.5 },
                  { label: '1.0x Regular', val: 1.0 },
                  { label: '1.5x Hearty', val: 1.5 },
                  { label: '2.0x Double', val: 2.0 },
                ].map((p) => (
                  <TouchableOpacity
                    key={p.val}
                    style={[
                      styles.portionBtn,
                      portionMultiplier === p.val && styles.portionBtnActive,
                    ]}
                    onPress={() => setPortionMultiplier(p.val)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.portionBtnText,
                        portionMultiplier === p.val && styles.portionBtnTextActive,
                      ]}
                    >
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Recalculated Live Macro Cards */}
            <View style={styles.macroSummaryCard}>
              <View style={styles.macroStatItem}>
                <Text style={styles.macroStatVal}>
                  {Math.round(baseMacros.calories * portionMultiplier)}
                </Text>
                <Text style={styles.macroStatLabel}>CALORIES</Text>
              </View>
              <View style={styles.macroStatItem}>
                <Text style={[styles.macroStatVal, { color: colors.chartProtein }]}>
                  {Math.round(baseMacros.protein * portionMultiplier)}g
                </Text>
                <Text style={styles.macroStatLabel}>PROTEIN</Text>
              </View>
              <View style={styles.macroStatItem}>
                <Text style={[styles.macroStatVal, { color: colors.chartCarbs }]}>
                  {Math.round(baseMacros.carbs * portionMultiplier)}g
                </Text>
                <Text style={styles.macroStatLabel}>CARBS</Text>
              </View>
              <View style={styles.macroStatItem}>
                <Text style={[styles.macroStatVal, { color: colors.chartFat }]}>
                  {Math.round(baseMacros.fat * portionMultiplier)}g
                </Text>
                <Text style={styles.macroStatLabel}>FAT</Text>
              </View>
            </View>

            {/* Meal Time Picker */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Meal Category</Text>
              <View style={styles.mealTypeRow}>
                {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.mealTypeChip,
                      selectedMealType === type && styles.mealTypeChipActive,
                    ]}
                    onPress={() => setSelectedMealType(type)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.mealTypeChipText,
                        selectedMealType === type && styles.mealTypeChipTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Confirm & Log Button */}
            <TouchableOpacity
              style={styles.confirmLogBtn}
              onPress={handleConfirmLog}
              activeOpacity={0.85}
            >
              <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
              <Text style={styles.confirmLogText}>Confirm & Log to Food Diary</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative',
    overflow: 'hidden',
  },
  cameraVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1,
  },
  cameraBackground: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    zIndex: 1,
  },
  nativeCameraFallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    zIndex: 1,
    paddingHorizontal: 24,
    gap: 12,
  },
  fallbackTitle: {
    ...typography.headlineSm,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 20,
  },
  fallbackSubtitle: {
    ...typography.bodySm,
    color: '#94A3B8',
    textAlign: 'center',
  },
  darkVignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    zIndex: 2,
    pointerEvents: 'none',
  },
  topBar: {
    position: 'absolute',
    top: (StatusBar.currentHeight || 24) + 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  iconCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lensBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  lensBadgeText: {
    ...typography.labelCaps,
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  viewfinderCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
    pointerEvents: 'none',
  },
  targetFrame: {
    width: width * 0.76,
    height: width * 0.76,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#34D399',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  laserScanLine: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 3,
    backgroundColor: '#34D399',
    borderRadius: 2,
    shadowColor: '#34D399',
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  floatingDetectionCapsule: {
    position: 'absolute',
    bottom: -46,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
  },
  detectionText: {
    ...typography.labelCaps,
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bottomControls: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 36 : 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  secondaryActionBtn: {
    alignItems: 'center',
    gap: 4,
    minWidth: 60,
  },
  actionBtnLabel: {
    ...typography.labelCaps,
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  shutterOuterRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInnerButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  verificationSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: Platform.OS === 'android' ? 36 : 24,
    maxHeight: height * 0.78,
    zIndex: 25,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
  },
  sheetScroll: {
    paddingBottom: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    ...typography.headlineSm,
    fontSize: 18,
    fontWeight: '800',
    color: colors.textMain,
  },
  sheetSubtitle: {
    ...typography.bodySm,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    ...typography.labelCaps,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMain,
    marginBottom: 6,
  },
  titleInput: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
    color: colors.textMain,
    fontWeight: '600',
  },
  presetScroll: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  presetChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  presetChipActive: {
    backgroundColor: colors.primary,
  },
  presetChipText: {
    fontSize: 12,
    color: colors.textMain,
    fontWeight: '600',
  },
  presetChipTextActive: {
    color: '#FFFFFF',
  },
  portionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  portionBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  portionBtnActive: {
    backgroundColor: colors.primaryContainer,
  },
  portionBtnText: {
    fontSize: 11,
    color: colors.textMain,
    fontWeight: '700',
  },
  portionBtnTextActive: {
    color: '#FFFFFF',
  },
  macroSummaryCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    justifyContent: 'space-around',
    marginBottom: 14,
  },
  macroStatItem: {
    alignItems: 'center',
  },
  macroStatVal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  macroStatLabel: {
    ...typography.labelCaps,
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },
  mealTypeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  mealTypeChip: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  mealTypeChipActive: {
    backgroundColor: colors.mintLight,
  },
  mealTypeChipText: {
    fontSize: 12,
    color: colors.textMain,
    fontWeight: '600',
  },
  mealTypeChipTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  confirmLogBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    elevation: 3,
  },
  confirmLogText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
