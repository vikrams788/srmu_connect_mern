import { Link } from 'react-router-dom';
import srmuLogo from '../assets/srmu-logo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { IoMdMenu } from "react-icons/io";

function Header() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchDropdown, setSearchDropdown] = useState(false);
  const searchDropdownRef = useRef(null);

  const handleLogout = async (e) => {
    e.preventDefault();

    await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/logout`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      },
    });
    localStorage.clear();

    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSearchDropdown = () => {
    setSearchDropdown(!searchDropdown);
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const handleClickOutsideSearch = (event) => {
    if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
      setSearchDropdown(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideSearch);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideSearch);
    };
  }, []);

  const handleSearch = async (query) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/search?query=${query}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
      });
      setSearchResults(response.data);
      setSearchDropdown(true);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
      setSearchDropdown(false);
    }
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <nav className="bg-blue-500 p-3">
      <div className="flex justify-between items-center h-16">
        <div className="flex-shrink-0 p-3 flex items-center">
          <img className="h-20 pl-3 w-auto" src={srmuLogo} alt="college-logo" />
        </div>
        <div className="ml-auto flex items-center">
          <input
            type="text"
            placeholder="Search users..."
            className="text-black px-3 py-2 rounded-md text-sm font-medium focus:outline-none"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
              setSearchDropdown(true);
              toggleSearchDropdown();
            }}
          />
          {searchDropdown && (
            <div ref={searchDropdownRef} className="absolute z-10 top-16 bg-white border rounded-md shadow-lg mt-1 ">
              <ul className="py-2">
                {searchResults.map((profile) => (
                  <li key={profile._id} className="px-4 py-2 flex cursor-pointer hover:bg-gray-100" onClick={() => handleProfileClick(profile.createdBy)}>
                    <img src={profile.profilePicture} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
                    <span>{profile.fullName}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="md:hidden relative">
            <button onClick={toggleDropdown} className="text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none">
              <IoMdMenu size={30} />
            </button>
            {dropdownOpen && (
              <div ref={dropdownRef} className="absolute z-10 top-16 right-0 bg-white border rounded-md shadow-lg py-1 dropdown-menu">
                <Link to="/" className="block px-4 py-2 mx-2 text-gray-800 hover:bg-gray-100">Home</Link>
                <Link to="/profile" className="block px-4 py-2 mx-2 text-gray-800 hover:bg-gray-100">Profile</Link>
                <Link to="/friends" className="block px-4 py-2 mx-2 text-gray-800 hover:bg-gray-100">Friends</Link>
                <Link to="/chat" className="block px-4 py-2 mx-2 text-gray-800 hover:bg-gray-100">Chat</Link>
                <Link to="/e-library" className="block px-4 py-2 mx-2 text-gray-800 hover:bg-gray-100">Library</Link>
                <span onClick={handleLogout} className="block px-4 py-2 mx-2 text-gray-800 hover:bg-gray-100 cursor-pointer">Logout</span>
              </div>
            )}
          </div>
          <div className="hidden md:flex">
            <Link to="/" className="text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
            <Link to="/profile" className="text-white px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
            <Link to="/friend-requests" className="text-white px-3 py-2 rounded-md text-sm font-medium">Friend Requests</Link>
            <Link to="/chat" className="text-white px-3 py-2 rounded-md text-sm font-medium">Chat</Link>
            <Link to="/e-library" className="text-white px-3 py-2 rounded-md text-sm font-medium">Library</Link>
            <span onClick={handleLogout} className="text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer">Logout</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;