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
import { authAPI, type SignInData } from '@/utils/authAPI';
import { Image } from 'react-native';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');
const CARD_MAX_HEIGHT = Math.round(WINDOW_HEIGHT * 0.78);

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const { setIsSignedIn } = useAuth();
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSignIn = async () => {
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const signinData: SignInData = {
        email,
        password,
      };

      const response = await authAPI.signin(signinData);

      if (response.success) {
        // Successfully signed in
        setIsSignedIn(true);
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign in. Please try again.';
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
              Welcome Back!
            </ThemedText>
            <ThemedText type="subtitle" style={styles.sub}>
              Sign in to continue your journey
            </ThemedText>

            {apiError ? (
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>{apiError}</ThemedText>
              </View>
            ) : null}

            <View style={styles.form}>
              <ThemedText style={styles.label}>Email Address</ThemedText>
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
                placeholder="Enter your password"
                placeholderTextColor="#C4C4C4"
                style={[styles.input, errors.password ? styles.inputError : null]}
                editable={!loading}
              />
              {errors.password ? <ThemedText style={styles.fieldError}>{errors.password}</ThemedText> : null}

              <View style={styles.rowBetween}>
                <View style={styles.rememberRow}>
                  <View style={styles.checkbox} />
                  <ThemedText style={styles.rememberText}>Remember me</ThemedText>
                </View>
                <Pressable onPress={() => console.log('forgot password')} disabled={loading}>
                  <ThemedText style={styles.forgot}>Forgot Password?</ThemedText>
                </Pressable>
              </View>

              <TouchableOpacity
                style={[styles.signInBtn, loading && styles.signInBtnDisabled]}
                onPress={onSignIn}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <ThemedText style={styles.signInText}>Sign In</ThemedText>
                )}
              </TouchableOpacity>

              <View style={styles.orRow}>
                <View style={styles.orLine} />
                <ThemedText style={styles.orText}>or continue with</ThemedText>
                <View style={styles.orLine} />
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity style={[styles.socialBtn, styles.socialLeft]} disabled={loading}>
                  <Text style={styles.socialIcon}>G</Text>
                  <ThemedText style={styles.socialLabel}>Google</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialBtn, styles.socialRight]} disabled={loading}>
                  <Text style={styles.socialIcon}>f</Text>
                  <ThemedText style={styles.socialLabel}>Facebook</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <ThemedText style={styles.noAccount}>Don’t have an account?</ThemedText>
            <Pressable onPress={() => router.replace("/create-account")} disabled={loading}>
              <ThemedText style={styles.createAccount}>Create Account</ThemedText>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const PINK = '#ffd7e6';
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
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    overflow: 'hidden',
  },
  brand: {
    color: TITLE_COLOR,
    fontSize: 22,
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
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  rememberText: {
    fontSize: 12,
    color: '#333',
  },
  forgot: {
    color: '#ff6f8a',
    fontSize: 12,
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
  orRow: {
    marginTop: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  orText: {
    marginHorizontal: 10,
    color: '#777',
    fontSize: 12,
  },
  socialRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  socialBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  socialLeft: { marginRight: 8 },
  socialRight: { marginLeft: 8 },
  socialIcon: { fontSize: 14, marginRight: 8 },
  socialLabel: { fontSize: 13, color: '#222' },
  footer: { width: '100%', alignItems: 'center', marginTop: 12 },
  noAccount: { color: '#666', marginTop: 8 },
  createAccount: { color: '#ff6f8a', marginTop: 6, fontWeight: '600' },
});
