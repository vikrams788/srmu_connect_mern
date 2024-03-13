import { useState, useEffect } from 'react';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import LeftComponent from './LeftComponent';
import RightComponent from './RightComponent';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState(null);
//   const [userPosts, setUserPosts] = useState([]);
//   const [profilePicture, setProfilePicture] = useState('');

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

    // const fetchUserPosts = async () => {
    //   try {
    //     const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/posts`, {
    //         withCredentials: true,
    //         headers: {
    //             'Content-Type': 'multipart/form-data',
    //             'Access-Control-Allow-Credentials': true,
    //         },
    //     });
    //     setUserPosts(response.data);
    //   } catch (error) {
    //     console.error('Error fetching user posts:', error);
    //   }
    // };

    fetchUserData();
    // fetchUserPosts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto py-8 flex-grow">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/6 hidden md:block">
            <LeftComponent />
          </div>
          <div className="w-full md:w-2/3 px-4">
            {userData && (
              <div className="bg-white shadow-md p-6 rounded-lg mb-6 grid grid-cols-2 gap-4">
                <div className="col-span-2 text-center">
                  <img src={userData.profilePicture} alt="Profile" className="w-40 h-40 rounded-full mx-auto mb-4" />
                </div>
                <h1 className="text-2xl font-bold mb-4 mx-auto col-span-2">{userData.fullName}</h1>
                <p className="col-span-2"><span className="font-semibold">Bio:</span> {userData.bio}</p>
                <p><span className="font-semibold">Email:</span> {userData.email}</p>
                <p><span className="font-semibold">Course:</span> {userData.course}</p>
                <p><span className="font-semibold">Roll Number:</span> {userData.rollNo}</p>
                <p><span className="font-semibold">Semester:</span> {userData.semester}</p>
              </div>
            )}
            <h1 className="text-2xl font-bold mb-4">{userData?.fullName.split(' ')[0]}&apos;s Posts</h1>
            <div>
              {/* {userPosts.map((post) => (
                <div key={post.id} className="bg-white shadow-md p-6 rounded-lg mb-4">
                  <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                  <p>{post.content}</p>
                </div>
              ))} */}
            </div>
          </div>
          <div className="w-full md:w-1/6 hidden md:block">
            <RightComponent />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;