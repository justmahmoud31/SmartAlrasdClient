/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterContext } from "../../Context/registerContext";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  let { setRegisterData } = useContext(RegisterContext);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [exists, setExists] = useState(null); // null: no check, true: exists, false: does not exist
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    fullname: "",
    email: "",
    profilepicture: null, // Store the file
  });

  // Handle input changes dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Preview image
      setUserData((prev) => ({ ...prev, profilepicture: file })); // Store file object
    }
  };

  // Handle form submission
  const handleRegister = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Save raw data (with file) in context
    setRegisterData(userData);
    console.log(userData);

    setIsLoading(false);
    navigate("/register2");
  };

  // Check if email or username exists
  useEffect(() => {
    if (userData.email && userData.username) {
      axios
        .post(`${import.meta.env.VITE_BASE_URL}/api/users/checkemailusername`, {
          email: userData.email,
          username: userData.username,
        })
        .then((res) => {
          setExists(false);
          setMessage("Okay");
        })
        .catch((err) => {
          setExists(true);
          setMessage(err.response?.data?.message || "Error checking details");
        });
    } else {
      setExists(null);
      setMessage("");
    }
  }, [userData.email, userData.username]);

  return (
    <div className="py-6 max-w-xl mx-auto">
      <h2 className="flex justify-center text-3xl font-bold mb-6">
        إنشاء حساب
      </h2>
      <form onSubmit={handleRegister} className="flex flex-col items-center">
        {/* Profile Image Upload */}
        <div className="relative mb-6">
          <label htmlFor="imageUpload" className="cursor-pointer">
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-2 border-gray-400">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-600">+</span>
              )}
            </div>
          </label>
          <input
            type="file"
            accept="image/*"
            id="imageUpload"
            name="profilepicture"
            onChange={handleImageChange}
            className="hidden"
            required
          />
        </div>

        {/* Username */}
        <div className="mb-5 w-full">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            اسم المستخدم
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={userData.username}
            onChange={handleChange}
            className="bg-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>

        {/* Full Name */}
        <div className="mb-5 w-full">
          <label
            htmlFor="fullname"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            الاسم الثلاثي
          </label>
          <input
            type="text"
            name="fullname"
            id="fullname"
            value={userData.fullname}
            onChange={handleChange}
            className="bg-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-5 w-full">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            البريد الإلكتروني
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={userData.email}
            onChange={handleChange}
            className="bg-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>

        {/* Message */}
        {message && (
          <div className={`mt-2 text-sm ${exists ? "text-red-500" : "text-green-500"}`}>
            {message}
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-700 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-8 py-3"
            disabled={exists}
          >
            {isLoading ? (
              <i className="fa-solid fa-spinner fa-spin fa-lg"></i>
            ) : (
              "التالي"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
