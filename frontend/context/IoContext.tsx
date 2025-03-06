import io from '@/io';
import { createContext, FC, PropsWithChildren, useContext } from 'react';

const IoContext = createContext<typeof io | null>(null);

export default IoContext;

export const IoProvider: FC<PropsWithChildren> = ({ children }) => {
  return <IoContext.Provider value={io}>{children}</IoContext.Provider>;
};

export const useIo = () => {
  const io = useContext(IoContext);

  if (io === null) {
    throw new Error('useIo must be used within an IoProvider');
  }
  return io;
};
