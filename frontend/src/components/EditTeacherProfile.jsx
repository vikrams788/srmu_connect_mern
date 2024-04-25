import { useEffect, useState } from 'react';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import LeftComponent from './LeftComponent';
import RightComponent from './RightComponent';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditTeacherProfile = () => {
  const [singleUserFormData, setSingleUserFormData] = useState({
    fullName: '',
    bio: '',
    facultyRoom: '',
    department: '',
    employeeId: '',
    profilePicture: null,
  });
  const user = JSON.parse(localStorage.getItem('user'));
  const [showAdminFeatures, setShowAdminFeatures] = useState(false);

  const navigate = useNavigate();

  const handleSingleUserChange = (e) => {
    const { name, value } = e.target;
    setSingleUserFormData({ ...singleUserFormData, [name]: value });
  };

  const handleSingleUserFileChange = (e) => {
    const file = e.target.files[0];
    setSingleUserFormData({ ...singleUserFormData, profilePicture: file });
  };

  const handleSubmitSingleUser = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('fullName', singleUserFormData.fullName);
      formData.append('bio', singleUserFormData.bio);
      formData.append('facultyRoom', singleUserFormData.facultyRoom);
      formData.append('department', singleUserFormData.department);
      formData.append('employeeId', singleUserFormData.employeeId);
      formData.append('profilePicture', singleUserFormData.profilePicture);

      const response = await axios.post(import.meta.env.VITE_REACT_APP_API_URL + '/api/create-teacher-profile', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
      });

      console.log('Single user profile created:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error creating single user profile:', error);
    }
  };

  useEffect(() => {
    if(user.role === 'admin' || user.role === 'teacher') {
      setShowAdminFeatures(true);
    } else {
      setShowAdminFeatures(false);
    }
  }, [user.role])

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAdmin = {showAdminFeatures}/>
      <div className="container mx-auto py-8 flex-grow">
        <div className="flex">
          <div className="w-full md:w-1/4">
            <LeftComponent />
          </div>
          <div className="w-full md:w-1/2 px-4">
            <h1 className="text-2xl font-bold mb-4">Edit Teacher Profile</h1>
            {/* Single User Form */}
            <form onSubmit={handleSubmitSingleUser} encType="multipart/form-data">
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-sm font-semibold mb-2">Full Name</label>
                <input type="text" name="fullName" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleSingleUserChange} required />
              </div>
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-sm font-semibold mb-2">Full Name</label>
                <input type="text" name="fullName" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleSingleUserChange} required />
              </div>
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-sm font-semibold mb-2">Full Name</label>
                <input type="text" name="fullName" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleSingleUserChange} required />
              </div>
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-sm font-semibold mb-2">Full Name</label>
                <input type="text" name="fullName" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleSingleUserChange} required />
              </div>
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-sm font-semibold mb-2">Full Name</label>
                <input type="text" name="fullName" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleSingleUserChange} required />
              </div>
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-sm font-semibold mb-2">Full Name</label>
                <input type="text" name="fullName" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleSingleUserChange} required />
              </div>
              <div className="mb-4">
                <label htmlFor="profilePicture" className="block text-sm font-semibold mb-2">Profile Picture</label>
                <input type="file" name="profilePicture" onChange={handleSingleUserFileChange} required />
              </div>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save</button>
            </form>
          </div>
          <div className="w-full md:w-1/4">
            <RightComponent />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditTeacherProfile;