import { useState } from 'react';

const CreateGroupModal = ({ friends, onSubmit }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);

  const handleFriendToggle = (friendId) => {
    // Toggle friend selection
    setSelectedFriends((prevSelected) =>
      prevSelected.includes(friendId)
        ? prevSelected.filter((id) => id !== friendId)
        : [...prevSelected, friendId]
    );
  };

  const handleSubmit = () => {
    onSubmit(groupName, selectedFriends);
  };

  return (
    <div className="create-group-modal">
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Enter group name"
      />
      <ul>
        {friends.map((friend) => (
          <li key={friend.id} onClick={() => handleFriendToggle(friend.id)}>
            {friend.fullName}
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Create Group</button>
    </div>
  );
};

export default CreateGroupModal;