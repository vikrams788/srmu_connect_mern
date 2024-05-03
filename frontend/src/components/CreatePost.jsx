import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import LeftComponent from './LeftComponent';
import RightComponent from './RightComponent';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreatePost = ({post}) => {
  const [formData, setFormData] = useState({
    text: '',
    link: '',
    image: '',
    video: '',
    embeddedVideo: '',
    postType: 'text-option',
    profilePicture: '',
    fullName: ''
  });

  useEffect(() => {
    if (post) {
      setFormData({
        text: post.text || '',
        link: post.link || '',
        image: '',
        video: '',
        embeddedVideo: '',
        postType: 'text-option',
        profilePicture: post.profilePicture || '',
        fullName: post.fullName || ''
      });
    }
  }, [post]);

  const userProfile = JSON.parse(localStorage.getItem('profile'));
  const user = JSON.parse(localStorage.getItem('user'));
  const [showAdminFeatures, setShowAdminFeatures] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const data = new FormData();
    if(post) {
      data.append('text', formData.text);
      data.append('link', formData.link);
    }
    else {
      data.append('text', formData.text);
      data.append('link', formData.link);
      data.append('postType', formData.postType);
      data.append('fullName', userProfile.fullName);
      data.append('profilePicture', userProfile.profilePicture);
      if (formData.image) {
        data.append('image', formData.image);
      } else if (formData.video) {
        data.append('video', formData.video);
      } else if (formData.embeddedVideo) {
        data.append('embeddedVideo', formData.embeddedVideo);
      }
    }

    try {
      if(post) {
        const response = await axios.put(`https://srmu-connect-mern-esjg.vercel.app/api/posts/${post._id}`, data, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Credentials': true,
          },
        });

        toast.success('Post updated successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        console.log('Post updated successfully', response.data);
      }
      else {
        const response = await axios.post('https://srmu-connect-mern-esjg.vercel.app/api/posts', data, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Credentials': true,
          },
        });

        toast.success('Post created successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        console.log('Post created successfully', response.data);
      }
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error.message);
    }
  };

  const handleChange = (event) => {
    if(post){
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value});
    }
    else {
      const { name, value, type, files } = event.target;
      if (type === 'file') {
        console.log(files.length);
        if (files.length > 0) {
          setFormData({ ...formData, [name]: files[0] });
        }
      } else {
        if (name === 'embeddedVideo') {
          const updatedEmbeddedVideo = value.replace('/watch?v=', '/embed/');
          setFormData({ ...formData, [name]: updatedEmbeddedVideo });
        } else {
          setFormData({ ...formData, [name]: value });
        }
      }
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
      <div className="container mx-auto mt-4 flex-grow">
        <div className="md:flex md:justify-between">
          <div className="md:w-1/6 hidden md:block">
            <LeftComponent />
          </div>
          <div className="md:w-2/3">
            <div className="bg-white px-4 py-6 md:px-8 md:py-8 mb-4">
              <div className="mx-auto rounded-full overflow-hidden" style={{ height: "200px", width: "200px" }}>
                <img src={userProfile.profilePicture} alt="Profile" className="object-cover w-full h-full" style={{ borderRadius: '100%' }} />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">Create Post</h2>
              {post ? (
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="mb-4">
                    <label htmlFor="text" className="block text-gray-700 text-sm font-semibold mb-2">Caption</label>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="text" name="text" rows="3" placeholder="Enter text" value={formData.text} onChange={handleChange}></textarea>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="link" className="block text-gray-700 text-sm font-semibold mb-2">Link</label>
                    <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link" name="link" placeholder="Enter link" value={formData.link} onChange={handleChange} />
                  </div>
                  <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full md:w-auto">Create Post</button>
                </form>
              ) :
              (<form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-4">
                  <label htmlFor="text" className="block text-gray-700 text-sm font-semibold mb-2">Caption</label>
                  <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="text" name="text" rows="3" placeholder="Enter text" value={formData.text} onChange={handleChange}></textarea>
                </div>
                <div className="mb-4">
                  <label htmlFor="link" className="block text-gray-700 text-sm font-semibold mb-2">Link</label>
                  <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link" name="link" placeholder="Enter link" value={formData.link} onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Post Type</label>
                  <div className="flex items-center space-x-4">
                    <input type="radio" id="text-option" name="postType" value="text-option" checked={formData.postType === 'text-option'} onChange={handleChange} />
                    <label htmlFor="text-option">Caption Only</label>
                    <input type="radio" id="image-option" name="postType" value="image-option" checked={formData.postType === 'image-option'} onChange={handleChange} />
                    <label htmlFor="image-option">Upload Image</label>
                    <input type="radio" id="video-option" name="postType" value="video-option" checked={formData.postType === 'video-option'} onChange={handleChange} />
                    <label htmlFor="video-option">Upload Video</label>
                    <input type="radio" id="embed-option" name="postType" value="embed-option" checked={formData.postType === 'embed-option'} onChange={handleChange} />
                    <label htmlFor="embed-option">Embed Video</label>
                  </div>
                </div>
                {formData.postType === 'image-option' && (
                  <div className="mb-4">
                    <label htmlFor="image" className="block text-gray-700 text-sm font-semibold mb-2">Upload Image</label>
                    <input type="file" id="image" name="image" onChange={handleChange} />
                  </div>
                )}
                {formData.postType === 'video-option' && (
                  <div className="mb-4">
                    <label htmlFor="video" className="block text-gray-700 text-sm font-semibold mb-2">Upload Video</label>
                    <input type="file" id="video" name="video" onChange={handleChange} />
                  </div>
                )}
                {formData.postType === 'embed-option' && (
                  <div className="mb-4">
                    <label htmlFor="embeddedVideo" className="block text-gray-700 text-sm font-semibold mb-2">Embedded Video</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" id="embeddedVideo" name="embeddedVideo" placeholder="Enter youtube video URL" value={formData.embeddedVideo} onChange={handleChange} />
                  </div>
                )}
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full md:w-auto">Create Post</button>
              </form>)}
            </div>
          </div>
          <div className="md:w-1/6 hidden md:block">
            <RightComponent />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreatePost;