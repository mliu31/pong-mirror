import { View, Text, Button } from 'react-native';
import { useState } from 'react';
import { Octicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';

import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { signup } from '../redux/slices/authSlice';

import { styles } from '../components/auth/authstyles';

export default function SignUp() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSignUp = async () => {
    if (name && email) {
      console.log('Attempting to sign up with:', { name, email });
      try {
        await dispatch(
          signup({
            name,
            email,
            _id: '',
            friends: [],
            elo: 1200,
            rank: 0,
            groups: [],
            gamesPlayed: 0,
            wins: 0
          })
        ).unwrap();
        console.log('Sign up successful');

        router.push('/profile');
      } catch (err) {
        console.error('Sign up failed:', err);
      }
    } else {
      console.error('Name and email are required');
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

      {/* sign up button */}
      <View style={styles.buttonWrapper}>
        <Button title="Sign up" onPress={handleSignUp} />
      </View>

      {/* Already have an account? login button */}
      <View style={styles.buttonWrapper}>
        <Text style={styles.buttonText}>Already have an account?</Text>
        <Button title="Login" onPress={() => router.push('/login')} />
      </View>
    </View>
  );
}
