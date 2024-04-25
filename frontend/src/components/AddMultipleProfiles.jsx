import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import LeftComponent from './LeftComponent';
import RightComponent from './RightComponent';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function AddMultipleProfiles() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [showAdminFeatures, setShowAdminFeatures] = useState(false);

  const [multipleProfileFormData, setMultipleProfileFormData] = useState({
    userDataFile: null,
  });

  const handleMultipleProfileChange = (event) => {
    const file = event.target.files[0];
    setMultipleProfileFormData({ userDataFile: file });
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
      console.log(response.data);
      toast.success('Profiles uploaded successfully');
      navigate('/');
    } catch (error) {
      console.error('Error uploading profiles:', error.message);
      toast.error('Failed to upload profiles. Please try again.');
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
      <div className="container my-auto flex-grow mx-auto mt-4">
        <div className="md:flex md:justify-evenly">
          <div className="md:w-1/3 hidden md:block">
            <LeftComponent />
          </div>
          <div className="md:w-2/3">
            <div className="bg-white shadow-md rounded-lg flex flex-col px-8 pt-6 pb-8 mb-4">
              <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
                <form onSubmit={handleSubmitMultipleProfiles} encType="multipart/form-data">
                  <input
                    type="file"
                    name="userDataFile"
                    onChange={handleMultipleProfileChange}
                    accept=".xlsx, .xls"
                  />
                  <button type="submit">Upload Multiple Profiles</button>
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
  )
}

export default AddMultipleProfiles;
