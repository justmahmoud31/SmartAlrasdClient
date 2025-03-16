/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegisterContext } from "../../Context/registerContext";

function PhoneNumber() {
  let navigate = useNavigate();
  let { setidCode, registerData, setRegisterData } =
    useContext(RegisterContext);
  let [isLoading, setIsLoading] = useState(false);
  let [APIError, setAPIError] = useState("");
  const [exists, setExists] = useState(null); // null: no check, true: exists, false: does not exist
  const [err, setErr] = useState("");
  let [isChecked, setIsChecked] = useState(false);
  const [phoneData, setPhoneData] = useState({
    phonenumber: "",
    privatenumber: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPhoneData((prev) => ({ ...prev, [name]: value }));
  };

  // Check if phone number and private number exist
  useEffect(() => {
    if (phoneData.phonenumber && phoneData.privatenumber) {
      axios
        .post(
          `${import.meta.env.VITE_BASE_URL}/api/users/checkphoneprivate`,
          {
            phonenumber: phoneData.phonenumber,
            privatenumber: phoneData.privatenumber,
          }
        )
        .then(() => {
          setExists(false);
          setErr("Okay");
        })
        .catch((err) => {
          setExists(true);
          setErr(err.response?.data?.message || "Error checking numbers");
        });
    } else {
      setExists(null);
      setErr("");
    }
  }, [phoneData.phonenumber, phoneData.privatenumber]);

  // Handle form submission
  const handleRegister = async (event) => {
    event.preventDefault();
    if (!isChecked) {
      setAPIError("يجب الموافقة على سياسه الخصوصية والاستخدام");
      return;
    }

    setIsLoading(true);
    setAPIError("");

    const updatedData = { ...registerData, ...phoneData };
    setRegisterData(updatedData);

    const finalData = new FormData();
    for (const key in updatedData) {
      if (key === "profilepicture" && updatedData[key] instanceof File) {
        finalData.append("profilepicture", updatedData[key]);
      } else {
        finalData.append(key, updatedData[key]);
      }
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/requests/addrequest`,
        finalData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.message === "Request created successfully") {
        setidCode(res.data.request.id);
        navigate("/successPage");
      }
    } catch (err) {
      setAPIError("خطأ في اسم المستخدم او الرقم الخاص او الاميل");
      setTimeout(() => {
        navigate("/register");
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-6 max-w-xl mx-auto">
      <h2 className="flex justify-center text-2xl font-bold mb-10">
        أدخل البيانات التالية
      </h2>
      <form onSubmit={handleRegister}>
        {/* Private Number */}
        <div className="mb-5">
          <label
            htmlFor="privatenumber"
            className="block mb-3 text-sm font-medium text-gray-900"
          >
            الرقم الخاص
          </label>
          <input
            type="text"
            name="privatenumber"
            id="privatenumber"
            value={phoneData.privatenumber}
            onChange={handleChange}
            className="bg-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="mb-5">
          <label
            htmlFor="phonenumber"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            رقم الهاتف
          </label>
          <input
            type="tel"
            name="phonenumber"
            id="phonenumber"
            value={phoneData.phonenumber}
            onChange={handleChange}
            className="bg-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>

        {/* Message */}
        {err && (
          <div className={`mt-2 text-sm ${exists ? "text-red-500" : "text-green-500"}`}>
            {err}
          </div>
        )}

        {/* Terms & Conditions */}
        <div className="mb-5 flex items-center gap-2">
          <input
            type="checkbox"
            id="terms"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="terms"
            className="ml-2 text-sm font-medium text-gray-900"
          >
            أوافق على سياسه الخصوصية والاستخدام
          </label>
        </div>

        {/* <div className="pb-2 text-gray-900 hover:underline hover:text-blue-400 flex text-center">
          ✅
          <Link className="mx-1" to="/policy">
            
          </Link>
        </div> */}

        {/* Submit Button */}
        <div className="mx-2 mt-10 flex justify-center">
          <button
            type="submit"
            className="bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-auto px-8 py-3 text-center"
            disabled={exists || isLoading}
          >
            {isLoading ? (
              <i className="fa-solid fa-spinner fa-spin fa-lg"></i>
            ) : (
              "أرسال"
            )}
          </button>
        </div>

        {/* API Error Message */}
        {APIError && (
          <div className="mt-4 text-red-500 text-center">
            <p>حدث خطأ: {APIError}</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default PhoneNumber;
