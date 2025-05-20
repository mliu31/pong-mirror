import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useAppDispatch } from '../redux/redux-hooks';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { IOS_CLIENT_ID, WEB_CLIENT_ID } from '../constants/auth';
import { useEffect } from 'react';
import { googleSignup } from '../redux/slices/authSlice';
import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription
} from '@/components/ui/toast';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const toast = useToast();

  const redirectUri = Platform.select({
    web: 'http://localhost:8081/profile'
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    redirectUri,
    scopes: ['profile', 'email']
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;

      if (authentication?.accessToken) {
        dispatch(googleSignup(authentication.accessToken))
          .unwrap()
          .then(() => {
            router.push('/profile');
          })
          .catch((err) => {
            console.error('Google signup failed:', err);
            toast.show({
              duration: 3000,
              render: ({ id }) => (
                <Toast nativeID={id} action="error" variant="solid">
                  <ToastTitle>Sign-in Failed</ToastTitle>
                  <ToastDescription>
                    {err?.message || 'Something went wrong'}
                  </ToastDescription>
                </Toast>
              )
            });
          });
      }
    } else if (response?.type === 'error') {
      console.error('Google Auth Error:', response.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, response, router]);

  return { promptAsync, request };
};
