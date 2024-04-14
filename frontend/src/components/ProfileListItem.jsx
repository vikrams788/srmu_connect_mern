import { useNavigate } from "react-router-dom";

const ProfileListItem = ({ profile, onSendRequest }) => {
    const navigate = useNavigate();
    const currentUserProfile = JSON.parse(localStorage.getItem('profile'));

    const handleViewProfile = (userId) => {
        navigate(`/profile/${userId}`);
    }

    const isCurrentUserProfile = currentUserProfile && profile._id === currentUserProfile._id;

    if (isCurrentUserProfile) {
        return null;
    }

    return (
        <div className="bg-white shadow-md p-4 mb-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
                <img src={profile.profilePicture} alt={profile.fullName} className="w-12 h-12 rounded-full mr-4" />
                <p>{profile.fullName}</p>
            </div>
            <div className="flex items-center">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => handleViewProfile(profile.createdBy)}
                >
                    View Profile
                </button>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => onSendRequest(profile.createdBy)}
                >
                    Send Request
                </button>
            </div>
        </div>
    );
};

export default ProfileListItem;