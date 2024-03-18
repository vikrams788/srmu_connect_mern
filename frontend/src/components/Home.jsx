import { useEffect } from 'react';
import Header from "../partials/Header";
import axios from 'axios';

function Home() {

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
        const userProfile = response.data;

        localStorage.setItem('profile', JSON.stringify(userProfile));
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();

    return () => {
    };
  }, []);

  return (
    <div>
      <Header />
      Home
    </div>
  );
}

export default Home;
