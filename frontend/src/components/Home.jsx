import { useEffect, useState } from 'react';
import Header from '../partials/Header';
import LeftComponent from './LeftComponent';
import RightComponent from './RightComponent';
import Footer from '../partials/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Post from './Post';

function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_REACT_APP_API_URL + '/api/profile', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
        });
        const userProfile = response.data;
        localStorage.setItem('profile', JSON.stringify(userProfile));
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchPosts = async () => {
      try {
        const userPostsResponse = await axios.get(import.meta.env.VITE_REACT_APP_API_URL + '/api/my-posts', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
        });

        const friendPostsResponse = await axios.get(import.meta.env.VITE_REACT_APP_API_URL + '/api/posts/user/friends', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
        });

        const userPosts = userPostsResponse.data.map((post) => ({ ...post, source: 'user' }));
        const friendPosts = friendPostsResponse.data.map((post) => ({ ...post, source: 'friend' }));

        const combinedPosts = [...userPosts, ...friendPosts];
        combinedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setPosts(combinedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchUserProfile();
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto py-8 flex-grow">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/6 overflow-y-auto h-screen hidden md:block custom-scrollbar">
            <LeftComponent />
          </div>
          <div className="w-full md:w-2/3 px-4 overflow-y-auto h-screen custom-scrollbar">
            {userData && (
              <div className="bg-white shadow-md p-6 rounded-lg mb-6">
                <div className="text-center">
                  <img
                    src={userData.profilePicture}
                    alt="Profile"
                    className="w-40 h-40 rounded-full mx-auto mb-4"
                  />
                  <h1 className="text-2xl font-bold mb-4">{userData.fullName}</h1>
                </div>
              </div>
            )}
            <h2 className="text-2xl font-bold mb-4">Create Post</h2>
            <input
              type="text"
              placeholder="Say something..."
              className="border border-gray-300 w-full rounded py-2 px-4 focus:outline-none focus:border-blue-500 cursor-pointer hover:border-blue-500"
              onClick={() => {navigate('/create-post')}}
            />
            <h1 className="text-2xl py-3 font-bold mb-4">
              Posts
            </h1>
            <div>
              {posts.map((post) => (
                <Post key={post._id} post={post} />
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/6 hidden md:block custom-scrollbar">
            <RightComponent />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
