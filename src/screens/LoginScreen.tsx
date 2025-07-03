import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from '../navigation/AppNavigator';
import api from '../api/api';
import { getApiBasePath } from '../utils/util';
import { UserData } from '../api/types/login.type';
import LoginIcon from '../assets/LoginIcon';

const LoginScreen: React.FC<NativeStackScreenProps<RootTabParamList, 'Login'>> = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      if (isLogin) {
        const res = await api<{ data: UserData; success: boolean; message: string }>(
          `${getApiBasePath()}/login`,
          {
            method: 'POST',
            body: JSON.stringify({ email, password })
          }
        );
        if (res.success) {
          // TODO: Save token/user info as needed
          navigation.replace('Home');
        } else {
          setErrorMessage(res.message || 'Login failed');
        }
      } else {
        const res = await api<{ success: boolean; message: string }>(
          `${getApiBasePath()}/register`,
          {
            method: 'POST',
            body: JSON.stringify({ email, password, name: username, lastName })
          }
        );
        if (!res.success) {
          setErrorMessage(res.message || 'Registration failed');
        } else {
          // Auto-login after registration
          await handleLogin();
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f8fafc' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <View style={styles.iconWrap}><LoginIcon width={56} height={56} /></View>
        <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <View style={styles.form}>
          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="words"
                returnKeyType="next"
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </>
          )}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>}
          </TouchableOpacity>
        </View>
        <Text style={styles.switchText}>
          {isLogin ? 'Need an account?' : 'Already have an account?'}
          <Text style={styles.switchLink} onPress={() => setIsLogin(!isLogin)}>
            {isLogin ? ' Register here' : ' Login here'}
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconWrap: {
    marginBottom: 18,
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 18,
  },
  error: {
    color: '#e74c3c',
    marginBottom: 10,
    fontSize: 15,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 340,
    marginBottom: 18,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 6,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  switchText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
  switchLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default LoginScreen; 