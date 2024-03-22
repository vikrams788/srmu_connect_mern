import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../partials/Footer';
import Header from '../partials/Header';
import srmuLogo2 from '../assets/srmu-logo2.webp';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const response = await axios.post(import.meta.env.VITE_REACT_APP_API_URL + '/api/signup', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
      });
      console.log(response.data);

      const token = response.data.token2;
      localStorage.setItem('token', token);

      navigate('/edit-profile');
    } catch (error) {
      console.error('Error in signup:', error);
      setError('Failed to signup. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col">
            <div className="m-3 top-0 left-0 right-0 mx-auto rounded-full overflow-hidden -mt-10" style={{height: "200px", width: "200px"}}>
              <img src={srmuLogo2} alt="SRMU Logo" className="object-cover min-h-full min-w-full" style={{ borderRadius: '100%' }} />
            </div>
            <h2 className="text-2xl mb-4 font-semibold text-center">Signup</h2>
            {error && <div className="text-red-500 text-sm mb-4 mx-auto">{error}</div>}
            <form onSubmit={handleSubmit} id="signupForm form">
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                <input type="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                <input type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-semibold mb-2">Confirm Password</label>
                <input type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">Signup</button>
            </form>
            <p className="mt-3 text-center text-sm">Already have an account? <a href="/login" className="text-blue-500 hover:text-blue-700">Login Here!</a></p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;