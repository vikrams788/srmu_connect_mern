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
          const response = await axios.get(`https://srmu-connect-mern-esjg.vercel.app/api/user`, {
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


  const handleFriendClick = (friend) => {
    if(friend.role !== 'teacher'){
      navigate(`/profile/${friend.userId}`);
    } else {
      navigate(`/teacher-profile/${friend.userId}/${friend.role}`);
    }
  };

  return (
    <div className="bg-white p-4 w-full">
      <h2 className="text-lg font-bold mb-4 border-black border-b-2">Friends List</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.userId} className="mb-2 flex items-center hover:bg-gray-100 border-black border-b-2 cursor-pointer px-2 py-4" onClick={() => handleFriendClick(friend)}>
            <img src={friend.profilePicture} alt={friend.fullName} className="w-8 h-8 rounded-full mr-2" />
            <p>{friend.fullName}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftComponent;