import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import EditProfile from './components/EditProfile';
import Profile from './components/Profile';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import FriendRequests from './components/FriendRequests';
import SingleChat from './components/SingleChat';
import Library from './components/Library';

function App() {

  let isLoggedIn = localStorage.getItem('token');
  isLoggedIn = true;
  
  return (
    <BrowserRouter >
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        {/* Protected Routes */}

        <Route path='/' element={isLoggedIn ? <Home /> : <Login />} />
        <Route path='/profile' element={isLoggedIn ? <Profile /> : <Login />} />
        <Route path='/profile/:userId' element={isLoggedIn ? <Profile /> : <Login />} />
        <Route path='/edit-profile' element={isLoggedIn ? <EditProfile /> : <Login />} />
        <Route path='/create-post' element={isLoggedIn ? <CreatePost /> : <Login />} />
        <Route path='/edit-post' element={isLoggedIn ? <EditPost /> : <Login />}/>
        <Route path='/friend-requests' element={isLoggedIn ? <FriendRequests /> : <Login />}/>
        <Route path='/chat' element={isLoggedIn ? <SingleChat /> : <Login />}/>
        <Route path='/e-library' element={isLoggedIn ? <Library /> : <Login />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
