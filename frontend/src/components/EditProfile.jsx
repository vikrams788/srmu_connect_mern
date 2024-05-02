import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import LeftComponent from './LeftComponent';
import RightComponent from './RightComponent';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom'

const EditProfileForm = () => {

  const [singleProfileFormData, setSingleProfileFormData] = useState({
    fullName: '',
    bio: '',
    email: '',
    course: '',
    rollNo: '',
    semester: '',
    profilePicture: null,
  });
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const [showAdminFeatures, setShowAdminFeatures] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if(!userId) {
          const response = await axios.get(import.meta.env.VITE_REACT_APP_API_URL + '/api/profile', {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Credentials': true,
            },
          });

          setProfileData(response.data);
          if(response){
            setSingleProfileFormData(response.data);
          }
          if(user.role === 'admin' || user.role === 'teacher') {
            setShowAdminFeatures(true);
          } else {
            setShowAdminFeatures(false);
          }
        } else {
          const response = await axios.get(import.meta.env.VITE_REACT_APP_API_URL + `/api/profile/${userId}`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Credentials': true,
            },
          });

          setProfileData(response.data);
          if(response){
            setSingleProfileFormData(response.data);
          }
          if(user.role === 'admin' || user.role === 'teacher') {
            setShowAdminFeatures(true);
          } else {
            setShowAdminFeatures(false);
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error.message);
        toast.error('Failed to fetch profile data. Please try again.', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
      }
    };

    fetchProfileData();
  }, [user.role, userId]);

  const handleSingleProfileChange = (event) => {
    const { name, value, files } = event.target;
  
    if (files) {
      const file = files[0];
      setSingleProfileFormData((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      setSingleProfileFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmitSingleProfile = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('fullName', singleProfileFormData.fullName);
      formData.append('bio', singleProfileFormData.bio);
      formData.append('email', singleProfileFormData.email);
      formData.append('course', singleProfileFormData.course);
      formData.append('rollNo', singleProfileFormData.rollNo);
      formData.append('semester', singleProfileFormData.semester);
      formData.append('profilePicture', singleProfileFormData.profilePicture);
      console.log(profileData);
      if(profileData){
        const response = await axios.put(import.meta.env.VITE_REACT_APP_API_URL + '/api/profile', formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Credentials': true,
          },
        });
        localStorage.setItem('profile', JSON.stringify(response.data));
      } else {
        const response = await axios.post(import.meta.env.VITE_REACT_APP_API_URL + '/api/profile', formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Credentials': true,
          },
        });
        localStorage.setItem('profile', JSON.stringify(response.data));
      }
      navigate('/profile');
      toast.success('Profile updated successfully', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    } catch (error) {
      console.error('Error updating profile:', error.message);
      toast.error('Failed to update profile. Please try again.', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAdmin={showAdminFeatures}/>
      <div className="container my-auto flex-grow mx-auto mt-4">
        <div className="md:flex md:justify-evenly">
          <div className="md:w-1/3 hidden md:block">
            <LeftComponent />
          </div>
          <div className="md:w-2/3">
            <div className="bg-white flex flex-col px-8 pt-6 pb-8 mb-4">
              <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
                <form onSubmit={handleSubmitSingleProfile} encType="multipart/form-data">
                  <div className="mb-4">
                  <label htmlFor="fullName" className="block text-gray-700 text-sm font-semibold mb-2">Full Name</label>
                  <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="fullName" name="fullName" placeholder="Enter your full name" value={singleProfileFormData.fullName} onChange={handleSingleProfileChange} />
                </div>
                <div className="mb-4">
                  <label htmlFor="bio" className="block text-gray-700 text-sm font-semibold mb-2">Bio</label>
                  <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="bio" rows="3" name="bio" placeholder="Tell something about yourself" value={singleProfileFormData.bio} onChange={handleSingleProfileChange}></textarea>
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                  <input type="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" name="email" placeholder="user@example.com" value={singleProfileFormData.email} onChange={handleSingleProfileChange} />
                </div>
                <div className="mb-4">
                  <label htmlFor="course" className="block text-gray-700 text-sm font-semibold mb-2">Course</label>
                  <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="course" name="course" placeholder="B. Tech CS(Specialization(if any))" value={singleProfileFormData.course} onChange={handleSingleProfileChange} />
                </div>
                <div className="mb-4">
                  <label htmlFor="rollNo" className="block text-gray-700 text-sm font-semibold mb-2">Roll Number</label>
                  <input type="number" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="rollNo" name="rollNo" maxLength="15" minLength="15" placeholder="2020101011XXXXX" value={singleProfileFormData.rollNo} onChange={handleSingleProfileChange} />
                </div>
                <div className="mb-4">
                  <label htmlFor="semester" className="block text-gray-700 text-sm font-semibold mb-2">Semester</label>
                  <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="semester" name="semester" placeholder="8th" value={singleProfileFormData.semester} onChange={handleSingleProfileChange} />
                </div>
                <div className="mb-4">
                  <label htmlFor="profilePicture" className="block text-gray-700 text-sm font-semibold mb-2">Profile Picture</label>
                  <input type="file" className="form-input" id="profilePicture" name="profilePicture" onChange={handleSingleProfileChange} />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save Changes</button>
                </form>
            </div>
          </div>
          <div className="md:w-1/3 hidden md:block">
            <RightComponent />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditProfileForm;