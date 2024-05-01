import { useState } from 'react';
import axios from 'axios';
import Footer from '../partials/Footer';
import Header from '../partials/Header';
import srmuLogo2 from '../assets/srmu-logo2.webp';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpComponent, setShowOtpComponent] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    // const validEmailPattern = /@srmu\.ac\.in$/;
    // const isEmailValid = validEmailPattern.test(email);

    // if (!isEmailValid) {
    //   setError('Please enter a valid SRMU email ID');
    //   return;
    // }

    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/send-otp`, { email }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
      });
      if (response.status === 200) {
        toast.success('OTP sent to your email', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setShowOtpComponent(true);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send OTP. Please try again.');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/signup`, {
        email,
        password,
        confirmPassword,
        otp,
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
      });
      if (response.status === 200) {
        toast.success('User created successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        const user = response.data.user;
        const token = response.data.token2;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', JSON.stringify(token));
        if(user.role === 'teacher') {
          navigate('/edit-teacher-profile')
        } else {
          navigate('/edit-profile');
        }
        
      } else {
        setError('Failed to create user. Please try again.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Failed to create user. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col">
            <div className="m-3 top-0 left-0 right-0 mx-auto rounded-full overflow-hidden -mt-10" style={{ height: "200px", width: "200px" }}>
              <img src={srmuLogo2} alt="SRMU Logo" className="object-cover min-h-full min-w-full" style={{ borderRadius: '100%' }} />
            </div>
            <h2 className="text-2xl mb-4 font-semibold text-center">Signup</h2>
            {error && <div className="text-red-500 text-sm mb-4 mx-auto">{error}</div>}
            {showOtpComponent ? (
              <form onSubmit={handleSignupSubmit}>
                <div className="mb-4">
                  <label htmlFor="otp" className="block text-gray-700 text-sm font-semibold mb-2">OTP</label>
                  <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="otp" id='otp' value={otp} onChange={(e) => setOtp(e.target.value)} required />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                  <input type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="password" id='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-semibold mb-2">Confirm Password</label>
                  <input type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="confirmPassword" id='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">Signup</button>
              </form>
            ) : (
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                  <input type="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="email" id='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">Send OTP</button>
              </form>
            )}
            <p className="mt-3 text-center text-sm">Already have an account? <a href="/login" className="text-blue-500 hover:text-blue-700">Login Here!</a></p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;