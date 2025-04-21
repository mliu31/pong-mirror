import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useAppDispatch } from '../redux/redux-hooks';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { WEB_CLIENT_ID } from '../constants/auth';
import { useEffect } from 'react';
import { googleSignup } from '../redux/slices/authSlice';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const redirectUri = Platform.select({
    web: 'http://localhost:8081/profile'
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: WEB_CLIENT_ID,
    redirectUri,
    scopes: ['profile', 'email']
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;

      console.log('Google Auth Response:', response); // check
      console.log('Access Token:', authentication?.accessToken); // check

      if (authentication?.accessToken) {
        dispatch(googleSignup(authentication.accessToken))
          .unwrap()
          .then(() => {
            router.push('/profile');
          })
          .catch((err) => {
            console.error('Google signup failed:', err);
          });
      }
    } else if (response?.type === 'error') {
      console.error('Google Auth Error:', response.error);
    }
  }, [dispatch, response, router]);

  return { promptAsync, request };
};
