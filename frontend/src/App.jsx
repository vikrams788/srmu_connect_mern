import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import EditProfile from './components/EditProfile';
import Profile from './components/Profile';

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
        <Route path='/edit-profile' element={isLoggedIn ? <EditProfile /> : <Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
