import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import LeftComponent from './LeftComponent';
import RightComponent from './RightComponent';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const TeacherEditProfile = () => {
  const navigate = useNavigate();
  const [teacherProfile, setTeacherProfile] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    department: '',
    facultyRoom: '',
    employeeId: '',
    bio: '',
    profilePicture: ''
  });

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_REACT_APP_API_URL + '/api/teacher/profile', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
        });
        setTeacherProfile(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching teacher profile:', error.message);
      }
    };

    fetchTeacherProfile();
  }, [teacherProfile]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('department', formData.department);
    data.append('facultyRoom', formData.facultyRoom);
    data.append('employeeId', formData.employeeId);
    data.append('bio', formData.bio);
    if (formData.profilePicture) {
      data.append('profilePicture', formData.profilePicture);
    }
    console.log(data);
    try {
      let response;
      if (teacherProfile) {
        response = await axios.put(import.meta.env.VITE_REACT_APP_API_URL + '/api/teacher/profile', data, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Credentials': true,
          },
        });
        toast.success('Teacher profile updated successfully', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
      } else {
        response = await axios.post(import.meta.env.VITE_REACT_APP_API_URL + '/api/teacher/profile', data, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Credentials': true,
          },
        });
        toast.success('Teacher profile created successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      console.log('Teacher profile saved successfully', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error saving teacher profile:', error.message);
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
            <div className="bg-white px-8 pt-6 pb-8 mb-4">
              <h2 className="text-2xl font-bold mb-4 text-center">Edit Teacher Profile</h2>
              <form onSubmit={handleSubmit} className="flex flex-col" encType="multipart/form-data">
                <div className="mb-4">
                  <label htmlFor="fullName" className="block text-gray-700 text-sm font-semibold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="fullName"
                    name="fullName"
                    placeholder="Enter teacher's full name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="department" className="block text-gray-700 text-sm font-semibold mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="department"
                    name="department"
                    placeholder="Enter teacher's department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="facultyRoom" className="block text-gray-700 text-sm font-semibold mb-2">
                    Faculty Room
                  </label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="facultyRoom"
                    name="facultyRoom"
                    placeholder="Enter teacher's faculty room"
                    value={formData.facultyRoom}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="employeeId" className="block text-gray-700 text-sm font-semibold mb-2">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="employeeId"
                    name="employeeId"
                    placeholder="Enter teacher's employee ID"
                    value={formData.employeeId}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="bio" className="block text-gray-700 text-sm font-semibold mb-2">
                    Bio
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="bio"
                    rows="3"
                    name="bio"
                    placeholder="Tell something about the teacher"
                    value={formData.bio}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label htmlFor="profilePicture" className="block text-gray-700 text-sm font-semibold mb-2">
                    Profile Picture
                  </label>
                  <input type="file" className="form-input" id="profilePicture" name="profilePicture" onChange={handleFileChange} />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save Changes
                </button>
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

export default TeacherEditProfile;