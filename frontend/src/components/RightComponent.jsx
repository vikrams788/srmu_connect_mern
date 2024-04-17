import axios from 'axios';
import { useState, useEffect } from 'react';

const RightComponent = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_REACT_APP_API_URL + '/api/all-chats', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
        });

        if (!response.data) {
          throw new Error('Failed to fetch chats');
        }

        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error.message);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="bg-gray-200 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Chats</h2>
      <div className="overflow-y-auto max-h-96">
        {chats.length === 0 ? (
          <p className="text-gray-600 text-center">No chats to show</p>
        ) : (
          chats.map((chat) => (
            <div key={chat._id} className="mb-4 p-2 bg-white rounded-lg shadow-md cursor-pointer">
              <h3 className="text-lg font-semibold">{chat.chatName}</h3>
              <div className="flex items-center mt-2">
                {!chat.isGroupChat && (
                  <img
                    src={chat.users[0].profilePicture}
                    alt={chat.users[0].fullName}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <p className="text-gray-600">
                  {chat.isGroupChat ? 'Group chat' : chat.users[0].fullName}
                </p>
              </div>
              {chat.latestMessage && (
                <p className="text-sm text-gray-500 mt-2">{chat.latestMessage.content}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RightComponent;