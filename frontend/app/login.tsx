import { View, Text, Button } from 'react-native';
import { useState } from 'react';
import { Octicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';

import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { login } from '../redux/slices/authSlice';

import { styles } from '../components/auth/authstyles';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { promptAsync, request } = useGoogleAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (email) {
      const lowercasedEmail = email.toLowerCase();
      console.log('Attempting to login with:', { email: lowercasedEmail });

      try {
        await dispatch(login({ email: lowercasedEmail })).unwrap();
        router.push('/profile');
      } catch (err: unknown) {
        if (typeof err === 'string') {
          setError(err);
        } else if (
          typeof err === 'object' &&
          err !== null &&
          'message' in err
        ) {
          setError((err as { message: string }).message);
        } else {
          setError('An unknown error occurred.');
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Log in</Text>

      {/* enter email */}
      <View style={styles.inputWrapper}>
        <Octicons name="mail" size={20} color="#0005" />
        <TextInput
          cursorColor={'#000'}
          style={styles.input}
          value={email}
          onChangeText={(email) => setEmail(email)}
          placeholder="Email"
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {/* log in button */}
      <View style={styles.buttonWrapper}>
        <Button title="Log in" onPress={handleLogin} />
      </View>

      {/* Google */}
      <View style={styles.buttonWrapper}>
        <Button
          title="Continue with Google"
          onPress={() => promptAsync()}
          disabled={!request}
        />
      </View>

      {/* Don't have an account? sign up button */}
      <View style={styles.buttonWrapper}>
        <Text style={styles.buttonText}>Don't have an account?</Text>
        <Button title="Sign up" onPress={() => router.push('/signup')} />
      </View>
    </View>
  );
}
