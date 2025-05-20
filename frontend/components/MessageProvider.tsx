import {
  ComponentProps,
  FC,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect
} from 'react';
import { useToast, Toast, ToastTitle } from './ui/toast';
import { Link } from 'expo-router';
import { useIo } from '@/context/IoContext';

const MessageProvider: FC<PropsWithChildren> = ({ children }) => {
  const toast = useToast();
  const showNotification = useCallback(
    (title: ReactNode, destination?: ComponentProps<typeof Link>['href']) =>
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const content = (
            <Toast
              nativeID={`toast-${id}`}
              className="px-5 py-3 gap-4 shadow-soft-1 items-center flex-row"
            >
              <ToastTitle size="sm">{title}</ToastTitle>
            </Toast>
          );
          return destination === undefined ? (
            content
          ) : (
            <Link href={destination} onPress={() => toast.close(id)}>
              {content}
            </Link>
          );
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const io = useIo();
  useEffect(() => {
    if (io === undefined) return;
    io.on('notification', (data: { title: string; destination?: string }) => {
      const { title, destination } = data;
      showNotification(
        title,
        destination as unknown as ComponentProps<typeof Link>['href']
      );
    });
  }, [io, showNotification]);

  return children;
};

export default MessageProvider;
