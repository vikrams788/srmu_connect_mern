import { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';

const CommentList = ({ comments }) => {
  const [commentProfiles, setCommentProfiles] = useState({});

  useEffect(() => {
    const fetchCommentProfiles = async () => {
      const profiles = {};
      await Promise.all(
        comments?.map(async (comment) => {
          try {
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/profile/${comment.createdBy}`, {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
              },
            });
            profiles[comment._id] = response.data;
          } catch (error) {
            console.error('Error fetching creator profile:', error);
          }
        })
      );
      setCommentProfiles(profiles);
    };

    fetchCommentProfiles();
  }, [comments]);

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment._id} className="flex items-start mb-4">
          {commentProfiles[comment._id] && (
            <img src={commentProfiles[comment._id].profilePicture} alt="Profile" className="w-10 h-10 rounded-full mr-2" />
          )}
          <div>
            {commentProfiles[comment._id] && (
              <>
                <p className="font-semibold">{commentProfiles[comment._id].fullName}</p>
                <p className="text-gray-500 text-sm">{moment(comment.createdAt).fromNow()}</p>
              </>
            )}
            <p>{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;