import { IInvite } from '@/api/types';
import { createContext, useState } from 'react';

const InviteContext = createContext<{
  invites: IInvite[];
  setInvites: (i: IInvite[]) => void;
}>({
  invites: [],
  setInvites: function (i: IInvite[]): void {
    throw new Error('Function not implemented.');
  }
});

export function InvitesProvider({ children }: { children: React.ReactNode }) {
  const [invites, setInvites] = useState<IInvite[]>([]);
  return (
    <InviteContext.Provider value={{ invites, setInvites }}>
      {children}
    </InviteContext.Provider>
  );
}

export default InviteContext;
