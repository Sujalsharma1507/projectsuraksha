import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Phone, Heart, AlertCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatScreen() {
  const { profile } = useAuth();
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your Suraksha AI assistant. I'm here to provide emotional support, safety guidance, and help in emergencies. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const quickResponses = [
    { text: "I feel unsafe", icon: AlertCircle, color: colors.danger },
    { text: "Need emotional support", icon: Heart, color: colors.secondary },
    { text: "Emergency contacts", icon: Phone, color: colors.success },
  ];

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    setTimeout(() => {
      const aiResponse = getAIResponse(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 1000);
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('unsafe') || input.includes('danger') || input.includes('scared')) {
      return "I understand you're feeling unsafe. Your safety is the priority. Would you like me to:\n\n1. Trigger an SOS alert to your emergency contacts\n2. Show you nearby safe zones\n3. Connect you with the Suraksha Network\n4. Guide you through breathing exercises to stay calm\n\nPlease let me know how I can help.";
    }

    if (input.includes('emergency') || input.includes('help') || input.includes('sos')) {
      return "This sounds like an emergency situation. I recommend:\n\n1. Triggering your SOS alert immediately\n2. Moving to a well-lit, populated area\n3. Calling your emergency contacts\n4. Contacting local authorities if needed\n\nWould you like me to activate your SOS alert now?";
    }

    if (input.includes('emotional') || input.includes('support') || input.includes('talk')) {
      return "I'm here to listen and support you. Remember that you're not alone. Would you like to:\n\n1. Talk about what's bothering you\n2. Access counseling resources\n3. Learn coping strategies\n4. Connect with support groups\n\nTake your time, I'm here for you.";
    }

    if (input.includes('contact') || input.includes('guardian')) {
      return "I can help you manage your emergency contacts. You can:\n\n1. View your current emergency contacts\n2. Add new emergency contacts\n3. Update contact information\n4. Set priority levels\n\nWould you like to go to your profile to manage contacts?";
    }

    return "I understand. I'm here to help with:\n\n• Emergency assistance and SOS alerts\n• Emotional support and counseling resources\n• Safety tips and guidance\n• Finding safe zones near you\n• Connecting with the Suraksha Network\n\nWhat would you like to know more about?";
  };

  const handleQuickResponse = (text: string) => {
    setInputText(text);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Bot size={32} color="#FFFFFF" />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>AI Assistant</Text>
          <Text style={styles.headerSubtitle}>24/7 Support & Guidance</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(message => (
          <View
            key={message.id}
            style={[
              styles.messageWrapper,
              message.role === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper,
            ]}
          >
            <View
              style={[
                styles.messageIcon,
                {
                  backgroundColor:
                    message.role === 'user' ? colors.primaryLight : colors.successLight,
                },
              ]}
            >
              {message.role === 'user' ? (
                <UserIcon size={20} color={colors.primary} />
              ) : (
                <Bot size={20} color={colors.success} />
              )}
            </View>
            <View
              style={[
                styles.messageBubble,
                {
                  backgroundColor: message.role === 'user' ? colors.primary : colors.card,
                },
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  { color: message.role === 'user' ? '#FFFFFF' : colors.text },
                ]}
              >
                {message.content}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  { color: message.role === 'user' ? '#FFFFFF' : colors.textLight },
                ]}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        ))}

        {loading && (
          <View style={[styles.messageWrapper, styles.assistantMessageWrapper]}>
            <View style={[styles.messageIcon, { backgroundColor: colors.successLight }]}>
              <Bot size={20} color={colors.success} />
            </View>
            <View style={[styles.messageBubble, { backgroundColor: colors.card }]}>
              <Text style={[styles.messageText, { color: colors.textSecondary }]}>Typing...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.quickResponsesContainer, { backgroundColor: colors.surface }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickResponses}>
          {quickResponses.map((response, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickResponseButton, { backgroundColor: colors.card }]}
              onPress={() => handleQuickResponse(response.text)}
            >
              <response.icon size={16} color={response.color} />
              <Text style={[styles.quickResponseText, { color: colors.text }]}>{response.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="Type your message..."
          placeholderTextColor={colors.textLight}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={sendMessage}
          disabled={!inputText.trim() || loading}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    gap: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
    opacity: 0.9,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 16,
  },
  messageWrapper: {
    flexDirection: 'row',
    gap: 12,
    maxWidth: '85%',
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
  },
  assistantMessageWrapper: {
    alignSelf: 'flex-start',
  },
  messageIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 6,
    opacity: 0.7,
  },
  quickResponsesContainer: {
    paddingVertical: 12,
  },
  quickResponses: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickResponseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  quickResponseText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    fontSize: 15,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
