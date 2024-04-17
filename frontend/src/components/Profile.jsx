import { useState, useEffect } from 'react';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import LeftComponent from './LeftComponent';
import RightComponent from './RightComponent';
import axios from 'axios';
import Post from './Post';
import { useNavigate, useParams } from 'react-router-dom';
import { MdOutlineModeEditOutline } from "react-icons/md";
import { FaUserPlus, FaRegMessage } from "react-icons/fa6";
import { FaUserMinus } from "react-icons/fa";
import { toast } from 'react-toastify';
import {Tooltip} from 'react-tooltip';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const { userId } = useParams();
  const currentUser = JSON.parse(localStorage.getItem('profile'));
  const currentUserId = currentUser.createdBy;

  const navigate = useNavigate();

  //Fetch user's profile info and posts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let profileEndpoint = '/api/profile';
        let postsEndpoint = '/api/my-posts';

        if (userId) {
          profileEndpoint = `/api/profile/${userId}`;
          postsEndpoint = `/api/posts/user/${userId}`;
        }

        const profileResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}${profileEndpoint}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
        });

        const postsResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}${postsEndpoint}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
        });

        setUserData(profileResponse.data);
        setUserPosts(postsResponse.data);

      } catch (error) {
        console.error('Error fetching user profile data or posts:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  //Create Post
  const handleCreatePostClick = () => {
    navigate('/create-post');
  }

  //Send Friend Request
  const handleAddFriend = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/friend-requests`, {
        senderId: currentUserId,
        recipientId: userData.createdBy,
        fullName: currentUser.fullName,
        profilePicture: currentUser.profilePicture
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
      });

      toast.success('Friend request sent', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });

      console.log('Friend request sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error('Friend request already sent or received');
    }
  };

  const handleRemoveFriend = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/remove-friend`, {
        userId: currentUserId,
        friendId: userData.createdBy
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
      });

      toast.success('Successfully removed as friend', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });

      console.log('Friend removed successfully:', response.data);
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error('You two aren&apos;t friends');
    }
  };

  const handleChat = () => {
    localStorage.setItem('anotherUserName', userData.fullName);
    navigate('/chat');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto max-h-screen py-8 flex-grow">
        <div className="flex max-h-screen flex-wrap">
          <div className="w-full md:w-1/6 overflow-y-auto overflow-x-hidden h-screen hidden md:block custom-scrollbar">
            <LeftComponent />
          </div>
          <div className="w-full md:w-2/3 px-4 h-screen overflow-y-auto overflow-x-hidden custom-scrollbar">
            {userData && (
              <div className="bg-white shadow-md p-6 rounded-lg mb-6 grid grid-cols-2 gap-4">
                <div className="col-span-2 text-center">
                  <img src={userData.profilePicture} alt="Profile" className="w-40 h-40 rounded-full mx-auto mb-4" />
                </div>
                <h1 className="text-2xl font-bold mb-4 mx-auto col-span-2">{userData.fullName}</h1>
                <div className=' flex justify-between items-center col-span-2 '>
                  <p className="col-span-2"><span className="font-semibold">Bio:</span> {userData.bio}</p>
                  <p className='flex'>
                    <FaUserPlus 
                    className='w-6 h-6 text-gray-700 hover:text-blue-500 m-2' 
                    onClick={handleAddFriend}
                    data-tooltip-id="add-friend-tooltip"
                    data-tooltip-content="Add Friend"
                    />
                    <Tooltip id='add-friend-tooltip' />
                    <MdOutlineModeEditOutline 
                    className=' w-6 h-6 hover:text-blue-500 text-gray-700 m-2' 
                    onClick={() => {navigate('/edit-profile')}}
                    data-tooltip-id="edit-profile-tooltip"
                    data-tooltip-content="Edit Profile"
                    />
                    <Tooltip id='edit-profile-tooltip' />
                    <FaUserMinus 
                    className=' w-6 h-6 hover:text-blue-500 m-2 text-gray-700' 
                    onClick={handleRemoveFriend}
                    data-tooltip-id="unfriend-tooltip"
                    data-tooltip-content="Unfriend"
                    />
                    <Tooltip id='unfriend-tooltip' />
                    <FaRegMessage 
                    className=' w-6 h-6 hover:text-blue-500 m-2 text-gray-700'
                    data-tooltip-id="send-message-tooltip"
                    data-tooltip-content="Send Message"
                    onClick={handleChat}
                    />
                    <Tooltip id='send-message-tooltip' />
                  </p>
                </div>
                <p><span className="font-semibold">Email:</span> {userData.email}</p>
                <p><span className="font-semibold">Course:</span> {userData.course}</p>
                <p><span className="font-semibold">Roll Number:</span> {userData.rollNo}</p>
                <p><span className="font-semibold">Semester:</span> {userData.semester}</p>
              </div>
            )}
            <h2 className="text-2xl font-bold mb-4">Create Post</h2>
            <input
              type="text"
              placeholder="Say something..."
              className="border border-gray-300 w-full rounded py-2 px-4 focus:outline-none focus:border-blue-500 cursor-pointer hover:border-blue-500 "
              onClick={handleCreatePostClick}
            />
            <h1 className="text-2xl py-3 font-bold mb-4">{userData?.fullName.split(' ')[0]}&apos;s Posts</h1>
            <div>
              {userPosts.map((post) => (
                <Post key={post._id} post={post} />
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/6 hidden h-screen md:block custom-scrollbar">
            <RightComponent />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
