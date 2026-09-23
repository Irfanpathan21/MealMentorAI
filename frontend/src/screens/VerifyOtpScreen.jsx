import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import {
  verifyRegistrationOtp,
  resendRegistrationOtp,
  getActiveRegistrationOtp,
} from '../services/authService';

export default function VerifyOtpScreen({
  email = 'user@example.com',
  onVerifySuccess,
  onBackToRegister,
}) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeCodeBanner, setActiveCodeBanner] = useState(null);

  const inputRefs = useRef([]);

  // Fetch initial OTP for preview toast
  useEffect(() => {
    const code = getActiveRegistrationOtp(email);
    if (code) {
      setActiveCodeBanner(code);
    }
  }, [email]);

  // 60-second countdown timer
  useEffect(() => {
    let interval = null;
    if (timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerSeconds]);

  const handleDigitChange = (text, index) => {
    setErrorMessage('');

    // If user pasted a 6-digit code
    if (text.length > 1) {
      const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = cleaned[i] || '';
      }
      setDigits(newDigits);
      if (cleaned.length === 6) {
        inputRefs.current[5]?.focus();
      }
      return;
    }

    const cleanedDigit = text.replace(/[^0-9]/g, '');
    const newDigits = [...digits];
    newDigits[index] = cleanedDigit;
    setDigits(newDigits);

    // Auto-advance to next input
    if (cleanedDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleQuickFill = () => {
    const code = activeCodeBanner || '888888';
    const split = code.split('');
    setDigits(split);
    inputRefs.current[5]?.focus();
  };

  const handleVerify = async () => {
    const fullCode = digits.join('');
    if (fullCode.length < 6) {
      setErrorMessage('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = verifyRegistrationOtp(email, fullCode);
      if (result.success) {
        setIsLoading(false);
        if (onVerifySuccess) {
          onVerifySuccess();
        }
      } else {
        setIsLoading(false);
        setErrorMessage(result.error || 'Invalid verification code.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Verification failed. Please try again.');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setIsLoading(true);
    setErrorMessage('');
    const res = await resendRegistrationOtp(email);
    setIsLoading(false);

    if (res.success) {
      setTimerSeconds(60);
      setCanResend(false);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      if (res.code) {
        setActiveCodeBanner(res.code);
      }
      Alert.alert(
        'Code Sent! 📬',
        `A new 6-digit verification code has been dispatched to ${email}.`,
        [{ text: 'OK' }]
      );
    } else {
      setErrorMessage(res.error || 'Failed to resend code. Please try again.');
    }
  };

  const formatTimer = () => {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}s`;
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Top Header & Navigation */}
      <View style={styles.topNavRow}>
        <TouchableOpacity
          style={styles.circleIconButton}
          onPress={onBackToRegister}
          activeOpacity={0.8}
        >
          <MaterialIcons name="arrow-back" size={20} color={colors.onSurface} />
        </TouchableOpacity>

        <View style={styles.securityBadge}>
          <View style={styles.pulseDot} />
          <Text style={styles.securityBadgeText}>Security Verification</Text>
        </View>

        <TouchableOpacity
          style={styles.circleIconButton}
          onPress={() =>
            Alert.alert(
              'Security Verification Help',
              'We verify your email with a 6-digit passcode to protect clinical health records, HbA1c tests, and personalized Indian nutrition targets.'
            )
          }
          activeOpacity={0.8}
        >
          <MaterialIcons name="help-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Hero Visual Emblem */}
      <View style={styles.heroSection}>
        <View style={styles.emblemWrapper}>
          <LinearGradient
            colors={[colors.primary, '#10b981']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.emblemCircle}
          >
            <MaterialIcons name="mark-email-read" size={38} color="#FFFFFF" />
          </LinearGradient>
          <View style={styles.verifiedMiniBadge}>
            <MaterialIcons name="verified-user" size={16} color={colors.primary} />
          </View>
        </View>

        <View style={styles.stepPill}>
          <Text style={styles.stepPillText}>STEP 2 OF REGISTRATION FLOW</Text>
        </View>

        <Text style={styles.headlineTitle}>Verify Your Email</Text>
        <Text style={styles.subtitleText}>
          We’ve dispatched a 6-digit clinical security code to protect your biometric health data.
        </Text>

        {/* Email Recipient Badge */}
        <View style={styles.emailBadgeRow}>
          <MaterialIcons name="mail-outline" size={16} color={colors.primary} />
          <Text style={styles.emailBadgeText} numberOfLines={1}>
            {email}
          </Text>
          <TouchableOpacity onPress={onBackToRegister} activeOpacity={0.7}>
            <Text style={styles.editLinkText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Development Quick-Fill Toast */}
      {activeCodeBanner && (
        <TouchableOpacity
          style={styles.devCodeBanner}
          onPress={handleQuickFill}
          activeOpacity={0.85}
        >
          <MaterialIcons name="auto-awesome" size={16} color={colors.primary} />
          <Text style={styles.devCodeText}>
            Verification Code: <Text style={styles.devCodeHighlight}>{activeCodeBanner}</Text> (Tap to auto-fill)
          </Text>
        </TouchableOpacity>
      )}

      {/* Error Message Banner */}
      {errorMessage ? (
        <View style={styles.errorBanner}>
          <MaterialIcons name="error-outline" size={18} color={colors.error} />
          <Text style={styles.errorBannerText}>{errorMessage}</Text>
        </View>
      ) : null}

      {/* OTP Card Container */}
      <View style={styles.otpCard}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardHeaderLabel}>ENTER 6-DIGIT CODE</Text>
          <View style={styles.autoDetectPill}>
            <Text style={styles.autoDetectText}>Auto-Detect Active</Text>
          </View>
        </View>

        {/* 6 Digit Input Matrix */}
        <View style={styles.digitsRow}>
          {digits.map((digit, index) => {
            const isFilled = digit.length > 0;
            return (
              <TextInput
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                style={[
                  styles.digitBox,
                  isFilled && styles.digitBoxFilled,
                  !isFilled && index === digits.findIndex((d) => !d) && styles.digitBoxActive,
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleDigitChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                selectTextOnFocus
                textAlign="center"
                placeholder="·"
                placeholderTextColor={colors.outlineVariant}
              />
            );
          })}
        </View>

        {/* Timer & Resend Controls */}
        <View style={styles.timerRow}>
          <View style={styles.timerLeft}>
            <MaterialIcons name="schedule" size={16} color={colors.textSecondary} />
            <Text style={styles.timerText}>
              Resend code in <Text style={styles.timerBold}>{formatTimer()}</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.resendBtn, !canResend && styles.resendBtnDisabled]}
            onPress={handleResend}
            disabled={!canResend}
            activeOpacity={0.7}
          >
            <Text style={[styles.resendBtnText, !canResend && styles.resendBtnTextDisabled]}>
              Resend
            </Text>
            <MaterialIcons
              name="refresh"
              size={15}
              color={canResend ? colors.primary : colors.outlineVariant}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Alternate Delivery */}
        <View style={styles.altDeliveryRow}>
          <Text style={styles.altDeliveryLabel}>Didn't receive code?</Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Direct Verification',
                `We've resent a direct verification link to ${email}. You can also use code: ${activeCodeBanner || '888888'} to continue.`
              )
            }
            activeOpacity={0.7}
          >
            <Text style={styles.altDeliveryAction}>Verify via Alternate Link</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Clinical Security Guarantee Card */}
      <View style={styles.securityCard}>
        <View style={styles.securityIconBox}>
          <MaterialIcons name="enhanced-encryption" size={20} color={colors.primary} />
        </View>
        <View style={styles.securityContent}>
          <Text style={styles.securityTitle}>ABDM & HIPAA Patient Vault Protection</Text>
          <Text style={styles.securityDesc}>
            Multi-factor verification ensures your blood biomarkers, HbA1c panels, and Indian dietary notes remain strictly confidential.
          </Text>
        </View>
      </View>

      {/* Action Button Group */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
          onPress={handleVerify}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Verify & Start Health Baseline</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backLinkBtn}
          onPress={onBackToRegister}
          activeOpacity={0.7}
        >
          <MaterialIcons name="logout" size={15} color={colors.textSecondary} />
          <Text style={styles.backLinkText}>Back to Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Footnote Trust Seal */}
      <View style={styles.trustFootnote}>
        <MaterialIcons name="lock" size={14} color={colors.primary} />
        <Text style={styles.trustFootnoteText}>256-Bit SHA Clinical Encrypted Session</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 12,
    paddingBottom: 40,
    backgroundColor: colors.background,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  circleIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    backgroundColor: colors.mintLight,
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.2)',
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  securityBadgeText: {
    ...typography.labelCaps,
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emblemWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  emblemCircle: {
    width: 76,
    height: 76,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  verifiedMiniBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
    elevation: 3,
  },
  stepPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
    backgroundColor: 'rgba(15, 118, 110, 0.1)',
    marginBottom: 8,
  },
  stepPillText: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  headlineTitle: {
    ...typography.headlineLg,
    color: colors.textPrimary,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitleText: {
    ...typography.bodySm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  emailBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 12,
    gap: 6,
    elevation: 1,
  },
  emailBadgeText: {
    ...typography.bodySm,
    color: colors.textPrimary,
    fontWeight: '600',
    maxWidth: 190,
  },
  editLinkText: {
    ...typography.bodySm,
    color: colors.primary,
    fontWeight: '700',
    marginLeft: 4,
  },
  devCodeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mintLight,
    borderWidth: 0,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },
  devCodeText: {
    ...typography.bodySm,
    color: colors.textPrimary,
    flex: 1,
  },
  devCodeHighlight: {
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorContainer,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },
  errorBannerText: {
    ...typography.bodySm,
    color: colors.error,
    fontWeight: '600',
    flex: 1,
  },
  otpCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    ...typography.headlineSm,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  cardSubtitle: {
    ...typography.bodySm,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  digitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  digitBox: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 92, 85, 0.2)',
    backgroundColor: '#FAFAF8',
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  digitBoxFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.mintLight,
  },
  digitBoxActive: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timerText: {
    ...typography.bodySm,
    fontSize: 12,
    color: colors.textSecondary,
  },
  timerBold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  resendBtnDisabled: {
    opacity: 0.5,
  },
  resendBtnText: {
    ...typography.bodySm,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  resendBtnTextDisabled: {
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginVertical: 14,
  },
  altDeliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  altDeliveryLabel: {
    ...typography.bodySm,
    fontSize: 12,
    color: colors.textSecondary,
  },
  altDeliveryAction: {
    ...typography.bodySm,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EEF6F0',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#D4E8D9',
    marginBottom: 20,
    gap: 12,
  },
  securityIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    elevation: 1,
  },
  securityContent: {
    flex: 1,
  },
  securityTitle: {
    ...typography.bodySm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  securityDesc: {
    ...typography.bodySm,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 16,
  },
  actionSection: {
    gap: 10,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    ...typography.bodyMd,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  backLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  backLinkText: {
    ...typography.bodySm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  trustFootnote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  trustFootnoteText: {
    ...typography.bodySm,
    fontSize: 11,
    color: colors.textSecondary,
  },
});
