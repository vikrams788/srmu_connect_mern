import { useState, useEffect } from 'react';
import axios from 'axios';
import CreatePost from './CreatePost';

const EditPost = () => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postId = localStorage.getItem('editPostId');
        if (postId) {
          const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/posts/${postId}`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Credentials': true,
            },
          });
          setPost(response.data);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, []);

  return (
    <div>
      {post ? (
        <CreatePost post={post} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditPost;