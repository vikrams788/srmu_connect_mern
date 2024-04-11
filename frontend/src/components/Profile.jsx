import { useState, useEffect } from 'react';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import LeftComponent from './LeftComponent';
import RightComponent from './RightComponent';
import axios from 'axios';
import Post from './Post';
import { useNavigate } from 'react-router-dom';
import { MdOutlineModeEditOutline } from "react-icons/md";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/profile`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user profile data:', error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/my-posts`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
        });
        setUserPosts(response.data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchUserData();
    fetchUserPosts();
  }, []);

  const handleCreatePostClick = () => {
    navigate('/create-post');
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
                <div className=' flex justify-between col-span-2 '>
                  <p className="col-span-2"><span className="font-semibold">Bio:</span> {userData.bio}</p>
                  <MdOutlineModeEditOutline className=' w-5 h-5 hover:text-blue-500 ' onClick={() => {navigate('/edit-profile')}}/>
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
