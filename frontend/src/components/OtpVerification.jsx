import { useState } from 'react';

const OtpVerification = ({ onSubmitOTP, onCancel }) => {
  const [otp, setOTP] = useState('');

  const handleOTPChange = (e) => {
    setOTP(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitOTP(otp);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col">
        <h2 className="text-2xl mb-4 font-semibold text-center">Enter OTP</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="otp" className="block text-gray-700 text-sm font-semibold mb-2">OTP</label>
            <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="otp" value={otp} onChange={handleOTPChange} required />
          </div>
          <div className="flex justify-center space-x-4">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
            <button type="button" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;