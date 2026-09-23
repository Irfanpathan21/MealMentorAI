import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import VerifyOtpScreen from '../screens/VerifyOtpScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import DashboardScreen from '../screens/DashboardScreen';
import FoodScanScreen from '../screens/FoodScanScreen';
import AiChatScreen from '../screens/AiChatScreen';
import ReportsScreen from '../screens/ReportsScreen';
import MealHistoryScreen from '../screens/MealHistoryScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import SuggestionsScreen from '../screens/SuggestionsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { subscribeToAuthChanges, logoutUser, checkRedirectResult } from '../services/authService';
import { saveUserProfile, subscribeToUserProfile, logMeal, subscribeToMeals } from '../services/firestoreService';

const DEFAULT_INITIAL_MEALS = [
  {
    id: 'init_1',
    title: 'Masala Omelette & 2 Pav',
    mealType: 'Breakfast',
    time: '08:45 AM',
    calories: 420,
    protein: 18,
    carbs: 46,
    fat: 16,
    imageUri: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'init_2',
    title: 'Dal Tadka, Sabzi & 2 Phulkas',
    mealType: 'Lunch',
    time: '01:30 PM',
    calories: 560,
    protein: 22,
    carbs: 82,
    fat: 14,
    imageUri: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=400&auto=format&fit=crop',
  },
];

export default function AppNavigator() {
  const [authView, setAuthView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [pendingEmail, setPendingEmail] = useState('');

  // Real Dynamic State: Logged Meals & Hydration
  const [meals, setMeals] = useState(DEFAULT_INITIAL_MEALS);
  const [waterGlasses, setWaterGlasses] = useState(5);

  // Main App Tab State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [previousTab, setPreviousTab] = useState('dashboard');

  // Subscribe to Firebase Auth state on mount
  useEffect(() => {
    checkRedirectResult().then((res) => {
      if (res && res.success && res.user) {
        setCurrentUser(res.user);
        setIsAuthenticated(true);
      }
    });

    const unsubscribe = subscribeToAuthChanges((user) => {
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync profile from Firestore whenever user is logged in
  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsubProfile = subscribeToUserProfile(currentUser.uid, (profile) => {
      if (profile) {
        setUserProfile(profile);
        setHasCompletedOnboarding(true);
      }
    });

    // Real-time listener for meals logged to Cloud Firestore
    const unsubMeals = subscribeToMeals(currentUser.uid, (cloudMeals) => {
      if (cloudMeals && cloudMeals.length > 0) {
        setMeals(cloudMeals);
      }
    });

    return () => {
      unsubProfile();
      unsubMeals();
    };
  }, [currentUser?.uid]);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = (userData) => {
    setCurrentUser(userData);
    setPendingEmail(userData?.email || '');
    setAuthView('verify_otp');
  };

  const handleOtpVerified = () => {
    setIsAuthenticated(true);
    setHasCompletedOnboarding(false);
    setAuthView('login');
  };

  const handleCompleteOnboarding = async (onboardingData) => {
    setUserProfile(onboardingData);
    setHasCompletedOnboarding(true);
    setActiveTab('dashboard');

    if (currentUser?.uid) {
      await saveUserProfile(currentUser.uid, onboardingData);
    }

    Alert.alert(
      'Profile Saved to Cloud! 🎉',
      `Your clinical nutrition plan is now active for ${onboardingData.goalTitle} (${onboardingData.dietLabel}).`,
      [{ text: 'Explore Dashboard' }]
    );
  };

  const handleSkipOnboarding = () => {
    setHasCompletedOnboarding(true);
    setActiveTab('dashboard');
  };

  const handleSelectTab = (tabKey) => {
    setPreviousTab(activeTab);
    setActiveTab(tabKey);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logoutUser();
            setIsAuthenticated(false);
            setCurrentUser(null);
            setUserProfile(null);
            setHasCompletedOnboarding(false);
            setAuthView('login');
            setActiveTab('dashboard');
          },
        },
      ]
    );
  };

  const handleLogMeal = async (food) => {
    const newMeal = {
      id: food.id || 'meal_' + Date.now().toString(36),
      title: food.title || 'Indian Meal',
      mealType: food.mealType || 'Lunch',
      time: food.time || 'Just now',
      calories: Number(food.calories) || 0,
      protein: Number(food.protein) || 0,
      carbs: Number(food.carbs) || 0,
      fat: Number(food.fat) || 0,
      imageUri: food.imageUri || null,
    };

    setMeals((prev) => [newMeal, ...prev]);

    if (currentUser?.uid) {
      await logMeal(currentUser.uid, newMeal);
    }

    setActiveTab('dashboard');
    Alert.alert(
      'Meal Logged! 🎉',
      `${newMeal.title} (${newMeal.calories} kcal) added. Your daily macro rings have updated!`,
      [{ text: 'View Dashboard' }]
    );
  };

  const handleNotificationPress = () => {
    Alert.alert(
      'MealMentor AI Nudge',
      'Time for your evening hydration and protein check! Keep going strong.',
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Ask AI Dietitian', onPress: () => setActiveTab('chat') },
      ]
    );
  };

  // 1. Auth Flow
  if (!isAuthenticated) {
    let authScreen = null;
    if (authView === 'verify_otp') {
      authScreen = (
        <VerifyOtpScreen
          email={pendingEmail || currentUser?.email || 'user@example.com'}
          onVerifySuccess={handleOtpVerified}
          onBackToRegister={() => setAuthView('register')}
        />
      );
    } else if (authView === 'register') {
      authScreen = (
        <RegisterScreen
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateToLogin={() => setAuthView('login')}
        />
      );
    } else {
      authScreen = (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegister={() => setAuthView('register')}
        />
      );
    }

    return (
      <SafeAreaProvider style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor={colors.bgCreamSurface} />
          {authScreen}
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // 2. Onboarding Flow
  if (!hasCompletedOnboarding) {
    return (
      <SafeAreaProvider style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor={colors.bgCreamSurface} />
          <OnboardingScreen
            currentUser={currentUser}
            onCompleteOnboarding={handleCompleteOnboarding}
            onSkip={handleSkipOnboarding}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // 3. Main Application Flow
  const renderCurrentScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardScreen
            currentUser={currentUser}
            userProfile={userProfile}
            meals={meals}
            waterGlasses={waterGlasses}
            onUpdateWater={setWaterGlasses}
            onNavigateToScan={() => handleSelectTab('scan')}
            onNavigateToChat={() => handleSelectTab('chat')}
            onNavigateToReports={() => handleSelectTab('reports')}
            onNavigateToAnalytics={() => handleSelectTab('analytics')}
            onNavigateToSuggestions={() => handleSelectTab('suggestions')}
          />
        );
      case 'scan':
        return (
          <FoodScanScreen
            onClose={() => setActiveTab(previousTab === 'scan' ? 'dashboard' : previousTab)}
            onFoodLogged={handleLogMeal}
          />
        );
      case 'chat':
        return <AiChatScreen userProfile={userProfile} />;
      case 'reports':
        return <ReportsScreen />;
      case 'history':
        return (
          <MealHistoryScreen
            meals={meals}
            onNavigateToScan={() => handleSelectTab('scan')}
          />
        );
      case 'analytics':
        return <AnalyticsScreen />;
      case 'suggestions':
        return (
          <SuggestionsScreen
            onSelectMeal={(item) => {
              handleLogMeal(item);
            }}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            currentUser={currentUser}
            userProfile={userProfile}
            onEditGoals={() => setHasCompletedOnboarding(false)}
            onLogout={handleSignOut}
            onNavigateToReports={() => handleSelectTab('reports')}
            onNavigateToAnalytics={() => handleSelectTab('analytics')}
          />
        );
      default:
        return (
          <DashboardScreen
            currentUser={currentUser}
            userProfile={userProfile}
            meals={meals}
            waterGlasses={waterGlasses}
            onUpdateWater={setWaterGlasses}
            onNavigateToScan={() => handleSelectTab('scan')}
            onNavigateToChat={() => handleSelectTab('chat')}
            onNavigateToReports={() => handleSelectTab('reports')}
            onNavigateToAnalytics={() => handleSelectTab('analytics')}
            onNavigateToSuggestions={() => handleSelectTab('suggestions')}
          />
        );
    }
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Top App Bar with Clinical Brand & Avatar */}
        <TopAppBar
          userName={currentUser?.name || userProfile?.goalTitle || 'Health Member'}
          userPhoto={currentUser?.photoURL || null}
          activeTab={activeTab}
          onNotificationPress={handleNotificationPress}
          onProfilePress={() => handleSelectTab('profile')}
        />

        {/* Main Content Viewport */}
        <View style={styles.content}>{renderCurrentScreen()}</View>

        {/* Bottom Navigation Bar */}
        <BottomNavBar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
});
