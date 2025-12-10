import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'expo-router';
import { authAPI, type SignUpData } from '@/utils/authAPI';
import { Image } from 'react-native';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');
const CARD_MAX_HEIGHT = Math.round(WINDOW_HEIGHT * 0.80);

export default function CreateAccountScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const { setIsSignedIn } = useAuth();
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (!confirm) newErrors.confirm = 'Please confirm password';

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (password && password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (password && confirm && password !== confirm) {
      newErrors.confirm = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onCreate = async () => {
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const signupData: SignUpData = {
        name,
        email,
        password,
        confirm,
      };

      const response = await authAPI.signup(signupData);

      if (response.success) {
        // Account created successfully
        setIsSignedIn(true);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create account. Please try again.';
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <View style={styles.container}>
          <View style={styles.headerArea}>
            <Image
                source={require('../assets/images/logo-yellow-background.png')}
                style={styles.logo}
              />
            <ThemedText type="title" style={styles.brand}>
              GooseTravel
            </ThemedText>
          </View>

          <View style={[styles.card, { maxHeight: CARD_MAX_HEIGHT }]}>
            <ThemedText type="title" style={styles.welcome}>
              Create Account
            </ThemedText>
            <ThemedText type="subtitle" style={styles.sub}>
              Start your journey with GooseTravel
            </ThemedText>

            {apiError ? (
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>{apiError}</ThemedText>
              </View>
            ) : null}

            <View style={styles.form}>
              <ThemedText style={styles.label}>Full Name</ThemedText>
              <TextInput
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="Enter your full name"
                placeholderTextColor="#C4C4C4"
                style={[styles.input, errors.name ? styles.inputError : null]}
                editable={!loading}
              />
              {errors.name ? <ThemedText style={styles.fieldError}>{errors.name}</ThemedText> : null}

              <ThemedText style={[styles.label, { marginTop: 10 }]}>Email Address</ThemedText>
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                placeholderTextColor="#C4C4C4"
                style={[styles.input, errors.email ? styles.inputError : null]}
                editable={!loading}
              />
              {errors.email ? <ThemedText style={styles.fieldError}>{errors.email}</ThemedText> : null}

              <ThemedText style={[styles.label, { marginTop: 10 }]}>Password</ThemedText>
              <TextInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                secureTextEntry
                placeholder="Create a password (8+ chars)"
                placeholderTextColor="#C4C4C4"
                style={[styles.input, errors.password ? styles.inputError : null]}
                editable={!loading}
              />
              {errors.password ? <ThemedText style={styles.fieldError}>{errors.password}</ThemedText> : null}

              <ThemedText style={[styles.label, { marginTop: 10 }]}>Confirm Password</ThemedText>
              <TextInput
                value={confirm}
                onChangeText={(text) => {
                  setConfirm(text);
                  if (errors.confirm) setErrors({ ...errors, confirm: '' });
                }}
                secureTextEntry
                placeholder="Confirm your password"
                placeholderTextColor="#C4C4C4"
                style={[styles.input, errors.confirm ? styles.inputError : null]}
                editable={!loading}
              />
              {errors.confirm ? <ThemedText style={styles.fieldError}>{errors.confirm}</ThemedText> : null}

              <TouchableOpacity
                style={[styles.signInBtn, loading && styles.signInBtnDisabled]}
                onPress={onCreate}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <ThemedText style={styles.signInText}>Create Account</ThemedText>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <ThemedText style={styles.noAccount}>Already have an account?</ThemedText>
            <Pressable onPress={() => router.push('/signin')} disabled={loading}>
              <ThemedText style={styles.createAccount}>Sign In</ThemedText>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const PRIMARY = '#ff6f8a';
const ERROR = '#ef5350';
const TITLE_COLOR = '#111';
const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: {
    flex: 1,
    backgroundColor: '#ffeef2',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerArea: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  // logoImage: {
  //   width: 80,
  //   height: 80,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  brand: {
    color: TITLE_COLOR,
    fontSize: 20,
    marginTop: 2,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  welcome: {
    color: TITLE_COLOR,
    fontSize: 22,
    marginBottom: 4,
  },
  sub: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: ERROR,
  },
  errorText: {
    color: ERROR,
    fontSize: 13,
    fontWeight: '600',
  },
  form: {
    marginTop: 6,
  },
  label: {
    fontSize: 12,
    color: '#333',
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#111',
  },
  inputError: {
    borderColor: ERROR,
    borderWidth: 1.5,
  },
  fieldError: {
    color: ERROR,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  signInBtn: {
    height: 48,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    elevation: 3,
  },
  signInBtnDisabled: {
    opacity: 0.6,
  },
  signInText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  footer: { width: '100%', alignItems: 'center', marginTop: 12 },
  noAccount: { color: '#666', marginTop: 8 },
  createAccount: { color: '#ff6f8a', marginTop: 6, fontWeight: '600' },
});
