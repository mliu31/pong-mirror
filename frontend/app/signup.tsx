import { StyleSheet, View, Text, Button } from 'react-native';
import { useState } from 'react';
import { Octicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';

import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../redux/slices/authSlice';
import { AppDispatch, RootState } from '../redux/store';

import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { signup } from '../redux/slices/authSlice';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10
  },
  inputWrapper: {
    width: '90%',
    height: 55,
    backgroundColor: '#f7f9ef',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8
  },
  input: {
    width: '90%',
    height: '100%',
    marginLeft: 10
  },
  buttonWrapper: {
    marginTop: 10,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    marginBottom: 5
  }
});

export default function SignUp() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
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
            elo: 0
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
