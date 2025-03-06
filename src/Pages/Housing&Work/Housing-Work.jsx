/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegisterContext } from "../../Context/registerContext";
import axios from "axios";

function Housing_Work() {
  let navigate = useNavigate();
  let [isLoading, setIsLoading] = useState(false);
  let { registerData, setRegisterData } = useContext(RegisterContext);
  const [labels, setLabels] = useState([]);
  useEffect(() => {
    const getLabels = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/label`);
        setLabels(res.data.labels);
      } catch (err) {
        console.error("Error fetching labels", err);
      }
    };
    getLabels();
  }, []);



  const handleRegister = (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Get form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    // Merge new data with existing context data
    const updatedData = { ...registerData, ...data };

    // Update context with the merged data
    setRegisterData(updatedData);

    // Navigate to the next page
    navigate("/age");
    setIsLoading(false);
  };

  return (
    <div className="py-6 max-w-xl mx-auto">
      <h2 className="flex justify-center text-3xl font-bold mb-10">أدخل البيانات التالية</h2>
      <form onSubmit={handleRegister}>
        {/* Lives In */}
        <div className="mb-5">
          <label htmlFor="livesin" className="block mb-3 text-sm font-medium text-gray-900">
            محل الولادة
          </label>
          <input
            type="text"
            name="livesin"
            id="livesin"
            className="bg-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>

        {/* Job Title */}
        <div className="mb-5">
          <label htmlFor="jobtitle" className="block mb-2 text-sm font-medium text-gray-900">
            {labels.length > 0 ? labels[0].label : "Loading..."}
          </label>

          <input
            type="text"
            name="jobtitle"
            id="jobtitle"
            className="bg-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>

        {/* Height */}
        <div className="mb-5">
          <label htmlFor="height" className="block mb-2 text-sm font-medium text-gray-900">
            {labels.length > 0 ? labels[1].label : "Loading..."}
          </label>
          <input
            type="text"
            name="height"
            id="height"
            className="bg-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 flex md:justify-evenly justify-end items-center">
          <div className="mx-2">
            <Link
              to="/register2"
              className="bg-slate-300 text-cyan-500 hover:text-cyan-600 hover:bg-slate-400 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-auto px-8 py-3 text-center"
            >
              السابق
            </Link>
          </div>
          <div className="mx-2">
            <button
              type="submit"
              className="bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-auto px-8 py-3 text-center"
              disabled={isLoading}
            >
              {isLoading ? <i className="fa-solid fa-spinner fa-spin fa-lg"></i> : "التالي"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Housing_Work;