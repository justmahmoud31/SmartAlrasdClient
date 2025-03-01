/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegisterContext } from "../../Context/registerContext";

function Age() {
  let navigate = useNavigate();
  let [isLoading, setIsLoading] = useState(false);
  let { registerData, setRegisterData } = useContext(RegisterContext);

  const [errors, setErrors] = useState({});

  const validateInputs = (day, month, year) => {
    let newErrors = {};

    // Convert values to numbers
    day = Number(day);
    month = Number(month);
    year = Number(year);

    // Validate day
    if (!day || day < 1 || day > 31) {
      newErrors.day = "اليوم غير صحيح";
    }

    // Validate month
    if (!month || month < 1 || month > 12) {
      newErrors.month = "الشهر غير صحيح";
    }

    // Validate year (reasonable range)
    const currentYear = new Date().getFullYear();
    if (!year || year < 1910 || year > currentYear) {
      newErrors.year = "العام غير صحيح";
    }

    // Check if user is at least 18 years old
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
  

    return newErrors;
  };

  const handleRegister = (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    let validationErrors = validateInputs(data.day, data.month, data.year);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    let birthdate = `${data.month}-${data.day}-${data.year}`;
    setRegisterData((prevData) => ({ ...prevData, birthdate }));

    navigate("/phoneNumber");
    setIsLoading(false);
  };

  return (
    <div className="py-6 max-w-xl mx-auto">
      <h2 className="flex justify-center text-3xl font-bold mb-10">أدخل تاريخ الميلاد</h2>
      <form onSubmit={handleRegister}>
        <div className="flex">
          {/* Day */}
          <div className="mb-6 mx-2">
            <label htmlFor="day" className="block mb-2 text-sm font-medium text-gray-900">
              اليوم
            </label>
            <input
              type="number"
              name="day"
              id="day"
              className="bg-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
            {errors.day && <p className="text-red-500 text-xs mt-1">{errors.day}</p>}
          </div>

          {/* Month */}
          <div className="mb-6 mx-2">
            <label htmlFor="month" className="block mb-2 text-sm font-medium text-gray-900">
              الشهر
            </label>
            <input
              type="number"
              name="month"
              id="month"
              className="bg-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
            {errors.month && <p className="text-red-500 text-xs mt-1">{errors.month}</p>}
          </div>

          {/* Year */}
          <div className="mb-6 mx-2">
            <label htmlFor="year" className="block mb-2 text-sm font-medium text-gray-900">
              العام
            </label>
            <input
              type="number"
              name="year"
              id="year"
              className="bg-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
            {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
          </div>
        </div>

        {/* Age Validation Error */}
        {errors.age && <p className="text-red-500 text-xs mt-1 text-center">{errors.age}</p>}

        {/* Buttons */}
        <div className="mt-8 flex md:justify-evenly justify-end items-center">
          <div className="mx-2">
            <Link
              to="/housing-work"
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

export default Age;
