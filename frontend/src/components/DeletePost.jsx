import axios from 'axios';
import { toast } from 'react-toastify';

const DeletePost = ({ postId, onDelete, onCancel }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/api/posts/${postId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
      });
      console.log("Post deleted successfully!");

      toast.success('Post deleted', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      onDelete();
    } catch (error) {
      console.error('Error deleting post:', error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Confirm Delete</h2>
        </div>
        <p className="text-gray-800 mb-4">Are you sure you want to delete this post?</p>
        <div className="flex justify-evenly">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
            onClick={handleDelete}
          >
            Yes, delete
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePost;