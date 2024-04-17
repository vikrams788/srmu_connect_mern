import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import RightComponent from './RightComponent';
import Footer from '../partials/Footer';
import LeftComponent from './LeftComponent';
import Header from '../partials/Header';

const SingleChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [chat, setChat] = useState(null)
  const anotherUserName = localStorage.getItem('anotherUserName');

  useEffect(() => {
    const fetchChatInfo = async () => {
      try {
        const chatResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/chat`, {
            params: {
                anotherUserName: anotherUserName
            },
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Credentials': true,
            },
          });
        setChat(chatResponse.data);
        // console.log('Chat Info:', chatResponse.data);
      } catch (error) {
        console.error('Error fetching chat information:', error);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/all-messages`, {
            params: {
                chatId: chat._id
            },
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Credentials': true,
            },
          });
        setMessages(response.data);
      } catch (error) {
        // console.error('Error fetching messages:', error);
      }
    };

    fetchChatInfo(); // Fetch chat information before messages

    fetchMessages(); // Fetch messages for the selected chat

    // Initialize WebSocket connection
    const newSocket = io(import.meta.env.VITE_REACT_APP_API_URL);
    setSocket(newSocket);

    return () => {
      // Close socket connection when component unmounts
      if (socket) {
        socket.disconnect();
      }
    };
  }, [anotherUserName, socket]);

  useEffect(() => {
    // Listen for new messages from socket.io
    if (socket) {
      socket.on('newMessage', (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }

    return () => {
      // Remove event listener when component unmounts
      if (socket) {
        socket.off('newMessage');
      }
    };
  }, [socket]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !chat) return;

    try {
      // Send message to backend using Axios
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/send`, {
        content: inputMessage,
        chatId: chat._id,
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
      });

      const newMessage = {
        content: inputMessage,
        sender: { fullName: 'You' }
      };

      // Update local state with the new message
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Clear input field
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-grow">
        <div className="w-1/4">
          <LeftComponent />
        </div>
        <div className="w-1/2 flex flex-col">
          {messages.length > 0 ? (
            <div className="flex-grow p-4 bg-white rounded-lg shadow-md overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className="mb-2 p-2 rounded-lg bg-gray-100">
                  <p className="text-gray-800">{message.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center text-gray-500 font-semibold">
              No messages yet
            </div>
          )}
          <div className="input-container p-4 flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow border border-gray-300 rounded-l py-2 px-4 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-r focus:outline-none"
            >
              Send
            </button>
          </div>
        </div>
        <div className="w-1/4">
          <RightComponent />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SingleChat;