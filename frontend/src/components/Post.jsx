import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const Post = ({ post }) => {
  const [creatorProfile, setCreatorProfile] = useState(null);

  useEffect(() => {
    const fetchCreatorProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/profile/${post.createdBy}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
        });
        setCreatorProfile(response.data);
      } catch (error) {
        console.error('Error fetching creator profile:', error);
      }
    };

    fetchCreatorProfile();
  }, [post.createdBy]);

  const renderTimeAgo = (createdAt) => {
    return moment(createdAt).fromNow();
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {creatorProfile && (
            <>
              <img src={creatorProfile.profilePicture} alt="Profile" className="w-10 h-10 rounded-full mr-2" />
                <div className='flex-col items-center'>
                  <p className="font-semibold">{creatorProfile.fullName}</p>
                  <span className=' text-gray-500 '>{renderTimeAgo(post.createdAt)}</span>
                </div>
            </>
          )}
        </div>
      </div>
      <h2 className="text-xl font-bold mb-2">{post.text}</h2>
      {post.link && <p><span className="font-semibold">Link:</span> <a href={post.link} target="_blank" rel="noopener noreferrer">{post.link}</a></p>}
      {post.image && <img src={post.image} alt="Post" className="w-full mb-2" />}
      {post.embeddedVideo && <iframe width="100%" height="360" src={post.embeddedVideo} title="Embedded Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>}
      <div className="flex items-center mt-4">
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2">Like</button>
        <input type="text" placeholder="Add a comment..." className="border border-gray-300 rounded py-1 px-2 focus:outline-none focus:border-blue-500" />
      </div>
    </div>
  );
};

export default Post;