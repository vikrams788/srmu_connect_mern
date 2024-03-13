import { useState } from 'react';
import axios from 'axios';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import LeftComponent from './LeftComponent';
import RightComponent from './RightComponent';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    text: '',
    link: '',
    image: null,
    video: null,
    embeddedVideo: '',
    postType: 'text'
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const data = new FormData();
    data.append('text', formData.text);
    data.append('link', formData.link);
    if (formData.postType === 'image') {
      data.append('image', formData.image);
    } else if (formData.postType === 'video') {
      data.append('video', formData.video);
    } else if (formData.postType === 'embed') {
      data.append('embeddedVideo', formData.embeddedVideo);
    }

    console.log(formData.image);

    try {
      const response = await axios.post(import.meta.env.VITE_REACT_APP_API_URL + '/api/posts', data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Credentials': true,
        },
      });
      console.log('Post created successfully', response.data);
    } catch (error) {
      console.error('Error creating post:', error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
      console.log(event.target.files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container my-auto flex-grow mx-auto mt-4">
        <div className="md:flex md:justify-evenly">
          <div className="md:w-1/4 hidden md:block">
            <LeftComponent />
          </div>
          <div className="md:w-2/3">
            <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
              <h2 className="text-2xl font-bold mb-4 text-center">Create Post</h2>
              <form onSubmit={handleSubmit} className="flex flex-col" encType="multipart/form-data">
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
                  <div className="flex items-center">
                    <input type="radio" id="text" name="postType" value="text" checked={formData.postType === 'text'} onChange={handleChange} />
                    <label htmlFor="text" className="ml-2 mr-6">Caption Only</label>
                    <input type="radio" id="image" name="postType" value="image" checked={formData.postType === 'image'} onChange={handleChange} />
                    <label htmlFor="image" className="ml-2 mr-6">Upload Image</label>
                    <input type="radio" id="video" name="postType" value="video" checked={formData.postType === 'video'} onChange={handleChange} />
                    <label htmlFor="video" className="ml-2 mr-6">Upload Video</label>
                    <input type="radio" id="embed" name="postType" value="embed" checked={formData.postType === 'embed'} onChange={handleChange} />
                    <label htmlFor="embed" className="ml-2">Embed Video</label>
                  </div>
                </div>
                {formData.postType === 'image' && (
                  <div className="mb-4">
                    <label htmlFor="image" className="block text-gray-700 text-sm font-semibold mb-2">Upload Image</label>
                    <input type="file" id="image" name="image" onChange={handleChange} />
                  </div>
                )}
                {formData.postType === 'video' && (
                  <div className="mb-4">
                    <label htmlFor="video" className="block text-gray-700 text-sm font-semibold mb-2">Upload Video</label>
                    <input type="file" id="video" name="video" onChange={handleChange} />
                  </div>
                )}
                {formData.postType === 'embed' && (
                  <div className="mb-4">
                    <label htmlFor="embeddedVideo" className="block text-gray-700 text-sm font-semibold mb-2">Embedded Video</label>
                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' type="text" id="embeddedVideo" name="embeddedVideo" placeholder="Enter video URL (replace '/watch?' with '/embed/')" value={formData.embeddedVideo} onChange={handleChange} />
                  </div>
                )}
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Create Post</button>
              </form>
            </div>
          </div>
          <div className="md:w-1/4 hidden md:block">
            <RightComponent />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreatePost;