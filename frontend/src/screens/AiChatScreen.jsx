import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const QUICK_PROMPTS = [
  'Best vegetarian protein for dinner?',
  'How to prevent glucose spikes after rice?',
  'Healthy Indian snack under 150 kcal?',
  'Should I take apple cider vinegar before meals?',
];

export default function AiChatScreen({ userProfile = null, onBack }) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef(null);

  const goal = userProfile?.goalTitle || 'Clinical Nutrition & Metabolic Wellness';
  const diet = userProfile?.dietLabel || 'Indian Balanced Diet';
  const conditions = userProfile?.conditions?.length
    ? userProfile.conditions.join(', ')
    : 'No severe medical conditions reported';

  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      text: `Namaste! I am your clinical AI Nutritionist. I see your primary focus is "${goal}" following a ${diet} pattern. How can I optimize your meals or biomarkers today?`,
      time: 'Just now',
    },
  ]);

  const generateClinicalResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes('protein') || q.includes('veg') || q.includes('vegetarian')) {
      return `For a ${diet} focused on ${goal}, great high-protein choices include:\n• Sprouted Moong Dal (14g P / cup) paired with a squeeze of lemon for iron absorption.\n• Low-fat Paneer or Soya chunks (52g P / 100g dry) cooked in minimal mustard oil.\n• Sattu (roasted chickpea flour) mixed in buttermilk (chaas) as a high-protein post-workout tonic.`;
    }

    if (q.includes('sugar') || q.includes('rice') || q.includes('spike') || q.includes('glucose') || q.includes('diabet')) {
      return `To mitigate postprandial glucose spikes when eating rice:\n1. 'Clothes your carbs': Eat a bowl of cucumber & tomato salad FIRST, followed by protein (dal or curd), and eat the rice last.\n2. Swap polished white rice for Brown or Parboiled (Usna) rice which has a lower Glycemic Index (GI 50 vs 72).\n3. Add 1 tsp of ground fenugreek (methi) or cinnamon to help insulin sensitivity.`;
    }

    if (q.includes('snack') || q.includes('evening') || q.includes('150')) {
      return `Here are 3 clinical-grade Indian snacks under 150 kcal:\n1. Roasted Makhana (Foxnuts) with turmeric & pinch of pink salt (~110 kcal, high magnesium).\n2. Boiled Chana Chaat (1/2 cup with chopped onions, coriander & lemon juice - ~135 kcal, 6g fiber).\n3. Cucumber Boats filled with 2 tbsp hung curd dip & mint (~85 kcal, zero spike).`;
    }

    if (q.includes('water') || q.includes('hydrat') || q.includes('drink')) {
      return `Proper hydration improves metabolic clearance and insulin sensitivity. Aim for 2.5 to 3 Liters daily. A great practice is starting your morning with 500ml warm water with soaked methi seeds or cumin (jeera) water.`;
    }

    return `Understood. Given your objective of ${goal} and your profile (${conditions}), remember that nutrient timing and dietary fiber (>30g/day) play a decisive role. Would you like me to suggest a full day meal schedule customized to these targets?`;
  };

  const handleSend = (textToSend = null) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const replyText = generateClinicalResponse(query);
      const aiReply = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        time: 'Just now',
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 1100);
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, isTyping]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      {/* Top Clinical Header */}
      <View style={styles.chatHeader}>
        <View style={styles.headerAvatar}>
          <LinearGradient
            colors={[colors.aiGradientStart, colors.aiGradientEnd]}
            style={styles.headerAvatarGrad}
          >
            <MaterialIcons name="auto-awesome" size={20} color="#FFFFFF" />
          </LinearGradient>
          <View style={styles.onlineBadge} />
        </View>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>AI Clinical Dietitian</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            Trained on Indian ICMR & Clinical Nutrition Guidelines
          </Text>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatScroll}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.goalReminderCard}>
          <MaterialIcons name="shield" size={16} color={colors.primary} />
          <Text style={styles.goalReminderText}>
            Personalized for: <Text style={{ fontWeight: '700' }}>{goal}</Text> ({diet})
          </Text>
        </View>

        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <View
              key={msg.id}
              style={[styles.messageRow, isAi ? styles.messageRowAi : styles.messageRowUser]}
            >
              {isAi && (
                <LinearGradient
                  colors={[colors.aiGradientStart, colors.aiGradientEnd]}
                  style={styles.aiAvatar}
                >
                  <MaterialIcons name="smart-toy" size={16} color="#FFFFFF" />
                </LinearGradient>
              )}

              <View style={[styles.bubble, isAi ? styles.bubbleAi : styles.bubbleUser]}>
                <Text style={[styles.messageText, isAi ? styles.messageTextAi : styles.messageTextUser]}>
                  {msg.text}
                </Text>
              </View>
            </View>
          );
        })}

        {isTyping && (
          <View style={[styles.messageRow, styles.messageRowAi]}>
            <LinearGradient
              colors={[colors.aiGradientStart, colors.aiGradientEnd]}
              style={styles.aiAvatar}
            >
              <MaterialIcons name="smart-toy" size={16} color="#FFFFFF" />
            </LinearGradient>
            <View style={[styles.bubble, styles.bubbleAi, styles.typingBubble]}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.typingText}>Consulting clinical dietary knowledge...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Suggested Quick Prompts */}
      <View style={styles.promptsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsScroll}>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.promptChip}
              onPress={() => handleSend(prompt)}
              activeOpacity={0.7}
            >
              <Text style={styles.promptChipText}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Input Box */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask about foods, calories, or blood sugar..."
          placeholderTextColor={colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={300}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={() => handleSend()}
          disabled={!inputText.trim() || isTyping}
          activeOpacity={0.85}
        >
          <MaterialIcons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: (Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 16) + 8,
    paddingBottom: 14,
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    gap: 12,
  },
  headerAvatar: {
    position: 'relative',
  },
  headerAvatarGrad: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    ...typography.headlineSm,
    fontSize: 16,
    fontWeight: '800',
    color: colors.textMain,
  },
  headerSubtitle: {
    ...typography.bodySm,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 20,
  },
  goalReminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  goalReminderText: {
    fontSize: 11,
    color: colors.primary,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-end',
  },
  messageRowAi: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 2,
  },
  bubble: {
    maxWidth: '82%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 0,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  bubbleAi: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  messageText: {
    ...typography.bodyMd,
    lineHeight: 21,
    fontSize: 14,
  },
  messageTextAi: {
    color: colors.textMain,
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  typingText: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  promptsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderTopWidth: 0,
  },
  promptsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  promptChip: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  promptChipText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'android' ? 24 : 14,
    gap: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 14,
    color: colors.textMain,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  sendButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
});
