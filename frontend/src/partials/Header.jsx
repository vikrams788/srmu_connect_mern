import { Link } from 'react-router-dom';
import srmuLogo from '../assets/srmu-logo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { IoMdMenu } from "react-icons/io";

function Header({isAdmin}) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchDropdown, setSearchDropdown] = useState(false);
  const searchDropdownRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

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
        const [userProfilesResponse, teacherProfilesResponse] = await Promise.all([
            axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/search?query=${query}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                },
            }),
            axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/search-teacher-profiles?query=${query}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                },
            })
        ]);

        const userProfiles = userProfilesResponse.data.map(profile => ({
          ...profile,
          profileType: 'normal' // Add profileType field for normal profiles
        }));

        const teacherProfiles = teacherProfilesResponse.data.map(profile => ({
          ...profile,
          profileType: 'teacher' // Add profileType field for teacher profiles
        }));

        const mergedProfiles = [...userProfiles, ...teacherProfiles];

        setSearchResults(mergedProfiles);
        setSearchDropdown(true);
    } catch (error) {
        console.error('Error searching users:', error);
        setSearchResults([]);
        setSearchDropdown(false);
    }
  };

  const handleProfileClick = (profile) => {
    const url = profile.profileType === 'teacher'
    ? `/teacher-profile/${profile.createdBy}/${profile.profileType}`
    : `/profile/${profile.createdBy}`;

    navigate(url);
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
                <li key={profile._id} className="px-4 py-2 flex cursor-pointer hover:bg-gray-100" onClick={() => handleProfileClick(profile)}>
                  <img src={profile.profilePicture} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
                  <span>{profile.fullName}</span>
                </li>
              ))}
              </ul>
            </div>
          )}
          <div className="relative">
            <button onClick={toggleDropdown} className="text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none">
              <IoMdMenu size={30} />
            </button>
            {dropdownOpen && user ? (
              <div ref={dropdownRef} className="absolute z-10 top-16 p-4 right-0 bg-white border rounded-md shadow-lg py-1 dropdown-menu">
                <Link to="/" className="block px-8 py-2 mx-2 text-gray-800 hover:bg-gray-100">Home</Link>
                {role !== 'teacher' ? (<Link to="/profile" className="block px-8 py-2 mx-2 text-gray-800 hover:bg-gray-100">Profile</Link>) : (<Link to="/teacher-profile" className="block px-8 py-2 mx-2 text-gray-800 hover:bg-gray-100">Profile</Link>)}
                <Link to="/friend-requests" className="block px-8 py-2 mx-2 text-gray-800 hover:bg-gray-100">Friends</Link>
                <Link to="/chat" className="block px-8 py-2 mx-2 text-gray-800 hover:bg-gray-100">Chat</Link>
                <Link to="/e-library" className="block px-8 py-2 mx-2 text-gray-800 hover:bg-gray-100">Library</Link>
                {isAdmin === true && (<Link to="/add-users" className="block px-8 py-2 mx-2 text-gray-800 hover:bg-gray-100">Add Users</Link>)}
                {isAdmin === true && (<Link to="/add-profiles" className="block px-8 py-2 mx-2 text-gray-800 hover:bg-gray-100">Add Profiles</Link>)}
                <span onClick={handleLogout} className="block px-8 py-2 mx-2 text-gray-800 hover:bg-gray-100 cursor-pointer">Logout</span>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;