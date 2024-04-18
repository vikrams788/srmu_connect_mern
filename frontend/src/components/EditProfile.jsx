import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import LeftComponent from './LeftComponent';
import RightComponent from './RightComponent';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditProfileForm = () => {
  const navigate = useNavigate();

  const [singleProfileFormData, setSingleProfileFormData] = useState({
    fullName: '',
    bio: '',
    email: '',
    course: '',
    rollNo: '',
    semester: '',
    profilePicture: null,
  });

  const [multipleProfileFormData, setMultipleProfileFormData] = useState({
    userDataFile: null,
  });

  const [isSingleProfile, setIsSingleProfile] = useState(true);
  const userData = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_REACT_APP_API_URL + '/api/profile', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
        });

        const profileData = response.data;
        if(response){
          setSingleProfileFormData(profileData);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error.message);
        toast.error('Failed to fetch profile data. Please try again.');
      }
    };

    fetchProfileData();
  }, []);

  const handleSingleProfileChange = (event) => {
    const { name, value } = event.target;
    setSingleProfileFormData({ ...singleProfileFormData, [name]: value });
  };

  const handleMultipleProfileChange = (event) => {
    const file = event.target.files[0];
    setMultipleProfileFormData({ userDataFile: file });
  };

  const handleSubmitSingleProfile = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(import.meta.env.VITE_REACT_APP_API_URL + '/api/profile', singleProfileFormData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
      });
      toast.success('Profile updated successfully');
      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error.message);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleSubmitMultipleProfiles = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('userDataFile', multipleProfileFormData.userDataFile);

      const response = await axios.post(import.meta.env.VITE_REACT_APP_API_URL + '/api/profile/bulk-profile-upload', formData, {
        withCredentials: true,
        headers: {
          'content-type': 'multipart/form-data',
          'Access-Control-Allow-Credentials': true,
        },
      });
      toast.success('Profiles uploaded successfully');
      navigate('/');
    } catch (error) {
      console.error('Error uploading profiles:', error.message);
      toast.error('Failed to upload profiles. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container my-auto flex-grow mx-auto mt-4">
        <div className="md:flex md:justify-evenly">
          <div className="md:w-1/3 hidden md:block">
            <LeftComponent />
          </div>
          <div className="md:w-2/3">
            <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
              <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
              {userData.role === 'teacher' || userData.role === 'admin' ? (<div className="mb-4 flex justify-center items-center">
                <button
                  className={`py-2 px-4 rounded mr-4 focus:outline-none ${isSingleProfile ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setIsSingleProfile(true)}
                >
                  Single Profile
                </button>
                <button
                  className={`py-2 px-4 rounded focus:outline-none ${!isSingleProfile ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setIsSingleProfile(false)}
                >
                  Multiple Profiles (Excel)
                </button>
              </div>) : (
                <p className='text-red-500 text-sm mb-4 mx-auto'>You are not authorized to upload multiple profiles</p>
              )}
              {isSingleProfile ? (
                <form onSubmit={handleSubmitSingleProfile}>
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
              ) : (
                <form onSubmit={handleSubmitMultipleProfiles} encType="multipart/form-data">
                  {/* Multiple profiles (Excel upload) form */}
                  <input
                    type="file"
                    name="userDataFile"
                    onChange={handleMultipleProfileChange}
                    accept=".xlsx, .xls"
                  />
                  <button type="submit">Upload Multiple Profiles</button>
                </form>
              )}
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