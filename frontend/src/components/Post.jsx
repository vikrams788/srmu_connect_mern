import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { AiOutlineClose, AiOutlineLike } from "react-icons/ai";
import { LuSend } from "react-icons/lu";
import Comments from './Comments';

const Post = ({ post }) => {
  const [creatorProfile, setCreatorProfile] = useState(null);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [newComment, setNewComment] = useState({
    text: '',
    fullName: '',
    profilePicture: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewComment({ ...newComment, [name]: value})
  };

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

  const toggleComments = (postId) => {
    setShowComments(!showComments);
    setSelectedPostId(postId);
  };

  const handleCommentSubmit = async (selectedPostId) => {
    try{
      const userProfile = JSON.parse(localStorage.getItem('profile'));

      newComment.fullName = userProfile.fullName;
      newComment.profilePicture = userProfile.profilePicture;

      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/comments/${selectedPostId}`, newComment, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
      })
      toggleComments();
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {creatorProfile && (
            <>
              <img src={creatorProfile.profilePicture} alt="Profile" className="w-10 h-10 rounded-full mr-2" />
              <div className="flex flex-col">
                <p className="font-semibold">{creatorProfile.fullName}</p>
                <span className="text-gray-500">{renderTimeAgo(post.createdAt)}</span>
              </div>
            </>
          )}
        </div>
      </div>
      <h2 className="text-lg font-semibold mb-2">{post.text}</h2>
      {post.link && (
        <p>
          <span className="font-semibold">Link:</span>{' '}
          <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            {post.link}
          </a>
        </p>
      )}
      {post.image && <img src={post.image} alt="Post" className="w-full mb-2" />}
      {post.video && (
        <video controls className="w-full mb-4">
          <source src={post.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {post.embeddedVideo && (
        <iframe
          width="100%"
          height="360"
          src={post.embeddedVideo}
          title="Embedded Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      )}
      <div className="flex items-center mt-4">
        <AiOutlineLike className="m-3 hover:text-blue-500 w-6 h-6" onClick={handleLike} />
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-grow border border-gray-300 rounded-l py-1 px-2 mx-2 focus:outline-none focus:border-blue-500 hover:border-blue-500 cursor-pointer"
          onClick={() => toggleComments(post._id)}
        />
        <LuSend className="m-3 hover:text-blue-500 w-6 h-6" />
      </div>
      {showComments && selectedPostId === post._id && (
        <div className="absolute inset-0 bg-white bg-opacity-50 h-full flex justify-center items-center">
          <div className="bg-white p-6 w-full sm:w-1/2 h-auto flex flex-col rounded-lg">
            <button
              className=" text-black hover:text-white ml-auto hover:bg-red-500 rounded"
              onClick={toggleComments}
            >
              <AiOutlineClose className=" w-6 h-6 " />
            </button>
            <h1 className="text-xl font-bold mb-4">Comments</h1>
            <div className="flex mb-4">
              <input
                type="text"
                placeholder="Add a comment..."
                id='text'
                name='text'
                value={newComment.text}
                onChange={handleChange}
                className="flex-grow border border-gray-300 rounded-l py-1 px-2 mx-2 focus:outline-none focus:border-blue-500 hover:border-blue-500"
              />
              <LuSend className="m-3 w-6 h-6 text-gray-700 hover:text-blue-500" onClick={() => {handleCommentSubmit(selectedPostId)}}/>
            </div>
            <Comments comments={post.comments} postId={selectedPostId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;