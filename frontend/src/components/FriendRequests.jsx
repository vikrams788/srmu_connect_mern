import { useState, useEffect } from 'react';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import LeftComponent from './LeftComponent';
import RightComponent from './RightComponent';
import axios from 'axios';
import PendingRequestItem from './PendingRequestItem';
import ProfileListItem from './ProfileListItem';
import { toast } from 'react-toastify';

const FriendRequests = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('profile'));
    const currentUserId = currentUser.createdBy;
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user.role;
    const [showAdminFeatures, setShowAdminFeatures] = useState(false);

    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/pending-requests/${currentUserId}`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Credentials': true,
                    },
                });

                setPendingRequests(response.data.pendingRequests);
            } catch (error) {
                console.error('Error fetching pending requests:', error);
            }
        };

        const fetchAllProfiles = async () => {
            try {
                const [userProfilesResponse, teacherProfilesResponse] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/all-profiles`, {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Credentials': true,
                        },
                    }),
                    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/non-friend-profiles`, {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Credentials': true,
                        },
                    })
                ]);
        
                const userProfiles = userProfilesResponse.data;
                const teacherProfiles = teacherProfilesResponse.data;
        
                const mergedProfiles = [...userProfiles, ...teacherProfiles];
        
                setProfiles(mergedProfiles);
            } catch (error) {
                console.error('Error fetching profiles:', error);
            }
        };        

        fetchPendingRequests();
        fetchAllProfiles();
        if(user.role === 'admin' || user.role === 'teacher') {
            setShowAdminFeatures(true);
        } else {
            setShowAdminFeatures(false);
        }
    }, [currentUserId, pendingRequests, user.role]);

    const sendFriendRequest = async (recipientId) => {
        const senderId = currentUserId;
        try {
            await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/friend-requests`, {
                senderId,
                recipientId,
                fullName: currentUser.fullName,
                profilePicture: currentUser.profilePicture,
                role: role
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                },
            });

            toast.success('Friend request sent', {
                position: 'top-right',
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });

        } catch (error) {
            console.error('Error sending friend request:', error);
            toast.error("Friend request already sent or received");
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header isAdmin = {showAdminFeatures}/>
            <div className="container mx-auto py-8 flex-grow">
                <div className="flex flex-col justify-evenly md:flex-row">
                    <div className="w-full md:w-1/6 md:block hidden custom-scrollbar">
                        <LeftComponent />
                    </div>
                    <div className="w-full md:w-2/3 px-4 custom-scrollbar">
                        <h2 className="text-2xl font-bold mb-4">Pending Friend Requests</h2>
                        {pendingRequests.length === 0 ? (
                            <p className="text-gray-500 mt-10">No friend requests</p>
                        ) : (
                            <div className="mt-10">
                                {pendingRequests.map((request) => (
                                    <PendingRequestItem key={request._id} request={request} />
                                ))}
                            </div>
                        )}
                        <h2 className="text-2xl mt-10 font-bold mb-4">Find Friends</h2>
                        <div className="mt-10">
                            {profiles?.map((profile) => (
                                <ProfileListItem key={profile._id} profile={profile} onSendRequest={sendFriendRequest} />
                            ))}
                        </div>
                    </div>
                    <div className="w-full md:w-1/6 md:block hidden custom-scrollbar">
                        <RightComponent />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FriendRequests;