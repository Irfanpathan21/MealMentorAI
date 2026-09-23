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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { registerWithEmail, signInWithGoogle } from '../services/authService';

export default function RegisterScreen({ onRegisterSuccess, onNavigateToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoogleSignUp = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        onRegisterSuccess(result.user);
      } else {
        setErrorMessage(result.error);
      }
    } catch (err) {
      setErrorMessage('Google registration failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await registerWithEmail(email, password, name);
      if (result.success) {
        onRegisterSuccess(result.user, result.otpCode);
      } else {
        setErrorMessage(result.error);
      }
    } catch (err) {
      setErrorMessage('Registration failed. Please try again.');
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
        <View style={styles.topAmbientGlow} />

        {/* Back Link to Sign In */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onNavigateToLogin}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={20} color={colors.primary} />
          <Text style={styles.backButtonText}>Back to Sign In</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Join MealMentor AI</Text>
          <Text style={styles.subtitle}>
            Empowering your Indian diet with real-time AI recognition & clinical precision.
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {errorMessage ? (
            <View style={styles.errorBanner}>
              <MaterialIcons name="error-outline" size={18} color={colors.error} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* 1-Tap Google Sign Up */}
          <GoogleSignInButton
            text="Sign up with Google"
            onPress={handleGoogleSignUp}
            isLoading={isGoogleLoading}
            disabled={isLoading || isGoogleLoading}
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or register with email</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="person-outline" size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Ananya Sharma"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
                editable={!isLoading && !isGoogleLoading}
              />
            </View>
          </View>

          {/* Email Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="mail-outline" size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="name@example.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!isLoading && !isGoogleLoading}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock-outline" size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="At least 6 characters"
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

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock-outline" size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Re-enter password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!isLoading && !isGoogleLoading}
              />
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, (isLoading || isGoogleLoading) && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading || isGoogleLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <View style={styles.btnContent}>
                <Text style={styles.registerButtonText}>Create Account & Continue</Text>
                <MaterialIcons name="arrow-forward" size={18} color={colors.onPrimary} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerRow}>
          <Text style={styles.footerPrompt}>Already have an account?</Text>
          <TouchableOpacity onPress={onNavigateToLogin} activeOpacity={0.7}>
            <Text style={styles.footerActionText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingTop: 36,
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 6,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    ...typography.bodySm,
    color: colors.primary,
    fontWeight: '600',
  },
  headerSection: {
    marginBottom: 20,
  },
  title: {
    ...typography.headlineLg,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.textMuted,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
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
  inputGroup: {
    marginBottom: 13,
  },
  inputLabel: {
    ...typography.labelCaps,
    color: colors.textMain,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
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
  registerButton: {
    backgroundColor: colors.primaryContainer,
    borderRadius: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
  registerButtonText: {
    ...typography.labelCaps,
    fontSize: 13,
    color: colors.onPrimary,
    fontWeight: '700',
    textTransform: 'none',
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
});
