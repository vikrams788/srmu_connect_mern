import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { AiOutlineLike } from "react-icons/ai";
import { LuSend } from "react-icons/lu";
import Comments from './Comments';

const Post = ({ post }) => {
  const [creatorProfile, setCreatorProfile] = useState(null);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

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

  const handleLike = (e) => {
    e.preventDefault();
    setLiked(!liked)
  }

  const toggleComments = () => {
    setShowComments(!showComments);
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
      <h2 className="text-lg font-semibold mb-2">{post.text}</h2>
      {post.link && <p><span className="font-semibold ">Link:</span> <a href={post.link} target="_blank" rel="noopener noreferrer" className=' text-blue-500 '>{post.link}</a></p>}
      {post.image && <img src={post.image} alt="Post" className=" w-full mb-2" />}
      {post.video && (
        <video controls className="w-full mb-4">
          <source src={post.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {post.embeddedVideo && <iframe width="100%" height="360" src={post.embeddedVideo} title="Embedded Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>}
      <div className="flex items-center mt-4">
        <AiOutlineLike className=' m-3 hover:text-blue-500 w-6 h-6 ' onClick={handleLike}/>
        <input type="text" placeholder="Add a comment..." className="border flex-grow border-gray-300 rounded py-1 px-2 focus:outline-none focus:border-blue-500" onClick={toggleComments} />
        <LuSend className=' m-3 hover:text-blue-500 w-6 h-6 ' />
      </div>
      {showComments && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <Comments comments={post.comments} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;