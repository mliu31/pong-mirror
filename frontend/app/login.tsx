import { View, Text, Button } from 'react-native';
import { useState } from 'react';
import { Octicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';

import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { login } from '../redux/slices/authSlice';

import { styles } from '../components/auth/authstyles';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    if (email) {
      console.log('Attempting to login with:', { email });
      try {
        await dispatch(
          login({
            email,
            _id: '',
            name: '',
            friends: [],
            elo: 0
          })
        ).unwrap();
        console.log('Login successful');

        router.push('/profile');
      } catch (err) {
        console.error('Login failed:', err);
      }
    } else {
      console.error('Email is required');
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

      {/* log in button */}
      <View style={styles.buttonWrapper}>
        <Button title="Log in" onPress={handleLogin} />
      </View>

      {/* Don't have an account? sign up button */}
      <View style={styles.buttonWrapper}>
        <Text style={styles.buttonText}>Don't have an account?</Text>
        <Button title="Sign up" onPress={() => router.push('/signup')} />
      </View>
    </View>
  );
}
