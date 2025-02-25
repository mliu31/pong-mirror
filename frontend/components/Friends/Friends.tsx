import FriendList from './FriendList';
import { router } from 'expo-router';

const Friends = (props: { fids: string[] }) => {
  const addFriendHandler = () => {
    router.push(`/profile/AddFriend`);
  };

  return (
    <div>
      <p>Friend component~</p>
      <FriendList fids={props.fids} />
      <button onClick={addFriendHandler}>Add Friend</button>
    </div>
  );
};

export default Friends;
