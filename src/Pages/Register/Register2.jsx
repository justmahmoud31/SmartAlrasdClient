/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegisterContext } from "../../Context/registerContext";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

function Register2() {
  let navigate = useNavigate();
  let { registerData, setRegisterData } = useContext(RegisterContext);
  console.log(registerData);

  let [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");

  const passwordRegex = /^(?=[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  const handleRegister = (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!passwordRegex.test(password)) {
      setError("يجب أن يبدأ بحرف كبير، يحتوي على أرقام وحروف صغيرة ورمز خاص.");
      setIsLoading(false);
      return;
    }

    if (password !== rePassword) {
      setError("كلمات المرور غير متطابقة.");
      setIsLoading(false);
      return;
    }

    setError(""); // Clear errors if validation passes

    // Merge new data with existing registerData in context
    setRegisterData((prevData) => ({
      ...prevData,
      password,
    }));

    navigate("/housing-work");
    setIsLoading(false);
  };

  return (
    <div className="py-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-14">اضف رمزا للدخول</h2>
      <form onSubmit={handleRegister}>
        {/* Password */}
        <div className="mb-6 relative">
          <label htmlFor="password" className="block mb-3 text-sm font-medium text-gray-900">
            الرمز
          </label>
          <div className="relative">
            <button
              type="button"
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-sm leading-5"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-10"
              required
            />
          </div>
        </div>

        {/* Re-Password */}
        <div className="mb-6 relative">
          <label htmlFor="rePassword" className="block mb-3 text-sm font-medium text-gray-900">
            تأكيد الرمز
          </label>
          <div className="relative">
            <button
              type="button"
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-sm leading-5"
              onClick={() => setShowRePassword(!showRePassword)}
            >
              {showRePassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            <input
              type={showRePassword ? "text" : "password"}
              name="rePassword"
              id="rePassword"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              className="bg-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-10"
              required
            />
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* Buttons */}
        <div className="mt-8 flex md:justify-evenly justify-end items-center">
          <div className="mx-2">
            <Link
              to="/register"
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

export default Register2;
