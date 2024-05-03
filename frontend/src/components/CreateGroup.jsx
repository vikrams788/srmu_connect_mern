import { useState, useEffect } from 'react';
import axios from 'axios';

const CreateGroup = ({ user }) => {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [allUsersSearchQuery, setAllUsersSearchQuery] = useState('');
  const [friendSearchResults, setFriendSearchResults] = useState([]);
  const [allUsersSearchResults, setAllUsersSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isTeacher = user.role === 'teacher';

  useEffect(() => {
    const searchFriends = async () => {
      if (friendSearchQuery.trim() === '') {
        setFriendSearchResults([]);
        return;
      }

      // Filter friends based on fullName
      const filteredFriends = user.friends.filter(friend =>
        friend.fullName.toLowerCase().includes(friendSearchQuery.toLowerCase())
      );

      setFriendSearchResults(filteredFriends);
    };

    const debounceTimeout = setTimeout(searchFriends, 300);

    return () => clearTimeout(debounceTimeout);
  }, [friendSearchQuery, user.friends]);

  useEffect(() => {
    const searchAllUsers = async () => {
      if (!isTeacher || allUsersSearchQuery.trim() === '') {
        setAllUsersSearchResults([]);
        return;
      }

      setIsLoading(true);

      try {
        const response = await axios.get(`https://srmu-connect-mern-esjg.vercel.app/api/search?query=${allUsersSearchQuery}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
        });

        setAllUsersSearchResults(response.data);
      } catch (error) {
        console.error('Error searching all users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(searchAllUsers, 300);

    return () => clearTimeout(debounceTimeout);
  }, [isTeacher, allUsersSearchQuery]);

  const handleAddFriend = (friend) => {
    setSelectedFriends([...selectedFriends, friend]);
  };

  const handleRemoveFriend = (friendId) => {
    const updatedSelectedFriends = selectedFriends.filter(friend => friend.userId !== friendId);
    setSelectedFriends(updatedSelectedFriends);
  };

  const handleCreateGroup = async () => {
    console.log('Creating group with:', selectedFriends.map(friend => friend.fullName), 'Group Name:', groupName);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Create Group</h2>
      <div className="mb-4 relative">
        <input
          type="text"
          value={friendSearchQuery}
          onChange={(e) => setFriendSearchQuery(e.target.value)}
          placeholder="Search friends..."
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
        />
        {friendSearchResults.length > 0 && (
          <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-md shadow-md mt-1 z-10">
            {friendSearchResults.map(profile => (
              <li key={profile.userId} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <button onClick={() => handleAddFriend(profile)}>{profile.fullName}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {isTeacher && (
        <div className="mb-4 relative">
          <input
            type="text"
            value={allUsersSearchQuery}
            onChange={(e) => setAllUsersSearchQuery(e.target.value)}
            placeholder="Search all users..."
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
          />
          {isLoading && (
            <p className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-md shadow-md mt-1 px-4 py-2 z-10">Loading...</p>
          )}
          {allUsersSearchResults.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-md shadow-md mt-1 z-10">
              {allUsersSearchResults.map(profile => (
                <li key={profile.userId} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <button onClick={() => handleAddFriend(profile)}>{profile.fullName}</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className="mb-4">
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name..."
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Selected Friends</h3>
        <ul className="mb-4">
          {selectedFriends.map(friend => (
            <li key={friend.userId} className="flex items-center justify-between">
              <span>{friend.fullName}</span>
              <button
                onClick={() => handleRemoveFriend(friend.userId)}
                className="text-red-500 hover:text-red-600 focus:outline-none"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={handleCreateGroup}
          disabled={!selectedFriends.length || !groupName.trim()}
          className={`${!selectedFriends.length || !groupName.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold py-2 px-4 rounded focus:outline-none`}
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default CreateGroup;