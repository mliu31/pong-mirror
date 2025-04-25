import { View, Text, Button } from 'react-native';
import { useState } from 'react';
import { Octicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';

import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { signup } from '../redux/slices/authSlice';

import { styles } from '../components/auth/authstyles';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

export default function SignUp() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const { promptAsync, request } = useGoogleAuth();

  const handleSignUp = async () => {
    if (name && email) {
      const lowercasedEmail = email.toLowerCase();
      try {
        await dispatch(signup({ name, email: lowercasedEmail })).unwrap();
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
      {/* Sign up header */}
      <Text style={styles.header}>Sign up</Text>

      {/* enter name */}
      <View style={styles.inputWrapper}>
        <Octicons name="person" size={20} color="#0005" />
        <TextInput
          cursorColor={'#000'}
          style={styles.input}
          value={name}
          onChangeText={(name) => setName(name)}
          placeholder="Username"
        />
      </View>

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

      {/* sign up button */}
      <View style={styles.buttonWrapper}>
        <Button title="Sign up" onPress={handleSignUp} />
      </View>

      {/* Google sign up button */}
      <View style={styles.buttonWrapper}>
        <Button
          title="Continue with Google"
          onPress={() => promptAsync()}
          disabled={!request}
        />
      </View>

      {/* Already have an account? login button */}
      <View style={styles.buttonWrapper}>
        <Text style={styles.buttonText}>Already have an account?</Text>
        <Button title="Login" onPress={() => router.push('/login')} />
      </View>
    </View>
  );
}
