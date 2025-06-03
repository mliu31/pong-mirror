import { IInvite } from '@/api/types';
import { createContext } from 'react';

const InviteContext = createContext<{
  invites: IInvite[];
  setInvites: (i: IInvite[]) => void;
  refreshInvites: () => Promise<void>;
}>({
  invites: [],
  setInvites: function (i: IInvite[]): void {
    throw new Error('Function not implemented.');
  },
  refreshInvites: async function () {
    throw new Error('Function not implemented.');
  }
});

export default InviteContext;
