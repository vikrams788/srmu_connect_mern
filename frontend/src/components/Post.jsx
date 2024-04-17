import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { AiOutlineClose, AiFillLike, AiOutlineLike, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { LuSend } from "react-icons/lu";
import Comments from './Comments';
import { useNavigate } from 'react-router-dom';
import DeletePost from './DeletePost';
import { toast } from 'react-toastify';

const Post = ({ post }) => {
  const navigate = useNavigate();
  const [creatorProfile, setCreatorProfile] = useState(null);
  // const [liked, setLiked] = useState(post.isLiked);
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [newComment, setNewComment] = useState({
    text: '',
    fullName: '',
    profilePicture: ''
  });
  const userProfile = JSON.parse(localStorage.getItem('profile'));
  const [showDeletePost, setShowDeletePost] = useState(false);

  //Fetch the profile of the creator
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

  // useEffect(() => {
  //   // Check if the current user has liked this post
  //   const currentUserId = userProfile.userId;
  //   setLiked(post.likes.some(function(like){
  //     return like.likedBy == currentUserId
  //   }));
  // }, [post.likes, userProfile.userId]);

  //Render time ago
  const renderTimeAgo = (createdAt) => {
    return moment(createdAt).fromNow();
  };

  //Like a post
  const handleLike = async () => {
    try {
      const userProfile = JSON.parse(localStorage.getItem('profile'));
      const currentUserId = userProfile.userId;
      const fullName = userProfile.fullName;

      if (post.isLiked === true) {
        // Unlike the post
        await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/api/posts/${post._id}/unlike`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
          data: { userId: currentUserId },
        });
        toast.success('Unliked', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
        
        // setLiked(false);
        console.log('Post unliked');
      } else {
        // Like the post
        await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/api/posts/${post._id}/like`, { userId: currentUserId, fullName }, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
        });

        toast.success('Post liked', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
        // setLiked(true);
        console.log('Post liked');
      }
    } catch (error) {
      console.error('Error toggling like:', error.message);
    }
  };

  //Open comments section
  const toggleComments = (postId) => {
    setShowComments(!showComments);
    setSelectedPostId(postId);
  };

  //Handle comment input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewComment({ ...newComment, [name]: value });
  };

  //Post a comment
  const handleCommentSubmit = async (selectedPostId) => {
    try {

      newComment.fullName = userProfile.fullName;
      newComment.profilePicture = userProfile.profilePicture;

      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/comments/${selectedPostId}`, newComment, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
      });
      toggleComments();

      toast.success('Comment added', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });

      console.log('Comment posted:', response.data);
      
    } catch (error) {
      console.error('Error posting comment:', error.message);
    }
  };

  //Clicking on the post edit button
  const handlePostEdit = (postId) => {
    localStorage.setItem('editPostId', postId);
    navigate('/edit-post');
  };

  //Delete post confirmation
  const handleDeleteConfirmation = () => {
    setShowDeletePost(true);
  };

  //Cancel delete post
  const handleDeleteCancel = () => {
    setShowDeletePost(false);
  };

  //Close delete post dialog box
  const handlePostDelete = () => {
    setShowDeletePost(false);
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
        {userProfile.createdBy === post.createdBy && (
          <div className="relative flex items-center">
            <AiOutlineEdit className="text-gray-500 hover:text-blue-500 m-2 cursor-pointer mr-2 w-6 h-6" onClick={() => handlePostEdit(post._id)} />
            <AiOutlineDelete className="text-gray-500 hover:text-red-500 m-2 cursor-pointer w-6 h-6" onClick={handleDeleteConfirmation} />
          </div>
        )}
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
        <span className="mr-2 flex items-center text-gray-500">
          {post.likes.length} Likes
          {post.isLiked === true ? (
            <AiFillLike className="ml-1 text-blue-500 w-4 h-4" onClick={handleLike} />
          ) : (
            <AiOutlineLike className="ml-1 hover:text-blue-500 w-4 h-4" onClick={handleLike} />
          )}
        </span>
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-grow border border-gray-300 rounded-l py-1 px-2 mx-2 focus:outline-none focus:border-blue-500 hover:border-blue-500 cursor-pointer"
          onClick={() => toggleComments(post._id)}
        />
        <LuSend className="m-3 hover:text-blue-500 w-6 h-6" />
        <span className="flex items-center text-gray-500">
          {post.comments.length} Comments
        </span>
      </div>
      {showComments && selectedPostId === post._id && (
        <div className="absolute inset-0 bg-white bg-opacity-50 h-full flex justify-center items-center z-10">
          <div className="bg-white p-6 w-full sm:w-1/2 h-auto flex flex-col rounded-lg ">
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
      {showDeletePost && (
        <DeletePost postId={post._id} onDelete={handlePostDelete} onCancel={handleDeleteCancel} />
      )}
    </div>
  );
};

export default Post;