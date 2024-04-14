import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LeftComponent = () => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {

          // Fetch user data based on createdBy field
          const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/user`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Credentials': true,
            },
          });

          const userData = response.data;
          if (userData && userData.friends) {
            setFriends(userData.friends);
            
          }
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, []);


  const handleFriendClick = (friendUserId) => {
    navigate(`/profile/${friendUserId}`);
  };

  return (
    <div className="bg-gray-200 shadow-md rounded-lg p-4 w-full">
      <h2 className="text-lg font-bold mb-4">Friends List</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.userId} className="mb-2 flex items-center hover:bg-gray-300 cursor-pointer p-2" onClick={() => handleFriendClick(friend.userId)}>
            <img src={friend.profilePicture} alt={friend.fullName} className="w-8 h-8 rounded-full mr-2" />
            <p>{friend.fullName}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftComponent;