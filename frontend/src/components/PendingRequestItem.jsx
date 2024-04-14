import axios from 'axios';
import { toast } from 'react-toastify';

const PendingRequestItem = ({ request }) => {
    const handleAcceptRequest = async () => {
        const requestId = request.userId;
        const currentUser = JSON.parse(localStorage.getItem('profile'))

        try {
            const response = await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/api/friend-requests/${requestId}`, {
                fullName: request.fullName,
                profilePicture: request.profilePicture,
                currentUserFullName: currentUser.fullName,
                currentUserProfilePicture: currentUser.profilePicture
              }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                },
            });

            toast.success('Friend request accepted', {
                position: 'top-right',
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });

            console.log("Friend request accepted", response.data);
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleDeleteRequest = async () => {
        const requestId = request.userId;

        try {
            const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/api/friend-requests/${requestId}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                },
            });

            toast.success('Friend request deleted', {
                position: 'top-right',
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });

            console.log("Friend request deleted", response.data);
        } catch (error) {
            console.error('Error deleting friend request:', error);
            toast.error("Friend request already deleted");
        }
    };

    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
                <img src={request.profilePicture} alt="Profile" className="w-12 h-12 rounded-full mr-4" />
                <div>
                    <p className="font-bold">{request.fullName}</p>
                    <p className="text-gray-500">sent you a friend request</p>
                </div>
            </div>
            <div className="flex items-center">
                <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={handleAcceptRequest}
                >
                    Accept
                </button>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    onClick={handleDeleteRequest}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default PendingRequestItem;