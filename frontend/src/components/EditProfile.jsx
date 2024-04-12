import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import LeftComponent from './LeftComponent';
import RightComponent from './RightComponent';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditProfileForm = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    email: '',
    course: '',
    rollNo: '',
    semester: '',
    profilePicture: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_REACT_APP_API_URL + '/api/profile', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
        });
        setUserProfile(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      }
    };

    fetchUserProfile();
  }, [userProfile]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('bio', formData.bio);
    data.append('email', formData.email);
    data.append('course', formData.course);
    data.append('rollNo', formData.rollNo);
    data.append('semester', formData.semester);
    if (formData.profilePicture) {
      data.append('profilePicture', formData.profilePicture);
    }
    console.log(data);
    try {
      let response;
      if (userProfile) {
        response = await axios.put(import.meta.env.VITE_REACT_APP_API_URL + '/api/profile', data, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Credentials': true,
          },
        });
        toast.success('Profile updated successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        response = await axios.post(import.meta.env.VITE_REACT_APP_API_URL + '/api/profile', data, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Credentials': true,
          },
        });
        toast.success('Profile created successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      console.log('Profile saved successfully', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error saving profile:', error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData({ ...formData, profilePicture: file });
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
              <form onSubmit={handleSubmit} className='flex flex-col' encType='multipart/form-data'>
                <div className="mb-4">
                  <label htmlFor="fullName" className="block text-gray-700 text-sm font-semibold mb-2">Full Name</label>
                  <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="fullName" name="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label htmlFor="bio" className="block text-gray-700 text-sm font-semibold mb-2">Bio</label>
                  <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="bio" rows="3" name="bio" placeholder="Tell something about yourself" value={formData.bio} onChange={handleChange}></textarea>
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                  <input type="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" name="email" placeholder="user@example.com" value={formData.email} onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label htmlFor="course" className="block text-gray-700 text-sm font-semibold mb-2">Course</label>
                  <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="course" name="course" placeholder="B. Tech CS(Specialization(if any))" value={formData.course} onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label htmlFor="rollNo" className="block text-gray-700 text-sm font-semibold mb-2">Roll Number</label>
                  <input type="number" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="rollNo" name="rollNo" maxLength="15" minLength="15" placeholder="2020101011XXXXX" value={formData.rollNo} onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label htmlFor="semester" className="block text-gray-700 text-sm font-semibold mb-2">Semester</label>
                  <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="semester" name="semester" placeholder="8th" value={formData.semester} onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label htmlFor="profilePicture" className="block text-gray-700 text-sm font-semibold mb-2">Profile Picture</label>
                  <input type="file" className="form-input" id="profilePicture" name="profilePicture" onChange={handleFileChange} />
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