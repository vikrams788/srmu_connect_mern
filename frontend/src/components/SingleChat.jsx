import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import RightComponent from './RightComponent';
import Footer from '../partials/Footer';
import LeftComponent from './LeftComponent';
import Header from '../partials/Header';
import CreateGroup from './CreateGroup';
import { AiOutlineClose } from 'react-icons/ai'

var socket, selectedChatCompare;

const SingleChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [chat, setChat] = useState(null)
  const [showAdminFeatures, setShowAdminFeatures] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const anotherUserId = localStorage.getItem('anotherUserId');
  const profile = JSON.parse(localStorage.getItem('profile'));
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    socket = io('//srmu-connect-mern-esjg.vercel.app');
    socket.emit("setup", user);
    socket.on('connection', () => setSocketConnected(true))

    return () => {
      socket.disconnect();
    }
  }, []);

  useEffect(() => {
    const fetchChatInfo = async () => {
      try {
        const chatResponse = await axios.get(`https://srmu-connect-mern-esjg.vercel.app/api/chat/${anotherUserId}`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Credentials': true,
            },
          });
        setChat(chatResponse.data);

        const otherUserInfo = chatResponse.data.users.find(u => u._id !== user._id);
        setOtherUser(otherUserInfo);
      } catch (error) {
        console.error('Error fetching chat information:', error);
      }
    };

    const fetchMessages = async () => {
      try {
        if (chat && chat._id) {
          const response = await axios.get(`https://srmu-connect-mern-esjg.vercel.app/api/all-messages/${chat._id}`, {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
              },
            });
          setMessages(response.data);

          socket.emit('join chat', chat._id);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchChatInfo();

    fetchMessages();

    selectedChatCompare = chat;

    if(user.role === 'admin' || user.role === 'teacher') {
      setShowAdminFeatures(true);
    } else {
      setShowAdminFeatures(false);
    }
    
  }, [anotherUserId, chat, user._id, user.role]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        //give notification
      } else {
        setMessages([...messages, newMessageRecieved])
      }
    })
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || !chat) return;

    try {
      const response = await axios.post(`https://srmu-connect-mern-esjg.vercel.app/api/send`, {
        content: inputMessage,
        chatId: chat._id,
        fullName: user.fullName,
        profilePicture: profile.profilePicture
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
      });
      console.log(response.data);

      const newMessage = {
        content: inputMessage,
        sender: { fullName: 'You' }
      };

      socket.emit('new message', response.data)

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCreateGroup = () => {
    setShowCreateGroup(true);
  };

  const handleCloseCreateGroup = () => {
    setShowCreateGroup(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAdmin={showAdminFeatures}/>
      <div className="flex flex-grow mt-4">
        <div className="w-1/5 p-4">
          <LeftComponent />
        </div>
        <div className="w-3/5 flex flex-col p-2">
        {otherUser && (
            <div className="flex justify-around items-center mb-4">
              <div className='flex items-center'>
                <img
                  src={otherUser.profilePicture}
                  alt={otherUser.fullName}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <h2 className="text-lg font-semibold">{otherUser.fullName}</h2>
              </div>
              <button type='button' className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-r focus:outline-none' onClick={handleCreateGroup}>+ New Group</button>
            </div>
          )}
        {messages.length > 0 ? (
          <div className="flex-grow p-4 bg-white overflow-y-auto" style={{ maxHeight: '75vh', paddingRight: '16px', marginRight: '-16px' }}>
            <div className="scrollbar-hide">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-2 flex items-center ${message.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender._id !== user._id && (
                    <img
                      src={message.profilePicture}
                      alt="Profile Picture"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  <div className={`rounded-lg ${message.sender._id === user._id ? 'bg-blue-200 ml-auto' : 'bg-gray-200 mr-auto'}`} style={{ width: `${(message.content.length * 2) + 100}px` }}>
                    <p className={`p-2 text-gray-800 ${message.sender._id === user._id ? 'text-right' : 'text-left'}`}>{message.content}</p>
                  </div>
                  {message.sender._id === user._id && (
                    <img
                      src={message.profilePicture}
                      alt="Profile Picture"
                      className="w-8 h-8 rounded-full ml-2"
                    />
                  )}
                </div>
              ))}
            </div>
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
        <div className="w-1/5 p-4">
          <RightComponent />
        </div>
      </div>
      {showCreateGroup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg flex flex-col shadow-lg">
            <button onClick={handleCloseCreateGroup} className="relative mt-2 ml-auto focus:outline-none">
              <AiOutlineClose className="text-black hover:text-white w-6 h-6 hover:bg-red-500 rounded" />
            </button>
            <CreateGroup onClose={handleCloseCreateGroup} user={user} />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default SingleChat;