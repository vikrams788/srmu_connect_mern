import { Link } from 'react-router-dom';
import srmuLogo from '../assets/srmu-logo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/logout`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      },
    });
    localStorage.removeItem('token');

    navigate('/login');
  };

  return (
    <nav className="bg-blue-500 p-3">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 p-3 flex items-center">
            <img className="h-20 pl-3 w-auto" src={srmuLogo} alt="college-logo" />
          </div>
          <div className="ml-auto">
            <Link to="/" className="text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
            <Link to="/profile" className="text-white px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
            <Link to="/friends" className="text-white px-3 py-2 rounded-md text-sm font-medium">Friends</Link>
            <span onClick={handleLogout} className="text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer">Logout</span>
          </div>
        </div>
    </nav>
  );
}

export default Header;
