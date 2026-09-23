import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { loginWithEmail, signInWithGoogle, signInWithGoogleAccount } from '../services/authService';

export default function LoginScreen({ onLoginSuccess, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Native Google Account modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');
  const [isSubmittingGoogle, setIsSubmittingGoogle] = useState(false);
  const [googleModalError, setGoogleModalError] = useState('');

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        onLoginSuccess(result.user);
      } else if (result.needsGooglePrompt || Platform.OS !== 'web') {
        setShowGoogleModal(true);
      } else {
        setErrorMessage(result.error);
      }
    } catch (err) {
      setShowGoogleModal(true);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleConfirmGoogleAccount = async () => {
    if (!googleEmailInput.trim()) {
      setGoogleModalError('Please enter your Google email address');
      return;
    }
    setGoogleModalError('');
    setIsSubmittingGoogle(true);
    try {
      const res = await signInWithGoogleAccount(googleEmailInput, googleNameInput);
      if (res.success) {
        setShowGoogleModal(false);
        onLoginSuccess(res.user);
      } else {
        setGoogleModalError(res.error || 'Failed to authenticate Google account.');
      }
    } catch (err) {
      setGoogleModalError('Authentication error. Please try again.');
    } finally {
      setIsSubmittingGoogle(false);
    }
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await loginWithEmail(email, password);
      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setErrorMessage(result.error);
      }
    } catch (err) {
      setErrorMessage('Sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ambient Top Glow */}
        <View style={styles.topAmbientGlow} />

        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <View style={styles.logoIcon}>
            <MaterialIcons name="auto-awesome" size={32} color={colors.onPrimary} />
          </View>
          <Text style={styles.appName}>MealMentor AI</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>Clinical Edition • Firebase Auth</Text>
          </View>
          <Text style={styles.tagline}>
            Clinical Precision & Lifestyle Wellness for Indian Nutrition
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSubtitle}>Sign in to access your AI meal journal & health metrics</Text>

          {errorMessage ? (
            <View style={styles.errorBanner}>
              <MaterialIcons name="error-outline" size={18} color={colors.error} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* 1-Tap Google Sign In */}
          <GoogleSignInButton
            text="Continue with Google"
            onPress={handleGoogleSignIn}
            isLoading={isGoogleLoading}
            disabled={isLoading || isGoogleLoading}
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign in with email</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="mail-outline" size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="name@domain.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!isLoading && !isGoogleLoading}
              />
            </View>
          </View>

          {/* Password Field */}
          <View style={styles.inputGroup}>
            <View style={styles.passwordLabelRow}>
              <Text style={styles.inputLabel}>Password</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.forgotPasswordText}>Forgot?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock-outline" size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading && !isGoogleLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <MaterialIcons
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Primary Sign In Button */}
          <TouchableOpacity
            style={[styles.signInButton, (isLoading || isGoogleLoading) && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading || isGoogleLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <View style={styles.btnContent}>
                <Text style={styles.signInButtonText}>Sign In to Dashboard</Text>
                <MaterialIcons name="arrow-forward" size={18} color={colors.onPrimary} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer: Navigate to Register */}
        <View style={styles.footerRow}>
          <Text style={styles.footerPrompt}>Don't have an account?</Text>
          <TouchableOpacity onPress={onNavigateToRegister} activeOpacity={0.7}>
            <Text style={styles.footerActionText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Google Account Modal (Native APK / Direct Auth) */}
      <Modal
        visible={showGoogleModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGoogleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.googleModalCard}>
            <View style={styles.googleModalHeader}>
              <View style={styles.googleIconCircle}>
                <MaterialIcons name="account-circle" size={28} color="#4285F4" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.googleModalTitle}>Sign in with Google</Text>
                <Text style={styles.googleModalSubtitle}>to continue to MealMentor AI</Text>
              </View>
              <TouchableOpacity onPress={() => setShowGoogleModal(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <MaterialIcons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {googleModalError ? (
              <View style={styles.modalErrorBanner}>
                <MaterialIcons name="error-outline" size={16} color={colors.error} />
                <Text style={styles.modalErrorText}>{googleModalError}</Text>
              </View>
            ) : null}

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalInputLabel}>Google Email Address</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="your.name@gmail.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={googleEmailInput}
                onChangeText={setGoogleEmailInput}
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalInputLabel}>Full Name (Optional)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Irfan Pathan"
                placeholderTextColor={colors.textMuted}
                value={googleNameInput}
                onChangeText={setGoogleNameInput}
              />
            </View>

            <TouchableOpacity
              style={[styles.confirmGoogleBtn, isSubmittingGoogle && styles.buttonDisabled]}
              onPress={handleConfirmGoogleAccount}
              disabled={isSubmittingGoogle}
              activeOpacity={0.85}
            >
              {isSubmittingGoogle ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.confirmGoogleText}>Verify & Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCreamSurface,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 46,
    paddingBottom: 40,
    minHeight: '100%',
    justifyContent: 'center',
  },
  topAmbientGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: 'rgba(204, 251, 241, 0.45)',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    marginBottom: 12,
  },
  appName: {
    ...typography.headlineLg,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  versionBadge: {
    backgroundColor: colors.mintLight,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  versionText: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.primaryContainer,
    fontWeight: '700',
  },
  tagline: {
    ...typography.bodySm,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 24,
    padding: 22,
    borderWidth: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  formTitle: {
    ...typography.headlineSm,
    color: colors.textMain,
    fontWeight: '700',
  },
  formSubtitle: {
    ...typography.bodySm,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 16,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorContainer,
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    gap: 8,
  },
  errorText: {
    ...typography.bodySm,
    color: colors.onErrorContainer,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    ...typography.labelCaps,
    color: colors.textMain,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 5,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  forgotPasswordText: {
    ...typography.bodySm,
    color: colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 14,
    borderWidth: 0,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    ...typography.bodyMd,
    color: colors.textMain,
  },
  eyeButton: {
    padding: 6,
  },
  signInButton: {
    backgroundColor: colors.primaryContainer,
    borderRadius: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signInButtonText: {
    ...typography.labelCaps,
    fontSize: 13,
    color: colors.onPrimary,
    fontWeight: '700',
    textTransform: 'none',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider || 'rgba(0, 0, 0, 0.07)',
  },
  dividerText: {
    ...typography.labelSm,
    color: colors.textMuted,
    marginHorizontal: 10,
    textTransform: 'uppercase',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    gap: 6,
  },
  footerPrompt: {
    ...typography.bodyMd,
    color: colors.textMuted,
  },
  footerActionText: {
    ...typography.bodyMd,
    color: colors.primary,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  googleModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 380,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
  },
  googleModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  googleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleModalTitle: {
    ...typography.headlineSm,
    fontSize: 18,
    color: '#202124',
    fontWeight: '700',
  },
  googleModalSubtitle: {
    ...typography.bodySm,
    fontSize: 12,
    color: '#5F6368',
  },
  modalErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorContainer,
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    gap: 8,
  },
  modalErrorText: {
    ...typography.bodySm,
    color: colors.onErrorContainer,
    flex: 1,
    fontSize: 12,
  },
  modalInputGroup: {
    marginBottom: 14,
  },
  modalInputLabel: {
    ...typography.labelCaps,
    color: '#3C4043',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#F1F3F4',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: '#202124',
  },
  confirmGoogleBtn: {
    backgroundColor: '#1A73E8',
    borderRadius: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  confirmGoogleText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
