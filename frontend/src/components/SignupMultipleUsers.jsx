import { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../partials/Footer';
import Header from '../partials/Header';
import srmuLogo2 from '../assets/srmu-logo2.webp';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function SignupMultipleUsers() {
  
  const [multipleUsersFormData, setMultipleUsersFormData] = useState({
    userDataFile: null,
  });
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const [showAdminFeatures, setShowAdminFeatures] = useState(false);

  const handleMultipleUsersFileChange = (e) => {
    const file = e.target.files[0];
    setMultipleUsersFormData({ ...multipleUsersFormData, userDataFile: file });
  };

  const handleSubmitMultipleUsers = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('userDataFile', multipleUsersFormData.userDataFile);
  
      console.log('FormData:', multipleUsersFormData.userDataFile);
  
      const response = await axios.post(import.meta.env.VITE_REACT_APP_API_URL + '/api/bulk-user-upload', data, {
        withCredentials: true,
        headers: {
          'content-type': 'multipart/form-data',
          'Access-Control-Allow-Credentials': true,
        },
      });
  
      toast.success('Users created', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
  
      navigate('/');
  
      console.log(response.data);
    } catch (error) {
      console.error('Error in bulk user upload:', error);
      setError('Failed to upload users. Please try again later.');
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
      <Header isAdmin={showAdminFeatures}/>
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col">
            <div className="m-3 top-0 left-0 right-0 mx-auto rounded-full overflow-hidden -mt-10" style={{ height: "200px", width: "200px" }}>
              <img src={srmuLogo2} alt="SRMU Logo" className="object-cover min-h-full min-w-full" style={{ borderRadius: '100%' }} />
            </div>
            <h2 className="text-2xl mb-4 font-semibold text-center">Signup</h2>
            {error && <div className="text-red-500 text-sm mb-4 mx-auto">{error}</div>}
              <form onSubmit={handleSubmitMultipleUsers} id="signupFormMultipleUsers" encType="multipart/form-data">
                {/* Multiple users upload form */}
                <div className="mb-4">
                  <label htmlFor="userDataFile" className="block text-gray-700 text-sm font-semibold mb-2">Upload User Data (Excel file)</label>
                  <input type="file" className="form-input" name="userDataFile" id='userDataFile' onChange={handleMultipleUsersFileChange} required />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">Upload Users</button>
              </form>
            <p className="mt-3 text-center text-sm">Already have an account? <a href="/login" className="text-blue-500 hover:text-blue-700">Login Here!</a></p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SignupMultipleUsers;
