import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const userProfile = JSON.parse(localStorage.getItem('profile'));

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/comments/${postId}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
        });
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setComments([]);
      }
    };

    fetchComments();
  }, [postId]);

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/api/comments/${commentId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
      });
      await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/api/posts/${postId}/delete-comment`, {
        commentId,
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
      });
      toast.success('Comment deleted', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
      console.log('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div>
      {comments.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">No comments yet</p>
      ) : (
        <div className="mt-4">
          {comments.map((comment) => (
            <div key={comment._id} className="flex items-start mb-4 relative">
              <img src={comment.profilePicture} alt="Profile" className="w-10 h-10 rounded-full mr-2" />
              <div className="flex-grow">
                <p className="font-semibold">{comment.fullName}</p>
                <div className="flex justify-between">
                  <p className="text-gray-500 text-sm">{moment(comment.createdAt).fromNow()}</p>
                  {userProfile.createdBy === comment.createdBy && (
                    <button
                      className="mt-1 mr-1 "
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      <AiOutlineDelete className='w-6 h-6 text-gray-800 hover:text-white hover:bg-red-500 rounded'/>
                    </button>
                  )}
                </div>
                <p className="break-words">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;