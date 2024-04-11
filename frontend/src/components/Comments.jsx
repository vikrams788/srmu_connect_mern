import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);

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
  
  
  return (
    <div>
      {comments.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">No comments yet</p>
      ) : (
        <div className="mt-4">
          {comments.map((comment) => (
            <div key={comment._id} className="flex items-start mb-4">
              <img src={comment.profilePicture} alt="Profile" className="w-10 h-10 rounded-full mr-2" />
              <div>
                <p className="font-semibold">{comment.fullName}</p>
                <p className="text-gray-500 text-sm">{moment(comment.createdAt).fromNow()}</p>
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