/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useContext, useState } from "react";
import { RegisterContext } from "../../Context/registerContext";
import { useNavigate } from "react-router-dom";


function ConfirmCode() {
  let navigate = useNavigate();
  let { idCode } = useContext(RegisterContext)
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  function handleConfirmCode(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    axios
      .post(`${import.meta.env.VITE_BASE_URL}/api/code/acceptrequest/${idCode}`, { code })
      .then((res) => {
        setSuccess("تم تفعيل النظام بنجاح");
        setTimeout(() => {
          navigate("/login")
        }, 2000);
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form onSubmit={handleConfirmCode} className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">ادخل رمز التفعيل</h2>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="رمز التحقق"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          ارسال
        </button>
        {error && <p className="text-red-500 mt-2">{"الكود منتهي الصلاحية"}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </form>
    </div>
  );
}

export default ConfirmCode;
