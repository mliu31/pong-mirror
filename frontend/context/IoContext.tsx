import { IOEvent } from '@/api/messageTypes';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState
} from 'react';
import io, { Socket } from 'socket.io-client';

type IOEventsMap = {
  [K in IOEvent['title']]: (
    data: Extract<IOEvent, { title: K }>['data']
  ) => void;
};

// undefined = loading
const IoContext = createContext<Socket<IOEventsMap> | undefined>(undefined);

export default IoContext;

export const IoProvider: FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  useEffect(() => {
    const socket = io('http://localhost:3000', { withCredentials: true });
    setSocket(socket);
    return () => void socket.disconnect();
  }, []);
  return <IoContext.Provider value={socket}>{children}</IoContext.Provider>;
};

export const useIo = () => {
  const io = useContext(IoContext);

  if (io === null) {
    throw new Error('useIo must be used within an IoProvider');
  }
  return io;
};
