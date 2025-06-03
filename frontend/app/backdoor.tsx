import { Input, InputField } from '@/components/ui/input';
import { Toast, ToastTitle, useToast } from '@/components/ui/toast';
import { useLoggedInPlayerUnsafe } from '@/hooks/useLoggedInPlayer';
import { useAppDispatch } from '@/redux/redux-hooks';
import { backdoor } from '@/redux/slices/authSlice';
import { Redirect } from 'expo-router';
import { FC } from 'react';
import { View } from 'react-native';

const Backdoor: FC = () => {
  const dispatch = useAppDispatch();
  const loggedInPlayer = useLoggedInPlayerUnsafe();
  const errorToast = useToast();
  if (loggedInPlayer !== null) {
    return <Redirect href="/profile" />;
  }
  if (__DEV__ !== true) {
    return <Redirect href="/+not-found" />;
  }
  return (
    <View className="flex-1 flex-col items-center justify-center gap-4">
      <pre>
        {`     _.--""--._
    /  _    _  \\
 _  ( (_\\  /_) )  _
{ \\._\\   /\\   /_./ }
/_"=-.}______{.-="_
 _  _.=("""")=._  _
(_'"_.-"\`~~\`"-._"'_)
 {_"  BACKDOOR  "_}`}
      </pre>
      <Input variant="outline">
        <InputField
          placeholder="Email"
          onSubmitEditing={(event) => {
            if (backdoor === undefined) {
              throw new Error(
                'Backdoor page is enabled, but backdoor action is not defined'
              );
            }
            return dispatch(backdoor(event.nativeEvent.text))
              .unwrap()
              .catch((err) =>
                errorToast.show({
                  placement: 'top',
                  render: ({ id }) => (
                    <Toast
                      action="error"
                      variant="solid"
                      nativeID={'scan-error-toast-' + id}
                    >
                      <ToastTitle>
                        {err.message ?? 'Error while logging in'}
                      </ToastTitle>
                    </Toast>
                  )
                })
              );
          }}
        />
      </Input>
    </View>
  );
};
export default Backdoor;
