import { useEffect, useState } from 'react';
import { Player } from '@/api/types';
import { getFriends } from '@/api/friends';

const FriendList = ({ fids }: { fids: string[] }) => {
  const [friends, setFriends] = useState<Player[]>([]);

  useEffect(() => {
    getFriends(fids).then((res) => setFriends(res));
  }, [fids]);

  return friends.map((friend) => (
    <div key={friend._id}>
      <h3>{friend.name}</h3>
    </div>
  ));
};

export default FriendList;
