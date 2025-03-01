/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// import { FaSearch, FaHome, FaUser } from "react-icons/fa";
// import { MdEmail, MdDateRange, MdOutlineWork } from "react-icons/md";
// import { FaPhone } from "react-icons/fa6";
// import { GiHighTide } from "react-icons/gi";

function ForgetPassword() {
  let navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input change
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Handle form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUserData(null);
    console.log({ identifier: searchValue });

    axios
      .post(`${import.meta.env.VITE_BASE_URL}/api/users/forgotpassword`, {
        identifier: searchValue,
      })
      .then((response) => {
        console.log(response.data);
        setUserData(response.data.user);
        if (response.data.message == "OTP sent to your email") {
          navigate("/updatePassword");
        }
      })
      .catch((err) => {
        console.log("error search", err);
        setError("المستخدم غير موجود أو حدث خطأ.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="max-w-lg mx-auto p-6 min-h-96">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <input
          type="text"
          value={searchValue}
          required
          onChange={handleInputChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right shadow-sm"
          placeholder="ابحث بالرقم الخاص او البريد الالكتروني او اسم المستحدم"

        />
        <button
          type="submit"
          className="p-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-md transition-all"
        >
          {/* <FaSearch /> */}
          <span>بحث</span>
        </button>
      </form>

      {/* Loading & Error Messages */}
      {loading && (
        <p className="text-right text-gray-600 mt-3">جاري البحث...</p>
      )}
      {error && <p className="text-right text-red-500 mt-3">{error}</p>}

    </div>


  );
}

export default ForgetPassword;
