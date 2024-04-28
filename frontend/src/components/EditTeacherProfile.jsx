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
  const [fetchedProfile, setFetchedProfile] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/teacher-profile`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true
        }
      });
      setSingleUserFormData(response.data);
      setFetchedProfile(response.data);
    }
    
    if(user.role === 'admin' || user.role === 'teacher') {
      setShowAdminFeatures(true);
    } else {
      setShowAdminFeatures(false);
    }

    fetchTeacherProfile();
  }, [user.role])

  const handleSingleUserChange = (event) => {
    const { name, value, files } = event.target;
  
    if (files) {
      const file = files[0];
      setSingleUserFormData((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      setSingleUserFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
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

      if(!fetchedProfile) {
        const response = await axios.post(import.meta.env.VITE_REACT_APP_API_URL + '/api/create-teacher-profile', formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Credentials': true,
          },
        });

        console.log('Single user profile created:', response.data);
      } else {
        const response = await axios.put(import.meta.env.VITE_REACT_APP_API_URL + '/api/edit-teacher-profile', formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Credentials': true,
          },
        });

        console.log('Single user profile created:', response.data);
      }
      navigate('/');
    } catch (error) {
      console.error('Error creating single user profile:', error);
    }
  };

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
                <input type="text" name="fullName" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id='fullName' value={singleUserFormData.fullName} onChange={handleSingleUserChange} required />
              </div>
              <div className="mb-4">
                <label htmlFor="bio" className="block text-sm font-semibold mb-2">Bio</label>
                <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="bio" rows="3" name="bio" placeholder="Tell something about yourself" value={singleUserFormData.bio} onChange={handleSingleUserChange}></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="facultyRoom" className="block text-sm font-semibold mb-2">Faculty Room</label>
                <input type="text" name="facultyRoom" id='facultyRoom' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={singleUserFormData.facultyRoom} onChange={handleSingleUserChange} required />
              </div>
              <div className="mb-4">
                <label htmlFor="department" className="block text-sm font-semibold mb-2">Department</label>
                <input type="text" name="department" id='department' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={singleUserFormData.department} onChange={handleSingleUserChange} required />
              </div>
              <div className="mb-4">
                <label htmlFor="employeeId" className="block text-sm font-semibold mb-2">Employee ID</label>
                <input type="text" name="employeeId" id='employeeId' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={singleUserFormData.employeeId} onChange={handleSingleUserChange} required />
              </div>
              <div className="mb-4">
                <label htmlFor="profilePicture" className="block text-sm font-semibold mb-2">Profile Picture</label>
                <input type="file" name="profilePicture" id='profilePicture' onChange={handleSingleUserChange} />
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